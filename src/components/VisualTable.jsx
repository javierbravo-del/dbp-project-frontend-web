import PropTypes from 'prop-types'
import DataTable from './DataTable'
import VisualCard from './VisualCard'

export default function VisualTable({ title, columns, rows }) {
  return (
    <VisualCard title={title}>
      <DataTable columns={columns} rows={rows} />
    </VisualCard>
  )
}

VisualTable.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired, header: PropTypes.string.isRequired }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
}
