const PER_PAGE_OPTIONS = [10, 20, 50, 100]

function Pagination({ meta, onPageChange, onPerPageChange }) {
  if (!meta || meta.total === 0) return null

  const { page = 1, per_page = 20, total = 0, total_pages = 1 } = meta

  return (
    <div className="pagination">
      <label className="pagination__page-size">
        Filas por página:
        <select
          value={per_page}
          onChange={(event) => onPerPageChange(Number(event.target.value))}
        >
          {PER_PAGE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <span className="pagination__info">
        Página {page} de {total_pages} · {total} {total === 1 ? 'error' : 'errores'}
      </span>
      <div className="pagination__controls">
        <button
          className="btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹ Anterior
        </button>
        <button
          className="btn"
          disabled={page >= total_pages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente ›
        </button>
      </div>
    </div>
  )
}

export default Pagination