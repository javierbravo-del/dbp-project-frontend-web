import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import ErrorBoundary from './ErrorBoundary'
import MobileBottomNav from './MobileBottomNav'
import Sidebar from './Sidebar'
import UserMenu from './UserMenu'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { NAV_ITEMS } from '../routes/navigation'

const readCollapsed = () => {
  try {
    return localStorage.getItem('gamarrito-sidebar-collapsed') === '1'
  } catch {
    return false
  }
}

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(readCollapsed)
  const { pathname } = useLocation()

  const currentItem = NAV_ITEMS.find((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to),
  )
  useDocumentTitle(currentItem?.label)

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow"
      >
        Saltar al contenido
      </a>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCollapsedChange={setIsCollapsed}
      />

      <div className={`transition-[padding] duration-200 ${isCollapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="p-4 pb-24 outline-none sm:p-6 lg:pb-6">
          <ErrorBoundary key={pathname}>
            <div key={pathname} className="page-enter">
              <Outlet />
            </div>
          </ErrorBoundary>
        </main>
      </div>

      <MobileBottomNav onOpenMenu={() => setIsSidebarOpen(true)} />
    </div>
  )
}
