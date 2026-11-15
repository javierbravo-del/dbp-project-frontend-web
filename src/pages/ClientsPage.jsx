import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { usePageParams } from '../hooks/usePageParams'
import { clientService } from '../services/clientService'
import { getErrorMessage } from '../utils/errors'
import Badge from '../components/Badge'
import ButtonLink from '../components/ButtonLink'
import ConfirmDialog from '../components/ConfirmDialog'
import CsvExportButton from '../components/CsvExportButton'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FilterChips from '../components/FilterChips'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import SearchInput from '../components/SearchInput'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Clientes' }]

const getDocumentType = (client) => (client.documento.length === 11 ? 'RUC' : 'DNI')

const buildColumns = ({ isAdmin, onDelete }) => [
  {
    key: 'tipo',
    header: 'Tipo',
    csv: (client) => getDocumentType(client),
    render: (client) => <Badge variant="neutral">{getDocumentType(client)}</Badge>,
  },
  {
    key: 'documento',
    header: 'Documento',
    csv: (client) => client.documento,
    sortKey: 'documento',
  },
  {
    key: 'nombre',
    header: 'Nombre',
    csv: (client) => client.nombre,
    sortKey: 'nombre',
  },
  {
    key: 'telefono',
    header: 'Teléfono',
    csv: (client) => client.telefono ?? '',
    render: (client) => client.telefono ?? '—',
  },
  {
    key: 'correo',
    header: 'Correo',
    csv: (client) => client.correo ?? '',
    render: (client) => client.correo ?? '—',
  },
  {
    key: 'actions',
    header: 'Acciones',
    render: (client) => (
      <div className="flex items-center gap-1">
        <Link
          to={`/clients/${client.id}/edit`}
          title="Editar cliente"
          aria-label={`Editar ${client.nombre}`}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <Pencil size={16} />
        </Link>
        {isAdmin && (
          <button
            type="button"
            title="Eliminar cliente"
            aria-label={`Eliminar ${client.nombre}`}
            onClick={() => onDelete(client)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    ),
  },
]

export default function ClientsPage() {
  const { isAdmin } = useAuth()
  const { page, size, sort, search, setPage, setSize, setSort, setSearch } = usePageParams({
    defaultSort: 'nombre,asc',
  })
  const [clientToDelete, setClientToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typeFilter, setTypeFilter] = useState('TODOS')
  const debouncedSearch = useDebounce(search, 300)
  const searchTerm = debouncedSearch.trim()

  const fetchClients = useCallback(
    (signal) => clientService.getAll({ page, size, sort, search: searchTerm }, signal),
    [page, size, sort, searchTerm],
  )
  const { data, error, isLoading, refetch } = useFetch(fetchClients)

  const columns = useMemo(
    () => buildColumns({ isAdmin, onDelete: setClientToDelete }),
    [isAdmin],
  )

  const rows = useMemo(() => {
    const all = data?.content ?? []
    return typeFilter === 'TODOS' ? all : all.filter((client) => getDocumentType(client) === typeFilter)
  }, [data, typeFilter])

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',')
    const direction = currentField === field && currentDirection === 'asc' ? 'desc' : 'asc'
    setSort(`${field},${direction}`)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await clientService.remove(clientToDelete.id)
      toast.success(`"${clientToDelete.nombre}" fue eliminado`)
      setClientToDelete(null)
      if (data?.content.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        refetch()
      }
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError))
    } finally {
      setIsDeleting(false)
    }
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
          description={`No encontramos clientes que coincidan con "${searchTerm}".`}
        />
      )
    }
    if (data.totalElements === 0) {
      return (
        <EmptyState
          title="Aún no tienes clientes"
          description="Registra a tus clientes para asociarlos a tus ventas."
          action={<ButtonLink to="/clients/new">Crear cliente</ButtonLink>}
        />
      )
    }
    if (rows.length === 0) {
      return (
        <EmptyState
          title="Sin resultados"
          description="Ningún cliente de esta página coincide con el filtro elegido."
        />
      )
    }
    return (
      <DataTable
        columns={columns}
        rows={rows}
        sort={sort}
        onSortChange={handleSort}
        isLoading={isLoading}
      />
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title="Clientes" breadcrumbs={BREADCRUMBS}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o documento"
        />
        <CsvExportButton filename="clientes.csv" columns={columns} rows={rows} />
        <ButtonLink to="/clients/new">
          <Plus size={16} className="mr-1" />
          Nuevo cliente
        </ButtonLink>
      </PageHeader>

      <FilterChips
        label="Filtrar por tipo de documento"
        value={typeFilter}
        onChange={setTypeFilter}
        options={[
          { value: 'TODOS', label: 'Todos' },
          { value: 'DNI', label: 'Personas (DNI)' },
          { value: 'RUC', label: 'Empresas (RUC)' },
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

      <ConfirmDialog
        isOpen={Boolean(clientToDelete)}
        title="Eliminar cliente"
        message={`¿Seguro que quieres eliminar a "${clientToDelete?.nombre ?? ''}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </section>
  )
}
