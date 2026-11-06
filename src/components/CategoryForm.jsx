import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import ButtonLink from './ButtonLink'
import Input from './Input'
import TextArea from './TextArea'

export default function CategoryForm({ defaultValues, onSubmit, submitLabel }) {
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
      <Input
        label="Nombre"
        placeholder="Ej: Polos"
        error={errors.nombre?.message}
        {...register('nombre', { required: 'El nombre es obligatorio' })}
      />

      <TextArea
        label="Descripción"
        placeholder="Opcional"
        {...register('descripcion', {
          maxLength: { value: 500, message: 'La descripción no puede superar los 500 caracteres' },
        })}
      />
      {errors.descripcion && (
        <p role="alert" className="-mt-3 text-sm text-red-600">
          {errors.descripcion.message}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <ButtonLink to="/categories" variant="secondary">
          Cancelar
        </ButtonLink>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

CategoryForm.propTypes = {
  defaultValues: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
}
