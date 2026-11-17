import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, Lightbulb, Send, Sparkles, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import { useFetch } from '../hooks/useFetch'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { assistantService } from '../services/assistantService'
import { getErrorMessage } from '../utils/errors'
import AssistantVisual from '../components/AssistantVisual'
import FormattedText from '../components/FormattedText'
import PageHeader from '../components/PageHeader'
import RobotMark from '../components/RobotMark'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Asistencia virtual' }]

// Lo que la seccion aporta, explicado para alguien que nunca uso un ERP.
const CAPACIDADES = [
  {
    icon: TrendingUp,
    titulo: 'Entiende tu negocio',
    texto: 'Lee tus ventas, compras y stock reales. No inventa cifras: responde con tus datos.',
  },
  {
    icon: BarChart3,
    titulo: 'Te lo dibuja',
    texto: 'Cuando la respuesta se entiende mejor en un gráfico, lo dibuja aquí mismo.',
  },
  {
    icon: Lightbulb,
    titulo: 'Te dice qué hacer',
    texto: 'Señala qué se está vendiendo, qué está parado y qué conviene reponer.',
  },
]

// Preguntas de ejemplo agrupadas por el tipo de decision que ayudan a tomar.
const SUGERENCIAS = [
  {
    grupo: 'Vender más',
    preguntas: [
      'Muéstrame en gráfico de líneas la evolución de mis ventas',
      '¿Cuáles son mis 5 productos más vendidos?',
      '¿Qué día de la semana vendo más?',
    ],
  },
  {
    grupo: 'Cuidar el stock',
    preguntas: [
      '¿Qué productos están por agotarse?',
      '¿Qué mercadería tengo parada hace tiempo?',
      'Muéstrame el stock por categoría en un gráfico de barras',
    ],
  },
  {
    grupo: 'Entender la plata',
    preguntas: [
      '¿Cuánto vendí este mes comparado con el anterior?',
      '¿Cuál es mi ticket promedio de venta?',
      '¿Qué medio de pago usan más mis clientes?',
    ],
  },
]

