const dateTimeFormatter = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return dateTimeFormatter.format(date)
}

const timeFormatter = new Intl.DateTimeFormat('es', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

export function formatTime(date = new Date()) {
  return timeFormatter.format(date)
}

export function toISOString(datetimeLocalValue) {
  if (!datetimeLocalValue) return ''
  const date = new Date(datetimeLocalValue)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString()
}