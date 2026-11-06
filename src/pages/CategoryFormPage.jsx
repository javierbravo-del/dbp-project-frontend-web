import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { categoryService } from '../services/categoryService'
import { getErrorMessage } from '../utils/errors'
import CategoryForm from '../components/CategoryForm'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

const EMPTY_VALUES = { nombre: '', descripcion: '' }

const toFormValues = (category) => ({
  nombre: category.nombre,
  descripcion: category.descripcion ?? '',
})

const toPayload = (values) => ({
  nombre: values.nombre.trim(),
  descripcion: values.descripcion.trim() || null,
})

export default function CategoryFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const fetchCategory = useCallback(
    (signal) => (id ? categoryService.getById(id, signal) : Promise.resolve(null)),
    [id],
  )
  const category = useFetch(fetchCategory)

  const title = isEditing ? 'Editar categoría' : 'Nueva categoría'
  const breadcrumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Categorías', to: '/categories' },
    { label: title },
  ]

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await categoryService.update(id, toPayload(values))
        toast.success('Categoría actualizada correctamente')
      } else {
        await categoryService.create(toPayload(values))
        toast.success('Categoría creada correctamente')
      }
      navigate('/categories')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const renderContent = () => {
    if (category.error) {
      return <ErrorState message={getErrorMessage(category.error)} onRetry={category.refetch} />
    }
    if (category.isLoading) {
      return <Spinner />
    }
    return (
      <CategoryForm
        key={category.data?.id ?? 'new'}
        defaultValues={isEditing ? toFormValues(category.data) : EMPTY_VALUES}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? 'Guardar cambios' : 'Crear categoría'}
      />
    )
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <PageHeader title={title} breadcrumbs={breadcrumbs} />
      {renderContent()}
    </section>
  )
}
