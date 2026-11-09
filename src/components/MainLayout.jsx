import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import ErrorBoundary from './ErrorBoundary'
import Sidebar from './Sidebar'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { NAV_ITEMS } from '../routes/navigation'

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  const currentItem = NAV_ITEMS.find((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to),
  )
  useDocumentTitle(currentItem?.label)

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow"
      >
        Saltar al contenido
      </a>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="font-semibold text-gray-900">{user.nombre}</p>
              <p className="text-gray-500">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="p-4 outline-none sm:p-6">
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
