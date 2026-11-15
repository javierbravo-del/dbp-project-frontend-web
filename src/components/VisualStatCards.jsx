import PropTypes from 'prop-types'
import { formatVisualValue } from '../utils/visuals'
import StatCard from './StatCard'
import VisualCard from './VisualCard'

export default function VisualStatCards({ title, cards, format }) {
  return (
    <VisualCard title={title}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            title={card.label}
            value={formatVisualValue(card.value, format)}
            hint={card.note || undefined}
          />
        ))}
      </div>
    </VisualCard>
  )
}

VisualStatCards.propTypes = {
  title: PropTypes.string,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      note: PropTypes.string,
    }),
  ).isRequired,
  format: PropTypes.oneOf(['moneda', 'numero', 'porcentaje']),
}
