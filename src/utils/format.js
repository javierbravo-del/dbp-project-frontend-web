const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

export const formatCurrency = (value) => currencyFormatter.format(Number(value ?? 0))
