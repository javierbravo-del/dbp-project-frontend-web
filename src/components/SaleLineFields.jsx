import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { variantService } from '../services/variantService'
import { formatCurrency } from '../utils/format'
import Input from './Input'
import Select from './Select'

export default function SaleLineFields({
  index,
  products,
  register,
  errors,
  watch,
  setValue,
  canRemove,
  onRemove,
  mode = 'sale',
}) {
  const isSale = mode === 'sale'
  const productId = watch(`detalles.${index}.productoId`)
  const variantId = watch(`detalles.${index}.varianteId`)
  const quantity = Number(watch(`detalles.${index}.cantidad`)) || 0
  const price = Number(watch(`detalles.${index}.precioUnitario`)) || 0

  const fetchVariants = useCallback(
    (signal) =>
      productId
        ? variantService.getByProduct(productId, { size: 100 }, signal)
        : Promise.resolve(null),
    [productId],
  )
  const variants = useFetch(fetchVariants)
  const options = variants.data?.content ?? []
  const selected = options.find((variant) => String(variant.id) === String(variantId))
  const lineErrors = errors.detalles?.[index]
  const hasNoVariants = Boolean(productId) && variants.data && options.length === 0

  const handleProductChange = (event) => {
    const product = products.find((item) => String(item.id) === event.target.value)
    const suggestedPrice = isSale ? product?.precioVenta : product?.precioCompra
    setValue(`detalles.${index}.varianteId`, '')
    setValue(`detalles.${index}.precioUnitario`, suggestedPrice ?? '')
  }

  const stockLabel = (variant) => {
    if (variant.stock > 0) return `stock ${variant.stock}`
    return isSale ? 'agotado' : 'sin stock'
  }

  return (
    <div className="space-y-2 rounded-xl border border-gray-200 p-4">
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-3">
          <Select
            label="Producto"
            error={lineErrors?.productoId?.message}
            {...register(`detalles.${index}.productoId`, {
              required: 'Elige un producto',
              onChange: handleProductChange,
            })}
          >
            <option value="">Selecciona...</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nombre}
              </option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Select
            label="Variante"
            disabled={!productId || variants.isLoading}
            error={lineErrors?.varianteId?.message}
            {...register(`detalles.${index}.varianteId`, { required: 'Elige una variante' })}
          >
            <option value="">{variants.isLoading ? 'Cargando...' : 'Selecciona...'}</option>
            {options.map((variant) => (
              <option key={variant.id} value={variant.id} disabled={isSale && variant.stock <= 0}>
                {`Talla ${variant.talla} · ${variant.color} (${stockLabel(variant)})`}
              </option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-2">
          <Input
            label="Cantidad"
            type="number"
            min="1"
            step="1"
            error={lineErrors?.cantidad?.message}
            {...register(`detalles.${index}.cantidad`, {
              required: 'Obligatoria',
              validate: (value) => {
                const amount = Number(value)
                if (!Number.isInteger(amount) || amount < 1) return 'Entero mayor a 0'
                if (isSale && selected && amount > selected.stock) {
                  return `Solo hay ${selected.stock}`
                }
                return true
              },
            })}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label={isSale ? 'Precio (S/)' : 'Costo (S/)'}
            type="number"
            min="0"
            step="0.01"
            error={lineErrors?.precioUnitario?.message}
            {...register(`detalles.${index}.precioUnitario`, {
              required: 'Obligatorio',
              validate: (value) => Number(value) > 0 || 'Debe ser mayor a 0',
            })}
          />
        </div>

        <div className="flex items-end justify-between gap-2 md:col-span-2">
          <div>
            <p className="text-xs font-medium text-gray-500">Subtotal</p>
            <p className="py-2 text-sm font-semibold text-gray-900">
              {formatCurrency(quantity * price)}
            </p>
          </div>
          {canRemove && (
            <button
              type="button"
              title="Quitar línea"
              aria-label={`Quitar línea ${index + 1}`}
              onClick={onRemove}
              className="mb-1 rounded-lg p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {hasNoVariants && (
        <p className="text-sm text-yellow-700">
          Este producto no tiene variantes.{' '}
          <Link to={`/products/${productId}/variants`} className="font-medium underline">
            Agrégalas aquí
          </Link>
          .
        </p>
      )}
    </div>
  )
}

SaleLineFields.propTypes = {
  index: PropTypes.number.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  canRemove: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['sale', 'purchase']),
}
