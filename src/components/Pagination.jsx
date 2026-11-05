import PropTypes from 'prop-types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PAGE_SIZE_OPTIONS, getPageNumbers } from '../utils/pagination'

const NAV_BUTTON_CLASS =
  'rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40'

export default function Pagination({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
  onSizeChange,
}) {
  const from = totalElements === 0 ? 0 : (page - 1) * size + 1
  const to = Math.min(page * size, totalElements)

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col items-center justify-between gap-3 py-4 sm:flex-row"
    >
      <p className="text-sm text-gray-600">
        Mostrando {from}-{to} de {totalElements} resultados
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Por página
          <select
            value={size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="rounded-lg border border-gray-300 px-2 py-1"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={NAV_BUTTON_CLASS}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers(page, totalPages).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? 'page' : undefined}
              className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium ${
                pageNumber === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            className={NAV_BUTTON_CLASS}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </nav>
  )
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  totalElements: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSizeChange: PropTypes.func.isRequired,
}
