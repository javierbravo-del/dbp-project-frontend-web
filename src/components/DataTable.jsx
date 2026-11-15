import PropTypes from 'prop-types'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

const ACTIONS_KEY = 'actions'

export default function DataTable({ columns, rows, sort, onSortChange, isLoading = false }) {
  const [sortField, sortDirection] = (sort ?? '').split(',')
  const cellValue = (column, row) => (column.render ? column.render(row) : row[column.key])

  const [titleColumn, ...restColumns] = columns.filter((column) => column.key !== ACTIONS_KEY)
  const actionsColumn = columns.find((column) => column.key === ACTIONS_KEY)

  return (
    <div aria-busy={isLoading} className={`transition-opacity ${isLoading ? 'opacity-60' : ''}`}>
      {/* Móvil: tarjetas */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-gray-900">{cellValue(titleColumn, row)}</p>
            <dl className="mt-2 space-y-1 text-sm">
              {restColumns.map((column) => (
                <div key={column.key} className="flex items-center justify-between gap-3">
                  <dt className="text-gray-500">{column.header}</dt>
                  <dd className="text-right text-gray-800">{cellValue(column, row)}</dd>
                </div>
              ))}
            </dl>
            {actionsColumn && (
              <div className="mt-3 flex justify-end border-t border-gray-100 pt-2">
                {actionsColumn.render(row)}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Escritorio: tabla compacta con encabezado fijo */}
      <div className="hidden max-h-[70vh] overflow-auto rounded-lg border border-gray-200 bg-white md:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              {columns.map((column) => {
                const isSortable = Boolean(column.sortKey && onSortChange)
                const isActive = column.sortKey === sortField
                let SortIcon = ChevronsUpDown
                if (isActive) {
                  SortIcon = sortDirection === 'desc' ? ArrowDown : ArrowUp
                }

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      isActive ? (sortDirection === 'desc' ? 'descending' : 'ascending') : 'none'
                    }
                    className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSortChange(column.sortKey)}
                        className="inline-flex items-center gap-1 hover:text-brand-600"
                      >
                        {column.header}
                        <SortIcon size={14} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-2 text-gray-800">
                    {cellValue(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      sortKey: PropTypes.string,
      render: PropTypes.func,
      csv: PropTypes.func,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  sort: PropTypes.string,
  onSortChange: PropTypes.func,
  isLoading: PropTypes.bool,
}
