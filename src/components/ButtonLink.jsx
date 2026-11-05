import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { buttonClasses } from '../utils/buttonStyles'

export default function ButtonLink({ to, children, variant = 'primary', className = '' }) {
  return (
    <Link to={to} className={`${buttonClasses(variant)} ${className}`}>
      {children}
    </Link>
  )
}

ButtonLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  className: PropTypes.string,
}
