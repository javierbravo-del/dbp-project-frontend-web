import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ban, Pencil, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { usePageParams } from '../hooks/usePageParams'
import { categoryService } from '../services/categoryService'
import { getErrorMessage } from '../utils/errors'
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

const BREADCRUMBS = [{ label: 'Dashboard', to: '/' }, { label: 'Categorías' }]

const buildColumns = ({ isAdmin, onDeactivate }) => [
  { key: 'nombre', header: 'Nombre', sortKey: 'nombre' },
  {
    key: 'descripcion',
    header: 'Descripción',
    render: (category) => category.descripcion ?? '—',
  },
  {
    key: 'activo',
    header: 'Estado',
    render: (category) => (
      <Badge variant={category.activo ? 'success' : 'neutral'}>
        {category.activo ? 'Activa' : 'Inactiva'}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: 'Acciones',
    render: (category) => (
      <div className="flex items-center gap-1">
        <Link
          to={`/categories/${category.id}/edit`}
          title="Editar categoría"
          aria-label={`Editar ${category.nombre}`}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <Pencil size={16} />
        </Link>
        {isAdmin && category.activo && (
          <button
            type="button"
            title="Desactivar categoría"
            aria-label={`Desactivar ${category.nombre}`}
            onClick={() => onDeactivate(category)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          >
            <Ban size={16} />
          </button>
        )}
      </div>
    ),
  },
]

export default function CategoriesPage() {
  const { isAdmin } = useAuth()
  const { page, size, sort, search, setPage, setSize, setSort, setSearch } = usePageParams({
    defaultSort: 'nombre,asc',
  })
  const [categoryToDeactivate, setCategoryToDeactivate] = useState(null)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  const fetchCategories = useCallback(
    (signal) => categoryService.getPage({ page, size, sort }, signal),
    [page, size, sort],
  )
  const { data, error, isLoading, refetch } = useFetch(fetchCategories)

  const columns = useMemo(
    () => buildColumns({ isAdmin, onDeactivate: setCategoryToDeactivate }),
    [isAdmin],
  )

  const categories = useMemo(() => {
    const rows = data?.content ?? []
    const term = debouncedSearch.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((category) => category.nombre.toLowerCase().includes(term))
  }, [data, debouncedSearch])

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',')
    const direction = currentField === field && currentDirection === 'asc' ? 'desc' : 'asc'
    setSort(`${field},${direction}`)
  }

  const handleConfirmDeactivate = async () => {
    setIsDeactivating(true)
    try {
      await categoryService.deactivate(categoryToDeactivate.id)
      toast.success(`"${categoryToDeactivate.nombre}" fue desactivada`)
      setCategoryToDeactivate(null)
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
          title="Aún no tienes categorías"
          description="Crea categorías para ordenar tus productos y ver reportes por categoría."
          action={<ButtonLink to="/categories/new">Crear categoría</ButtonLink>}
        />
      )
    }
    if (categories.length === 0 && debouncedSearch.trim()) {
      return (
        <EmptyState
          title="Sin resultados"
          description={`No encontramos categorías que coincidan con "${debouncedSearch}" en esta página.`}
        />
      )
    }
    return (
      <DataTable
        columns={columns}
        rows={categories}
        sort={sort}
        onSortChange={handleSort}
        isLoading={isLoading}
      />
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title="Categorías" breadcrumbs={BREADCRUMBS}>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre" />
        <ButtonLink to="/categories/new">
          <Plus size={16} className="mr-1" />
          Nueva categoría
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
        isOpen={Boolean(categoryToDeactivate)}
        title="Desactivar categoría"
        message={`¿Desactivar "${categoryToDeactivate?.nombre ?? ''}"? Ya no aparecerá al crear productos nuevos y no se puede volver a activar. Los productos que ya la usan la conservan.`}
        confirmLabel="Desactivar"
        isLoading={isDeactivating}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setCategoryToDeactivate(null)}
      />
    </section>
  )
}
