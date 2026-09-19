function StateMessage({ kind, children, onRetry }) {
  return (
    <div className={`state-message state-message--${kind}`}>
      {children}
      {kind === 'error' && onRetry && (
        <button className="btn" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}

export default StateMessage