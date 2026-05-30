import { useState, useEffect } from 'react'
import { Todo, NewTodo } from '../types/todo'
import { api } from '../lib/api'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const reload = () => setRefreshKey(k => k + 1)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.getPendingTodos()
        if (!cancelled) setTodos(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [refreshKey])

  const addTodo = async (data: NewTodo) => {
    try {
      setMutationError(null)
      const created = await api.createTodo(data)
      setTodos(prev => [created, ...prev])
    } catch {
      setMutationError('Failed to add task')
    }
  }

  const updateTodo = async (todo: Todo) => {
    try {
      setMutationError(null)
      const updated = await api.updateTodo(todo)
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
    } catch {
      setMutationError('Failed to update task')
    }
  }

  const markComplete = async (todo: Todo) => {
    try {
      setMutationError(null)
      await api.markReviewed(todo.id)
      setTodos(prev => prev.filter(t => t.id !== todo.id))
    } catch {
      setMutationError('Failed to mark task complete')
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      setMutationError(null)
      await api.deleteTodo(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch {
      setMutationError('Failed to delete task')
    }
  }

  return { todos, loading, error, mutationError, reload, addTodo, updateTodo, markComplete, deleteTodo }
}
