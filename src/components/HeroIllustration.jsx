import PropTypes from 'prop-types'
import RobotMark from './RobotMark'

const OUTLINE = '#cdd7e6'

function Card({ x, y, w, h, children }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="white" stroke={OUTLINE} strokeWidth="2" />
      {children}
    </g>
  )
}

Card.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  children: PropTypes.node,
}

// Escena de bienvenida: la mascota con tarjetas que representan producto, ventas y tareas
export default function HeroIllustration({ width = 420, className = '' }) {
  return (
    <svg
      width={width}
      height={width * (270 / 420)}
      viewBox="0 0 420 270"
      fill="none"
      role="img"
      aria-label="Gamarrito con tarjetas de producto, ventas y tareas"
      className={className}
    >
      {/* adornos */}
      <rect x="132" y="22" width="10" height="10" rx="3" fill="currentColor" opacity="0.5" />
      <rect x="292" y="14" width="9" height="9" rx="3" fill="currentColor" opacity="0.5" />
      <rect x="22" y="170" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <rect x="398" y="136" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="2" opacity="0.6" />

      {/* tarjeta de producto */}
      <g transform="rotate(-4 65 110)">
        <Card x="10" y="68" w="112" h="84">
          <path
            d="M34 90 l10 -6 c2 5 12 5 14 0 l10 6 -5 10 -5 -3 v22 H44 v-22 l-5 3 z"
            className="fill-brand-800"
          />
          <rect x="76" y="88" width="34" height="5" rx="2.5" className="fill-brand-100" />
          <rect x="76" y="100" width="26" height="5" rx="2.5" className="fill-brand-100" />
          <circle cx="40" cy="136" r="5" className="fill-brand-600" />
          <circle cx="56" cy="136" r="5" className="fill-brand-500" />
          <circle cx="72" cy="136" r="5" className="fill-brand-200" />
        </Card>
      </g>

      {/* tarjeta de ventas */}
      <g transform="rotate(4 355 80)">
        <Card x="300" y="36" w="108" h="82">
          <rect x="314" y="86" width="12" height="18" rx="3" className="fill-brand-200" />
          <rect x="332" y="76" width="12" height="28" rx="3" className="fill-brand-500" />
          <rect x="350" y="66" width="12" height="38" rx="3" className="fill-brand-600" />
          <rect x="368" y="54" width="12" height="50" rx="3" className="fill-brand-800" />
          <path
            d="M312 70 l22 -14 14 8 30 -20 M388 44 h-9 M388 44 v9"
            className="stroke-brand-500"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Card>
      </g>

      {/* tarjeta de tareas */}
      <g transform="rotate(3 360 190)">
        <Card x="306" y="140" w="104" h="86">
          {[160, 182, 204].map((cy) => (
            <g key={cy}>
              <circle cx="324" cy={cy} r="8" className="fill-brand-600" />
              <path
                d={`M320 ${cy} l3 3 6 -6`}
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="340" y={cy - 3} width="56" height="5" rx="2.5" className="fill-brand-100" />
            </g>
          ))}
        </Card>
      </g>

      {/* telas dobladas */}
      <rect x="18" y="232" width="86" height="20" rx="9" className="fill-brand-500" />
      <rect x="12" y="214" width="94" height="20" rx="9" className="fill-brand-800" />
      <rect x="20" y="196" width="82" height="20" rx="9" className="fill-brand-200" />

      {/* mascota */}
      <g transform="translate(112 18)">
        <RobotMark size={246} className="" />
      </g>
    </svg>
  )
}

HeroIllustration.propTypes = { width: PropTypes.number, className: PropTypes.string }
