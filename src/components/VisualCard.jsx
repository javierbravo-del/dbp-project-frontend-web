import PropTypes from 'prop-types'

export default function VisualCard({ title, children }) {
  return (
    <figure className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {title && (
        <figcaption className="mb-3 text-sm font-semibold text-gray-900">{title}</figcaption>
      )}
      {children}
    </figure>
  )
}

VisualCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
}
