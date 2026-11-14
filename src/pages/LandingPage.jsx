import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  BookX,
  ChevronDown,
  ClipboardList,
  LineChart,
  MessageCircleQuestion,
  NotebookPen,
  PackageSearch,
  Receipt,
  ShoppingCart,
  Sparkles,
  Store,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useInView } from '../hooks/useInView'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Logo from '../components/Logo'
import HeroDemo from '../components/HeroDemo'
import ThemeToggle from '../components/ThemeToggle'

// Enlace de descarga de la app móvil (Expo/EAS). Pégalo aquí cuando esté listo.
const MOBILE_APP_URL = ''

const NAV_LINKS = [
  { href: '#problema', label: 'Tu día a día' },
  { href: '#demo', label: 'Demo' },
  { href: '#empezar', label: 'Cómo empezar' },
  { href: '#faq', label: 'Preguntas' },
]

const BEFORE_AFTER = [
  {
    icon: NotebookPen,
    before: 'Llevas el stock en un cuaderno o en tu memoria.',
    after: 'Ve tu stock por talla y color, con aviso cuando algo baja del mínimo.',
  },
  {
    icon: BookX,
    before: 'Calculas tu ganancia al cierre del día.',
    after: 'Cada venta guarda su costo real y ves cuánto ganas, sin hacer cuentas.',
  },
  {
    icon: MessageCircleQuestion,
    before: 'Decides qué reponer según tu experiencia.',
    after: 'Pregúntale al asistente: te responde con tus propios números.',
  },
]

const DEMO_TABS = [
  {
    id: 'vender',
    label: 'Vender',
    icon: Receipt,
    title: 'Registra una venta en segundos',
    points: [
      'Varias prendas por venta, con talla y color.',
      'Medio de pago y canal (puesto, WhatsApp, redes).',
      'El stock se descuenta solo y la ganancia queda calculada.',
    ],
  },
  {
    id: 'comprar',
    label: 'Comprar',
    icon: ShoppingCart,
    title: 'Las compras alimentan tu stock',
    points: [
      'Registra la compra al proveedor con sus costos.',
      'Cada línea suma stock automáticamente.',
      'El costo de compra alimenta el cálculo de ganancia.',
    ],
  },
  {
    id: 'preguntar',
    label: 'Preguntar',
    icon: Sparkles,
    title: 'Pregúntale a Gamarrito',
    points: [
      '"¿Qué me conviene reponer esta semana?"',
      'Responde en lenguaje simple, con gráficos.',
      'Usa solo los datos de tu negocio, no inventa cifras.',
    ],
  },
]

const STEPS = [
  { title: 'Registra tu negocio', text: 'RUC, razón social y tu usuario administrador.' },
  { title: 'Carga tu catálogo', text: 'Productos con sus tallas, colores y stock inicial.' },
  { title: 'Trabaja y pregunta', text: 'Registra ventas y compras, y consulta a Gamarrito.' },
]

