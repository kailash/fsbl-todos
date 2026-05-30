import { useState, useEffect, useCallback } from 'react'
import { Todo } from '../types/todo'
import { api } from '../lib/api'

export function useRevisionList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      setTodos(await api.getRevisionList(signal))
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('Failed to load revision list')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  const markReviewed = async (todo: Todo) => {
    try {
      setMutationError(null)
      await api.markReviewed(todo.id)
      setTodos(prev => prev.filter(t => t.id !== todo.id))
    } catch {
      setMutationError('Failed to mark as reviewed')
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

  const deleteTodo = async (id: string) => {
    try {
      setMutationError(null)
      await api.deleteTodo(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch {
      setMutationError('Failed to delete task')
    }
  }

  return { todos, loading, error, mutationError, markReviewed, updateTodo, deleteTodo }
}
