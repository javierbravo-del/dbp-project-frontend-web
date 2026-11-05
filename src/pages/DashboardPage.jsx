import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Hola, {user.nombre}</h1>
      <p className="mb-4 text-gray-600">Rol: {user.role}</p>
      <Button variant="secondary" onClick={logout}>
        Cerrar sesión
      </Button>
    </main>
  )
}
