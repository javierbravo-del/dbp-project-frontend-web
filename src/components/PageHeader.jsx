import PropTypes from 'prop-types'
import Breadcrumbs from './Breadcrumbs'

export default function PageHeader({ title, breadcrumbs, children }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {children && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{children}</div>
      )}
    </header>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    }),
  ),
  children: PropTypes.node,
}
