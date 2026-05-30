import { useState, useEffect, useCallback } from 'react'
import { Todo, NewTodo } from '../types/todo'
import { api } from '../lib/api'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setTodos(await api.getPendingTodos())
    } catch {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addTodo = async (data: NewTodo) => {
    const created = await api.createTodo(data)
    setTodos(prev => [created, ...prev])
  }

  const updateTodo = async (todo: Todo) => {
    const updated = await api.updateTodo(todo)
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const markComplete = async (todo: Todo) => {
    const updated = { ...todo, completed: !todo.completed }
    await api.markReviewed(updated)
    setTodos(prev => prev.filter(t => t.id !== todo.id))
  }

  const deleteTodo = async (id: string) => {
    await api.deleteTodo(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return { todos, loading, error, addTodo, updateTodo, markComplete, deleteTodo }
}
