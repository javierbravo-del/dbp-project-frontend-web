import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Trash2, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { userService } from '../services/userService'
import { getErrorMessage } from '../utils/errors'
import Badge from '../components/Badge'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Input from '../components/Input'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Equipo' }]

export default function TeamPage() {
  const { user } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [isRemoving, setIsRemoving] = useState(false)

  const fetchUsers = useCallback((signal) => userService.getAll({ size: 50 }, signal), [])
  const { data, error, isLoading, refetch } = useFetch(fetchUsers)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  const onSubmit = async (values) => {
    try {
      await userService.createEmployee({
        nombre: values.nombre.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      toast.success('Empleado agregado a tu equipo')
      reset()
      setIsFormOpen(false)
      refetch()
    } catch (submitError) {
      toast.error(getErrorMessage(submitError))
    }
  }

  const handleConfirmRemove = async () => {
    setIsRemoving(true)
    try {
      await userService.remove(memberToRemove.id)
      toast.success(`${memberToRemove.nombre} ya no tiene acceso`)
      setMemberToRemove(null)
      refetch()
    } catch (removeError) {
      toast.error(getErrorMessage(removeError))
    } finally {
      setIsRemoving(false)
    }
  }

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'email', header: 'Correo' },
    {
      key: 'role',
      header: 'Rol',
      render: (member) => (
        <Badge variant={member.role === 'ADMIN' ? 'success' : 'neutral'}>
          {member.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (member) =>
        member.id === user.id || member.role === 'ADMIN' ? (
          <span className="text-xs text-gray-400">—</span>
        ) : (
          <button
            type="button"
            title="Quitar acceso"
            aria-label={`Quitar acceso a ${member.nombre}`}
            onClick={() => setMemberToRemove(member)}
            className="rounded-md p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        ),
    },
  ]

  const renderContent = () => {
    if (error) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
    if (!data) return <Spinner />
    if (data.content.length === 0) {
      return <EmptyState title="Aún no hay nadie en tu equipo" />
    }
    return <DataTable columns={columns} rows={data.content} isLoading={isLoading} />
  }

  return (
    <section className="space-y-4">
      <PageHeader title="Equipo" breadcrumbs={BREADCRUMBS}>
        <Button onClick={() => setIsFormOpen((open) => !open)}>
          <UserPlus size={16} className="mr-1" />
          Agregar empleado
        </Button>
      </PageHeader>

      <p className="text-sm text-gray-600">
        Como administrador, tú creas las cuentas de tus empleados. Ellos entran con su correo y
        pueden registrar ventas, compras y productos; los reportes y el equipo quedan solo para
        ti.
      </p>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:grid-cols-3"
        >
          <Input
            label="Nombre"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />
          <Input
            label="Correo electrónico"
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Ingresa un correo válido' },
            })}
          />
          <Input
            label="Contraseña inicial"
            type="password"
            autoComplete="new-password"
            hint="Mínimo 8 caracteres, con una mayúscula y un número."
            error={errors.password?.message}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[0-9]).*$/,
                message: 'Debe tener al menos una mayúscula y un número',
              },
            })}
          />
          <div className="flex justify-end gap-3 sm:col-span-3">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Crear empleado
            </Button>
          </div>
        </form>
      )}

      {renderContent()}

      <ConfirmDialog
        isOpen={Boolean(memberToRemove)}
        title="Quitar acceso"
        message={`¿Seguro que quieres quitar el acceso a "${memberToRemove?.nombre ?? ''}"? Ya no podrá iniciar sesión.`}
        confirmLabel="Quitar acceso"
        isLoading={isRemoving}
        onConfirm={handleConfirmRemove}
        onCancel={() => setMemberToRemove(null)}
      />
    </section>
  )
}
