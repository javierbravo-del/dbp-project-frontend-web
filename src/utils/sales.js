export const PAYMENT_METHODS = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'TARJETA', label: 'Tarjeta' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
]

export const SALES_CHANNELS = [
  { value: 'TIENDA', label: 'Tienda' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'OTRO', label: 'Otro' },
]

export const labelOf = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value ?? '—'
