function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function FiltersBar({ meta, draft, setDraft, onApply, onClear }) {
  const set = (key) => (value) => setDraft({ ...draft, [key]: value })

  return (
    <form
      className="filters"
      onSubmit={(event) => {
        event.preventDefault()
        onApply()
      }}
    >
      <div className="filters__grid">
        <SelectField
          label="Servicio"
          value={draft.service_name}
          onChange={set('service_name')}
          options={meta.services}
          placeholder="Todos"
        />
        <SelectField
          label="Tipo de error"
          value={draft.error_type}
          onChange={set('error_type')}
          options={meta.error_types}
          placeholder="Todos"
        />
        <SelectField
          label="Severidad"
          value={draft.severity}
          onChange={set('severity')}
          options={meta.severities}
          placeholder="Todas"
        />
        <SelectField
          label="Estado"
          value={draft.status}
          onChange={set('status')}
          options={meta.statuses}
          placeholder="Todos"
        />
        <label className="field">
          <span>Desde</span>
          <input
            type="datetime-local"
            value={draft.from}
            onChange={(event) => set('from')(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Hasta</span>
          <input
            type="datetime-local"
            value={draft.to}
            onChange={(event) => set('to')(event.target.value)}
          />
        </label>
      </div>
      <div className="filters__actions">
        <button type="button" className="btn" onClick={onClear}>
          Limpiar
        </button>
        <button type="submit" className="btn btn--primary">
          Aplicar filtros
        </button>
      </div>
    </form>
  )
}

export default FiltersBar