function Mensaje({ mensaje }) {
  const esUsuario = mensaje.role === 'user'

  if (esUsuario) {
    return (
      <div className="flex justify-end">
        <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-brand-600 px-4 py-2.5 text-sm text-white">
          {mensaje.text}
        </p>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 sm:flex">
        <RobotMark size={22} variant="head" />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div
          className={`max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm ${
            mensaje.failed ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <FormattedText text={mensaje.text} />
        </div>
        {mensaje.visual && (
          <div className="max-w-xl">
            <AssistantVisual visual={mensaje.visual} />
          </div>
        )}
      </div>
    </div>
  )
}

Mensaje.propTypes = {
  mensaje: PropTypes.shape({
    role: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    failed: PropTypes.bool,
    visual: PropTypes.object,
  }).isRequired,
}

export default function AssistantPage() {
  useDocumentTitle('Asistencia virtual')

  const [borrador, setBorrador] = useState('')
  const [mensajesSesion, setMensajesSesion] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [restantes, setRestantes] = useState(null)
  const finRef = useRef(null)
  const campoRef = useRef(null)

  const traerHistorial = useCallback(
    (signal) => assistantService.getHistory({ page: 1, size: 20 }, signal),
    [],
  )
  const historial = useFetch(traerHistorial)

  const mensajesHistorial = useMemo(() => {
    const entradas = [...(historial.data?.content ?? [])].reverse()
    return entradas.flatMap((entrada) => [
      { id: `h-${entrada.id}-q`, role: 'user', text: entrada.pregunta },
      {
        id: `h-${entrada.id}-a`,
        role: 'assistant',
        text: entrada.respuesta ?? 'No se pudo obtener una respuesta.',
        failed: !entrada.exitosa,
      },
    ])
  }, [historial.data])

  const mensajes = [...mensajesHistorial, ...mensajesSesion]
  const hayConversacion = mensajes.length > 0

  useEffect(() => {
    if (hayConversacion) {
      finRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [mensajes.length, enviando, hayConversacion])

  const preguntar = async (texto) => {
    const pregunta = texto.trim()
    if (!pregunta || enviando) return

    const id = `s-${Date.now()}`
    setMensajesSesion((actuales) => [...actuales, { id, role: 'user', text: pregunta }])
    setBorrador('')
    setEnviando(true)

    try {
      const respuesta = await assistantService.ask(pregunta)
      setMensajesSesion((actuales) => [
        ...actuales,
        {
          id: `${id}-a`,
          role: 'assistant',
          text: respuesta.respuesta,
          visual: respuesta.visual,
        },
      ])
      setRestantes(respuesta.consultasRestantesHoy)
    } catch (error) {
      setMensajesSesion((actuales) => actuales.filter((mensaje) => mensaje.id !== id))
      setBorrador(pregunta)
      toast.error(getErrorMessage(error))
    } finally {
      setEnviando(false)
    }
  }

  const alEnviar = (evento) => {
    evento.preventDefault()
    preguntar(borrador)
  }

  const alTeclear = (evento) => {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault()
      preguntar(borrador)
    }
  }

  const usarSugerencia = (pregunta) => {
    setBorrador(pregunta)
    campoRef.current?.focus()
  }

  return (
    <section className="space-y-5">
      <PageHeader title="Asistencia virtual" breadcrumbs={BREADCRUMBS} />

      {/* Presentacion: que es esta seccion y para que sirve */}
      <div className="overflow-hidden rounded-2xl bg-brand-600 text-white">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
          <RobotMark size={92} className="mx-auto shrink-0 sm:mx-0" />
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-xl font-bold">Pregúntale a Gamarrito sobre tu negocio</h2>
            <p className="max-w-2xl text-sm text-brand-50">
              Escríbele como le hablarías a tu socio. Él revisa tus ventas, tus compras y tu stock,
              y te responde con los números reales de tu tienda para que decidas qué comprar, qué
              reponer y qué conviene impulsar.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {CAPACIDADES.map(({ icon: Icono, titulo, texto }) => (
          <article key={titulo} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
              <Icono size={18} className="text-brand-600" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{titulo}</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{texto}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[18rem_1fr] lg:items-start">
        {/* Sugerencias: enseñan que se le puede pedir */}
        <aside className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-600" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-gray-900">Prueba preguntando</h3>
          </div>
          {SUGERENCIAS.map(({ grupo, preguntas }) => (
            <div key={grupo} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{grupo}</p>
              <ul className="space-y-1.5">
                {preguntas.map((pregunta) => (
                  <li key={pregunta}>
                    <button
                      type="button"
                      onClick={() => usarSugerencia(pregunta)}
                      disabled={enviando}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs leading-snug text-gray-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pregunta}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Conversacion */}
        <div className="flex min-h-[28rem] flex-col rounded-2xl border border-gray-200 bg-white">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" aria-live="polite">
            {historial.isLoading && <Spinner label="Cargando conversaciones anteriores" />}

            {historial.error && (
              <p role="alert" className="text-center text-xs text-red-600">
                No se pudo cargar el historial. Igual puedes escribir tu consulta.
              </p>
            )}

            {!historial.isLoading && !hayConversacion && (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
                <RobotMark size={76} />
                <p className="max-w-sm text-sm text-gray-600">
                  Todavía no has conversado con Gamarrito. Elige una de las preguntas de la
                  izquierda o escribe la tuya abajo.
                </p>
              </div>
            )}

            {mensajes.map((mensaje) => (
              <Mensaje key={mensaje.id} mensaje={mensaje} />
            ))}

            {enviando && (
              <div className="flex gap-3">
                <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 sm:flex">
                  <RobotMark size={22} variant="head" />
                </div>
                <p className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2.5 text-sm text-gray-500">
                  Revisando tus datos...
                </p>
              </div>
            )}

            <div ref={finRef} />
          </div>

          <form onSubmit={alEnviar} className="space-y-1.5 border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <label htmlFor="consulta" className="sr-only">
                Escribe tu consulta
              </label>
              <textarea
                id="consulta"
                ref={campoRef}
                rows={2}
                value={borrador}
                onChange={(evento) => setBorrador(evento.target.value)}
                onKeyDown={alTeclear}
                disabled={enviando}
                placeholder="Por ejemplo: muéstrame en gráfico de líneas la evolución de mis ventas"
                className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={enviando || !borrador.trim()}
                className="rounded-lg bg-brand-600 p-2.5 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Enviar consulta"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Enter envía, Shift + Enter hace salto de línea</span>
              {restantes !== null && <span>Te quedan {restantes} consultas hoy</span>}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
