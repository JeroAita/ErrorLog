const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const DEFAULT_SORT_COLUMNS = {
  occurred_at: 'Ocurrió',
  service_name: 'Servicio',
  error_type: 'Tipo',
  severity: 'Severidad',
  status: 'Estado',
  created_at: 'Ingresado',
}

export const DEFAULT_SEVERITIES = ['debug', 'info', 'warning', 'error', 'critical']
export const DEFAULT_STATUSES = ['open', 'investigating', 'resolved', 'ignored']

export function buildQuery(params = {}) {
  const url = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === '' || value === undefined || value === null) continue
    url.set(key, typeof value === 'string' ? value : String(value))
  }
  const query = url.toString()
  return query ? `?${query}` : ''
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verificá que el backend esté disponible.')
  }

  if (!response.ok) {
    let message = `Error ${response.status}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // sin cuerpo JSON, se mantiene el mensaje genérico
    }
    throw new Error(message)
  }
  return response.json()
}

export function fetchErrors(params) {
  return request(`/errors${buildQuery(params)}`)
}

export function fetchError(id) {
  return request(`/errors/${id}`)
}

export function updateStatus(id, status) {
  return request(`/errors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function fetchSummary(params) {
  return request(`/errors/summary${buildQuery(params)}`)
}

export function fetchMeta() {
  return request('/errors/meta')
}