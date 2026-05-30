import { RefreshCw, CheckCircle } from 'lucide-react'
import { TodoItem } from './TodoItem'
import type { Todo } from '@/types/todo'

interface Props {
  todos: Todo[]
  loading: boolean
  error: string | null
  onMarkReviewed: (todo: Todo) => void
  onUpdate: (todo: Todo) => void
  onDelete: (id: string) => void
}

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric',
})

export function RevisionList({ todos, loading, error, onMarkReviewed, onUpdate, onDelete }: Props) {
  return (
    <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
          <RefreshCw size={17} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[15px] font-bold text-slate-900 leading-tight">Review Today</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{today}</p>
        </div>
      </div>
      <div className="mx-5 h-px bg-slate-50" />

      {/* Body */}
      <div className="px-5 pt-2 pb-4">
        {loading && (
          <p className="text-sm text-slate-400 py-10 text-center">Loading…</p>
        )}
        {!loading && error && (
          <p className="text-sm text-red-500 py-10 text-center">{error}</p>
        )}
        {!loading && !error && todos.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <CheckCircle size={36} className="mx-auto mb-2 text-slate-200" />
            <p className="text-sm font-medium">Nothing to review today!</p>
          </div>
        )}
        {!loading && !error && todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            variant="revision"
            onToggle={onMarkReviewed}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
