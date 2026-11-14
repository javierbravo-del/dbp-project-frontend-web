import PropTypes from 'prop-types'
import { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import { PAYMENT_METHODS, SALES_CHANNELS, labelOf } from '../utils/sales'
import Button from './Button'
import ButtonLink from './ButtonLink'
import SaleLineFields from './SaleLineFields'
import Select from './Select'
import Stepper from './Stepper'
import SummaryRow from './SummaryRow'

const EMPTY_LINE = { productoId: '', varianteId: '', cantidad: 1, precioUnitario: '' }
const STEPS = ['Datos', 'Productos', 'Confirmar']
const LAST_STEP = STEPS.length - 1

const DEFAULT_VALUES = {
  clienteId: '',
  medioPago: 'EFECTIVO',
  canal: 'TIENDA',
  detalles: [EMPTY_LINE],
}

export default function SaleForm({ products, clients, onSubmit }) {
  const [step, setStep] = useState(0)
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES, mode: 'onChange' })
  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' })

  const lines = useWatch({ control, name: 'detalles' })
  const clienteId = useWatch({ control, name: 'clienteId' })
  const medioPago = useWatch({ control, name: 'medioPago' })
  const canal = useWatch({ control, name: 'canal' })
  const total = lines.reduce(
    (sum, line) => sum + (Number(line.cantidad) || 0) * (Number(line.precioUnitario) || 0),
    0,
  )

  const goNext = async () => {
    const isValid = step === 1 ? await trigger('detalles') : true
    if (isValid) setStep((current) => Math.min(current + 1, LAST_STEP))
  }

  // Atajos: Ctrl+Enter continúa o registra; Alt+N agrega una línea; Enter no envía por accidente
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      if (step < LAST_STEP) goNext()
      else handleSubmit(onSubmit)()
    } else if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      event.preventDefault()
    } else if (event.altKey && event.key.toLowerCase() === 'n' && step === 1) {
      event.preventDefault()
      append(EMPTY_LINE)
    }
  }

  const client = clients.find((item) => String(item.id) === String(clienteId))

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
      noValidate
      className="space-y-6"
    >
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <Stepper steps={STEPS} current={step} />
      </div>

      <section hidden={step !== 0} className="grid gap-5 rounded-lg bg-white p-6 shadow-sm sm:grid-cols-3">
        <Select label="Cliente" hint="Opcional. Sin cliente se registra como venta general." {...register('clienteId')}>
          <option value="">Cliente general</option>
          {clients.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre} ({item.documento})
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

      <section hidden={step !== 1} className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Productos de la venta</h2>
          <Button variant="secondary" onClick={() => append(EMPTY_LINE)}>
            <Plus size={16} className="mr-1" />
            Agregar línea
          </Button>
        </div>
        <p className="text-xs text-gray-500">Atajo: Alt + N agrega una línea.</p>

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

      {step === LAST_STEP && (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-900">Revisa tu venta</h2>
          <dl>
            <SummaryRow label="Cliente" value={client ? client.nombre : 'Cliente general'} />
            <SummaryRow label="Medio de pago" value={labelOf(PAYMENT_METHODS, medioPago)} />
            <SummaryRow label="Canal" value={labelOf(SALES_CHANNELS, canal)} />
            {lines.map((line, index) => {
              const product = products.find((item) => String(item.id) === String(line.productoId))
              return (
                <SummaryRow
                  key={`${line.productoId}-${index}`}
                  label={`${line.cantidad} × ${product?.nombre ?? 'Producto'}`}
                  value={formatCurrency((Number(line.cantidad) || 0) * (Number(line.precioUnitario) || 0))}
                />
              )
            })}
          </dl>
        </section>
      )}

      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-bold text-gray-900">Total: {formatCurrency(total)}</p>
        <div className="flex flex-wrap gap-3">
          {step === 0 ? (
            <ButtonLink to="/sales" variant="secondary">
              Cancelar
            </ButtonLink>
          ) : (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} className="mr-1" />
              Atrás
            </Button>
          )}
          {step < LAST_STEP ? (
            <Button onClick={goNext}>
              Continuar
              <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button type="submit" isLoading={isSubmitting}>
              Registrar venta
            </Button>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-gray-400">Ctrl + Enter para continuar o registrar</p>
    </form>
  )
}

SaleForm.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
}
