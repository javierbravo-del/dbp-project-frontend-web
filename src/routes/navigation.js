import { Bot, ClipboardList, UserCog, LayoutDashboard, Package, ShoppingCart, Tags, Truck, Users } from 'lucide-react'

export const NAV_GROUPS = [
  {
    label: 'Operación',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/sales', label: 'Ventas', icon: ShoppingCart },
      { to: '/purchases', label: 'Compras', icon: ClipboardList },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      { to: '/products', label: 'Productos', icon: Package },
      { to: '/categories', label: 'Categorías', icon: Tags },
    ],
  },
  {
    label: 'Personas',
    items: [
      { to: '/clients', label: 'Clientes', icon: Users },
      { to: '/suppliers', label: 'Proveedores', icon: Truck },
      { to: '/team', label: 'Equipo', icon: UserCog, roles: ['ADMIN'] },
    ],
  },
  {
    label: 'Asistente',
    items: [{ to: '/assistant', label: 'Asistente', icon: Bot }],
  },
]

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items)

// Secciones principales que van en la barra inferior del móvil
export const BOTTOM_NAV_PATHS = ['/dashboard', '/sales', '/products', '/assistant']
