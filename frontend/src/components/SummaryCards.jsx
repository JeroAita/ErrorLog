import { DEFAULT_SEVERITIES, DEFAULT_STATUSES } from '../api.js'
import { SEVERITY_LABELS, STATUS_SHORT_LABELS } from '../lib/labels.js'

function BreakdownCard({ title, values, counts, labels }) {
  return (
    <div className="card">
      <h3 className="card__title">{title}</h3>
      <table className="card__table">
        <thead>
          <tr>
            {values.map((value) => (
              <th key={value} className={`card__cell card__cell--${value}`}>
                {labels[value]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {values.map((value) => (
              <td key={value} className="card__count">
                {counts[value] ?? 0}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function SummaryCards({ summary }) {
  if (!summary) return null

  const { total = 0, by_status = {}, by_severity = {} } = summary

  return (
    <section className="summary">
      <div className="card card--total">
        <h3 className="card__title">Total de errores</h3>
        <span className="card__number">{total}</span>
      </div>
      <BreakdownCard
        title="Por estado"
        values={DEFAULT_STATUSES}
        counts={by_status}
        labels={STATUS_SHORT_LABELS}
      />
      <BreakdownCard
        title="Por severidad"
        values={DEFAULT_SEVERITIES}
        counts={by_severity}
        labels={SEVERITY_LABELS}
      />
    </section>
  )
}

export default SummaryCards