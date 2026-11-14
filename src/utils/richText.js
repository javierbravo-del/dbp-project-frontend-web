// Convierte el texto con marcas simples (**negrita**, *cursiva*, listas) que escribe la IA
// en una estructura de bloques que el componente FormattedText puede dibujar sin HTML inseguro.

const BULLET = /^\s*[-*•]\s+(.*)$/
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/

export const parseBlocks = (text) => {
  const blocks = []
  let current = null

  String(text ?? '')
    .split('\n')
    .forEach((rawLine) => {
      const line = rawLine.trimEnd()
      const bullet = line.match(BULLET)
      const numbered = bullet ? null : line.match(NUMBERED)

      if (bullet || numbered) {
        const type = bullet ? 'ul' : 'ol'
        if (!current || current.type !== type) {
          current = { type, items: [] }
          blocks.push(current)
        }
        current.items.push((bullet ?? numbered)[1])
        return
      }

      if (line.trim() === '') {
        current = null
        return
      }

      if (current && current.type === 'p') {
        current.lines.push(line.trim())
      } else {
        current = { type: 'p', lines: [line.trim()] }
        blocks.push(current)
      }
    })

  return blocks
}

const INLINE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g

// Devuelve una lista de fragmentos: { kind: 'text' | 'bold' | 'italic', value }
export const parseInline = (text) =>
  String(text)
    .split(INLINE)
    .filter(Boolean)
    .map((part) => {
      if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
        return { kind: 'bold', value: part.slice(2, -2) }
      }
      if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
        return { kind: 'italic', value: part.slice(1, -1) }
      }
      return { kind: 'text', value: part }
    })

// Texto limpio (sin asteriscos) para copiar al portapapeles.
export const stripMarks = (text) =>
  String(text ?? '')
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
