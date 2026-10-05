import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchPage, getApiBaseUrl, normalizeResponse } from './api.js'

test('base URL supports Codespaces and safe localhost fallback', () => {
  assert.equal(getApiBaseUrl('my-codespace'), 'https://my-codespace-8000.app.github.dev')
  for (const value of [undefined, '', ' ', 'https://example.com']) {
    assert.equal(getApiBaseUrl(value), 'http://localhost:8000')
  }
})

test('normalizes arrays and paginated responses', () => {
  const records = [{ _id: 'user-1', name: 'Mona' }]
  assert.deepEqual(normalizeResponse(records), { records, count: 1, next: null, previous: null })
  assert.deepEqual(normalizeResponse({ results: records, count: 3, next: '?page=2', previous: null }), {
    records, count: 3, next: '?page=2', previous: null,
  })
  assert.equal(normalizeResponse({ data: records, total: 3 }).count, 3)
  assert.throws(() => normalizeResponse({ error: 'Failed' }), /invalid response/)
})

test('fetches same-resource pagination and rejects unsafe links and HTTP errors', async (context) => {
  context.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url.href, 'http://localhost:8000/api/users/?page=2')
    return { ok: true, json: async () => ({ results: [], count: 0 }) }
  })
  await fetchPage('/api/users/', { pageUrl: '?page=2' })
  await assert.rejects(fetchPage('/api/users/', { pageUrl: 'https://example.com/api/users/' }), /invalid pagination/)
  await assert.rejects(fetchPage('/api/users/', { pageUrl: '/api/teams/' }), /invalid pagination/)
  context.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 503 }))
  await assert.rejects(fetchPage('/api/users/'), /HTTP 503/)
})