import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { clientService } from '../services/clientService'
import { productService } from '../services/productService'
import { salesService } from '../services/salesService'
import { getErrorMessage } from '../utils/errors'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import SaleForm from '../components/SaleForm'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Ventas', to: '/sales' },
  { label: 'Nueva venta' },
]

const toPayload = (values) => ({
  clienteId: values.clienteId ? Number(values.clienteId) : null,
  medioPago: values.medioPago,
  canal: values.canal || null,
  detalles: values.detalles.map((line) => ({
    varianteId: Number(line.varianteId),
    cantidad: Number(line.cantidad),
    precioUnitario: Number(line.precioUnitario),
  })),
})

export default function SaleFormPage() {
  const navigate = useNavigate()

  const fetchProducts = useCallback(
    (signal) => productService.getAll({ size: 100, soloActivos: true }, signal),
    [],
  )
  const fetchClients = useCallback((signal) => clientService.getAll({ size: 100 }, signal), [])
  const products = useFetch(fetchProducts)
  const clients = useFetch(fetchClients)

  const handleSubmit = async (values) => {
    try {
      const sale = await salesService.create(toPayload(values))
      toast.success('Venta registrada correctamente')
      navigate(`/sales/${sale.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleRetry = () => {
    products.refetch()
    clients.refetch()
  }

  const renderContent = () => {
    const error = products.error ?? clients.error
    if (error) {
      return <ErrorState message={getErrorMessage(error)} onRetry={handleRetry} />
    }
    if (!products.data || !clients.data) {
      return <Spinner />
    }
    return (
      <SaleForm
        products={products.data.content}
        clients={clients.data.content}
        onSubmit={handleSubmit}
      />
    )
  }

  return (
    <section className="mx-auto max-w-6xl space-y-4">
      <PageHeader title="Nueva venta" breadcrumbs={BREADCRUMBS} />
      {renderContent()}
    </section>
  )
}
