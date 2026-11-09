import { Bot, ClipboardList, LayoutDashboard, Package, ShoppingCart, Tags, Truck, Users } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/categories', label: 'Categorías', icon: Tags },
  { to: '/sales', label: 'Ventas', icon: ShoppingCart },
  { to: '/purchases', label: 'Compras', icon: ClipboardList },
  { to: '/clients', label: 'Clientes', icon: Users },
  { to: '/suppliers', label: 'Proveedores', icon: Truck },
  { to: '/assistant', label: 'Asistente', icon: Bot },
]
