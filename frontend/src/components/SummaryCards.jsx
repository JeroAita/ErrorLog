import Badge from './Badge.jsx'
import { DEFAULT_SEVERITIES, DEFAULT_STATUSES } from '../api.js'
import { STATUS_LABELS } from '../lib/labels.js'

function SummaryCards({ summary }) {
  if (!summary) return null

  const { total = 0, by_status = {}, by_severity = {} } = summary

  return (
    <section className="summary">
      <div className="card card--total">
        <span className="card__label">Total de errores</span>
        <span className="card__number">{total}</span>
      </div>
      <div className="card">
        <h3 className="card__title">Por estado</h3>
        <ul className="card__list">
          {DEFAULT_STATUSES.map((value) => (
            <li key={value}>
              <Badge kind="status" value={value} />
              <span>{STATUS_LABELS[value]}</span>
              <span className="card__count">{by_status[value] ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3 className="card__title">Por severidad</h3>
        <ul className="card__list">
          {DEFAULT_SEVERITIES.map((value) => (
            <li key={value}>
              <Badge kind="severity" value={value} />
              <span>{value}</span>
              <span className="card__count">{by_severity[value] ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SummaryCards