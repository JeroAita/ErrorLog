import { useCallback, useEffect, useState } from 'react'
import {
  fetchError,
  fetchErrors,
  fetchMeta,
  fetchSummary,
  updateStatus,
  DEFAULT_SEVERITIES,
  DEFAULT_STATUSES,
} from './api.js'
import { toISOString, formatTime } from './lib/format.js'
import Buscador from './components/Buscador.jsx'
import SummaryCards from './components/SummaryCards.jsx'
import ErrorDetailPanel from './components/ErrorDetailPanel.jsx'
import './App.css'

const POLL_INTERVAL_MS = 15_000
const DEFAULT_PER_PAGE = 20

const EMPTY_DRAFT = {
  service_name: '',
  error_type: '',
  severity: '',
  status: '',
  q: '',
  from: '',
  to: '',
  sort: '',
  order: '',
}

function App() {
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [filters, setFilters] = useState(EMPTY_DRAFT)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [refreshToken, setRefreshToken] = useState(0)

  const [errors, setErrors] = useState([])
  const [listMeta, setListMeta] = useState(null)
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')

  const [summary, setSummary] = useState(null)
  const [metaOptions, setMetaOptions] = useState({
    services: [],
    error_types: [],
    severities: DEFAULT_SEVERITIES,
    statuses: DEFAULT_STATUSES,
  })

  const [detailId, setDetailId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  const [updatingIds, setUpdatingIds] = useState(() => new Set())
  const [lastUpdated, setLastUpdated] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    fetchMeta()
      .then(({ data }) => {
        if (active) setMetaOptions(data)
      })
      .catch(() => {
        // fallos en /errors/meta no son críticos
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const { from, to, ...baseFilters } = filters
        const params = {
          ...baseFilters,
          from: toISOString(from),
          to: toISOString(to),
          page,
          per_page: perPage,
        }
        const [{ data, meta }, summaryData] = await Promise.all([
          fetchErrors(params),
          fetchSummary(),
        ])
        if (!active) return
        setErrors(data)
        setListMeta(meta)
        setSummary(summaryData.data)
        setListError('')
        setListLoading(false)
        setLastUpdated(new Date())
      } catch (error) {
        if (!active) return
        setListError(error.message)
        setListLoading(false)
      }
    }

    load()
    const id = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [filters, page, perPage, refreshToken])

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(''), 6000)
    return () => clearTimeout(timer)
  }, [notice])

  const manualRefresh = useCallback(() => setRefreshToken((value) => value + 1), [])

  const applyFilters = () => {
    setPage(1)
    setFilters(draft)
  }

  const clearFilters = () => {
    setDraft(EMPTY_DRAFT)
    setFilters(EMPTY_DRAFT)
    setPage(1)
  }

  const onPageChange = (nextPage) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onPerPageChange = (size) => {
    setPerPage(size)
    setPage(1)
  }

  const openDetail = async (id) => {
    setDetailId(id)
    setDetail(null)
    setDetailError('')
    setDetailLoading(true)
    try {
      const { data } = await fetchError(id)
      setDetail(data)
    } catch (error) {
      setDetailError(error.message)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetail = () => {
    setDetailId(null)
    setDetail(null)
    setDetailError('')
  }

  const handleUpdateStatus = async (id, status) => {
    const previous = errors.find((error) => error.id === id)?.status
    setErrors((current) =>
      current.map((error) => (error.id === id ? { ...error, status } : error)),
    )
    setDetail((current) => (current?.id === id ? { ...current, status } : current))
    setUpdatingIds((current) => new Set(current).add(id))
    try {
      await updateStatus(id, status)
      manualRefresh()
    } catch (error) {
      setErrors((current) =>
        current.map((item) => (item.id === id ? { ...item, status: previous } : item)),
      )
      setDetail((current) =>
        current?.id === id ? { ...current, status: previous } : current,
      )
      setNotice(`No se pudo actualizar el estado: ${error.message}`)
    } finally {
      setUpdatingIds((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">
            <span className="app__title-error">Error</span>
            <span className="app__title-log">Log</span>
          </h1>
          <p>Monitoreo y triage de errores reportados vía Apache Kafka.</p>
        </div>
        <div className="app__header-actions">
          <span className="app__last-updated">
            Última actualización: {lastUpdated ? formatTime(lastUpdated) : '—'}
          </span>
          <button className="btn" onClick={manualRefresh}>
            Actualizar
          </button>
        </div>
      </header>

      {notice && (
        <div className="notice" role="alert">
          {notice}
          <button className="btn" onClick={() => setNotice('')}>
            ✕
          </button>
        </div>
      )}

      <main className="app__main">
        <SummaryCards summary={summary} />

        <Buscador
          meta={metaOptions}
          draft={draft}
          setDraft={setDraft}
          onApply={applyFilters}
          onClear={clearFilters}
          loading={listLoading}
          error={listError}
          errors={errors}
          listMeta={listMeta}
          statuses={metaOptions.statuses ?? []}
          updatingIds={updatingIds}
          onOpen={openDetail}
          onUpdateStatus={handleUpdateStatus}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          onRetry={manualRefresh}
        />
      </main>

      <ErrorDetailPanel
        error={detail}
        loading={detailLoading}
        errorMessage={detailError}
        statuses={metaOptions.statuses ?? []}
        disabled={updatingIds.has(detailId)}
        onClose={closeDetail}
        onRetry={() => openDetail(detailId)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}

export default App