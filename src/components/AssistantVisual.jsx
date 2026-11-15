import PropTypes from 'prop-types'
import { VISUAL_TYPES, normalizeVisual } from '../utils/visuals'
import VisualBarChart from './VisualBarChart'
import VisualLineChart from './VisualLineChart'
import VisualStatCards from './VisualStatCards'
import VisualTable from './VisualTable'

export default function AssistantVisual({ visual }) {
  const safeVisual = normalizeVisual(visual)
  if (!safeVisual) return null

  switch (safeVisual.type) {
    case VISUAL_TYPES.BAR:
      return (
        <VisualBarChart
          title={safeVisual.title}
          points={safeVisual.points}
          format={safeVisual.format}
        />
      )
    case VISUAL_TYPES.LINE:
      return (
        <VisualLineChart
          title={safeVisual.title}
          points={safeVisual.points}
          format={safeVisual.format}
        />
      )
    case VISUAL_TYPES.CARDS:
      return (
        <VisualStatCards
          title={safeVisual.title}
          cards={safeVisual.cards}
          format={safeVisual.format}
        />
      )
    case VISUAL_TYPES.TABLE:
      return (
        <VisualTable
          title={safeVisual.title}
          columns={safeVisual.columns}
          rows={safeVisual.rows}
        />
      )
    default:
      return null
  }
}

AssistantVisual.propTypes = {
  visual: PropTypes.object,
}
