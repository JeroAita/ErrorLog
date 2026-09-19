import FiltersBar from './FiltersBar.jsx'
import ErrorsTable from './ErrorsTable.jsx'
import Pagination from './Pagination.jsx'
import StateMessage from './StateMessage.jsx'

function Buscador({
  meta,
  draft,
  setDraft,
  onApply,
  onClear,
  loading,
  error,
  errors,
  listMeta,
  statuses,
  updatingIds,
  onOpen,
  onUpdateStatus,
  onPageChange,
  onPerPageChange,
  onRetry,
}) {
  const total = listMeta?.total ?? 0

  return (
    <section className="panel buscador">
      <header className="buscador__header">
        <h2>Buscador de errores</h2>
        <span className="buscador__count">
          {total} {total === 1 ? 'error' : 'errores'}
        </span>
      </header>

      <FiltersBar
        meta={meta}
        draft={draft}
        setDraft={setDraft}
        onApply={onApply}
        onClear={onClear}
      />

      <hr className="buscador__separator" />

      {loading && errors.length === 0 && (
        <StateMessage kind="loading">Cargando errores…</StateMessage>
      )}

      {!loading && error && errors.length === 0 && (
        <StateMessage kind="error" onRetry={onRetry}>
          {error}
        </StateMessage>
      )}

      {!loading && !error && errors.length === 0 && (
        <StateMessage kind="empty">
          No hay errores que coincidan con los criterios. Publicá un evento en
          el tópico <code>error-logs</code> para verlo acá.
        </StateMessage>
      )}

      {errors.length > 0 && (
        <>
          <ErrorsTable
            errors={errors}
            statuses={statuses}
            disabledIds={updatingIds}
            onOpen={onOpen}
            onUpdateStatus={onUpdateStatus}
          />
          <Pagination
            meta={listMeta}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
          />
        </>
      )}
    </section>
  )
}

export default Buscador