import { useCallback, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { usePageParams } from '../hooks/usePageParams'
import { supplierService } from '../services/supplierService'
import { getErrorMessage } from '../utils/errors'
import ButtonLink from '../components/ButtonLink'
import CsvExportButton from '../components/CsvExportButton'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FilterChips from '../components/FilterChips'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import SearchInput from '../components/SearchInput'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Proveedores' }]

const COLUMNS = [
  { key: 'ruc', header: 'RUC', csv: (supplier) => supplier.ruc, sortKey: 'ruc' },
  {
    key: 'razonSocial',
    header: 'Razón social',
    csv: (supplier) => supplier.razonSocial,
    sortKey: 'razonSocial',
  },
  {
    key: 'telefono',
    header: 'Teléfono',
    csv: (supplier) => supplier.telefono ?? '',
    render: (supplier) => supplier.telefono ?? '—',
  },
  {
    key: 'correo',
    header: 'Correo',
    csv: (supplier) => supplier.correo ?? '',
    render: (supplier) => supplier.correo ?? '—',
  },
]

const CONTACT_FILTERS = {
  TODOS: () => true,
  CON_CORREO: (supplier) => Boolean(supplier.correo),
  CON_TELEFONO: (supplier) => Boolean(supplier.telefono),
}

export default function SuppliersPage() {
  const { page, size, sort, search, setPage, setSize, setSort, setSearch } = usePageParams({
    defaultSort: 'razonSocial,asc',
  })
  const [contactFilter, setContactFilter] = useState('TODOS')
  const debouncedSearch = useDebounce(search, 300)
  const searchTerm = debouncedSearch.trim()

  const fetchSuppliers = useCallback(
    (signal) => supplierService.getAll({ page, size, sort, search: searchTerm }, signal),
    [page, size, sort, searchTerm],
  )
  const { data, error, isLoading, refetch } = useFetch(fetchSuppliers)

  const rows = useMemo(
    () => (data?.content ?? []).filter(CONTACT_FILTERS[contactFilter]),
    [data, contactFilter],
  )

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
    if (data.totalElements === 0 && searchTerm) {
      return (
        <EmptyState
          title="Sin resultados"
          description={`No encontramos proveedores que coincidan con "${searchTerm}".`}
        />
      )
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
    if (rows.length === 0) {
      return (
        <EmptyState
          title="Sin resultados"
          description="Ningún proveedor de esta página coincide con el filtro elegido."
        />
      )
    }
    return (
      <DataTable
        columns={COLUMNS}
        rows={rows}
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
        <CsvExportButton filename="proveedores.csv" columns={COLUMNS} rows={rows} />
        <ButtonLink to="/suppliers/new">
          <Plus size={16} className="mr-1" />
          Nuevo proveedor
        </ButtonLink>
      </PageHeader>

      <FilterChips
        label="Filtrar por datos de contacto"
        value={contactFilter}
        onChange={setContactFilter}
        options={[
          { value: 'TODOS', label: 'Todos' },
          { value: 'CON_CORREO', label: 'Con correo' },
          { value: 'CON_TELEFONO', label: 'Con teléfono' },
        ]}
      />

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
