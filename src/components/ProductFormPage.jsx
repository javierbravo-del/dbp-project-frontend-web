import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { categoryService } from '../services/categoryService'
import { productService } from '../services/productService'
import { getErrorMessage } from '../utils/errors'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import ProductForm from '../components/ProductForm'
import Spinner from '../components/Spinner'

const EMPTY_VALUES = {
  codigo: '',
  nombre: '',
  descripcion: '',
  unidadMedida: 'UNIDAD',
  precioCompra: '',
  precioVenta: '',
  categoriaId: '',
}

const toFormValues = (product) => ({
  codigo: product.codigo,
  nombre: product.nombre,
  descripcion: product.descripcion ?? '',
  unidadMedida: product.unidadMedida ?? 'UNIDAD',
  precioCompra: product.precioCompra ?? '',
  precioVenta: product.precioVenta,
  categoriaId: product.categoriaId ?? '',
})

export default function ProductFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const fetchCategories = useCallback((signal) => categoryService.getAll({}, signal), [])
  const fetchProduct = useCallback(
    (signal) => (id ? productService.getById(id, signal) : Promise.resolve(null)),
    [id],
  )

  const categories = useFetch(fetchCategories)
  const product = useFetch(fetchProduct)

  const title = isEditing ? 'Editar producto' : 'Nuevo producto'
  const breadcrumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Productos', to: '/products' },
    { label: title },
  ]

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await productService.update(id, values)
        toast.success('Producto actualizado correctamente')
      } else {
        await productService.create(values)
        toast.success('Producto creado correctamente')
      }
      navigate('/products')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleRetry = () => {
    categories.refetch()
    product.refetch()
  }

  const renderContent = () => {
    const error = categories.error ?? product.error
    if (error) {
      return <ErrorState message={getErrorMessage(error)} onRetry={handleRetry} />
    }
    if (categories.isLoading || product.isLoading) {
      return <Spinner />
    }
    return (
      <ProductForm
        key={product.data?.id ?? 'new'}
        defaultValues={isEditing ? toFormValues(product.data) : EMPTY_VALUES}
        categories={categories.data}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? 'Guardar cambios' : 'Crear producto'}
      />
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <PageHeader title={title} breadcrumbs={breadcrumbs} />
      {renderContent()}
    </section>
  )
}
