import PropTypes from 'prop-types'

export default function Spinner({ fullScreen = false, label = 'Cargando...' }) {
  const wrapperClass = fullScreen
    ? 'flex min-h-screen items-center justify-center'
    : 'flex items-center justify-center p-8'

  return (
    <div className={wrapperClass} role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

Spinner.propTypes = {
  fullScreen: PropTypes.bool,
  label: PropTypes.string,
}
