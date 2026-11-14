import PropTypes from 'prop-types'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from '../utils/chartTheme'
import { formatCurrency } from '../utils/format'

export default function DailySalesChart({ data }) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Ventas por día de los últimos 7 días">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_STROKE} />
          <XAxis dataKey="label" tick={AXIS_TICK} />
          <YAxis tick={AXIS_TICK} width={64} tickFormatter={(v) => `S/ ${v}`} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [formatCurrency(value), 'Vendido']}
          />
          <Line type="monotone" dataKey="total" stroke="#3d5e99" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

DailySalesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, total: PropTypes.number.isRequired }),
  ).isRequired,
}
