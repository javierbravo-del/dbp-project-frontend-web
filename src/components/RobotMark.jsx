import PropTypes from 'prop-types'

const OUTLINE = '#cdd7e6'

// Mascota original de Gamarrito: robot amistoso, plano y minimalista, con un carrete de hilo.
// variant "full": cuerpo completo. variant "head": solo la cabeza (para avatares pequeños).
export default function RobotMark({ size = 120, variant = 'full', className = '' }) {
  const isHead = variant === 'head'
  const viewBox = isHead ? '28 0 144 120' : '0 0 200 236'
  const width = isHead ? size * 1.2 : size * (200 / 236)

  return (
    <svg
      width={width}
      height={size}
      viewBox={viewBox}
      fill="none"
      role="img"
      aria-label="Mascota de Gamarrito"
      className={className}
    >
      {!isHead && (
        <>
          <ellipse cx="100" cy="230" rx="46" ry="5" fill="currentColor" opacity="0.12" />
          {/* hilo */}
          <path
            d="M178 116 C198 150 180 198 128 204 C96 208 64 196 50 178"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* piernas y pies */}
          <rect x="76" y="192" width="10" height="16" rx="5" fill="currentColor" />
          <rect x="114" y="192" width="10" height="16" rx="5" fill="currentColor" />
          <rect x="62" y="206" width="34" height="18" rx="9" fill="white" stroke={OUTLINE} strokeWidth="2" />
          <rect x="104" y="206" width="34" height="18" rx="9" fill="white" stroke={OUTLINE} strokeWidth="2" />
          <rect x="68" y="215" width="22" height="4" rx="2" fill="currentColor" />
          <rect x="110" y="215" width="22" height="4" rx="2" fill="currentColor" />
          {/* brazo izquierdo */}
          <path d="M58 142 L47 176" stroke={OUTLINE} strokeWidth="15" strokeLinecap="round" />
          <path d="M58 142 L47 176" stroke="white" strokeWidth="11" strokeLinecap="round" />
          {/* cuerpo */}
          <rect x="58" y="120" width="84" height="76" rx="34" fill="white" stroke={OUTLINE} strokeWidth="2" />
          {/* G tejida: banda con puntadas (hilo enrollado), como el logo */}
          <g className="text-brand-600">
            <circle cx="100" cy="158" r="17" fill="currentColor" opacity="0.1" />
            <path d="M107.3 151.9 A9.5 9.5 0 1 0 109.3 160" stroke="currentColor" strokeWidth="4.6" />
            <path d="M109.3 160 H101.5" stroke="#e9a95c" strokeWidth="4.6" />
            <path
              d="M107.3 151.9 A9.5 9.5 0 1 0 109.3 160 M109.3 160 H101.5"
              stroke="white"
              strokeWidth="4.6"
              strokeDasharray="0.7 2.2"
              opacity="0.7"
            />
          </g>
          {/* brazo derecho levantado con carrete */}
          <path d="M142 142 L172 132 L174 112" stroke={OUTLINE} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M142 142 L172 132 L174 112" stroke="white" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="164" y="86" width="20" height="24" rx="4" fill="currentColor" />
          <path d="M164 94 L184 90 M164 100 L184 96 M164 106 L184 102" stroke="white" strokeWidth="1.8" opacity="0.55" />
          <rect x="161" y="82" width="26" height="6" rx="3" fill="white" stroke={OUTLINE} strokeWidth="2" />
          <rect x="161" y="108" width="26" height="6" rx="3" fill="white" stroke={OUTLINE} strokeWidth="2" />
          <circle cx="174" cy="112" r="7" fill="white" stroke={OUTLINE} strokeWidth="2" />
          {/* cuello */}
          <rect x="88" y="108" width="24" height="14" rx="7" fill="currentColor" />
        </>
      )}

      {/* antena */}
      <path d="M128 36 L135 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="135.5" cy="11" r="6" fill="currentColor" />
      {/* auriculares */}
      <circle cx="42" cy="74" r="12" fill="currentColor" />
      <circle cx="158" cy="74" r="12" fill="currentColor" />
      {/* cabeza */}
      <rect x="46" y="34" width="108" height="78" rx="30" fill="white" stroke={OUTLINE} strokeWidth="2" />
      <rect x="56" y="46" width="88" height="52" rx="22" className="fill-brand-900" />
      <path
        d="M72 77 q9 -13 18 0 M110 77 q9 -13 18 0"
        className="stroke-brand-200"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

RobotMark.propTypes = {
  size: PropTypes.number,
  variant: PropTypes.oneOf(['full', 'head']),
  className: PropTypes.string,
}
