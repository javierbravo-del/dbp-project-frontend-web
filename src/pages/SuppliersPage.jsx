import { useCallback, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { usePageParams } from '../hooks/usePageParams'
import { supplierService } from '../services/supplierService'
import { getErrorMessage } from '../utils/errors'
import ButtonLink from '../components/ButtonLink'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import SearchInput from '../components/SearchInput'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Proveedores' }]

const COLUMNS = [
  { key: 'ruc', header: 'RUC', sortKey: 'ruc' },
  { key: 'razonSocial', header: 'Razón social', sortKey: 'razonSocial' },
  { key: 'telefono', header: 'Teléfono', render: (supplier) => supplier.telefono ?? '—' },
  { key: 'correo', header: 'Correo', render: (supplier) => supplier.correo ?? '—' },
]

export default function SuppliersPage() {
  const { page, size, sort, search, setPage, setSize, setSort, setSearch } = usePageParams({
    defaultSort: 'razonSocial,asc',
  })
  const debouncedSearch = useDebounce(search, 300)

  const fetchSuppliers = useCallback(
    (signal) => supplierService.getAll({ page, size, sort }, signal),
    [page, size, sort],
  )
  const { data, error, isLoading, refetch } = useFetch(fetchSuppliers)

  const suppliers = useMemo(() => {
    const rows = data?.content ?? []
    const term = debouncedSearch.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(
      (supplier) =>
        supplier.razonSocial.toLowerCase().includes(term) || supplier.ruc.includes(term),
    )
  }, [data, debouncedSearch])

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',')
    const direction = currentField === field && currentDirection === 'asc' ? 'desc' : 'asc'
    setSort(`${field},${direction}`)
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
          title="Aún no tienes proveedores"
          description="Registra a tus proveedores para asociarlos a tus compras."
          action={<ButtonLink to="/suppliers/new">Crear proveedor</ButtonLink>}
        />
      )
    }
    if (suppliers.length === 0 && debouncedSearch.trim()) {
      return (
        <EmptyState
          title="Sin resultados"
          description={`No encontramos proveedores que coincidan con "${debouncedSearch}" en esta página.`}
        />
      )
    }
    return (
      <DataTable
        columns={COLUMNS}
        rows={suppliers}
        sort={sort}
        onSortChange={handleSort}
        isLoading={isLoading}
      />
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title="Proveedores" breadcrumbs={BREADCRUMBS}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por razón social o RUC"
        />
        <ButtonLink to="/suppliers/new">
          <Plus size={16} className="mr-1" />
          Nuevo proveedor
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
    </section>
  )
}