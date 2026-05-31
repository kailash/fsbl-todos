import { useState, useEffect, useRef } from 'react'
import {
  Pencil,
  Trash2,
  Check,
  X,
  CheckCircle2,
  Circle,
  RotateCcw,
  Clock,
  Bell,
  Trophy,
} from 'lucide-react'
import { CategoryBadges } from './CategoryBadge'
import { Tip } from '@/components/ui/tooltip'
import { formatRevisionDate, tomorrowISO, nextWeekISO, cn } from '@/lib/utils'
import type { Todo } from '@/types/todo'

interface Props {
  todo: Todo
  variant: 'pending' | 'revision' | 'schedule' | 'new-learning' | 'task'
  onToggle: (todo: Todo) => void
  onUpdate: (todo: Todo) => void
  onDelete: (id: string) => void
  onRemind?: (id: string, date: string) => void
  onClose?: (id: string) => void
  onMaster?: (id: string) => void
  isDueToday?: boolean
}

export function TodoItem({
  todo,
  variant,
  onToggle,
  onUpdate,
  onDelete,
  onRemind,
  onClose,
  onMaster,
  isDueToday,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description ?? '')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [showSnooze, setShowSnooze] = useState(false)
  const [snoozeAbove, setSnoozeAbove] = useState(false)
  const snoozeRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLButtonElement>(null)

  const isLearning = todo.categories.includes('LEARNING')
  const isScheduleVariant = variant === 'schedule'
  const isTaskVariant = variant === 'task'

  useEffect(() => {
    if (!confirmingDelete) return
    const timer = setTimeout(() => setConfirmingDelete(false), 3000)
    return () => clearTimeout(timer)
  }, [confirmingDelete])

  useEffect(() => {
    if (!showSnooze) return
    const handler = (e: MouseEvent) => {
      if (snoozeRef.current && !snoozeRef.current.contains(e.target as Node)) setShowSnooze(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showSnooze])

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (trimmed) {
      onUpdate({ ...todo, title: trimmed, description: editDescription || undefined })
      setEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setEditTitle(todo.title)
      setEditDescription(todo.description ?? '')
      setEditing(false)
    }
  }

  const itemBase =
    'flex items-start gap-3 px-3 py-2.5 transition-all duration-150 hover:bg-slate-50 dark:hover:bg-white/[0.03]'

  if (editing) {
    return (
      <div className={cn(itemBase, 'bg-slate-50 dark:bg-white/[0.03]')}>
        <div className="flex-1 flex flex-col gap-1.5">
          <input
            aria-label={`Edit: ${todo.title}`}
            className="w-full h-9 px-3 text-sm border border-violet-400 outline-none font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <textarea
            rows={2}
            placeholder="Description (optional)"
            className="w-full px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 resize-none focus:border-violet-400 transition-colors"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-colors flex-shrink-0"
        >
          <Check size={14} />
        </button>
        <button
          onClick={() => {
            setEditTitle(todo.title)
            setEditDescription(todo.description ?? '')
            setEditing(false)
          }}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  const revisionDate = formatRevisionDate(todo.nextRevisionDate)
  const showStrikethrough = todo.completed && !isLearning

  // Left-side primary action button
  const renderLeftAction = () => {
    if (isTaskVariant) {
      return (
        <Tip label="Mark as done and close this task">
          <button
            onClick={() => onClose?.(todo.id)}
            aria-label="Close task"
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors mt-px"
          >
            <CheckCircle2 size={16} />
          </button>
        </Tip>
      )
    }

    if (isScheduleVariant) {
      return (
        <Tip label="Mark as reviewed — schedules next spaced repetition review">
          <button
            onClick={() => onToggle(todo)}
            aria-label="Mark as reviewed"
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors mt-px"
          >
            <RotateCcw size={14} />
          </button>
        </Tip>
      )
    }

    return (
      <Tip
        label={
          isLearning
            ? 'Begin your first review session'
            : todo.completed
              ? 'Completed'
              : 'Mark as complete'
        }
      >
        <button
          onClick={() => onToggle(todo)}
          aria-pressed={todo.completed}
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors mt-px',
            todo.completed
              ? 'text-emerald-500'
              : 'text-slate-300 dark:text-slate-600 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
          )}
        >
          {todo.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
        </button>
      </Tip>
    )
  }

  const hasMetadata =
    (isScheduleVariant && (revisionDate || todo.revisionIteration !== undefined)) ||
    (!isLearning && todo.reminderDate)

  return (
    <div className={itemBase}>
      {renderLeftAction()}

      <div className="flex-1 min-w-0">
        {/* Top row: title + inline action buttons */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span
                className={cn(
                  'text-[13px] font-semibold leading-snug',
                  showStrikethrough
                    ? 'line-through text-slate-400 dark:text-slate-600'
                    : 'text-slate-800 dark:text-slate-100'
                )}
              >
                {todo.title}
              </span>
              <CategoryBadges categories={todo.categories} />
              {isDueToday && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white flex-shrink-0">
                  Due today
                </span>
              )}
            </div>
          </div>

          {/* Right-side action buttons — now top-right, always visible */}
          <div className="flex items-center gap-0.5 flex-shrink-0 -mt-0.5">
            {/* Bell / snooze (task only) */}
            {isTaskVariant && onRemind && (
              <div className="relative" ref={snoozeRef}>
                <Tip label="Set a reminder for this task">
                  <button
                    ref={bellRef}
                    onClick={() => {
                      if (!showSnooze && bellRef.current) {
                        const rect = bellRef.current.getBoundingClientRect()
                        setSnoozeAbove(window.innerHeight - rect.bottom < 200)
                      }
                      setShowSnooze((p) => !p)
                    }}
                    aria-label="Set reminder"
                    className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 transition-colors"
                  >
                    <Bell size={12} />
                  </button>
                </Tip>
                {showSnooze && (
                  <div
                    className={`absolute right-0 ${snoozeAbove ? 'bottom-7' : 'top-7'} z-20 bg-white dark:bg-[#1e1e28] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-3 min-w-[160px] flex flex-col gap-1.5`}
                  >
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-0.5">
                      Remind me
                    </p>
                    <button
                      className="text-sm font-medium px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-left"
                      onClick={() => {
                        onRemind(todo.id, tomorrowISO())
                        setShowSnooze(false)
                      }}
                    >
                      Tomorrow
                    </button>
                    <button
                      className="text-sm font-medium px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-left"
                      onClick={() => {
                        onRemind(todo.id, nextWeekISO())
                        setShowSnooze(false)
                      }}
                    >
                      Next week
                    </button>
                    <input
                      type="date"
                      className="text-sm border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-violet-400 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 mt-0.5"
                      onChange={(e) => {
                        if (e.target.value) {
                          onRemind(todo.id, e.target.value)
                          setShowSnooze(false)
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            {/* Trophy / master (schedule only) */}
            {isScheduleVariant && onMaster && (
              <Tip label="Graduate — mark this item as fully mastered">
                <button
                  aria-label="Mark as mastered"
                  onClick={() => onMaster(todo.id)}
                  className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-500 transition-colors"
                >
                  <Trophy size={12} />
                </button>
              </Tip>
            )}
            {/* Edit */}
            <Tip label="Edit title and description">
              <button
                aria-label="Edit task"
                onClick={() => {
                  setEditTitle(todo.title)
                  setEditDescription(todo.description ?? '')
                  setEditing(true)
                }}
                className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Pencil size={12} />
              </button>
            </Tip>
            {/* Delete */}
            {confirmingDelete ? (
              <Tip label="Click again to confirm deletion">
                <button
                  aria-label="Confirm delete"
                  onClick={() => onDelete(todo.id)}
                  className="h-6 px-2 text-[11px] font-bold bg-red-500 text-white hover:bg-red-600 transition-colors rounded"
                >
                  Delete?
                </button>
              </Tip>
            ) : (
              <Tip label="Delete this item permanently">
                <button
                  aria-label="Delete task"
                  onClick={() => setConfirmingDelete(true)}
                  className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </Tip>
            )}
          </div>
        </div>

        {/* Description */}
        {todo.description && (
          <p className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
            {todo.description}
          </p>
        )}

        {/* Metadata row */}
        {hasMetadata && (
          <div className="flex items-center flex-wrap gap-1.5 mt-1">
            {isScheduleVariant && revisionDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                <Clock size={10} />
                {revisionDate}
              </span>
            )}
            {isScheduleVariant && todo.revisionIteration !== undefined && (
              <span
                title={`Review #${todo.revisionIteration}. More reviews = stronger retention.`}
                className="text-[10px] font-bold px-1.5 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 uppercase tracking-wide cursor-help rounded"
              >
                #{todo.revisionIteration}
              </span>
            )}
            {!isLearning && todo.reminderDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-500 dark:text-orange-400">
                <Bell size={10} />
                {formatRevisionDate(todo.reminderDate)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
