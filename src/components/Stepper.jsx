import PropTypes from 'prop-types'
import { Check } from 'lucide-react'

export default function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Pasos del formulario">
      {steps.map((label, index) => {
        const isDone = index < current
        const isCurrent = index === current
        return (
          <li
            key={label}
            aria-current={isCurrent ? 'step' : undefined}
            className="flex flex-1 items-center gap-2"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                isDone || isCurrent ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isDone ? <Check size={14} aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={`hidden text-sm sm:inline ${
                isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`h-px flex-1 ${isDone ? 'bg-brand-600' : 'bg-gray-200'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  current: PropTypes.number.isRequired,
}
