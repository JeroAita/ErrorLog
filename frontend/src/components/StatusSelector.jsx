import { STATUS_LABELS } from '../lib/labels.js'

function StatusSelector({ id, status, statuses, disabled, onSelect }) {
  return (
    <select
      className="status-select"
      aria-label="Cambiar estado"
      value={status}
      disabled={disabled}
      onChange={(event) => onSelect(id, event.target.value)}
    >
      {statuses.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  )
}

export default StatusSelector