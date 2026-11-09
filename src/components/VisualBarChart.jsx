import PropTypes from 'prop-types'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatAxisValue, formatVisualValue } from '../utils/visuals'
import VisualCard from './VisualCard'

const BAR_COLOR = '#1f5ae0'

export default function VisualBarChart({ title, points, format }) {
  return (
    <VisualCard title={title}>
      <div className="h-64 w-full" role="img" aria-label={title || 'Gráfico de barras'}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={72}
              tickFormatter={(value) => formatAxisValue(value, format)}
            />
            <Tooltip formatter={(value) => [formatVisualValue(value, format), 'Valor']} />
            <Bar dataKey="value" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </VisualCard>
  )
}

VisualBarChart.propTypes = {
  title: PropTypes.string,
  points: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.number.isRequired }),
  ).isRequired,
  format: PropTypes.oneOf(['moneda', 'numero', 'porcentaje']),
}
