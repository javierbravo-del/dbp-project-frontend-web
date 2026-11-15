import { useState } from 'react'
import { Bot, X } from 'lucide-react'
import AssistantPanel from './AssistantPanel'

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  const handleToggle = () => {
    setHasOpened(true)
    setIsOpen((current) => !current)
  }

  return (
    <>
      {hasOpened && <AssistantPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />}

      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? 'Cerrar Gamarrito IA' : 'Abrir Gamarrito IA'}
        title="Gamarrito IA"
        aria-expanded={isOpen}
        className="fixed bottom-20 right-4 z-40 lg:bottom-4 rounded-full bg-brand-600 p-4 text-white shadow-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </button>
    </>
  )
}
