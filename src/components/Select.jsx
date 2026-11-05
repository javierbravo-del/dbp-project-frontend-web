import PropTypes from 'prop-types'
import FormField from './FormField'
import { fieldClasses } from '../utils/formStyles'

export default function Select({ label, error, hint, id, ref, children, ...props }) {
  const selectId = id ?? props.name

  return (
    <FormField label={label} htmlFor={selectId} error={error} hint={hint}>
      <select
        id={selectId}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={fieldClasses(Boolean(error))}
        {...props}
      >
        {children}
      </select>
    </FormField>
  )
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  children: PropTypes.node.isRequired,
}
