import PropTypes from 'prop-types'
import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <Inbox className="text-gray-400" size={40} />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="max-w-sm text-sm text-gray-600">{description}</p>}
      {action}
    </div>
  )
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
}
