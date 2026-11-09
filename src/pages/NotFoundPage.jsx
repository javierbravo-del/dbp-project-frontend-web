import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600">No encontramos la página que buscas.</p>
      <Link to="/" className="font-semibold text-brand-600 hover:underline">
        Volver al inicio
      </Link>
    </main>
  )
}
