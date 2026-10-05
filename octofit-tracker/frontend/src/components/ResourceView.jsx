import { useDeferredValue, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react'
import { fetchPage } from '../api'

async function loadUsers(signal) {
  const users = {}
  const visited = new Set()
  let pageUrl
  do {
    const page = await fetchPage('/api/users/', { signal, pageUrl })
    for (const user of page.records) users[user._id ?? user.id] = user.name
    pageUrl = page.next
    if (pageUrl && visited.has(pageUrl)) throw new Error('The API returned a repeating pagination link.')
    visited.add(pageUrl)
  } while (pageUrl)
  return users
}

export default function ResourceView({ title, fetch, columns, resolveUsers = false }) {
  const [request, setRequest] = useState({ pageUrl: null, revision: 0, page: 1, offset: 0, offsets: { 1: 0 } })
  const [state, setState] = useState({ status: 'loading', records: [], users: {}, count: 0 })
  const [search, setSearch] = useState('')
  const query = useDeferredValue(search).trim().toLowerCase()

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetch({ signal: controller.signal, pageUrl: request.pageUrl }),
      resolveUsers ? loadUsers(controller.signal) : Promise.resolve({}),
    ]).then(([page, users]) => {
      if (!controller.signal.aborted) setState({ ...page, users, status: 'ready' })
    }).catch((error) => {
      if (!controller.signal.aborted) {
        setState({ status: 'error', records: [], users: {}, count: 0, error: error.message })
      }
    })
    return () => controller.abort()
  }, [fetch, resolveUsers, request])

  function load(pageUrl = request.pageUrl, page = request.page, offset = request.offset) {
    setState({ status: 'loading', records: [], users: {}, count: 0 })
    setRequest((previous) => ({ pageUrl, page, offset, offsets: { ...previous.offsets, [page]: offset }, revision: previous.revision + 1 }))
  }

  const records = state.records.map((record, index) => ({ record, index })).filter(({ record, index }) => columns.some((column) =>
    String(column.render(record, index, state.users) ?? '').toLowerCase().includes(query),
  ))

  return (
    <section aria-labelledby="view-title" aria-busy={state.status === 'loading'}>
      <div className="view-heading">
        <div>
          <p className="eyebrow">Mergington High School</p>
          <h1 id="view-title">{title}</h1>
        </div>
        <button className="btn btn-outline-secondary icon-button" type="button" title={`Refresh ${title.toLowerCase()}`} aria-label={`Refresh ${title.toLowerCase()}`} disabled={state.status === 'loading'} onClick={() => load()}>
          <RefreshCw size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="view-toolbar">
        <div className="search-field">
          <Search size={18} aria-hidden="true" />
          <input className="form-control" type="search" aria-label={`Search ${title.toLowerCase()}`} placeholder={`Search ${title.toLowerCase()}`} value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <span className="record-count" role="status">
          {state.status === 'ready' ? `${state.count} records` : state.status === 'loading' ? 'Loading...' : 'Unavailable'}
        </span>
      </div>

      {state.status === 'error' ? (
        <div className="alert alert-danger d-flex align-items-center justify-content-between gap-3" role="alert">
          <span>{state.error}</span>
          <button className="btn btn-outline-danger d-flex align-items-center gap-2" type="button" onClick={() => load()}><RefreshCw size={16} aria-hidden="true" />Retry</button>
        </div>
      ) : (
        <div className="table-responsive data-table">
          <table className="table align-middle mb-0">
            <caption className="visually-hidden">{title}</caption>
            <thead><tr>{columns.map((column) => <th key={column.label} scope="col">{column.label}</th>)}</tr></thead>
            <tbody>
              {state.status === 'loading' ? (
                <tr><td colSpan={columns.length} className="table-state"><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Loading {title.toLowerCase()}...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={columns.length} className="table-state">{query ? 'No matching records.' : `No ${title.toLowerCase()} yet.`}</td></tr>
              ) : records.map(({ record, index }) => (
                <tr key={record._id ?? record.id ?? index}>
                  {columns.map((column) => <td key={column.label}>{column.render(record, index + request.offset, state.users)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {state.status === 'ready' && (state.next || state.previous) && (
        <nav className="pagination-bar" aria-label={`${title} pages`}>
          <button type="button" className="btn btn-outline-secondary icon-button" title="Previous page" aria-label="Previous page" disabled={!state.previous} onClick={() => load(state.previous, Math.max(1, request.page - 1), request.offsets[request.page - 1] ?? 0)}><ChevronLeft size={18} aria-hidden="true" /></button>
          <span>Page {request.page}</span>
          <button type="button" className="btn btn-outline-secondary icon-button" title="Next page" aria-label="Next page" disabled={!state.next} onClick={() => load(state.next, request.page + 1, request.offset + state.records.length)}><ChevronRight size={18} aria-hidden="true" /></button>
        </nav>
      )}
    </section>
  )
}