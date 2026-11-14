import PropTypes from 'prop-types'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Skeleton from './Skeleton'

function Delta({ value }) {
  if (value === null || value === undefined || Number.isNaN(value)) return null
  const isUp = value >= 0
  const Icon = isUp ? TrendingUp : TrendingDown
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        isUp ? 'text-green-600' : 'text-red-600'
      }`}
    >
      <Icon size={14} aria-hidden="true" />
      {isUp ? '+' : ''}
      {value.toFixed(1)}%<span className="sr-only"> frente al periodo anterior</span>
    </span>
  )
}

Delta.propTypes = { value: PropTypes.number }

function StatCard({ title, value, hint, icon: Icon, delta, isLoading }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && <Icon className="h-5 w-5 text-brand-600" aria-hidden="true" />}
      </div>
      {isLoading ? (
        <>
          <Skeleton className="mt-3 h-7 w-28" />
          <Skeleton className="mt-3 h-3 w-20" />
        </>
      ) : (
        <>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <div className="mt-1 flex items-center gap-2">
            <Delta value={delta} />
            {hint && <p className="text-xs text-gray-500">{hint}</p>}
          </div>
        </>
      )}
    </div>
  )
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hint: PropTypes.string,
  icon: PropTypes.elementType,
  delta: PropTypes.number,
  isLoading: PropTypes.bool,
}

export default StatCard
