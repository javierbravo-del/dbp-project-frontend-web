import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ban, Layers, Pencil, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { usePageParams } from '../hooks/usePageParams'
import { productService } from '../services/productService'
import { getErrorMessage } from '../utils/errors'
import { formatCurrency } from '../utils/format'
import Badge from '../components/Badge'
import ButtonLink from '../components/ButtonLink'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import SearchInput from '../components/SearchInput'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/' }, { label: 'Productos' }]

const buildColumns = ({ isAdmin, onDeactivate }) => [
  { key: 'codigo', header: 'Código', sortKey: 'codigo' },
  { key: 'nombre', header: 'Producto', sortKey: 'nombre' },
  {
    key: 'categoriaNombre',
    header: 'Categoría',
    render: (product) => product.categoriaNombre ?? 'Sin categoría',
  },
  {
    key: 'precioVenta',
    header: 'Precio de venta',
    sortKey: 'precioVenta',
    render: (product) => formatCurrency(product.precioVenta),
  },
  { key: 'stockTotal', header: 'Stock', render: (product) => product.stockTotal ?? 0 },
  {
    key: 'activo',
    header: 'Estado',
    render: (product) => (
      <Badge variant={product.activo ? 'success' : 'neutral'}>
        {product.activo ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: 'Acciones',
    render: (product) => (
      <div className="flex items-center gap-1">
        <Link
          to={`/products/${product.id}/variants`}
          title="Variantes y stock"
          aria-label={`Variantes y stock de ${product.nombre}`}
          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
        >
          <Layers size={16} />
        </Link>
        <Link
          to={`/products/${product.id}/edit`}
          title="Editar producto"
          aria-label={`Editar ${product.nombre}`}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <Pencil size={16} />
        </Link>
        {isAdmin && product.activo && (
          <button
            type="button"
            title="Desactivar producto"
            aria-label={`Desactivar ${product.nombre}`}
            onClick={() => onDeactivate(product)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          >
            <Ban size={16} />
          </button>
        )}
      </div>
    ),
  },
]

export default function ProductsPage() {
  const { isAdmin } = useAuth()
  const { page, size, sort, search, setPage, setSize, setSort, setSearch } = usePageParams({
    defaultSort: 'nombre,asc',
  })
  const [showInactive, setShowInactive] = useState(false)
  const [productToDeactivate, setProductToDeactivate] = useState(null)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  const fetchProducts = useCallback(
    (signal) =>
      productService.getAll({ page, size, sort, soloActivos: !showInactive }, signal),
    [page, size, sort, showInactive],
  )
  const { data, error, isLoading, refetch } = useFetch(fetchProducts)

  const columns = useMemo(
    () => buildColumns({ isAdmin, onDeactivate: setProductToDeactivate }),
    [isAdmin],
  )

  const products = useMemo(() => {
    const rows = data?.content ?? []
    const term = debouncedSearch.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(
      (product) =>
        product.nombre.toLowerCase().includes(term) ||
        product.codigo.toLowerCase().includes(term),
    )
  }, [data, debouncedSearch])

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',')
    const direction = currentField === field && currentDirection === 'asc' ? 'desc' : 'asc'
    setSort(`${field},${direction}`)
  }

  const handleToggleInactive = (event) => {
    setShowInactive(event.target.checked)
    setPage(1)
  }

  const handleConfirmDeactivate = async () => {
    setIsDeactivating(true)
    try {
      await productService.deactivate(productToDeactivate.id)
      toast.success(`"${productToDeactivate.nombre}" fue desactivado`)
      setProductToDeactivate(null)
      refetch()
    } catch (deactivateError) {
      toast.error(getErrorMessage(deactivateError))
    } finally {
      setIsDeactivating(false)
    }
  }

  const renderContent = () => {
    if (error) {
      return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
    }
    if (!data) {
      return <Spinner />
    }
    if (data.totalElements === 0) {
      return (
        <EmptyState
          title="Aún no tienes productos"
          description="Registra tu primer producto para empezar a controlar tu inventario."
          action={<ButtonLink to="/products/new">Crear producto</ButtonLink>}
        />
      )
    }
    if (products.length === 0 && debouncedSearch.trim()) {
      return (
        <EmptyState
          title="Sin resultados"
          description={`No encontramos productos que coincidan con "${debouncedSearch}" en esta página.`}
        />
      )
    }
    return (
      <DataTable
        columns={columns}
        rows={products}
        sort={sort}
        onSortChange={handleSort}
        isLoading={isLoading}
      />
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title="Productos" breadcrumbs={BREADCRUMBS}>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={showInactive} onChange={handleToggleInactive} />
          Mostrar inactivos
        </label>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por código o nombre"
        />
        <ButtonLink to="/products/new">
          <Plus size={16} className="mr-1" />
          Nuevo producto
        </ButtonLink>
      </PageHeader>

      {renderContent()}

      {data && data.totalElements > 0 && (
        <Pagination
          page={page}
          size={size}
          totalElements={data.totalElements}
          totalPages={data.totalPages}
          onPageChange={setPage}
          onSizeChange={setSize}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(productToDeactivate)}
        title="Desactivar producto"
        message={`¿Seguro que quieres desactivar "${productToDeactivate?.nombre ?? ''}"? Dejará de aparecer en tus listados activos, pero conservarás su historial.`}
        confirmLabel="Desactivar"
        isLoading={isDeactivating}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setProductToDeactivate(null)}
      />
    </section>
  )
}