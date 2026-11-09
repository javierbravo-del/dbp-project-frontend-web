import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const OPTIONS = [
  { value: 'light', label: 'Modo claro', icon: Sun },
  { value: 'dark', label: 'Modo oscuro', icon: Moon },
  { value: 'system', label: 'Según el sistema', icon: Monitor },
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Tema de la interfaz"
      className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
            className={`rounded-md p-1.5 transition-colors ${
              isActive
                ? 'bg-brand-600 text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
