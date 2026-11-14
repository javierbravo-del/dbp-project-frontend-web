import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Check, Copy, History, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { assistantService } from '../services/assistantService'
import { getErrorMessage } from '../utils/errors'
import { stripMarks } from '../utils/richText'
import AssistantVisual from '../components/AssistantVisual'
import FormattedText from '../components/FormattedText'
import HeroIllustration from '../components/HeroIllustration'
import RobotMark from '../components/RobotMark'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

const BREADCRUMBS = [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Asistente' }]
const MAX_LENGTH = 500

const SUGGESTIONS = [
  '¿Cuáles son mis productos más vendidos?',
  '¿Qué productos tienen stock bajo?',
  '¿Cuánto he vendido esta semana?',
  '¿Qué medio de pago uso más?',
]

function TypingDots() {
  return (
    <div className="flex items-center gap-2" role="status" aria-label="El asistente está escribiendo">
      <RobotMark size={24} variant="head" className="text-brand-600" />
      <div className="flex gap-1 rounded-2xl bg-gray-100 px-4 py-3">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('No se pudo copiar la respuesta')
    }
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copiar respuesta"
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

CopyButton.propTypes = { text: PropTypes.string.isRequired }

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const bubbleClasses = isUser
    ? 'bg-brand-600 text-white'
    : message.failed
      ? 'bg-red-50 text-red-700'
      : 'bg-gray-100 text-gray-900'

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex max-w-[90%] items-start gap-2 ${isUser ? '' : ''}`}>
        {!isUser && <RobotMark size={24} variant="head" className="mt-1 shrink-0 text-brand-600" />}
        {isUser ? (
          <p className={`whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${bubbleClasses}`}>
            {message.text}
          </p>
        ) : (
          <FormattedText
            text={message.text}
            className={`rounded-2xl px-4 py-2 text-sm ${bubbleClasses}`}
          />
        )}
      </div>
      {!isUser && !message.failed && (
        <div className="pl-9">
          <CopyButton text={stripMarks(message.text)} />
        </div>
      )}
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
  const recentQuestions = messages.filter((message) => message.role === 'user').slice(-12).reverse()

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
    <section className="mx-auto max-w-5xl space-y-4">
      <PageHeader title="Asistente" breadcrumbs={BREADCRUMBS} />

      <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
      <div className="flex h-[70vh] flex-col rounded-lg bg-white shadow-sm">
        <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          {history.isLoading && messages.length === 0 && <Spinner />}

          {history.error && (
            <p role="alert" className="text-center text-sm text-red-600">
              No se pudo cargar tu historial, pero puedes seguir preguntando.
            </p>
          )}

          {!history.isLoading && messages.length === 0 && (
            <div className="space-y-3 py-8 text-center">
              <HeroIllustration width={300} className="mx-auto max-w-full text-brand-600" />
              <p className="text-sm text-gray-600">
                Pregúntame sobre tus ventas, tu inventario o tus clientes.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isSending && <TypingDots />}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 border-t border-gray-200 p-4">
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Preguntas sugeridas">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setDraft(suggestion)}
                disabled={isSending}
                className="shrink-0 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 transition-colors hover:border-brand-400 hover:text-brand-700 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
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

      <aside className="hidden max-h-[70vh] overflow-y-auto rounded-lg bg-white p-4 shadow-sm lg:block">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <History size={16} aria-hidden="true" />
          Preguntas recientes
        </h2>
        {recentQuestions.length === 0 ? (
          <p className="text-xs text-gray-500">Aquí verás las preguntas que hagas.</p>
        ) : (
          <ul className="space-y-1">
            {recentQuestions.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setDraft(entry.text)}
                  title="Usar esta pregunta de nuevo"
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  {entry.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
      </div>
    </section>
  )
}