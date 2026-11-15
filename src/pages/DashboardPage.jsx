import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote, Percent, Receipt, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import reportService from '../services/reportService';
import stockService from '../services/stockService';
import { getErrorMessage } from '../utils/errors';
import { formatCurrency } from '../utils/format';
import {
  formatShortDay,
  getDaysList,
  getLastDaysRange,
  getPreviousRange,
  percentChange,
} from '../utils/dates';
import { clientService } from '../services/clientService';
import { productService } from '../services/productService';
import { salesService } from '../services/salesService';
import DailySalesChart from '../components/DailySalesChart';
import OnboardingChecklist from '../components/OnboardingChecklist';
import StatCard from '../components/StatCard';
import DashboardCard from '../components/DashboardCard';
import DateRangeFilter from '../components/DateRangeFilter';
import SalesBarChart from '../components/SalesBarChart';
import Badge from '../components/Badge';

const GROUPINGS = [
  { value: 'MEDIO_PAGO', label: 'Medio de pago' },
  { value: 'CANAL', label: 'Canal' },
  { value: 'CATEGORIA', label: 'Categoría' },
  { value: 'DIA_SEMANA', label: 'Día de la semana' },
  { value: 'HORA', label: 'Hora' },
];

const CRITERIA = [
  { value: 'UNIDADES', label: 'Por unidades' },
  { value: 'GANANCIA', label: 'Por ganancia' },
];

