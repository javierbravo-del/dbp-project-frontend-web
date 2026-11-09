import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PackagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { usePageParams } from '../hooks/usePageParams'
import { productService } from '../services/productService'
import { variantService } from '../services/variantService'
import stockService from '../services/stockService'
import { getErrorMessage } from '../utils/errors'
import Badge from '../components/Badge'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import StockEntryDialog from '../components/StockEntryDialog'
import VariantForm from '../components/VariantForm'

const toVariantPayload = (values) => ({
  talla: values.talla.trim(),
  color: values.color.trim(),
  sku: values.sku.trim() || null,
  stockMinimo: values.stockMinimo,
})

const buildColumns = ({ onAddStock }) => [
  { key: 'talla', header: 'Talla', sortKey: 'talla' },
  { key: 'color', header: 'Color', sortKey: 'color' },
  { key: 'sku', header: 'SKU', render: (variant) => variant.sku ?? '—' },
  { key: 'stock', header: 'Stock', sortKey: 'stock' },
  { key: 'stockMinimo', header: 'Mínimo' },
  {
    key: 'estado',
    header: 'Estado',
    render: (variant) =>
      variant.stockBajo ? (
        <Badge variant="warning">Stock bajo</Badge>
      ) : (
        <Badge variant="success">OK</Badge>
      ),
  },
  {
    key: 'actions',
    header: 'Acciones',
    render: (variant) => (
      <button
        type="button"
        title="Registrar entrada de stock"
        aria-label={`Registrar entrada de stock para talla ${variant.talla} ${variant.color}`}
        onClick={() => onAddStock(variant)}
        className="rounded-lg p-2 text-brand-600 hover:bg-brand-50"
      >
        <PackagePlus size={16} />
      </button>
    ),
  },
]

export default function ProductVariantsPage() {
  const { id } = useParams()
  const { page, size, sort, setPage, setSize, setSort } = usePageParams({ defaultSort: 'id,asc' })
  const [variantForStock, setVariantForStock] = useState(null)

  const fetchProduct = useCallback((signal) => productService.getById(id, signal), [id])
  const fetchVariants = useCallback(
    (signal) => variantService.getByProduct(id, { page, size, sort }, signal),
    [id, page, size, sort],
  )
  const product = useFetch(fetchProduct)
  const variants = useFetch(fetchVariants)

  const columns = useMemo(() => buildColumns({ onAddStock: setVariantForStock }), [])

  const productName = product.data?.nombre ?? 'Producto'
  const breadcrumbs = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Productos', to: '/products' },
    { label: productName },
    { label: 'Variantes y stock' },
  ]

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',')
    const direction = currentField === field && currentDirection === 'asc' ? 'desc' : 'asc'
    setSort(`${field},${direction}`)
  }

  const handleCreateVariant = async (values) => {
    let created
    try {
      created = await variantService.create(id, toVariantPayload(values))
    } catch (error) {
      toast.error(getErrorMessage(error))
      return false
    }

    if (values.stockInicial > 0) {
      try {
        await stockService.registerInbound({
          varianteId: created.id,
          cantidad: values.stockInicial,
          motivo: 'Stock inicial',
        })
        toast.success(`Variante creada con ${values.stockInicial} unidades de stock`)
      } catch (error) {
        toast.error(
          `La variante se creó, pero no se pudo registrar el stock: ${getErrorMessage(error)}`,
        )
      }
    } else {
      toast.success('Variante creada correctamente')
    }

    variants.refetch()
    return true
  }

  const handleStockEntry = async ({ cantidad, motivo }) => {
    try {
      const movement = await stockService.registerInbound({
        varianteId: variantForStock.id,
        cantidad,
        motivo,
      })
      toast.success(`Entrada registrada. Nuevo stock: ${movement.stockResultante}`)
      setVariantForStock(null)
      variants.refetch()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const renderVariants = () => {
    if (variants.error) {
      return <ErrorState message={getErrorMessage(variants.error)} onRetry={variants.refetch} />
    }
    if (!variants.data) {
      return <Spinner />
    }
    if (variants.data.totalElements === 0) {
      return (
        <EmptyState
          title="Este producto aún no tiene variantes"
          description="Agrega al menos una talla y color para poder registrar stock y vender."
        />
      )
    }
    return (
      <DataTable
        columns={columns}
        rows={variants.data.content}
        sort={sort}
        onSortChange={handleSort}
        isLoading={variants.isLoading}
      />
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title={`Variantes de ${productName}`} breadcrumbs={breadcrumbs} />

      {product.error ? (
        <ErrorState message={getErrorMessage(product.error)} onRetry={product.refetch} />
      ) : (
        <>
          <VariantForm onSubmit={handleCreateVariant} />
          {renderVariants()}
          {variants.data && variants.data.totalElements > 0 && (
            <Pagination
              page={page}
              size={size}
              totalElements={variants.data.totalElements}
              totalPages={variants.data.totalPages}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          )}
        </>
      )}

      <StockEntryDialog
        variant={variantForStock}
        onSubmit={handleStockEntry}
        onCancel={() => setVariantForStock(null)}
      />
    </section>
  )
}
