import PropTypes from 'prop-types'

export default function Skeleton({ className = 'h-4 w-full' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
}

Skeleton.propTypes = { className: PropTypes.string }
