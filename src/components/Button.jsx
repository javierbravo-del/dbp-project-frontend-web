import PropTypes from 'prop-types'
import { Loader2 } from 'lucide-react'
import { buttonClasses } from '../utils/buttonStyles'

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${buttonClasses(variant)} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {isLoading ? 'Procesando…' : children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
}
