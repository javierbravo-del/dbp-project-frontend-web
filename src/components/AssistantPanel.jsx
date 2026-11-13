import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Bot, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { assistantService } from '../services/assistantService'
import { getErrorMessage } from '../utils/errors'
import Spinner from './Spinner'

const MAX_LENGTH = 500

const SUGGESTIONS = [
  '¿Cuáles son mis productos más vendidos?',
  '¿Qué productos tienen stock bajo?',
  '¿Cuánto he vendido esta semana?',
]

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white'
    : message.failed
      ? 'bg-red-50 text-red-700'
      : 'bg-gray-100 text-gray-900'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${bubbleClasses}`}
      >
        {message.text}
      </p>
    </div>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    text: PropTypes.string.isRequired,
    failed: PropTypes.bool,
  }).isRequired,
}

export default function AssistantPanel({ isOpen, onClose }) {
  const [draft, setDraft] = useState('')
  const [sessionMessages, setSessionMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [remaining, setRemaining] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

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
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, isSending, isOpen])

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus()
    }
  }, [isOpen])

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
        { id: `${messageId}-a`, role: 'assistant', text: answer.respuesta },
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

  const handlePanelKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  return (
    <section
      role="dialog"
      aria-label="Gamarrito IA"
      onKeyDown={handlePanelKeyDown}
      className={`fixed bottom-20 right-4 z-20 flex h-[32rem] max-h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] max-w-sm flex-col rounded-2xl border border-gray-200 bg-white shadow-xl ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <header className="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Bot size={18} />
          <h2 className="text-sm font-semibold">Gamarrito IA</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar Gamarrito IA"
          className="rounded-lg p-1 hover:bg-blue-700"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-3" aria-live="polite">
        {history.isLoading && messages.length === 0 && <Spinner />}

        {history.error && (
          <p role="alert" className="text-center text-xs text-red-600">
            No se pudo cargar tu historial, pero puedes seguir preguntando.
          </p>
        )}

        {!history.isLoading && messages.length === 0 && (
          <div className="space-y-3 py-4 text-center">
            <p className="text-sm text-gray-600">
              ¡Hola! Soy Gamarrito IA. Pregúntame sobre tus ventas, tu inventario o tus clientes.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setDraft(suggestion)}
                  className="rounded-full border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
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
            <p className="rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-500">
              Gamarrito IA está pensando...
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-1 border-t border-gray-200 p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MAX_LENGTH}
            rows={2}
            placeholder="Pregúntale a Gamarrito IA..."
            aria-label="Tu pregunta"
            disabled={isSending}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            aria-label="Enviar pregunta"
            className="rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {remaining === null
              ? 'Enter para enviar'
              : `Te quedan ${remaining} consultas hoy`}
          </span>
          <span>
            {draft.length}/{MAX_LENGTH}
          </span>
        </div>
      </form>
    </section>
  )
}

AssistantPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
