const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

export const formatCurrency = (value) => currencyFormatter.format(Number(value ?? 0))

const dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export const formatDateTime = (value) => (value ? dateTimeFormatter.format(new Date(value)) : '—')
