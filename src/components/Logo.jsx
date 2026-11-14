import PropTypes from 'prop-types'

/**
 * Logo de Gamarrito ERP: una "G" geométrica dentro de un cuadrado redondeado,
 * con una costura punteada (stroke-dasharray) que recuerda al rubro textil.
 * Es SVG puro: escala sin perder nitidez y hereda el tema.
 */
export default function Logo({ size = 36, withText = true, textClassName = '' }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        role="img"
        aria-label="Logo de Gamarrito ERP"
      >
        <rect x="2" y="2" width="44" height="44" rx="12" className="fill-brand-600" />
        <rect
          x="6.5"
          y="6.5"
          width="35"
          height="35"
          rx="9"
          fill="none"
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="1.6"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <path
          d="M31.5 18.5a9 9 0 1 0 2 7h-8"
          fill="none"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className={`text-lg font-bold tracking-tight ${textClassName}`}>
          Gamarrito <span className="font-medium opacity-70">ERP</span>
        </span>
      )}
    </span>
  )
}

Logo.propTypes = {
  size: PropTypes.number,
  withText: PropTypes.bool,
  textClassName: PropTypes.string,
}
