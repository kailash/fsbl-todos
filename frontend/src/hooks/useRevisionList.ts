import { useState, useEffect } from 'react'
import { Todo } from '../types/todo'
import { api } from '../lib/api'

export function useRevisionList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const reload = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.getRevisionList()
        if (!cancelled) setTodos(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load revision list')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const markReviewed = async (todo: Todo) => {
    try {
      setMutationError(null)
      await api.markReviewed(todo.id)
      setTodos((prev) => prev.filter((t) => t.id !== todo.id))
    } catch {
      setMutationError('Failed to mark as reviewed')
    }
  }

  const updateTodo = async (todo: Todo) => {
    try {
      setMutationError(null)
      const updated = await api.updateTodo(todo)
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch {
      setMutationError('Failed to update task')
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      setMutationError(null)
      await api.deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch {
      setMutationError('Failed to delete task')
    }
  }

  const closeRevisionTodo = async (id: string) => {
    try {
      setMutationError(null)
      await api.closeTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch {
      setMutationError('Failed to close task')
    }
  }

  const snoozeRevisionTodo = async (id: string, date: string) => {
    try {
      setMutationError(null)
      await api.setReminder(id, date)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch {
      setMutationError('Failed to snooze task')
    }
  }

  return {
    todos,
    loading,
    error,
    mutationError,
    reload,
    markReviewed,
    updateTodo,
    deleteTodo,
    closeRevisionTodo,
    snoozeRevisionTodo,
  }
}
