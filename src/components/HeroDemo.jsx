import { useEffect, useState } from 'react'
import { Pause, Play, Sparkles } from 'lucide-react'

/**
 * Demo animada de Gamarrito para la portada. No usa backend ni video:
 * es un componente React que recorre preguntas de ejemplo con useEffect
 * y setTimeout (con limpieza), igual que un bucle de video pero nítido
 * y adaptado al tema. Respeta prefers-reduced-motion y tiene pausa.
 */
const SCENARIOS = [
  {
    question: '¿Qué medio de pago me deja más ventas?',
    answer: 'Esta semana Yape lidera con S/ 1,850. Efectivo va segundo.',
    chart: [
      { label: 'Yape', value: 100 },
      { label: 'Efectivo', value: 72 },
      { label: 'Plin', value: 38 },
      { label: 'Tarjeta', value: 21 },
    ],
  },
  {
    question: '¿Qué me conviene reponer?',
    answer: 'Polo básico talla M: quedan 3 unidades y vendes 9 por semana.',
    chart: [
      { label: 'Polo M', value: 100 },
      { label: 'Jean 32', value: 60 },
      { label: 'Casaca L', value: 45 },
    ],
  },
  {
    question: '¿Cuánto gané este mes?',
    answer: 'S/ 6,120 de ganancia, un margen de 33% sobre S/ 18,450 vendidos.',
    chart: [
      { label: 'Sem 1', value: 55 },
      { label: 'Sem 2', value: 70 },
      { label: 'Sem 3', value: 62 },
      { label: 'Sem 4', value: 100 },
    ],
  },
]

// Fases: typing -> thinking -> answer -> chart -> espera y pasa al siguiente.
const PHASE_DURATION = { thinking: 1100, answer: 1400, chart: 3200 }

export default function HeroDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [phase, setPhase] = useState('typing')
  const [typedCount, setTypedCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const scenario = SCENARIOS[scenarioIndex]

  useEffect(() => {
    if (isPaused || reducedMotion) return undefined

    let timer
    if (phase === 'typing') {
      if (typedCount < scenario.question.length) {
        timer = setTimeout(() => setTypedCount((count) => count + 1), 38)
      } else {
        timer = setTimeout(() => setPhase('thinking'), 350)
      }
    } else if (phase === 'thinking') {
      timer = setTimeout(() => setPhase('answer'), PHASE_DURATION.thinking)
    } else if (phase === 'answer') {
      timer = setTimeout(() => setPhase('chart'), PHASE_DURATION.answer)
    } else {
      timer = setTimeout(() => {
        setScenarioIndex((index) => (index + 1) % SCENARIOS.length)
        setPhase('typing')
        setTypedCount(0)
      }, PHASE_DURATION.chart)
    }
    return () => clearTimeout(timer)
  }, [phase, typedCount, isPaused, reducedMotion, scenario.question.length])

  // Con movimiento reducido se muestra el estado final, sin animar.
  const showAll = reducedMotion
  const showAnswer = showAll || phase === 'answer' || phase === 'chart'
  const showChart = showAll || phase === 'chart'
  const typedQuestion = showAll ? scenario.question : scenario.question.slice(0, typedCount)

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        </div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Sparkles size={13} aria-hidden="true" />
          Asistente Gamarrito
        </p>
        {!showAll && (
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            aria-label={isPaused ? 'Reanudar la demo' : 'Pausar la demo'}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
          </button>
        )}
      </div>

      <div className="flex min-h-[290px] flex-col gap-3 p-4" aria-live="off">
        <p className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2 text-sm text-white">
          {typedQuestion}
          {!showAll && phase === 'typing' && (
            <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-white/80">&nbsp;</span>
          )}
        </p>

        {!showAll && phase === 'thinking' && (
          <p className="flex items-center gap-1 self-start rounded-2xl bg-gray-100 px-3.5 py-2.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                style={{ animationDelay: `${dot * 0.15}s` }}
              />
            ))}
            <span className="sr-only">Gamarrito está pensando</span>
          </p>
        )}

        {showAnswer && (
          <p className="max-w-[90%] self-start rounded-2xl rounded-bl-md bg-gray-100 px-3.5 py-2 text-sm text-gray-800">
            {scenario.answer}
          </p>
        )}

        {showChart && (
          <div className="mt-1 space-y-2 rounded-lg border border-gray-200 p-3">
            {scenario.chart.map((bar) => (
              <div key={bar.label} className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-xs text-gray-500">{bar.label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <span
                    className="block h-full rounded-full bg-brand-500 transition-[width] duration-700 ease-out"
                    style={{ width: `${bar.value}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
