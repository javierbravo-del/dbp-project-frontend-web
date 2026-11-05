import PropTypes from 'prop-types'
import FormField from './FormField'
import { fieldClasses } from '../utils/formStyles'

export default function TextArea({ label, error, hint, id, ref, ...props }) {
  const textAreaId = id ?? props.name

  return (
    <FormField label={label} htmlFor={textAreaId} error={error} hint={hint}>
      <textarea
        id={textAreaId}
        ref={ref}
        rows={3}
        aria-invalid={Boolean(error)}
        className={fieldClasses(Boolean(error))}
        {...props}
      />
    </FormField>
  )
}

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
}
