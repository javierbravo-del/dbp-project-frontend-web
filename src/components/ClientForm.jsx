import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import ButtonLink from './ButtonLink'
import Input from './Input'

export default function ClientForm({ defaultValues, onSubmit, submitLabel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, mode: 'onChange' })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Documento"
          placeholder="DNI (8 dígitos) o RUC (11 dígitos)"
          inputMode="numeric"
          error={errors.documento?.message}
          {...register('documento', {
            required: 'El documento es obligatorio',
            pattern: {
              value: /^(\d{8}|\d{11})$/,
              message: 'Debe ser un DNI (8 dígitos) o un RUC (11 dígitos)',
            },
          })}
        />
        <Input
          label="Nombre"
          placeholder="Ej: María Pérez"
          error={errors.nombre?.message}
          {...register('nombre', { required: 'El nombre es obligatorio' })}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Teléfono"
          placeholder="Ej: +51987654321"
          hint="Opcional. Entre 6 y 15 dígitos, con + opcional."
          error={errors.telefono?.message}
          {...register('telefono', {
            pattern: {
              value: /^\+?\d{6,15}$/,
              message: 'Teléfono inválido: use entre 6 y 15 dígitos, con + opcional',
            },
          })}
        />
        <Input
          label="Correo"
          type="email"
          placeholder="cliente@correo.com"
          hint="Opcional."
          error={errors.correo?.message}
          {...register('correo', {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Correo inválido',
            },
          })}
        />
      </div>

      <Input
        label="Dirección"
        placeholder="Opcional"
        {...register('direccion')}
      />

      <div className="flex justify-end gap-3">
        <ButtonLink to="/clients" variant="secondary">
          Cancelar
        </ButtonLink>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

ClientForm.propTypes = {
  defaultValues: PropTypes.shape({
    documento: PropTypes.string,
    nombre: PropTypes.string,
    telefono: PropTypes.string,
    correo: PropTypes.string,
    direccion: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
}
