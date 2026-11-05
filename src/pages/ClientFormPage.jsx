import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { clientService } from '../services/clientService'
import { getErrorMessage } from '../utils/errors'
import ClientForm from '../components/ClientForm'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

const EMPTY_VALUES = { documento: '', nombre: '', telefono: '', correo: '', direccion: '' }

const toFormValues = (client) => ({
  documento: client.documento,
  nombre: client.nombre,
  telefono: client.telefono ?? '',
  correo: client.correo ?? '',
  direccion: client.direccion ?? '',
})

const toPayload = (values) => ({
  documento: values.documento.trim(),
  nombre: values.nombre.trim(),
  telefono: values.telefono.trim() || null,
  correo: values.correo.trim() || null,
  direccion: values.direccion.trim() || null,
})

export default function ClientFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const fetchClient = useCallback(
    (signal) => (id ? clientService.getById(id, signal) : Promise.resolve(null)),
    [id],
  )
  const client = useFetch(fetchClient)

  const title = isEditing ? 'Editar cliente' : 'Nuevo cliente'
  const breadcrumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Clientes', to: '/clients' },
    { label: title },
  ]

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await clientService.update(id, toPayload(values))
        toast.success('Cliente actualizado correctamente')
      } else {
        await clientService.create(toPayload(values))
        toast.success('Cliente creado correctamente')
      }
      navigate('/clients')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const renderContent = () => {
    if (client.error) {
      return <ErrorState message={getErrorMessage(client.error)} onRetry={client.refetch} />
    }
    if (client.isLoading) {
      return <Spinner />
    }
    return (
      <ClientForm
        key={client.data?.id ?? 'new'}
        defaultValues={isEditing ? toFormValues(client.data) : EMPTY_VALUES}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? 'Guardar cambios' : 'Crear cliente'}
      />
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <PageHeader title={title} breadcrumbs={breadcrumbs} />
      {renderContent()}
    </section>
  )
}
