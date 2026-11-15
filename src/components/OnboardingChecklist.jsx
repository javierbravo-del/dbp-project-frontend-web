import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Check, Circle } from 'lucide-react'

export default function OnboardingChecklist({ steps }) {
  const done = steps.filter((step) => step.done).length
  if (done === steps.length) return null

  return (
    <section className="rounded-lg border border-brand-200 bg-brand-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-900">Empieza con tu negocio</h2>
        <p className="text-xs font-medium text-brand-700">
          {done} de {steps.length} pasos
        </p>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={done}
        aria-label="Progreso de configuración inicial"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${(done / steps.length) * 100}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-3 text-sm">
            {step.done ? (
              <Check size={18} className="text-green-600" aria-hidden="true" />
            ) : (
              <Circle size={18} className="text-gray-400" aria-hidden="true" />
            )}
            {step.done ? (
              <span className="text-gray-500 line-through">{step.label}</span>
            ) : (
              <Link to={step.to} className="font-medium text-brand-700 hover:underline">
                {step.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

OnboardingChecklist.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      done: PropTypes.bool.isRequired,
    }),
  ).isRequired,
}
