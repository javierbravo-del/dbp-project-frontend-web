import PropTypes from 'prop-types'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import Logo from './Logo'
import { NAV_GROUPS } from '../routes/navigation'
import { useAuth } from '../hooks/useAuth'

const COLLAPSE_KEY = 'gamarrito-sidebar-collapsed'

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}

export default function Sidebar({ isOpen, onClose, onCollapsedChange }) {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(readCollapsed)

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    onCollapsedChange(next)
    try {
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
    } catch {
      /* sin almacenamiento: se mantiene solo en memoria */
    }
  }

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.roles || item.roles.includes(user.role)),
  })).filter((group) => group.items.length > 0)

  // En móvil el drawer siempre se muestra expandido
  const isCompact = collapsed

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-gray-200 bg-white transition-all duration-200 lg:translate-x-0 ${
          isCompact ? 'lg:w-[4.5rem]' : 'lg:w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          <Logo size={28} withText={!isCompact} textClassName="text-base" />
          <button type="button" onClick={onClose} className="lg:hidden" aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Principal">
          {groups.map((group) => (
            <div key={group.label}>
              <p
                className={`mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${
                  isCompact ? 'lg:sr-only' : ''
                }`}
              >
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onClose}
                    title={isCompact ? label : undefined}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isCompact ? 'lg:justify-center lg:px-0' : ''
                      } ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 before:absolute before:left-0 before:top-1.5 before:h-[calc(100%-0.75rem)] before:w-[3px] before:rounded-full before:bg-brand-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span className={isCompact ? 'lg:sr-only' : ''}>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden border-t border-gray-200 p-3 lg:block">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCompact ? 'Expandir menú lateral' : 'Contraer menú lateral'}
            title={isCompact ? 'Expandir' : 'Contraer'}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 ${
              isCompact ? 'justify-center px-0' : ''
            }`}
          >
            {isCompact ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!isCompact && <span>Contraer</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCollapsedChange: PropTypes.func.isRequired,
}
