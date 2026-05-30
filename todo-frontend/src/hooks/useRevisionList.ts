import { useState, useEffect, useCallback } from 'react'
import { Todo } from '../types/todo'
import { api } from '../lib/api'

export function useRevisionList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setTodos(await api.getRevisionList())
    } catch {
      setError('Failed to load revision list')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const markReviewed = async (todo: Todo) => {
    const updated = { ...todo, completed: !todo.completed }
    await api.updateTodo(updated)
    setTodos(prev => prev.filter(t => t.id !== todo.id))
  }

  const updateTodo = async (todo: Todo) => {
    const updated = await api.updateTodo(todo)
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const deleteTodo = async (id: string) => {
    await api.deleteTodo(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return { todos, loading, error, markReviewed, updateTodo, deleteTodo }
}
