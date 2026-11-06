import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from './Button'
import ButtonLink from './ButtonLink'
import Input from './Input'
import Select from './Select'
import TextArea from './TextArea'

const UNIT_OPTIONS = ['UNIDAD', 'DOCENA', 'METRO', 'ROLLO']

const toNullableNumber = (value) => (value === '' || value === null ? null : Number(value))

export default function ProductForm({ defaultValues, categories, onSubmit, submitLabel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, mode: 'onChange' })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Código"
          placeholder="Ej: POL-001"
          hint="Identificador único dentro de tu empresa."
          error={errors.codigo?.message}
          {...register('codigo', { required: 'El código es obligatorio' })}
        />
        <Input
          label="Nombre"
          placeholder="Ej: Polo básico de algodón"
          error={errors.nombre?.message}
          {...register('nombre', { required: 'El nombre es obligatorio' })}
        />
      </div>

      <TextArea
        label="Descripción"
        placeholder="Detalles del producto (opcional)"
        {...register('descripcion')}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Categoría"
          hint="Opcional. Sirve para agrupar tus productos en los reportes."
          {...register('categoriaId', { setValueAs: toNullableNumber })}
        >
          <option value="">Sin categoría</option>
          {categories
            .filter(
              (category) =>
                category.activo !== false || String(category.id) === String(defaultValues.categoriaId),
            )
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
        </Select>

        <Select label="Unidad de medida" {...register('unidadMedida')}>
          {UNIT_OPTIONS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Precio de compra (S/)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          hint="Opcional. Se usa para calcular tu ganancia."
          error={errors.precioCompra?.message}
          {...register('precioCompra', {
            setValueAs: toNullableNumber,
            validate: (value) =>
              value === null || value >= 0 || 'El precio de compra no puede ser negativo',
          })}
        />
        <Input
          label="Precio de venta (S/)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.precioVenta?.message}
          {...register('precioVenta', {
            setValueAs: toNullableNumber,
            validate: (value) =>
              (value !== null && value > 0) || 'El precio de venta debe ser mayor a 0',
          })}
        />
      </div>

      <div className="flex justify-end gap-3">
        <ButtonLink to="/products" variant="secondary">
          Cancelar
        </ButtonLink>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

ProductForm.propTypes = {
  defaultValues: PropTypes.shape({
    codigo: PropTypes.string,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    unidadMedida: PropTypes.string,
    precioCompra: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    precioVenta: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    categoriaId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
}
