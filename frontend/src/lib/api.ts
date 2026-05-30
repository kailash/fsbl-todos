import { Todo, NewTodo } from '../types/todo'

const BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080') + '/api'

async function request<T>(url: string, options?: RequestInit & { signal?: AbortSignal }): Promise<T> {
  const { signal, ...rest } = options ?? {}
  const res = await fetch(url, { ...rest, signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  // DELETE returns 204 No Content
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

function toISODate(d: unknown): string | undefined {
  if (!d) return undefined
  if (Array.isArray(d) && d.length === 3 && d.every(x => typeof x === 'number')) {
    const [y, m, day] = d as number[]
    return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  return typeof d === 'string' ? d : undefined
}

function normalizeTodo(raw: unknown): Todo {
  const r = raw as Record<string, unknown>
  return {
    ...(r as unknown as Todo),
    nextRevisionDate: toISODate(r.nextRevisionDate),
    createdAt: toISODate(r.createdAt),
    revisionIteration: r.revisionIteration as number | undefined,
  }
}

export const api = {
  getPendingTodos: (signal?: AbortSignal) =>
    request<unknown[]>(`${BASE}/todos/pending`, { signal }).then(arr => arr.map(normalizeTodo)),

  getRevisionList: (signal?: AbortSignal) =>
    request<unknown[]>(`${BASE}/todos/revision`, { signal }).then(arr => arr.map(normalizeTodo)),

  createTodo: (data: NewTodo) =>
    request<unknown>(`${BASE}/todos`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }).then(normalizeTodo),

  updateTodo: (data: Todo) =>
    request<unknown>(`${BASE}/todos/${data.id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }).then(normalizeTodo),

  markReviewed: (id: string) =>
    request<unknown>(`${BASE}/todos/${id}/mark-reviewed`, { method: 'POST' }).then(normalizeTodo),

  deleteTodo: (id: string) =>
    request<void>(`${BASE}/todos/${id}`, { method: 'DELETE' }),
}
