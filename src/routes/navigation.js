import { LayoutDashboard, Package, Truck, Users } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/clients', label: 'Clientes', icon: Users },
  { to: '/suppliers', label: 'Proveedores', icon: Truck },
]