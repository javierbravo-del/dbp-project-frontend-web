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
        className="fixed bottom-4 right-4 z-20 rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </button>
    </>
  )
}
