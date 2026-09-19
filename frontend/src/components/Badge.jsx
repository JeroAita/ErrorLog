import { SEVERITY_LABELS, STATUS_LABELS } from '../lib/labels.js'

function Badge({ kind, value }) {
  const label = kind === 'severity' ? SEVERITY_LABELS[value] : STATUS_LABELS[value]
  return (
    <span className={`badge badge--${kind} badge--${value}`}>
      {label ?? value}
    </span>
  )
}

export default Badge