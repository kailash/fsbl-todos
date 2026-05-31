import { useReducer, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { Todo, NewTodo } from '@/types/todo'

interface State {
  learningSchedule: Todo[]
  newLearning: Todo[]
  tasks: Todo[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; schedule: Todo[]; newL: Todo[]; taskList: Todo[] }
  | { type: 'FETCH_ERROR'; message: string }

const initial: State = {
  learningSchedule: [],
  newLearning: [],
  tasks: [],
  loading: true,
  error: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return {
        loading: false,
        error: null,
        learningSchedule: action.schedule,
        newLearning: action.newL,
        tasks: action.taskList,
      }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.message }
  }
}

export function useAllTodos() {
  const [state, dispatch] = useReducer(reducer, initial)
  const [refreshKey, setRefreshKey] = useReducerCount()

  const reload = useCallback(() => setRefreshKey(), [setRefreshKey])

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'FETCH_START' })

    Promise.all([api.getLearningSchedule(), api.getNewLearning(), api.getTasksAndReminders()])
      .then(([schedule, newL, taskList]) => {
        if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', schedule, newL, taskList })
      })
      .catch((err) => {
        if (!cancelled) dispatch({ type: 'FETCH_ERROR', message: err.message ?? 'Failed to load' })
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const addTodo = useCallback(
    async (data: NewTodo) => {
      await api.createTodo(data)
      reload()
    },
    [reload]
  )
  const updateTodo = useCallback(
    async (todo: Todo) => {
      await api.updateTodo(todo)
      reload()
    },
    [reload]
  )
  const deleteTodo = useCallback(
    async (id: string) => {
      await api.deleteTodo(id)
      reload()
    },
    [reload]
  )
  const markReviewed = useCallback(
    async (id: string) => {
      await api.markReviewed(id)
      reload()
    },
    [reload]
  )
  const markMastered = useCallback(
    async (id: string) => {
      await api.masterTodo(id)
      reload()
    },
    [reload]
  )
  const closeTodo = useCallback(
    async (id: string) => {
      await api.closeTodo(id)
      reload()
    },
    [reload]
  )
  const setReminder = useCallback(
    async (id: string, date: string) => {
      await api.setReminder(id, date)
      reload()
    },
    [reload]
  )

  return {
    ...state,
    reload,
    addTodo,
    updateTodo,
    deleteTodo,
    markReviewed,
    markMastered,
    closeTodo,
    setReminder,
  }
}

function useReducerCount(): [number, () => void] {
  const [count, dispatch] = useReducer((n: number) => n + 1, 0)
  return [count, dispatch]
}
