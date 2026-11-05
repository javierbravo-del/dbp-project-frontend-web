import PropTypes from 'prop-types'
import FormField from './FormField'
import { fieldClasses } from '../utils/formStyles'

export default function Input({ label, error, hint, id, ref, ...props }) {
  const inputId = id ?? props.name

  return (
    <FormField label={label} htmlFor={inputId} error={error} hint={hint}>
      <input
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={fieldClasses(Boolean(error))}
        {...props}
      />
    </FormField>
  )
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
}
