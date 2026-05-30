import { useState } from 'react'
import { Zap } from 'lucide-react'
import { AddTodo } from './components/AddTodo'
import { TodoList } from './components/TodoList'
import { RevisionList } from './components/RevisionList'
import { ToastContainer, type ToastMessage, type ToastType } from './components/Toast'
import { useTodos } from './hooks/useTodos'
import { useRevisionList } from './hooks/useRevisionList'
import type { Todo, Category, NewTodo } from './types/todo'

let toastId = 0

const FILTER_LABELS: { key: Category; label: string; cls: string; activeCls: string }[] = [
  { key: 'PERSONAL', label: 'Personal', cls: 'border-emerald-400 text-emerald-700', activeCls: 'bg-emerald-500 text-white border-emerald-500' },
  { key: 'WORK',     label: 'Work',     cls: 'border-red-400 text-red-700',         activeCls: 'bg-red-500 text-white border-red-500' },
  { key: 'FUTURE',   label: 'Future',   cls: 'border-blue-400 text-blue-700',       activeCls: 'bg-blue-500 text-white border-blue-500' },
  { key: 'LEARNING', label: 'Learning', cls: 'border-violet-400 text-violet-700',   activeCls: 'bg-violet-500 text-white border-violet-500' },
]

export default function App() {
  const { todos, loading, error, mutationError, reload, addTodo, updateTodo, markComplete, deleteTodo } = useTodos()
  const {
    todos: revTodos,
    loading: revLoading,
    error: revError,
    mutationError: revMutationError,
    reload: revReload,
    markReviewed,
    updateTodo: updateRevTodo,
    deleteTodo: deleteRevTodo,
  } = useRevisionList()

  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [activeFilter, setActiveFilter] = useState<Category | null>(null)

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
  }

  const dismissToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  const filterTodos = (list: Todo[]) =>
    activeFilter ? list.filter(t => t.categories.includes(activeFilter)) : list

  const handleAddTodo = async (data: NewTodo) => {
    await addTodo(data)
    addToast('Task added')
  }

  const handleMarkComplete = async (todo: Todo) => {
    await markComplete(todo)
    addToast('Task completed')
  }

  const handleUpdateTodo = async (todo: Todo) => {
    await updateTodo(todo)
    addToast('Task updated')
  }

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id)
    addToast('Task deleted')
  }

  const handleMarkReviewed = async (todo: Todo) => {
    await markReviewed(todo)
    addToast('Marked as reviewed')
  }

  const handleUpdateRevTodo = async (todo: Todo) => {
    await updateRevTodo(todo)
    addToast('Task updated')
  }

  const handleDeleteRevTodo = async (id: string) => {
    await deleteRevTodo(id)
    addToast('Task deleted')
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Header */}
      <header className="bg-zinc-900 sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={19} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-white text-base font-bold tracking-wide leading-tight">FSBL</span>
              <span className="text-zinc-500 text-[11px] font-normal leading-tight">Fibonacci Spaced Learning</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-7 flex flex-col gap-5">
        <AddTodo onAdd={handleAddTodo} />

        {/* Category filter chips */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
              activeFilter === null
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
            }`}
          >
            All
          </button>
          {FILTER_LABELS.map(({ key, label, cls, activeCls }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(prev => prev === key ? null : key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                activeFilter === key ? activeCls : `bg-white ${cls} hover:opacity-80`
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-5 items-start flex-col md:flex-row">
          <div className="flex-1 min-w-0 w-full order-last md:order-first">
            <TodoList
              todos={filterTodos(todos)}
              loading={loading}
              error={error}
              mutationError={mutationError}
              reload={reload}
              onToggle={handleMarkComplete}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          </div>
          <div className="flex-1 min-w-0 w-full order-first md:order-last">
            <RevisionList
              todos={filterTodos(revTodos)}
              loading={revLoading}
              error={revError}
              mutationError={revMutationError}
              reload={revReload}
              onMarkReviewed={handleMarkReviewed}
              onUpdate={handleUpdateRevTodo}
              onDelete={handleDeleteRevTodo}
            />
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