const FAQS = [
  {
    q: '¿Quiénes somos?',
    a: 'Somos un equipo de estudiantes de UTEC entusiasmados por mejorar el rubro textil en Gamarra. Gamarrito ERP es nuestro proyecto: un ERP ligero pensado para los negocios textiles de Gamarra.',
  },
  {
    q: '¿Qué necesito para empezar?',
    a: 'Solo el RUC y la razón social de tu negocio, un correo y una contraseña. Después cargas tus productos con sus tallas y colores.',
  },
  {
    q: '¿Cada negocio ve solo su información?',
    a: 'Sí. Cada empresa tiene sus propios datos aislados: tus productos, ventas y reportes no se mezclan con los de nadie más.',
  },
  {
    q: '¿El asistente tiene límite?',
    a: 'Sí: cada usuario de tu negocio puede hacer hasta 30 preguntas por día.',
  },
  {
    q: '¿Necesito instalar algo?',
    a: (
      <>
        No. Funciona en el navegador, también desde el celular. Además puedes descargar nuestra
        app móvil Gamarrito ERP{' '}
        {MOBILE_APP_URL ? (
          <a
            href={MOBILE_APP_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand-600 underline"
          >
            desde este enlace
          </a>
        ) : (
          '(enlace disponible pronto)'
        )}
        .
      </>
    ),
  },
]

function Reveal({ children, className = '' }) {
  const { ref, isVisible } = useInView()
  return (
    <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default function LandingPage() {
  useDocumentTitle('Gamarrito ERP · Tu negocio textil en orden')
  const { isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('vender')
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const currentTab = DEMO_TABS.find((tab) => tab.id === activeTab)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          isScrolled
            ? 'border-b border-gray-200 bg-white/95 backdrop-blur'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" aria-label="Inicio de Gamarrito ERP" className="text-brand-700">
            <Logo size={32} textClassName="text-gray-900" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Secciones">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-brand-700"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-brand-700 active:translate-y-0 active:scale-[0.98]"
              >
                Ir a mi panel
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:text-brand-700"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-brand-700 active:translate-y-0 active:scale-[0.98]"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pt-36">
          <div>
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Store size={13} aria-hidden="true" />
              ERP ligero para negocios textiles de Gamarra
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Gamarrito: el ERP simple para <span className="text-brand-600">Gamarra</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-gray-600">
              Controla tu catálogo, tu stock por talla y color, tus compras y tus ventas. Y
              pregúntale a Gamarrito qué te conviene hacer con tu negocio.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-brand-700 active:translate-y-0 active:scale-[0.98]"
              >
                Crear cuenta
              </Link>
              <a
                href="#demo"
                className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-500 hover:text-brand-700"
              >
                Ver la demo
              </a>
            </div>
          </div>
          <HeroDemo />
        </section>

        <section id="problema" className="border-y border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-bold">
                Lo que ya haces, con menos esfuerzo
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
                Tu experiencia más las herramientas correctas: ordena tu stock, entiende tus
                ventas y haz crecer tus ganancias.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {BEFORE_AFTER.map(({ icon: Icon, before, after }) => (
                <Reveal key={before}>
                  <article className="h-full rounded-xl border border-gray-200 p-5">
                    <span className="inline-flex rounded-lg bg-brand-50 p-2.5 text-brand-600">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Hoy
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{before}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-600">
                      Con Gamarrito
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{after}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-bold">Explora cómo funciona</h2>
            </Reveal>
            <Reveal className="mt-8">
              <div
                role="tablist"
                aria-label="Escenarios de la demo"
                className="mx-auto flex w-fit gap-1 rounded-lg border border-gray-200 bg-white p-1"
              >
                {DEMO_TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === id}
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === id
                        ? 'bg-brand-600 text-white'
                        : 'text-gray-600 hover:text-brand-700'
                    }`}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-bold">{currentTab.title}</h3>
                <ul className="mt-3 space-y-2">
                  {currentTab.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm text-gray-700">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="empezar" className="border-y border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-bold">Cómo empezar</h2>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <Reveal key={step.title}>
                  <article className="h-full rounded-xl border border-gray-200 p-5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-3 font-bold">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{step.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8">
              <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl bg-brand-50 px-6 py-4 text-sm text-brand-800">
                <span className="font-semibold">Qué necesitas:</span>
                <span className="inline-flex items-center gap-1.5">
                  <ClipboardList size={15} aria-hidden="true" /> RUC y razón social
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PackageSearch size={15} aria-hidden="true" /> Tu lista de productos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <LineChart size={15} aria-hidden="true" /> Ganas de ordenarte
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="faq" className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-bold">Preguntas frecuentes</h2>
            </Reveal>
            <div className="mt-8 space-y-2">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <Reveal key={faq.q}>
                    <div className="rounded-xl border border-gray-200 bg-white">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold"
                      >
                        {faq.q}
                        <ChevronDown
                          size={17}
                          aria-hidden="true"
                          className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <p className="px-5 pb-4 text-sm text-gray-600">{faq.a}</p>
                      )}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-3xl font-bold">Quiénes somos</h2>
              <p className="mx-auto mt-2 max-w-xl text-gray-600">
                Somos un equipo de estudiantes de UTEC entusiasmados por mejorar el rubro textil en
                Gamarra. Vimos que, con las herramientas correctas, los negocios pueden ordenar su
                stock, entender sus ventas y aumentar sus ganancias. Gamarrito ERP es nuestro
                proyecto: un ERP ligero pensado para ellos.
              </p>
              <p className="mx-auto mt-4 max-w-xl font-medium text-gray-900">
                Somos personas comprometidas con tu negocio.
              </p>
            </Reveal>
            <Reveal className="mt-12">
              <Link
                to="/register"
                className="inline-block rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-brand-700 active:translate-y-0 active:scale-[0.98]"
              >
                Pon en orden tu negocio hoy
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6">
        <p className="text-center text-sm text-gray-500">
          Gamarrito ERP · Hecho por estudiantes de UTEC para Gamarra
        </p>
      </footer>

      <div className="fixed bottom-4 right-4 z-40">
        <ThemeToggle />
      </div>
    </div>
  )
}
