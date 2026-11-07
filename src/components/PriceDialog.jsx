import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import Input from './Input'

export default function PriceDialog({ product, onSubmit, onCancel }) {
  const dialogRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  const isOpen = Boolean(product)

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) {
      reset({ precioVenta: product.precioVenta })
      dialog.showModal()
    }
    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen, product, reset])

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
      <h2 className="text-lg font-semibold text-gray-900">Cambiar precio de venta</h2>
      {product && <p className="mt-1 text-sm text-gray-600">{product.nombre}</p>}
      <form
        onSubmit={handleSubmit((values) => onSubmit(Number(values.precioVenta)))}
        noValidate
        className="mt-4 space-y-4"
      >
        <Input
          label="Nuevo precio (S/)"
          type="number"
          min="0"
          step="0.01"
          error={errors.precioVenta?.message}
          {...register('precioVenta', {
            required: 'El precio es obligatorio',
            validate: (value) => Number(value) > 0 || 'El precio debe ser mayor a 0',
          })}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </dialog>
  )
}

PriceDialog.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string,
    precioVenta: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
