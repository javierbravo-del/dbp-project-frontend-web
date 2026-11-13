import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { enterpriseService } from '../services/enterpriseService'
import { getErrorMessage } from '../utils/errors'
import Button from '../components/Button'
import Input from '../components/Input'

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuth()
    const [createdEnterpriseId, setCreatedEnterpriseId] = useState(null)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

    const onSubmit = async (values) => {
    try {
      let enterpriseId = createdEnterpriseId
      if (!enterpriseId) {
        const enterprise = await enterpriseService.create({
          ruc: values.ruc.trim(),
          razonSocial: values.razonSocial.trim(),
        })
        enterpriseId = enterprise.id
        setCreatedEnterpriseId(enterpriseId)
      }
      await registerUser({
        nombre: values.nombre.trim(),
        email: values.email.trim(),
        password: values.password,
        enterpriseId,
      })
      toast.success('Cuenta creada. ¡Bienvenido!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-lg space-y-6 rounded-2xl bg-white p-8 shadow"
      >
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Registra tu negocio y tu usuario administrador.
          </p>
        </header>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-700">Tu negocio</legend>
          <Input
            label="RUC"
            placeholder="11 dígitos"
            inputMode="numeric"
            error={errors.ruc?.message}
            {...register('ruc', {
              required: 'El RUC es obligatorio',
              pattern: { value: /^\d{11}$/, message: 'El RUC debe tener exactamente 11 dígitos' },
            })}
          />
          <Input
            label="Razón social"
            placeholder="Ej: Gamarra Textiles SAC"
            error={errors.razonSocial?.message}
            {...register('razonSocial', { required: 'La razón social es obligatoria' })}
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-700">Administrador</legend>
          <Input
            label="Nombre"
            autoComplete="name"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />
          <Input
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Ingresa un correo válido' },
            })}
          />
          <Input
            label="Contraseña"
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
          <Input
            label="Confirmar contraseña"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirma tu contraseña',
              validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden',
            })}
          />
        </fieldset>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Crear cuenta
        </Button>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  )
}