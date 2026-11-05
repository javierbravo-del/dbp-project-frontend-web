import { useCallback, useMemo, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { usePageParams } from '../hooks/usePageParams'
import { productService } from '../services/productService'
import { getErrorMessage } from '../utils/errors'
import { formatCurrency } from '../utils/format'
import Badge from '../components/Badge'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Pagination from '../components/Pagination'
import SearchInput from '../components/SearchInput'
import Spinner from '../components/Spinner'

const COLUMNS = [
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
]

export default function ProductsPage() {
  const { page, size, sort, search, setPage, setSize, setSort, setSearch } = usePageParams({
    defaultSort: 'nombre,asc',
  })
  const [showInactive, setShowInactive] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  const fetchProducts = useCallback(
    (signal) =>
      productService.getAll({ page, size, sort, soloActivos: !showInactive }, signal),
    [page, size, sort, showInactive],
  )
  const { data, error, isLoading, refetch } = useFetch(fetchProducts)

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
          description="Cuando registres productos aparecerán aquí."
        />
      )
    }
    if (products.length === 0) {
      return (
        <EmptyState
          title="Sin resultados"
          description={`No encontramos productos que coincidan con "${debouncedSearch}" en esta página.`}
        />
      )
    }
    return (
      <DataTable
        columns={COLUMNS}
        rows={products}
        sort={sort}
        onSortChange={handleSort}
        isLoading={isLoading}
      />
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={showInactive} onChange={handleToggleInactive} />
            Mostrar inactivos
          </label>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por código o nombre"
          />
        </div>
      </div>

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
    </section>
  )
}
