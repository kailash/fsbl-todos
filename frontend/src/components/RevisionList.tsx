import { RefreshCw, CheckCircle } from 'lucide-react'
import { TodoItem } from './TodoItem'
import type { Todo } from '@/types/todo'

interface Props {
  todos: Todo[]
  loading: boolean
  error: string | null
  mutationError?: string | null
  reload?: () => void
  onMarkReviewed: (todo: Todo) => Promise<void>
  onUpdate: (todo: Todo) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: (id: string) => void
  onSnooze: (id: string, date: string) => void
}

export function RevisionList({
  todos,
  loading,
  error,
  mutationError,
  reload,
  onMarkReviewed,
  onUpdate,
  onDelete,
  onClose,
  onSnooze,
}: Props) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const title = !loading && todos.length > 0 ? `Review Today (${todos.length})` : 'Review Today'

  const learningTodos = todos.filter((t) => t.categories.includes('LEARNING'))
  const reminderTodos = todos.filter((t) => !t.categories.includes('LEARNING'))
  const hasBoth = learningTodos.length > 0 && reminderTodos.length > 0

  const renderTodoItem = (todo: Todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      variant="revision"
      onToggle={onMarkReviewed}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onClose={onClose}
      onRemind={onSnooze}
    />
  )

  return (
    <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
          <RefreshCw size={17} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[15px] font-bold text-slate-900 leading-tight">{title}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{today}</p>
          <p className="text-xs text-slate-400 mt-0.5">Items scheduled for review today</p>
        </div>
      </div>
      <div className="mx-5 h-px bg-slate-50" />

      {/* Body */}
      <div className="px-5 pt-2 pb-4">
        {loading && <p className="text-sm text-slate-400 py-10 text-center">Loading…</p>}
        {!loading && error && (
          <div className="py-10 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            {reload && (
              <button
                onClick={reload}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
              >
                Try again
              </button>
            )}
          </div>
        )}
        {mutationError && <p className="text-sm text-red-500 py-2 text-center">{mutationError}</p>}
        {!loading && !error && todos.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <CheckCircle size={36} className="mx-auto mb-2 text-slate-200" />
            <p className="text-sm font-medium">
              You're all caught up for today. Keep reviewing to build long-term memory.
            </p>
          </div>
        )}
        {!loading &&
          !error &&
          todos.length > 0 &&
          (hasBoth ? (
            <>
              {learningTodos.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-1 mt-1">
                    Spaced Review
                  </p>
                  {learningTodos.map(renderTodoItem)}
                </div>
              )}
              {reminderTodos.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1">
                    Reminders
                  </p>
                  {reminderTodos.map(renderTodoItem)}
                </div>
              )}
            </>
          ) : (
            todos.map(renderTodoItem)
          ))}
      </div>
    </div>
  )
}
