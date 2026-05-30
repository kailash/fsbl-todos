import { useState, useEffect, useCallback } from 'react'
import { Todo, NewTodo } from '../types/todo'
import { api } from '../lib/api'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      setTodos(await api.getPendingTodos(signal))
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

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

  return { todos, loading, error, mutationError, addTodo, updateTodo, markComplete, deleteTodo }
}
