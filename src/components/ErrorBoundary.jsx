import { Component } from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Error capturado por ErrorBoundary:', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div
        role="alert"
        className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-3 p-6 text-center"
      >
        <h2 className="text-xl font-bold text-gray-900">Algo salió mal</h2>
        <p className="text-sm text-gray-600">
          Ocurrió un error inesperado en esta pantalla. Puedes intentarlo de nuevo o volver al
          inicio.
        </p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    )
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
}
