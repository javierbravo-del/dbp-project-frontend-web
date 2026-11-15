import PropTypes from 'prop-types'
import { Download } from 'lucide-react'
import { exportToCsv } from '../utils/csv'
import { buttonClasses } from '../utils/buttonStyles'

export default function CsvExportButton({ filename, columns, rows, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled || rows.length === 0}
      onClick={() => exportToCsv(filename, columns, rows)}
      className={`${buttonClasses('secondary')} gap-1.5`}
    >
      <Download size={16} aria-hidden="true" />
      Exportar CSV
    </button>
  )
}

CsvExportButton.propTypes = {
  filename: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
}
