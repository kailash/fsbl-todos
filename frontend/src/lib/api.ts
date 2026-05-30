import { Todo, NewTodo } from '../types/todo'

const BASE = 'http://localhost:8080/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export const api = {
  getPendingTodos: () =>
    request<Todo[]>(`${BASE}/todos/pending`),

  getRevisionList: () =>
    request<Todo[]>(`${BASE}/todos/revision`),

  createTodo: (data: NewTodo) =>
    request<Todo>(`${BASE}/todos/`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),

  updateTodo: (data: Todo) =>
    request<Todo>(`${BASE}/todos/${data.id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),

  markReviewed: (data: Todo) =>
    request<Todo>(`${BASE}/todos/updateitr/${data.id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),

  deleteTodo: (id: string) =>
    request<void>(`${BASE}/todos/${id}`, { method: 'DELETE' }),
}
