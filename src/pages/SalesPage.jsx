import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Plus } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { usePageParams } from '../hooks/usePageParams'
import { salesService } from '../services/salesService'
import { getLastDaysRange } from '../utils/dates'
import { getErrorMessage } from '../utils/errors'
import { formatCurrency, formatDateTime } from '../utils/format'
import { PAYMENT_METHODS, SALES_CHANNELS, labelOf } from '../utils/sales'
import Badge from '../components/Badge'
import ButtonLink from '../components/ButtonLink'
import CsvExportButton from '../components/CsvExportButton'
import FilterChips from '../components/FilterChips'
import DataTable from '../components/DataTable'
import DateRangeFilter from '../components/DateRangeFilter'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Ventas' }]

const STATUS_BADGES = {
  COMPLETADA: { variant: 'success', label: 'Completada' },
  PENDIENTE: { variant: 'warning', label: 'Pendiente' },
  ANULADA: { variant: 'danger', label: 'Anulada' },
}

const COLUMNS = [
  {
    key: 'fechaEmision',
    header: 'Fecha',
    csv: (sale) => sale.fechaEmision,
    sortKey: 'fechaEmision',
    render: (sale) => formatDateTime(sale.fechaEmision),
  },
  {
    key: 'clienteNombre',
    header: 'Cliente',
    csv: (sale) => sale.clienteNombre ?? 'Cliente general',
    render: (sale) => sale.clienteNombre ?? 'Cliente general',
  },
  {
    key: 'medioPago',
    header: 'Pago',
    csv: (sale) => labelOf(PAYMENT_METHODS, sale.medioPago),
    render: (sale) => labelOf(PAYMENT_METHODS, sale.medioPago),
  },
  {
    key: 'canal',
    header: 'Canal',
    csv: (sale) => labelOf(SALES_CHANNELS, sale.canal),
    render: (sale) => labelOf(SALES_CHANNELS, sale.canal),
  },
  {
    key: 'total',
    header: 'Total',
    csv: (sale) => sale.total,
    sortKey: 'total',
    render: (sale) => formatCurrency(sale.total),
  },
  {
    key: 'estado',
    header: 'Estado',
    csv: (sale) => STATUS_BADGES[sale.estado]?.label ?? sale.estado,
    render: (sale) => {
      const badge = STATUS_BADGES[sale.estado] ?? { variant: 'neutral', label: sale.estado }
      return <Badge variant={badge.variant}>{badge.label}</Badge>
    },
  },
  {
    key: 'actions',
    header: 'Detalle',
    render: (sale) => (
      <Link
        to={`/sales/${sale.id}`}
        title="Ver detalle"
        aria-label={`Ver detalle de la venta ${sale.id}`}
        className="inline-flex rounded-lg p-2 text-brand-600 hover:bg-brand-50"
      >
        <Eye size={16} />
      </Link>
    ),
  },
]

export default function SalesPage() {
  const { page, size, sort, setPage, setSize, setSort } = usePageParams({
    defaultSort: 'fechaEmision,desc',
  })
  const [range, setRange] = useState(() => getLastDaysRange(30))
  const { desde, hasta } = range

  const fetchSales = useCallback(
    (signal) => salesService.getAll({ page, size, sort, desde, hasta }, signal),
    [page, size, sort, desde, hasta],
  )
  const { data, error, isLoading, refetch } = useFetch(fetchSales)

  const [statusFilter, setStatusFilter] = useState('TODAS')
  const rows = useMemo(() => {
    const all = data?.content ?? []
    return statusFilter === 'TODAS' ? all : all.filter((sale) => sale.estado === statusFilter)
  }, [data, statusFilter])

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
          title="No hay ventas en este rango"
          description="Cambia las fechas o registra una nueva venta."
          action={<ButtonLink to="/sales/new">Registrar venta</ButtonLink>}
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
      <PageHeader title="Ventas" breadcrumbs={BREADCRUMBS}>
        <CsvExportButton filename="ventas.csv" columns={COLUMNS} rows={rows} />
        <ButtonLink to="/sales/new">
          <Plus size={16} className="mr-1" />
          Nueva venta
        </ButtonLink>
      </PageHeader>

      <DateRangeFilter desde={desde} hasta={hasta} onChange={handleRangeChange} />
      <FilterChips
        label="Filtrar por estado"
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { value: 'TODAS', label: 'Todas' },
          { value: 'COMPLETADA', label: 'Completadas' },
          { value: 'PENDIENTE', label: 'Pendientes' },
          { value: 'ANULADA', label: 'Anuladas' },
        ]}
      />

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
