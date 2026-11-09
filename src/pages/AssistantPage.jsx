import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { assistantService } from '../services/assistantService'
import { getErrorMessage } from '../utils/errors'
import AssistantVisual from '../components/AssistantVisual'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Asistente' }]
const MAX_LENGTH = 500

const SUGGESTIONS = [
  '¿Cuáles son mis productos más vendidos?',
  '¿Qué productos tienen stock bajo?',
  '¿Cuánto he vendido esta semana?',
]

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const bubbleClasses = isUser
    ? 'bg-brand-600 text-white'
    : message.failed
      ? 'bg-red-50 text-red-700'
      : 'bg-gray-100 text-gray-900'

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${bubbleClasses}`}
      >
        {message.text}
      </p>
      {!isUser && message.visual && (
        <div className="w-full max-w-[95%]">
          <AssistantVisual visual={message.visual} />
        </div>
      )}
    </div>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    text: PropTypes.string.isRequired,
    failed: PropTypes.bool,
    visual: PropTypes.object,
  }).isRequired,
}

export default function AssistantPage() {
  const [draft, setDraft] = useState('')
  const [sessionMessages, setSessionMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [remaining, setRemaining] = useState(null)
  const bottomRef = useRef(null)

  const fetchHistory = useCallback(
    (signal) => assistantService.getHistory({ page: 1, size: 20 }, signal),
    [],
  )
  const history = useFetch(fetchHistory)

  const historyMessages = useMemo(() => {
    const entries = [...(history.data?.content ?? [])].reverse()
    return entries.flatMap((entry) => [
      { id: `h-${entry.id}-q`, role: 'user', text: entry.pregunta },
      {
        id: `h-${entry.id}-a`,
        role: 'assistant',
        text: entry.respuesta ?? 'No se pudo obtener una respuesta.',
        failed: !entry.exitosa,
      },
    ])
  }, [history.data])

  const messages = [...historyMessages, ...sessionMessages]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isSending])

  const sendQuestion = async () => {
    const question = draft.trim()
    if (!question || isSending) return

    const messageId = `s-${Date.now()}`
    setSessionMessages((current) => [...current, { id: messageId, role: 'user', text: question }])
    setDraft('')
    setIsSending(true)

    try {
      const answer = await assistantService.ask(question)
      setSessionMessages((current) => [
        ...current,
        {
          id: `${messageId}-a`,
          role: 'assistant',
          text: answer.respuesta,
          visual: answer.visual,
        },
      ])
      setRemaining(answer.consultasRestantesHoy)
    } catch (error) {
      setSessionMessages((current) => current.filter((message) => message.id !== messageId))
      setDraft(question)
      toast.error(getErrorMessage(error))
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendQuestion()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendQuestion()
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Asistente" breadcrumbs={BREADCRUMBS} />

      <div className="flex h-[70vh] flex-col rounded-2xl bg-white shadow-sm">
        <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          {history.isLoading && messages.length === 0 && <Spinner />}

          {history.error && (
            <p role="alert" className="text-center text-sm text-red-600">
              No se pudo cargar tu historial, pero puedes seguir preguntando.
            </p>
          )}

          {!history.isLoading && messages.length === 0 && (
            <div className="space-y-3 py-8 text-center">
              <p className="text-sm text-gray-600">
                Pregúntame sobre tus ventas, tu inventario o tus clientes.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setDraft(suggestion)}
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isSending && (
            <div className="flex justify-start">
              <p className="rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-500">
                Pensando...
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 border-t border-gray-200 p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_LENGTH}
              rows={2}
              placeholder="Escribe tu pregunta..."
              aria-label="Tu pregunta"
              disabled={isSending}
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={isSending || !draft.trim()}
              aria-label="Enviar pregunta"
              className="rounded-lg bg-brand-600 p-3 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {remaining === null
                ? 'Enter para enviar, Shift + Enter para salto de línea'
                : `Te quedan ${remaining} consultas hoy`}
            </span>
            <span>
              {draft.length}/{MAX_LENGTH}
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}