import PropTypes from 'prop-types'
import { useFieldArray, useForm } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import { PAYMENT_METHODS, SALES_CHANNELS } from '../utils/sales'
import Button from './Button'
import ButtonLink from './ButtonLink'
import SaleLineFields from './SaleLineFields'
import Select from './Select'

const EMPTY_LINE = { productoId: '', varianteId: '', cantidad: 1, precioUnitario: '' }

const DEFAULT_VALUES = {
  clienteId: '',
  medioPago: 'EFECTIVO',
  canal: 'TIENDA',
  detalles: [EMPTY_LINE],
}

export default function SaleForm({ products, clients, onSubmit }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES, mode: 'onChange' })
  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' })

  const lines = watch('detalles')
  const total = lines.reduce(
    (sum, line) => sum + (Number(line.cantidad) || 0) * (Number(line.precioUnitario) || 0),
    0,
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <section className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3">
        <Select label="Cliente" hint="Opcional. Sin cliente se registra como venta general." {...register('clienteId')}>
          <option value="">Cliente general</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.nombre} ({client.documento})
            </option>
          ))}
        </Select>
        <Select label="Medio de pago" {...register('medioPago', { required: true })}>
          {PAYMENT_METHODS.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </Select>
        <Select label="Canal de venta" {...register('canal')}>
          {SALES_CHANNELS.map((channel) => (
            <option key={channel.value} value={channel.value}>
              {channel.label}
            </option>
          ))}
        </Select>
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Productos de la venta</h2>
          <Button variant="secondary" onClick={() => append(EMPTY_LINE)}>
            <Plus size={16} className="mr-1" />
            Agregar línea
          </Button>
        </div>

        {fields.map((field, index) => (
          <SaleLineFields
            key={field.id}
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
          <ButtonLink to="/sales" variant="secondary">
            Cancelar
          </ButtonLink>
          <Button type="submit" isLoading={isSubmitting}>
            Registrar venta
          </Button>
        </div>
      </div>
    </form>
  )
}

SaleForm.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
}
