import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import Input from './Input'

const EMPTY_VALUES = { cantidad: '', motivo: '' }

export default function StockEntryDialog({ variant, onSubmit, onCancel }) {
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
      <h2 className="text-lg font-semibold text-gray-900">Registrar entrada de stock</h2>
      {variant && (
        <p className="mt-1 text-sm text-gray-600">
          Talla {variant.talla} · {variant.color} (stock actual: {variant.stock})
        </p>
      )}
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({
            cantidad: Number(values.cantidad),
            motivo: values.motivo.trim() || null,
          }),
        )}
        noValidate
        className="mt-4 space-y-4"
      >
        <Input
          label="Cantidad"
          type="number"
          min="1"
          step="1"
          error={errors.cantidad?.message}
          {...register('cantidad', {
            required: 'La cantidad es obligatoria',
            validate: (value) =>
              (Number.isInteger(Number(value)) && Number(value) >= 1) ||
              'La cantidad debe ser un entero mayor a 0',
          })}
        />
        <Input
          label="Motivo"
          placeholder="Ej: Compra inicial"
          hint="Opcional."
          {...register('motivo')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Registrar entrada
          </Button>
        </div>
      </form>
    </dialog>
  )
}

StockEntryDialog.propTypes = {
  variant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    talla: PropTypes.string,
    color: PropTypes.string,
    stock: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