const selectClasses =
  'rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [range, setRange] = useState(() => getLastDaysRange(30));
  const [grouping, setGrouping] = useState('MEDIO_PAGO');
  const [criterion, setCriterion] = useState('UNIDADES');
  const { desde, hasta } = range;

  const fetchSummary = useCallback(
    (signal) => reportService.getSummary({ desde, hasta }, signal),
    [desde, hasta],
  );
  const previousRange = getPreviousRange(range);
  const prevDesde = previousRange.desde;
  const prevHasta = previousRange.hasta;
  const fetchPrevious = useCallback(
    (signal) => reportService.getSummary({ desde: prevDesde, hasta: prevHasta }, signal),
    [prevDesde, prevHasta],
  );
  const fetchDaily = useCallback(
    (signal) =>
      Promise.all(
        getDaysList(hasta, 7).map(async (day) => {
          const result = await reportService.getSummary({ desde: day, hasta: day }, signal);
          return { label: formatShortDay(day), total: Number(result.totalVendido ?? 0) };
        }),
      ),
    [hasta],
  );
  const fetchProductCount = useCallback((s) => productService.getAll({ size: 1 }, s), []);
  const fetchClientCount = useCallback((s) => clientService.getAll({ size: 1 }, s), []);
  const fetchSalesCount = useCallback((s) => salesService.getAll({ size: 1 }, s), []);
  const fetchGrouped = useCallback(
    (signal) => reportService.getGroupedSales({ desde, hasta, por: grouping }, signal),
    [desde, hasta, grouping],
  );
  const fetchTop = useCallback(
    (signal) => reportService.getTopProducts({ desde, hasta, criterio: criterion, limite: 5 }, signal),
    [desde, hasta, criterion],
  );
  const fetchLowStock = useCallback((signal) => stockService.getLowStock({ size: 5 }, signal), []);

  const summary = useFetch(
    useCallback((s) => (isAdmin ? fetchSummary(s) : Promise.resolve(null)), [isAdmin, fetchSummary]),
  );
  const previous = useFetch(
    useCallback((s) => (isAdmin ? fetchPrevious(s) : Promise.resolve(null)), [isAdmin, fetchPrevious]),
  );
  const daily = useFetch(
    useCallback((s) => (isAdmin ? fetchDaily(s) : Promise.resolve(null)), [isAdmin, fetchDaily]),
  );
  const productCount = useFetch(fetchProductCount);
  const clientCount = useFetch(fetchClientCount);
  const salesCount = useFetch(fetchSalesCount);
  const grouped = useFetch(
    useCallback((s) => (isAdmin ? fetchGrouped(s) : Promise.resolve(null)), [isAdmin, fetchGrouped]),
  );
  const top = useFetch(
    useCallback((s) => (isAdmin ? fetchTop(s) : Promise.resolve(null)), [isAdmin, fetchTop]),
  );
  const lowStock = useFetch(fetchLowStock);

  const lowStockItems = lowStock.data?.content ?? [];

  const checklistReady = productCount.data && clientCount.data && salesCount.data;
  const checklistSteps = checklistReady
    ? [
        { label: 'Registra tu primer producto', to: '/products/new', done: productCount.data.totalElements > 0 },
        { label: 'Agrega a tu primer cliente', to: '/clients/new', done: clientCount.data.totalElements > 0 },
        { label: 'Registra tu primera venta', to: '/sales/new', done: salesCount.data.totalElements > 0 },
      ]
    : null;

  const cur = summary.data;
  const prev = previous.data;
  const deltaOf = (key) => (cur && prev ? percentChange(cur[key], prev[key]) : null);
  const salesDelta = deltaOf('totalVendido');
  let summaryPhrase = null;
  if (cur) {
    summaryPhrase =
      cur.numeroVentas === 0
        ? 'Aún no registraste ventas en este periodo.'
        : `En este periodo vendiste ${formatCurrency(cur.totalVendido)} en ${cur.numeroVentas} ventas` +
          (salesDelta === null
            ? '.'
            : `, un ${Math.abs(salesDelta).toFixed(1)}% ${salesDelta >= 0 ? 'más' : 'menos'} que el periodo anterior.`);
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Hola, {user?.nombre ?? 'bienvenido'}</h1>
        <p className="text-sm text-gray-500">
          {isAdmin ? (summaryPhrase ?? 'Resumen de tu negocio') : 'Alertas de inventario'}
        </p>
      </header>

      {checklistSteps && <OnboardingChecklist steps={checklistSteps} />}

      {isAdmin && (
        <>
          <DateRangeFilter desde={desde} hasta={hasta} onChange={setRange} />

          {summary.error ? (
            <DashboardCard title="Resumen" error={getErrorMessage(summary.error)} onRetry={summary.refetch} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total vendido"
                value={summary.data ? formatCurrency(summary.data.totalVendido) : ''}
                isLoading={!summary.data}
                delta={deltaOf('totalVendido')}
                hint={summary.data ? `${summary.data.numeroVentas} ventas` : undefined}
                icon={Banknote}
              />
              <StatCard
                title="Ganancia"
                value={summary.data ? formatCurrency(summary.data.ganancia) : ''}
                isLoading={!summary.data}
                delta={deltaOf('ganancia')}
                hint={summary.data ? `Margen ${summary.data.margenPorcentaje}%` : undefined}
                icon={Percent}
              />
              <StatCard
                title="Ticket promedio"
                value={summary.data ? formatCurrency(summary.data.ticketPromedio) : ''}
                isLoading={!summary.data}
                delta={deltaOf('ticketPromedio')}
                icon={Receipt}
              />
              <StatCard
                title="Unidades vendidas"
                value={summary.data ? summary.data.unidadesVendidas : ''}
                isLoading={!summary.data}
                delta={deltaOf('unidadesVendidas')}
                icon={ShoppingBag}
              />
            </div>
          )}

          <DashboardCard
            title="Ventas de los últimos 7 días"
            isLoading={daily.isLoading}
            error={daily.error ? getErrorMessage(daily.error) : undefined}
            onRetry={daily.refetch}
            isEmpty={!daily.data}
            emptyText=""
          >
            {daily.data && <DailySalesChart data={daily.data} />}
          </DashboardCard>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Ventas agrupadas"
              isLoading={grouped.isLoading}
              error={grouped.error ? getErrorMessage(grouped.error) : undefined}
              onRetry={grouped.refetch}
              isEmpty={!grouped.data || grouped.data.length === 0}
              emptyText="No hay ventas en el rango seleccionado"
              action={
                <select
                  aria-label="Agrupar ventas por"
                  value={grouping}
                  onChange={(e) => setGrouping(e.target.value)}
                  className={selectClasses}
                >
                  {GROUPINGS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              }
            >
              {grouped.data && <SalesBarChart data={grouped.data} />}
            </DashboardCard>

            <DashboardCard
              title="Top productos"
              isLoading={top.isLoading}
              error={top.error ? getErrorMessage(top.error) : undefined}
              onRetry={top.refetch}
              isEmpty={!top.data || top.data.length === 0}
              emptyText="Aún no hay productos vendidos en este rango"
              action={
                <select
                  aria-label="Ordenar ranking"
                  value={criterion}
                  onChange={(e) => setCriterion(e.target.value)}
                  className={selectClasses}
                >
                  {CRITERIA.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              }
            >
              {top.data && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-gray-500">
                      <tr>
                        <th scope="col" className="py-2 pr-3">#</th>
                        <th scope="col" className="py-2 pr-3">Producto</th>
                        <th scope="col" className="py-2 pr-3 text-right">Unid.</th>
                        <th scope="col" className="py-2 text-right">Ganancia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {top.data.map((item, index) => (
                        <tr key={item.productoId}>
                          <td className="py-2 pr-3 text-gray-500">{index + 1}</td>
                          <td className="py-2 pr-3">
                            <p className="font-medium text-gray-900">{item.producto}</p>
                            <p className="text-xs text-gray-500">{item.categoria}</p>
                          </td>
                          <td className="py-2 pr-3 text-right">{item.unidades}</td>
                          <td className="py-2 text-right">{formatCurrency(item.ganancia)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DashboardCard>
          </div>
        </>
      )}

      <DashboardCard
        title="Stock bajo"
        isLoading={lowStock.isLoading}
        error={lowStock.error ? getErrorMessage(lowStock.error) : undefined}
        onRetry={lowStock.refetch}
        isEmpty={lowStockItems.length === 0}
        emptyText="Todo el inventario está por encima del mínimo"
        action={
          <Link to="/products" className="text-sm font-medium text-brand-600 hover:underline">
            Ver productos
          </Link>
        }
      >
        <ul className="divide-y divide-gray-100">
          {lowStockItems.map((variant) => (
            <li key={variant.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium text-gray-900">{variant.productoNombre}</p>
                <p className="text-xs text-gray-500">
                  Talla {variant.talla} · {variant.color}
                </p>
              </div>
              <Badge>
                {variant.stock} / mín. {variant.stockMinimo}
              </Badge>
            </li>
          ))}
        </ul>
        {lowStock.data && lowStock.data.totalElements > lowStockItems.length && (
          <p className="mt-3 text-xs text-gray-500">
            Mostrando {lowStockItems.length} de {lowStock.data.totalElements} variantes con stock bajo.
          </p>
        )}
      </DashboardCard>
    </main>
  );
}

export default DashboardPage;
