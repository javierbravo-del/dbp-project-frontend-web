import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { BOTTOM_NAV_PATHS, NAV_ITEMS } from '../routes/navigation'
import { useAuth } from '../hooks/useAuth'

export default function MobileBottomNav({ onOpenMenu }) {
  const { user } = useAuth()
  const items = NAV_ITEMS.filter(
    (item) =>
      BOTTOM_NAV_PATHS.includes(item.to) && (!item.roles || item.roles.includes(user.role)),
  )

  return (
    <nav
      aria-label="Navegación rápida"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                  isActive ? 'text-brand-700' : 'text-gray-500'
                }`
              }
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
        <li className="flex-1">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-gray-500"
          >
            <Menu size={20} aria-hidden="true" />
            Más
          </button>
        </li>
      </ul>
    </nav>
  )
}

MobileBottomNav.propTypes = { onOpenMenu: PropTypes.func.isRequired }
