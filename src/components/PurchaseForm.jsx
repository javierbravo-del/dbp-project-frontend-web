import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import Button from './Button'
import ButtonLink from './ButtonLink'
import SaleLineFields from './SaleLineFields'
import Select from './Select'
import Stepper from './Stepper'
import SummaryRow from './SummaryRow'

const EMPTY_LINE = { productoId: '', varianteId: '', cantidad: 1, precioUnitario: '' }

const STEPS = ['Proveedor', 'Productos', 'Confirmar']
const LAST_STEP = STEPS.length - 1

const DEFAULT_VALUES = { proveedorId: '', detalles: [EMPTY_LINE] }

export default function PurchaseForm({ products, suppliers, onSubmit }) {
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
  const total = lines.reduce(
    (sum, line) => sum + (Number(line.cantidad) || 0) * (Number(line.precioUnitario) || 0),
    0,
  )

  const proveedorId = useWatch({ control, name: 'proveedorId' })
  const supplier = suppliers.find((item) => String(item.id) === String(proveedorId))

  const goNext = async () => {
    const isValid = await trigger(step === 0 ? 'proveedorId' : 'detalles')
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

      <section hidden={step !== 0} className="rounded-lg bg-white p-6 shadow-sm">
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

      <section hidden={step !== 1} className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
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

      {step === LAST_STEP && (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-900">Revisa tu compra</h2>
          <dl>
            <SummaryRow label="Proveedor" value={supplier ? supplier.razonSocial : '—'} />
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
            <ButtonLink to="/purchases" variant="secondary">
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
              Registrar compra
            </Button>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-gray-400">Ctrl + Enter para continuar o registrar</p>
    </form>
  )
}

PurchaseForm.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  suppliers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
}
