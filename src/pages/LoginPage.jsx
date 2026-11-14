import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/errors'
import Button from '../components/Button'
import Input from '../components/Input'
import AuthPanel from '../components/AuthPanel'
import Logo from '../components/Logo'

// Credenciales de la cuenta de demostración (datos ficticios, rol ADMIN).
const DEMO_CREDENTIALS = { email: 'prueba@test.com', password: 'Prueba123' }

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? '/dashboard'

  const {
    register,
    handleSubmit,
    setValue,
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

  const fillDemo = () => {
    setValue('email', DEMO_CREDENTIALS.email, { shouldValidate: true })
    setValue('password', DEMO_CREDENTIALS.password, { shouldValidate: true })
    toast('Credenciales de demo listas. Presiona Ingresar.', { icon: '✨' })
  }

  return (
    <main className="grid min-h-screen bg-gray-50 lg:grid-cols-2">
      <AuthPanel
        title="Tu stock, tus ventas y un asistente que los entiende."
        description="Registra lo que pasa en tu puesto y pregúntale a Gamarrito qué reponer, qué rematar y cuánto estás ganando de verdad."
      />

      <section className="flex items-center justify-center p-4 sm:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full max-w-sm space-y-4 rounded-xl border border-gray-200 bg-white p-8"
        >
          <div className="lg:hidden">
            <Link to="/" aria-label="Volver a la portada" className="text-brand-700">
              <Logo size={30} textClassName="text-gray-900" />
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
            <p className="mt-1 text-sm text-gray-500">Entra para seguir con tu negocio.</p>
          </div>

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

          <Button type="button" variant="secondary" onClick={fillDemo} className="w-full">
            <Sparkles size={15} aria-hidden="true" />
            Probar con cuenta demo
          </Button>

          <p className="text-center text-sm text-gray-600">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
