import { useState, useEffect } from 'react'
import { Pencil, Trash2, Check, X, CheckCircle2, Circle, RotateCcw, Clock } from 'lucide-react'
import { CategoryBadges } from './CategoryBadge'
import { formatRevisionDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Todo } from '@/types/todo'

interface Props {
  todo: Todo
  variant: 'pending' | 'revision'
  onToggle: (todo: Todo) => void
  onUpdate: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, variant, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    if (!confirmingDelete) return
    const timer = setTimeout(() => setConfirmingDelete(false), 3000)
    return () => clearTimeout(timer)
  }, [confirmingDelete])

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (trimmed) {
      onUpdate({ ...todo, title: trimmed })
      setEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setEditTitle(todo.title); setEditing(false) }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 py-2.5 border-b border-slate-50 last:border-0">
        <input
          aria-label={`Edit: ${todo.title}`}
          className="flex-1 h-9 px-3 text-sm border border-indigo-500 rounded-lg outline-none font-medium text-slate-900 bg-white"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
        >
          <Check size={15} />
        </button>
        <button
          onClick={() => { setEditTitle(todo.title); setEditing(false) }}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X size={15} />
        </button>
      </div>
    )
  }

  const revisionDate = formatRevisionDate(todo.nextRevisionDate)

  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-slate-50 last:border-0 group">
      {/* Toggle button */}
      <button
        onClick={() => onToggle(todo)}
        aria-label={variant === 'revision' ? 'Mark as reviewed — schedules next spaced review' : 'Mark complete'}
        aria-pressed={todo.completed}
        title={variant === 'revision' ? 'Mark as reviewed — schedules next spaced review' : 'Mark complete'}
        className={cn(
          'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors mt-0.5',
          variant === 'revision'
            ? 'text-slate-300 hover:text-teal-500 hover:bg-teal-50'
            : todo.completed
              ? 'text-emerald-500'
              : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50'
        )}
      >
        {variant === 'revision'
          ? <RotateCcw size={16} />
          : todo.completed
            ? <CheckCircle2 size={18} />
            : <Circle size={18} />}
      </button>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <span className={`block text-sm font-medium leading-snug break-words ${
          todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
        }`}>
          {todo.title}
        </span>
        <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
          <CategoryBadges categories={todo.categories} />
          {variant === 'pending' && revisionDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Clock size={11} />
              {revisionDate}
            </span>
          )}
          {variant === 'revision' && todo.revisionIteration !== undefined && (
            <span
              title={`This is review #${todo.revisionIteration}. More reviews = stronger memory retention.`}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 uppercase tracking-wide cursor-help"
            >
              Review #{todo.revisionIteration}
            </span>
          )}
        </div>
      </div>

      {/* Actions — reveal on hover/focus-within */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex-shrink-0">
        <button
          aria-label="Edit task"
          onClick={() => { setEditTitle(todo.title); setEditing(true) }}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <Pencil size={14} />
        </button>
        {confirmingDelete ? (
          <button
            aria-label="Confirm delete"
            onClick={() => onDelete(todo.id)}
            className="h-7 px-2 rounded-md flex items-center justify-center text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Confirm?
          </button>
        ) : (
          <button
            aria-label="Delete task"
            onClick={() => setConfirmingDelete(true)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
