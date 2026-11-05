import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import ButtonLink from './ButtonLink'
import Input from './Input'

export default function SupplierForm({ defaultValues, onSubmit, submitLabel }) {
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
          placeholder="Ej: Textiles Gamarra S.A.C."
          error={errors.razonSocial?.message}
          {...register('razonSocial', { required: 'La razón social es obligatoria' })}
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
          placeholder="ventas@proveedor.com"
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

      <div className="flex justify-end gap-3">
        <ButtonLink to="/suppliers" variant="secondary">
          Cancelar
        </ButtonLink>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

SupplierForm.propTypes = {
  defaultValues: PropTypes.shape({
    ruc: PropTypes.string,
    razonSocial: PropTypes.string,
    telefono: PropTypes.string,
    correo: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
}
