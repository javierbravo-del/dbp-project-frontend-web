import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import Button from './Button'
import ButtonLink from './ButtonLink'
import SaleLineFields from './SaleLineFields'
import Select from './Select'

const EMPTY_LINE = { productoId: '', varianteId: '', cantidad: 1, precioUnitario: '' }

const DEFAULT_VALUES = { proveedorId: '', detalles: [EMPTY_LINE] }

export default function PurchaseForm({ products, suppliers, onSubmit }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES, mode: 'onChange' })
  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' })

  const lines = useWatch({ control, name: 'detalles' })
  const total = lines.reduce(
    (sum, line) => sum + (Number(line.cantidad) || 0) * (Number(line.precioUnitario) || 0),
    0,
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="max-w-md">
          <Select
            label="Proveedor"
            error={errors.proveedorId?.message}
            {...register('proveedorId', { required: 'Elige un proveedor' })}
          >
            <option value="">Selecciona...</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.razonSocial} ({supplier.ruc})
              </option>
            ))}
          </Select>
        </div>
        {suppliers.length === 0 && (
          <p className="mt-2 text-sm text-yellow-700">
            Aún no tienes proveedores.{' '}
            <Link to="/suppliers/new" className="font-medium underline">
              Crea uno aquí
            </Link>
            .
          </p>
        )}
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Productos comprados</h2>
          <Button variant="secondary" onClick={() => append(EMPTY_LINE)}>
            <Plus size={16} className="mr-1" />
            Agregar línea
          </Button>
        </div>

        {fields.map((field, index) => (
          <SaleLineFields
            key={field.id}
            mode="purchase"
            index={index}
            products={products}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          />
        ))}
      </section>

      <div className="flex flex-col items-end gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-bold text-gray-900">Total: {formatCurrency(total)}</p>
        <div className="flex gap-3">
          <ButtonLink to="/purchases" variant="secondary">
            Cancelar
          </ButtonLink>
          <Button type="submit" isLoading={isSubmitting}>
            Registrar compra
          </Button>
        </div>
      </div>
    </form>
  )
}

PurchaseForm.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  suppliers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
}
