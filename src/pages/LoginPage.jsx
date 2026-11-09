import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/errors'
import Button from '../components/Button'
import Input from '../components/Input'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success('Bienvenido de nuevo')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow"
      >
        <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'El correo es obligatorio',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Ingresa un correo válido' },
          })}
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'La contraseña es obligatoria' })}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Ingresar
        </Button>
        <p className="text-center text-sm text-gray-600">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  )
}
