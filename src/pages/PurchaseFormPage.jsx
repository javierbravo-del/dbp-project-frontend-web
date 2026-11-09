import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { productService } from '../services/productService'
import { purchaseService } from '../services/purchaseService'
import { supplierService } from '../services/supplierService'
import { getErrorMessage } from '../utils/errors'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import PurchaseForm from '../components/PurchaseForm'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Compras', to: '/purchases' },
  { label: 'Nueva compra' },
]

const toPayload = (values) => ({
  proveedorId: Number(values.proveedorId),
  detalles: values.detalles.map((line) => ({
    varianteId: Number(line.varianteId),
    cantidad: Number(line.cantidad),
    precioUnitario: Number(line.precioUnitario),
  })),
})

export default function PurchaseFormPage() {
  const navigate = useNavigate()

  const fetchProducts = useCallback(
    (signal) => productService.getAll({ size: 100, soloActivos: true }, signal),
    [],
  )
  const fetchSuppliers = useCallback((signal) => supplierService.getAll({ size: 100 }, signal), [])
  const products = useFetch(fetchProducts)
  const suppliers = useFetch(fetchSuppliers)

  const handleSubmit = async (values) => {
    try {
      const purchase = await purchaseService.create(toPayload(values))
      toast.success('Compra registrada. El stock fue actualizado')
      navigate(`/purchases/${purchase.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleRetry = () => {
    products.refetch()
    suppliers.refetch()
  }

  const renderContent = () => {
    const error = products.error ?? suppliers.error
    if (error) {
      return <ErrorState message={getErrorMessage(error)} onRetry={handleRetry} />
    }
    if (!products.data || !suppliers.data) {
      return <Spinner />
    }
    return (
      <PurchaseForm
        products={products.data.content}
        suppliers={suppliers.data.content}
        onSubmit={handleSubmit}
      />
    )
  }

  return (
    <section className="mx-auto max-w-6xl space-y-4">
      <PageHeader title="Nueva compra" breadcrumbs={BREADCRUMBS} />
      {renderContent()}
    </section>
  )
}
