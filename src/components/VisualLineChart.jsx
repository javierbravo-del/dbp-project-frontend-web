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
import { formatAxisValue, formatVisualValue } from '../utils/visuals'
import VisualCard from './VisualCard'

const LINE_COLOR = '#1f5ae0'

export default function VisualLineChart({ title, points, format }) {
  return (
    <VisualCard title={title}>
      <div className="h-64 w-full" role="img" aria-label={title || 'Gráfico de líneas'}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={72}
              tickFormatter={(value) => formatAxisValue(value, format)}
            />
            <Tooltip formatter={(value) => [formatVisualValue(value, format), 'Valor']} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={LINE_COLOR}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </VisualCard>
  )
}

VisualLineChart.propTypes = {
  title: PropTypes.string,
  points: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.number.isRequired }),
  ).isRequired,
  format: PropTypes.oneOf(['moneda', 'numero', 'porcentaje']),
}
