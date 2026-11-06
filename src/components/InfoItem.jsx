import PropTypes from 'prop-types'

export default function InfoItem({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">{children}</dd>
    </div>
  )
}

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}
