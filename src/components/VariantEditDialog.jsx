import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import Input from './Input'

const toNullableNumber = (value) => (value === '' || value === null ? null : Number(value))

const toFormValues = (variant) => ({
  talla: variant?.talla ?? '',
  color: variant?.color ?? '',
  sku: variant?.sku ?? '',
  stockMinimo: variant?.stockMinimo ?? 0,
})

export default function VariantEditDialog({ variant, onSubmit, onCancel }) {
  const dialogRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(null), mode: 'onChange' })

  const isOpen = Boolean(variant)

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) {
      reset(toFormValues(variant))
      dialog.showModal()
    }
    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen, variant, reset])

  const handleCancel = (event) => {
    event.preventDefault()
    if (!isSubmitting) {
      onCancel()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      className="m-auto w-full max-w-lg rounded-2xl p-6 shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-lg font-semibold text-gray-900">Editar variante</h2>
      <p className="mt-1 text-sm text-gray-600">
        Cambia los datos de la variante. Para modificar las unidades usa los botones de stock.
      </p>
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({
            talla: values.talla.trim(),
            color: values.color.trim(),
            sku: values.sku.trim() || null,
            stockMinimo: values.stockMinimo ?? 0,
          }),
        )}
        noValidate
        className="mt-4 space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Talla"
            error={errors.talla?.message}
            {...register('talla', { required: 'La talla es obligatoria' })}
          />
          <Input
            label="Color"
            error={errors.color?.message}
            {...register('color', { required: 'El color es obligatorio' })}
          />
          <Input label="SKU" placeholder="Opcional" {...register('sku')} />
          <Input
            label="Stock mínimo"
            type="number"
            min="0"
            step="1"
            hint="Avisa cuando el stock llegue a este valor."
            error={errors.stockMinimo?.message}
            {...register('stockMinimo', {
              setValueAs: toNullableNumber,
              validate: (value) =>
                value === null ||
                (Number.isInteger(value) && value >= 0) ||
                'Debe ser un número entero, 0 o mayor',
            })}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </dialog>
  )
}

VariantEditDialog.propTypes = {
  variant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    talla: PropTypes.string,
    color: PropTypes.string,
    sku: PropTypes.string,
    stockMinimo: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
