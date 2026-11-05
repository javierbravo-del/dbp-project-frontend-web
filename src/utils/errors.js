const MESSAGES_BY_STATUS = {
  400: 'Los datos enviados no son válidos. Revisa el formulario.',
  401: 'Tu sesión expiró o tus credenciales son incorrectas.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'No encontramos lo que buscas.',
  409: 'Esta operación entra en conflicto con información existente.',
  429: 'Alcanzaste el límite de consultas. Intenta más tarde.',
  500: 'Ocurrió un error en el servidor. Intenta nuevamente.',
  503: 'El servicio no está disponible por ahora.',
}

export const getErrorMessage = (error) => {
  if (error.code === 'ERR_CANCELED') return null
  if (error.code === 'ECONNABORTED') return 'La solicitud tardó demasiado. Intenta de nuevo.'
  if (!error.response) return 'No hay conexión con el servidor. Revisa tu internet.'

  const { status, data } = error.response
  const isClientError = status >= 400 && status < 500
  if (isClientError && data?.detail) return data.detail

  return MESSAGES_BY_STATUS[status] ?? 'Ocurrió un error inesperado.'
}
