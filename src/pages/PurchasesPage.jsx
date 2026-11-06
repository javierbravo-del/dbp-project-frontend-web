import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Plus } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { usePageParams } from '../hooks/usePageParams'
import { purchaseService } from '../services/purchaseService'
import { getLastDaysRange } from '../utils/dates'
import { getErrorMessage } from '../utils/errors'
import { formatCurrency, formatDateTime } from '../utils/format'
import { ORDER_STATUS_BADGES } from '../utils/sales'
import Badge from '../components/Badge'
import ButtonLink from '../components/ButtonLink'
import DataTable from '../components/DataTable'
import DateRangeFilter from '../components/DateRangeFilter'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/' }, { label: 'Compras' }]

const COLUMNS = [
  {
    key: 'fechaEmision',
    header: 'Fecha',
    sortKey: 'fechaEmision',
    render: (purchase) => formatDateTime(purchase.fechaEmision),
  },
  { key: 'proveedorRazonSocial', header: 'Proveedor' },
  {
    key: 'total',
    header: 'Total',
    sortKey: 'total',
    render: (purchase) => formatCurrency(purchase.total),
  },
  {
    key: 'estado',
    header: 'Estado',
    render: (purchase) => {
      const badge = ORDER_STATUS_BADGES[purchase.estado] ?? {
        variant: 'neutral',
        label: purchase.estado,
      }
      return <Badge variant={badge.variant}>{badge.label}</Badge>
    },
  },
  {
    key: 'actions',
    header: 'Detalle',
    render: (purchase) => (
      <Link
        to={`/purchases/${purchase.id}`}
        title="Ver detalle"
        aria-label={`Ver detalle de la compra ${purchase.id}`}
        className="inline-flex rounded-lg p-2 text-blue-600 hover:bg-blue-50"
      >
        <Eye size={16} />
      </Link>
    ),
  },
]

export default function PurchasesPage() {
  const { page, size, sort, setPage, setSize, setSort } = usePageParams({
    defaultSort: 'fechaEmision,desc',
  })
  const [range, setRange] = useState(() => getLastDaysRange(30))
  const { desde, hasta } = range

  const fetchPurchases = useCallback(
    (signal) => purchaseService.getAll({ page, size, sort, desde, hasta }, signal),
    [page, size, sort, desde, hasta],
  )
  const { data, error, isLoading, refetch } = useFetch(fetchPurchases)

  const rows = useMemo(() => data?.content ?? [], [data])

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',')
    const direction = currentField === field && currentDirection === 'asc' ? 'desc' : 'asc'
    setSort(`${field},${direction}`)
  }

  const handleRangeChange = (nextRange) => {
    setRange(nextRange)
    setPage(1)
  }

  const renderContent = () => {
    if (error) {
      return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
    }
    if (!data) {
      return <Spinner />
    }
    if (data.totalElements === 0) {
      return (
        <EmptyState
          title="No hay compras en este rango"
          description="Cambia las fechas o registra una nueva compra."
          action={<ButtonLink to="/purchases/new">Registrar compra</ButtonLink>}
        />
      )
    }
    return (
      <DataTable
        columns={COLUMNS}
        rows={rows}
        sort={sort}
        onSortChange={handleSort}
        isLoading={isLoading}
      />
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title="Compras" breadcrumbs={BREADCRUMBS}>
        <ButtonLink to="/purchases/new">
          <Plus size={16} className="mr-1" />
          Nueva compra
        </ButtonLink>
      </PageHeader>

      <DateRangeFilter desde={desde} hasta={hasta} onChange={handleRangeChange} />

      {renderContent()}

      {data && data.totalElements > 0 && (
        <Pagination
          page={page}
          size={size}
          totalElements={data.totalElements}
          totalPages={data.totalPages}
          onPageChange={setPage}
          onSizeChange={setSize}
        />
      )}
    </section>
  )
}
