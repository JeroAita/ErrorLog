import { useEffect } from 'react'
import Badge from './Badge.jsx'
import StatusSelector from './StatusSelector.jsx'
import StateMessage from './StateMessage.jsx'
import { formatDateTime } from '../lib/format.js'

function ErrorDetailPanel({
  error,
  loading,
  errorMessage,
  statuses,
  disabled,
  onClose,
  onRetry,
  onUpdateStatus,
}) {
  useEffect(() => {
    if (!loading && !error && !errorMessage) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [loading, error, errorMessage, onClose])

  if (!loading && !error && !errorMessage) return null

  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Detalle del error"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="detail-panel__header">
          <div>
            <h2>{error?.error_type ?? 'Detalle del error'}</h2>
            <span className="detail-panel__service">{error?.service_name}</span>
          </div>
          <button className="btn btn--icon" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>

        {loading && (
          <StateMessage kind="loading">Cargando detalle…</StateMessage>
        )}

        {!loading && errorMessage && (
          <StateMessage kind="error" onRetry={onRetry}>
            {errorMessage}
          </StateMessage>
        )}

        {!loading && error && (
          <div className="detail-panel__body">
            <div className="detail-panel__meta">
              <div>
                <span className="detail-panel__label">Severidad</span>
                <Badge kind="severity" value={error.severity} />
              </div>
              <div>
                <span className="detail-panel__label">Estado</span>
                <StatusSelector
                  id={error.id}
                  status={error.status}
                  statuses={statuses}
                  disabled={disabled}
                  onSelect={onUpdateStatus}
                />
              </div>
            </div>

            <section className="detail-panel__section">
              <h3>Ocurrencia</h3>
              <dl className="detail-panel__fields">
                <div>
                  <dt>Ocurrió</dt>
                  <dd>{formatDateTime(error.occurred_at)}</dd>
                </div>
                <div>
                  <dt>Ingresado</dt>
                  <dd>{formatDateTime(error.created_at)}</dd>
                </div>
                <div>
                  <dt>Actualizado</dt>
                  <dd>{formatDateTime(error.updated_at)}</dd>
                </div>
              </dl>
            </section>

            <section className="detail-panel__section">
              <h3>Mensaje</h3>
              <p className="detail-panel__message">{error.message}</p>
            </section>

            <section className="detail-panel__section">
              <h3>Stack trace</h3>
              {error.stack_trace ? (
                <pre className="detail-panel__pre">{error.stack_trace}</pre>
              ) : (
                <p className="detail-panel__muted">Sin traza de pila.</p>
              )}
            </section>

            <section className="detail-panel__section">
              <h3>Metadata</h3>
              {error.metadata && Object.keys(error.metadata).length > 0 ? (
                <pre className="detail-panel__pre">
                  {JSON.stringify(error.metadata, null, 2)}
                </pre>
              ) : (
                <p className="detail-panel__muted">Sin metadata.</p>
              )}
            </section>
          </div>
        )}
      </aside>
    </div>
  )
}

export default ErrorDetailPanel