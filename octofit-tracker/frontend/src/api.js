export function getApiBaseUrl(codespaceName) {
  const name = codespaceName?.trim()
  return name && /^[a-zA-Z0-9-]+$/.test(name)
    ? `https://${name}-8000.app.github.dev`
    : 'http://localhost:8000'
}

export const apiBaseUrl = getApiBaseUrl(import.meta.env?.VITE_CODESPACE_NAME)

export function getUserName(user, users = {}) {
  return user?.name ?? users[user?._id ?? user] ?? 'Unknown user'
}

export function normalizeResponse(payload) {
  if (Array.isArray(payload)) {
    return { records: payload, count: payload.length, next: null, previous: null }
  }
  const records = payload?.results ?? payload?.data
  if (!Array.isArray(records)) throw new Error('The API returned an invalid response.')
  return {
    records,
    count: payload.count ?? payload.total ?? records.length,
    next: typeof payload.next === 'string' ? payload.next : null,
    previous: typeof payload.previous === 'string' ? payload.previous : null,
  }
}

export async function fetchPage(endpoint, { signal, pageUrl } = {}) {
  const endpointUrl = new URL(endpoint, apiBaseUrl)
  const url = pageUrl ? new URL(pageUrl, endpointUrl) : endpointUrl
  if (url.origin !== endpointUrl.origin || url.pathname !== endpointUrl.pathname) {
    throw new Error('The API returned an invalid pagination link.')
  }
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Unable to load records (HTTP ${response.status}).`)
  return normalizeResponse(await response.json())
}