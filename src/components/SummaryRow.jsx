import PropTypes from 'prop-types'

export default function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-2 text-sm last:border-0">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900">{value}</dd>
    </div>
  )
}

SummaryRow.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.node.isRequired }
