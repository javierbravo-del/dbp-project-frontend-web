import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import Input from './Input'

const EMPTY_VALUES = { nuevoStock: '', motivo: '' }

export default function StockAdjustDialog({ variant, onSubmit, onCancel }) {
  const dialogRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_VALUES, mode: 'onChange' })

  const isOpen = Boolean(variant)

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) {
      reset(EMPTY_VALUES)
      dialog.showModal()
    }
    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen, reset])

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
      className="m-auto w-full max-w-md rounded-2xl p-6 shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-lg font-semibold text-gray-900">Corregir stock</h2>
      {variant && (
        <p className="mt-1 text-sm text-gray-600">
          Talla {variant.talla} · {variant.color} (el sistema indica {variant.stock} unidades)
        </p>
      )}
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({
            nuevoStock: Number(values.nuevoStock),
            motivo: values.motivo.trim() || null,
          }),
        )}
        noValidate
        className="mt-4 space-y-4"
      >
        <Input
          label="Unidades que realmente tienes"
          type="number"
          min="0"
          step="1"
          hint="Cuenta lo que hay en tu almacén y escríbelo aquí. El sistema ajusta la diferencia."
          error={errors.nuevoStock?.message}
          {...register('nuevoStock', {
            required: 'Escribe cuántas unidades tienes',
            validate: (value) =>
              (Number.isInteger(Number(value)) && Number(value) >= 0) ||
              'Debe ser un número entero, 0 o mayor',
          })}
        />
        <Input
          label="Motivo"
          placeholder="Ej: Conteo de inventario"
          hint="Opcional."
          {...register('motivo')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Corregir stock
          </Button>
        </div>
      </form>
    </dialog>
  )
}

StockAdjustDialog.propTypes = {
  variant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    talla: PropTypes.string,
    color: PropTypes.string,
    stock: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
