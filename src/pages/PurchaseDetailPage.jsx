import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { purchaseService } from '../services/purchaseService'
import { getErrorMessage } from '../utils/errors'
import { formatCurrency, formatDateTime } from '../utils/format'
import { ORDER_STATUS_BADGES } from '../utils/sales'
import Badge from '../components/Badge'
import ButtonLink from '../components/ButtonLink'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import InfoItem from '../components/InfoItem'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

const LINE_COLUMNS = [
  { key: 'varianteDescripcion', header: 'Producto' },
  { key: 'cantidad', header: 'Cantidad' },
  {
    key: 'precioUnitario',
    header: 'Costo unitario',
    render: (line) => formatCurrency(line.precioUnitario),
  },
  { key: 'subtotal', header: 'Subtotal', render: (line) => formatCurrency(line.subtotal) },
]

export default function PurchaseDetailPage() {
  const { id } = useParams()
  const fetchPurchase = useCallback((signal) => purchaseService.getById(id, signal), [id])
  const { data: purchase, error, refetch } = useFetch(fetchPurchase)

  const breadcrumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Compras', to: '/purchases' },
    { label: `Compra #${id}` },
  ]

  const renderContent = () => {
    if (error) {
      return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
    }
    if (!purchase) {
      return <Spinner />
    }
    const badge = ORDER_STATUS_BADGES[purchase.estado] ?? {
      variant: 'neutral',
      label: purchase.estado,
    }
    return (
      <>
        <dl className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3">
          <InfoItem label="Fecha">{formatDateTime(purchase.fechaEmision)}</InfoItem>
          <InfoItem label="Proveedor">{purchase.proveedorRazonSocial}</InfoItem>
          <InfoItem label="Estado">
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </InfoItem>
        </dl>

        <DataTable columns={LINE_COLUMNS} rows={purchase.detalles} />

        <p className="text-right text-xl font-bold text-gray-900">
          Total: {formatCurrency(purchase.total)}
        </p>
      </>
    )
  }

  return (
    <section className="mx-auto max-w-5xl space-y-4">
      <PageHeader title={`Compra #${id}`} breadcrumbs={breadcrumbs}>
        <ButtonLink to="/purchases/new">Nueva compra</ButtonLink>
      </PageHeader>
      {renderContent()}
    </section>
  )
}
