import { Todo, NewTodo } from '../types/todo'

const BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080') + '/api'

async function request<T>(
  url: string,
  options?: RequestInit & { signal?: AbortSignal }
): Promise<T> {
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
  if (Array.isArray(d) && d.length === 3 && d.every((x) => typeof x === 'number')) {
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
    description: r.description as string | undefined,
    reminderDate: toISODate(r.reminderDate),
    lastReviewedAt: toISODate(r.lastReviewedAt),
    mastered: r.mastered as boolean | undefined,
  }
}

export interface StatsResponse {
  reviewedToday: number
  currentStreak: number
  activeLearningCount: number
  masteredCount: number
  weeklyActivity: number[]
}

export interface ArchiveResponse {
  masteredItems: Todo[]
  closedTasks: Todo[]
}

export const api = {
  getPendingTodos: (signal?: AbortSignal) =>
    request<unknown[]>(`${BASE}/todos/pending`, { signal }).then((arr) => arr.map(normalizeTodo)),

  getRevisionList: (signal?: AbortSignal) =>
    request<unknown[]>(`${BASE}/todos/revision`, { signal }).then((arr) => arr.map(normalizeTodo)),

  getLearningSchedule: (signal?: AbortSignal) =>
    request<unknown[]>(`${BASE}/todos/learning/schedule`, { signal }).then((arr) =>
      arr.map(normalizeTodo)
    ),

  getNewLearning: (signal?: AbortSignal) =>
    request<unknown[]>(`${BASE}/todos/learning/new`, { signal }).then((arr) =>
      arr.map(normalizeTodo)
    ),

  getTasksAndReminders: (signal?: AbortSignal) =>
    request<unknown[]>(`${BASE}/todos/tasks`, { signal }).then((arr) => arr.map(normalizeTodo)),

  masterTodo: (id: string): Promise<Todo> =>
    request<unknown>(`${BASE}/todos/${id}/master`, { method: 'POST' }).then(normalizeTodo),

  getStats: (signal?: AbortSignal) => request<StatsResponse>(`${BASE}/stats`, { signal }),

  getArchive: (signal?: AbortSignal) =>
    request<ArchiveResponse>(`${BASE}/todos/archive`, { signal }),

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

  deleteTodo: (id: string) => request<void>(`${BASE}/todos/${id}`, { method: 'DELETE' }),

  closeTodo: (id: string): Promise<void> =>
    request<void>(`${BASE}/todos/${id}/close`, { method: 'POST' }),

  setReminder: (id: string, remindOn: string): Promise<Todo> =>
    request<unknown>(`${BASE}/todos/${id}/remind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remindOn }),
    }).then(normalizeTodo),
}
