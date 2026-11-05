import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import Input from './Input'

const EMPTY_VALUES = { talla: '', color: '', sku: '', stockMinimo: '' }

const toNullableNumber = (value) => (value === '' || value === null ? null : Number(value))

export default function VariantForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_VALUES, mode: 'onChange' })

  const submit = async (values) => {
    const created = await onSubmit(values)
    if (created) {
      reset(EMPTY_VALUES)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold text-gray-900">Nueva variante</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Talla"
          placeholder="Ej: M"
          error={errors.talla?.message}
          {...register('talla', { required: 'La talla es obligatoria' })}
        />
        <Input
          label="Color"
          placeholder="Ej: Negro"
          error={errors.color?.message}
          {...register('color', { required: 'El color es obligatorio' })}
        />
        <Input
          label="SKU"
          placeholder="Opcional"
          {...register('sku')}
        />
        <Input
          label="Stock mínimo"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          hint="Avisa cuando el stock llegue a este valor."
          error={errors.stockMinimo?.message}
          {...register('stockMinimo', {
            setValueAs: toNullableNumber,
            validate: (value) =>
              value === null || value >= 0 || 'El stock mínimo no puede ser negativo',
          })}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Agregar variante
        </Button>
      </div>
    </form>
  )
}

VariantForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}