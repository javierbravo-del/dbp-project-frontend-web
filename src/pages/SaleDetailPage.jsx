import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { salesService } from '../services/salesService'
import { getErrorMessage } from '../utils/errors'
import { formatCurrency, formatDateTime } from '../utils/format'
import { PAYMENT_METHODS, SALES_CHANNELS, labelOf } from '../utils/sales'
import Badge from '../components/Badge'
import ButtonLink from '../components/ButtonLink'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import InfoItem from '../components/InfoItem'

const LINE_COLUMNS = [
  { key: 'varianteDescripcion', header: 'Producto' },
  { key: 'cantidad', header: 'Cantidad' },
  {
    key: 'precioUnitario',
    header: 'Precio unitario',
    render: (line) => formatCurrency(line.precioUnitario),
  },
  { key: 'subtotal', header: 'Subtotal', render: (line) => formatCurrency(line.subtotal) },
]

export default function SaleDetailPage() {
  const { id } = useParams()
  const fetchSale = useCallback((signal) => salesService.getById(id, signal), [id])
  const { data: sale, error, refetch } = useFetch(fetchSale)

  const breadcrumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Ventas', to: '/sales' },
    { label: `Venta #${id}` },
  ]

  const renderContent = () => {
    if (error) {
      return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
    }
    if (!sale) {
      return <Spinner />
    }
    return (
      <>
        <dl className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
          <InfoItem label="Fecha">{formatDateTime(sale.fechaEmision)}</InfoItem>
          <InfoItem label="Cliente">{sale.clienteNombre ?? 'Cliente general'}</InfoItem>
          <InfoItem label="Medio de pago">{labelOf(PAYMENT_METHODS, sale.medioPago)}</InfoItem>
          <InfoItem label="Canal">{labelOf(SALES_CHANNELS, sale.canal)}</InfoItem>
          <InfoItem label="Estado">
            <Badge variant={sale.estado === 'COMPLETADA' ? 'success' : 'neutral'}>
              {sale.estado}
            </Badge>
          </InfoItem>
        </dl>

        <DataTable columns={LINE_COLUMNS} rows={sale.detalles} />

        <p className="text-right text-xl font-bold text-gray-900">
          Total: {formatCurrency(sale.total)}
        </p>
      </>
    )
  }

  return (
    <section className="mx-auto max-w-5xl space-y-4">
      <PageHeader title={`Venta #${id}`} breadcrumbs={breadcrumbs}>
        <ButtonLink to="/sales/new">Nueva venta</ButtonLink>
      </PageHeader>
      {renderContent()}
    </section>
  )
}
