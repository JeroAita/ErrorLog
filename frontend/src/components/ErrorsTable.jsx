import Badge from './Badge.jsx'
import StatusSelector from './StatusSelector.jsx'
import { formatDateTime } from '../lib/format.js'

function ErrorsTable({ errors, statuses, disabledIds, onOpen, onUpdateStatus }) {
  if (errors.length === 0) return null

  return (
    <div className="table-wrap">
      <table className="errors-table">
        <thead>
          <tr>
            <th>Ocurrió</th>
            <th>Servicio</th>
            <th>Tipo</th>
            <th>Mensaje</th>
            <th>Severidad</th>
            <th>Estado</th>
            <th className="errors-table__actions-header">Acción</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((error) => (
            <tr key={error.id} className="errors-table__row" onClick={() => onOpen(error.id)}>
              <td className="errors-table__cell--nowrap">{formatDateTime(error.occurred_at)}</td>
              <td>{error.service_name}</td>
              <td>
                <code>{error.error_type}</code>
              </td>
              <td className="errors-table__message">{error.message}</td>
              <td>
                <Badge kind="severity" value={error.severity} />
              </td>
              <td>
                <Badge kind="status" value={error.status} />
              </td>
              <td className="errors-table__cell--nowrap">
                <span onClick={(event) => event.stopPropagation()}>
                  <StatusSelector
                    id={error.id}
                    status={error.status}
                    statuses={statuses}
                    disabled={disabledIds.has(error.id)}
                    onSelect={onUpdateStatus}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ErrorsTable