import { useDocumentTitle } from '../hooks/useDocumentTitle'
import AssistantVisual from '../components/AssistantVisual'
import { SAMPLE_VISUALS } from '../mocks/assistantVisuals'

export default function AssistantVisualsDemoPage() {
  useDocumentTitle('Demo de visuales del asistente')

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Demo de visuales del asistente</h1>
        <p className="text-sm text-gray-600">
          Solo en desarrollo. Cada ejemplo usa el mismo formato que enviará el backend.
        </p>
      </header>

      {SAMPLE_VISUALS.map(({ description, visual }) => (
        <section key={description} className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500">{description}</h2>
          <AssistantVisual visual={visual} />
        </section>
      ))}
    </main>
  )
}
