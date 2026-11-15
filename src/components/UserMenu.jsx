import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

const THEMES = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

export default function UserMenu() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined
    const handlePointer = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false)
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  const initial = (user.nombre ?? '?').trim().charAt(0).toUpperCase()

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-md p-1.5 pr-2 text-left hover:bg-gray-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden text-sm leading-tight sm:block">
          <span className="block font-semibold text-gray-900">{user.nombre}</span>
          <span className="block text-xs text-gray-500">{user.role}</span>
        </span>
        <ChevronDown size={16} className="text-gray-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-60 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
        >
          <div className="px-2 pb-2 pt-1 sm:hidden">
            <p className="text-sm font-semibold text-gray-900">{user.nombre}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Apariencia
          </p>
          <div role="group" aria-label="Tema de la interfaz" className="grid grid-cols-3 gap-1 p-1">
            {THEMES.map(({ value, label, icon: Icon }) => {
              const active = theme === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-brand-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </div>
          <div className="my-2 border-t border-gray-200" />
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
