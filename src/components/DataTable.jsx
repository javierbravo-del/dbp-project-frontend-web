import PropTypes from 'prop-types'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

export default function DataTable({ columns, rows, sort, onSortChange, isLoading = false }) {
  const [sortField, sortDirection] = (sort ?? '').split(',')

  return (
    <div
      aria-busy={isLoading}
      className={`overflow-x-auto rounded-xl border border-gray-200 bg-white transition-opacity ${
        isLoading ? 'opacity-60' : ''
      }`}
    >
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
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
                  className="px-4 py-3 text-left font-semibold text-gray-700"
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.sortKey)}
                      className="inline-flex items-center gap-1 hover:text-blue-600"
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
                <td key={column.key} className="px-4 py-3 text-gray-800">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  sort: PropTypes.string,
  onSortChange: PropTypes.func,
  isLoading: PropTypes.bool,
}
