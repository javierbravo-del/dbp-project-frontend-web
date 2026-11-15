import PropTypes from 'prop-types'

// Ilustración simple de una caja vacía, en SVG propio
function EmptyBoxIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true" className="text-brand-600">
      <ellipse cx="48" cy="82" rx="28" ry="5" className="fill-gray-200" />
      <path d="M16 38 48 24l32 14v30L48 82 16 68V38Z" fill="currentColor" opacity="0.12" />
      <path d="M16 38 48 52l32-14M48 52v30" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 38 48 24l32 14v30L48 82 16 68V38Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 31l32 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
    </svg>
  )
}

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <EmptyBoxIllustration />
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
