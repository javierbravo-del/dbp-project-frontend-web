import {
  ArrowRight,
  Check,
  ChevronsRight,
  ClipboardList,
  Layers,
  Package,
  Receipt,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import FeatureCard from '../components/FeatureCard'
import ThemeToggle from '../components/ThemeToggle'

const BRAND = 'Gamarrito ERP'

const FEATURES = [
  {
    icon: Package,
    title: 'Catálogo ordenado',
    description: 'Categorías y productos con precio de compra y de venta, siempre a mano.',
  },
  {
    icon: Layers,
    title: 'Tallas y colores',
    description: 'Controla el stock de cada variante con un historial de todos sus movimientos.',
  },
  {
    icon: ShoppingCart,
    title: 'Ventas con ganancia real',
    description: 'Registra cada venta, el medio de pago y el canal, y conoce cuánto ganaste de verdad.',
  },
  {
    icon: ClipboardList,
    title: 'Compras a proveedores',
    description: 'Cada compra suma stock automáticamente, sin hacer cuentas a mano.',
  },
  {
    icon: Receipt,
    title: 'Reportes claros',
    description: 'Ventas del periodo, productos más vendidos y alertas de stock bajo en un panel.',
  },
  {
    icon: Sparkles,
    title: 'Gamarrito, tu agente de IA',
    description: 'Pregunta en lenguaje sencillo qué reponer o qué se vende más y recibe una respuesta.',
  },
]

const HIGHLIGHTS = [
  { icon: Layers, title: 'Stock por talla y color', description: 'Sin cuadernos ni cuentas a mano' },
  { icon: ShoppingCart, title: 'Ventas y compras', description: 'Con la ganancia real de cada una' },
  { icon: Sparkles, title: 'Agente de IA', description: 'Pregúntale a tu negocio' },
]

const STEPS = [
  { title: 'Registra tu negocio', description: 'Crea tu cuenta y la de tu equipo en un par de minutos.' },
  { title: 'Carga tu catálogo', description: 'Agrega productos, tallas, colores y tu primer stock.' },
  { title: 'Pregunta a Gamarrito', description: 'Consulta tus números y decide qué comprar o rebajar.' },
]

const BENEFITS = [
  'Pensado para vender en el puesto, por WhatsApp y por redes.',
  'Cada negocio ve solo su información.',
  'Alertas de stock bajo para no quedarte sin tallas.',
  'Un asistente que explica tus números en palabras simples.',
]

function Highlight({ icon: Icon, title, description }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
        <Icon size={20} aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-sky-100/80">{description}</p>
      </div>
    </li>
  )
}

Highlight.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

const pillBase =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors'

const navPill =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  useDocumentTitle('Tu agente de negocio textil')

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="fixed bottom-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-brand-900 to-sky-800 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl"
        />

        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap text-base font-bold sm:text-lg">
            <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-sky-400/20 text-sky-300 sm:flex">
              <ChevronsRight size={20} aria-hidden="true" />
            </span>
            {BRAND}
          </Link>
          <nav aria-label="Acceso" className="flex items-center gap-1.5 sm:gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className={`${navPill} bg-sky-500 hover:bg-sky-400`}>
                Ir al panel
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${navPill} border border-white/40 hover:bg-white/10`}
                >
                  Iniciar sesión
                </Link>
                <Link to="/register" className={`${navPill} bg-sky-500 hover:bg-sky-400`}>
                  Crear cuenta
                </Link>
              </>
            )}
          </nav>
        </header>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-8 lg:grid-cols-2 lg:pt-14">
          <div className="motion-safe:animate-fade-up">
            <p className="inline-block rounded-full border border-sky-300/40 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
              ERP ligero para minoristas de Gamarra
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Tu agente de IA para el negocio <span className="text-sky-400">textil</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-sky-50/90">
              Controla tu catálogo, tu stock por talla y color, tus compras y tus ventas. Y
              pregúntale a Gamarrito qué te conviene hacer con tu negocio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className={`${pillBase} bg-sky-500 px-7 hover:bg-sky-400`}
              >
                {isAuthenticated ? 'Ir al panel' : 'Crear cuenta'}
                <ArrowRight size={16} className="ml-2" aria-hidden="true" />
              </Link>
              <a
                href="#funciones"
                className={`${pillBase} border border-white/40 px-7 hover:bg-white/10`}
              >
                Ver funciones
              </a>
            </div>
          </div>

          <figure className="relative motion-safe:animate-fade-up">
            <div className="motion-safe:animate-float">
              <img
                src="/images/gamarrito-hero.webp"
                alt="Robot de Gamarrito mostrando un panel de ventas en una galería textil de Gamarra"
                width="1024"
                height="559"
                className="w-full rounded-3xl border border-sky-300/30 shadow-2xl shadow-sky-500/20"
              />
            </div>
            <figcaption className="absolute -bottom-5 left-4 max-w-56 rounded-2xl border border-white/20 bg-brand-900/80 p-3 text-xs backdrop-blur sm:left-auto sm:right-4">
              <span className="flex items-center gap-1 font-semibold text-sky-300">
                <Sparkles size={14} aria-hidden="true" /> Pregúntale a Gamarrito
              </span>
              <span className="mt-1 block text-sky-50/90">«¿Qué me conviene reponer esta semana?»</span>
            </figcaption>
          </figure>
        </div>

        <ul className="relative mx-auto grid max-w-6xl gap-5 px-4 pb-10 pt-8 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <Highlight key={item.title} {...item} />
          ))}
        </ul>
      </section>

      <main>
        <section
          id="funciones"
          className="mx-auto max-w-6xl scroll-mt-4 px-4 py-16"
          aria-labelledby="features-title"
        >
          <h2 id="features-title" className="text-center text-3xl font-bold text-gray-900">
            Todo lo que tu negocio necesita
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Pensado para quienes venden en su puesto, por WhatsApp y por redes, sin complicaciones.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="bg-brand-50" aria-labelledby="gamarra-title">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
            <img
              src="/images/gamarrito-banner.webp"
              alt="Gamarrito, el robot agente de IA, en una galería textil de Gamarra"
              width="1024"
              height="559"
              loading="lazy"
              className="w-full rounded-3xl shadow-lg"
            />
            <div>
              <h2 id="gamarra-title" className="text-3xl font-bold text-gray-900">
                Hecho para el emprendedor de Gamarra
              </h2>
              <ul className="mt-6 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-gray-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check size={14} aria-hidden="true" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="steps-title">
          <h2 id="steps-title" className="text-center text-3xl font-bold text-gray-900">
            Cómo funciona
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {!isAuthenticated && (
          <section className="bg-linear-to-br from-slate-950 via-brand-900 to-sky-800">
            <div className="mx-auto max-w-4xl px-4 py-14 text-center">
              <h2 className="text-3xl font-bold text-white">Pon en orden tu negocio hoy</h2>
              <p className="mt-3 text-sky-100">Crea tu cuenta y empieza a registrar en minutos.</p>
              <Link
                to="/register"
                className={`${pillBase} mt-6 bg-sky-500 px-8 text-white hover:bg-sky-400`}
              >
                Crear cuenta
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-slate-950 py-6 text-center text-sm text-sky-100/70">
        {BRAND} · CS 2031 Desarrollo Basado en Plataformas · UTEC
      </footer>
    </div>
  )
}
