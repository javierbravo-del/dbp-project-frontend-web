import { formatCurrency } from './format'

export const VISUAL_TYPES = {
  BAR: 'BARRAS',
  LINE: 'LINEAS',
  CARDS: 'TARJETAS',
  TABLE: 'TABLA',
}

const VALUE_FORMATS = ['moneda', 'numero', 'porcentaje']
const MAX_POINTS = 50
const MAX_CARDS = 6
const MAX_COLUMNS = 8

const numberFormatter = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 })

export const formatVisualValue = (value, format = 'numero') => {
  if (typeof value !== 'number') return String(value ?? '')
  if (format === 'moneda') return formatCurrency(value)
  if (format === 'porcentaje') return `${numberFormatter.format(value)} %`
  return numberFormatter.format(value)
}

const axisFormatter = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 })

export const formatAxisValue = (value, format = 'numero') => {
  const text = axisFormatter.format(value)
  if (format === 'moneda') return `S/ ${text}`
  if (format === 'porcentaje') return `${text} %`
  return text
}

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

const toText = (value) => (typeof value === 'string' ? value.trim() : '')

const normalizePoints = (data) => {
  if (!Array.isArray(data) || data.length === 0 || data.length > MAX_POINTS) return null
  const points = data.map((item) => ({
    label: toText(item?.etiqueta),
    value: Number(item?.valor),
  }))
  const isValid = points.every((point) => point.label && Number.isFinite(point.value))
  return isValid ? points : null
}

const normalizeCards = (data) => {
  if (!Array.isArray(data) || data.length === 0 || data.length > MAX_CARDS) return null
  const cards = data.map((item) => ({
    label: toText(item?.etiqueta),
    value: typeof item?.valor === 'number' ? item.valor : toText(String(item?.valor ?? '')),
    note: toText(item?.nota),
  }))
  const isValid = cards.every(
    (card) => card.label && (typeof card.value === 'number' || card.value !== ''),
  )
  return isValid ? cards : null
}

const normalizeTable = (columns, rows) => {
  if (!Array.isArray(columns) || columns.length === 0 || columns.length > MAX_COLUMNS) return null
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > MAX_POINTS) return null
  const normalizedColumns = columns.map((column) => ({
    key: toText(column?.clave),
    header: toText(column?.titulo),
  }))
  if (!normalizedColumns.every((column) => column.key && column.header)) return null
  if (!rows.every(isPlainObject)) return null
  return {
    columns: normalizedColumns,
    rows: rows.map((row, index) => ({ ...row, id: index })),
  }
}

/**
 * Convierte el campo `visual` que envía el backend a una forma segura para dibujar.
 * Si el tipo no existe o los datos no son válidos devuelve null y solo se muestra el texto.
 */
export const normalizeVisual = (raw) => {
  if (!isPlainObject(raw)) return null

  const type = toText(raw.tipo).toUpperCase()
  const title = toText(raw.titulo)
  const format = VALUE_FORMATS.includes(raw.formato) ? raw.formato : 'numero'

  if (type === VISUAL_TYPES.BAR || type === VISUAL_TYPES.LINE) {
    const points = normalizePoints(raw.datos)
    return points ? { type, title, format, points } : null
  }

  if (type === VISUAL_TYPES.CARDS) {
    const cards = normalizeCards(raw.datos)
    return cards ? { type, title, format, cards } : null
  }

  if (type === VISUAL_TYPES.TABLE) {
    const table = normalizeTable(raw.columnas, raw.filas)
    return table ? { type, title, ...table } : null
  }

  return null
}
