import { useState, useRef } from 'react'
import { Briefcase, User, CalendarDays, BookOpen, Plus, ChevronDown } from 'lucide-react'
import type { NewTodo, Category } from '@/types/todo'
import { cn } from '@/lib/utils'

interface Props {
  onAdd: (data: NewTodo) => Promise<void>
}

const CATEGORIES: {
  key: Category
  label: string
  icon: React.ElementType
  active: string
  idle: string
}[] = [
  {
    key: 'PERSONAL',
    label: 'Personal',
    icon: User,
    active: 'bg-emerald-500 text-white border-emerald-500',
    idle: 'border-emerald-600/50 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-500',
  },
  {
    key: 'WORK',
    label: 'Work',
    icon: Briefcase,
    active: 'bg-red-500 text-white border-red-500',
    idle: 'border-red-500/50 text-red-500 dark:border-red-400/30 dark:text-red-400',
  },
  {
    key: 'FUTURE',
    label: 'Future',
    icon: CalendarDays,
    active: 'bg-blue-500 text-white border-blue-500',
    idle: 'border-blue-500/50 text-blue-500 dark:border-blue-400/30 dark:text-blue-400',
  },
  {
    key: 'LEARNING',
    label: 'Learning',
    icon: BookOpen,
    active: 'bg-violet-500 text-white border-violet-500',
    idle: 'border-violet-500/50 text-violet-600 dark:border-violet-400/30 dark:text-violet-400',
  },
]

const EMPTY: NewTodo = {
  title: '',
  categories: ['LEARNING'],
  description: '',
  reminderDate: undefined,
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function AddTodo({ onAdd }: Props) {
  const [form, setForm] = useState<NewTodo>({ ...EMPTY })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showDescription, setShowDescription] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isLearning = form.categories.includes('LEARNING')
  const descWords = wordCount(form.description ?? '')
  const overWordLimit = descWords > 200

  const toggle = (key: Category) =>
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(key)
        ? prev.categories.filter((c) => c !== key)
        : [...prev.categories, key],
    }))

  const submit = async () => {
    if (!form.title.trim() || submitting || overWordLimit) return
    try {
      setSubmitError(null)
      setSubmitting(true)
      await onAdd({
        ...form,
        title: form.title.trim(),
        description: form.description || undefined,
        reminderDate: form.reminderDate || undefined,
      })
      setForm({ ...EMPTY })
      setShowDescription(false)
      textareaRef.current?.focus()
    } catch {
      setSubmitError('Failed to add task.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/8 shadow-sm dark:shadow-none overflow-hidden">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="flex items-start gap-2.5 px-4 pt-3.5 pb-3 border-b border-slate-100 dark:border-white/5">
          <Plus size={18} className="text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5" />
          <textarea
            ref={textareaRef}
            rows={1}
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to learn?"
            className="flex-1 resize-none border-none outline-none bg-transparent text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 leading-relaxed"
          />
        </div>

        {/* Description */}
        <div className="px-4 py-2">
          {!showDescription ? (
            <button
              type="button"
              onClick={() => setShowDescription(true)}
              className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-violet-400 transition-colors"
            >
              <ChevronDown size={12} />
              Add description
            </button>
          ) : (
            <div>
              <textarea
                rows={2}
                value={form.description ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description…"
                className="w-full resize-none border border-slate-200 dark:border-white/8 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-400 dark:focus:border-violet-500/50 bg-transparent transition-colors"
              />
              <p
                className={cn(
                  'text-right text-[10px] font-medium mt-0.5',
                  overWordLimit ? 'text-red-500' : 'text-slate-400 dark:text-slate-600'
                )}
              >
                {descWords}/200 words
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-3.5 flex flex-col gap-2.5">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(({ key, label, icon: Icon, active, idle }) => {
              const isActive = form.categories.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150',
                    isActive ? active : `bg-transparent ${idle}`
                  )}
                >
                  <Icon size={11} strokeWidth={2.5} />
                  {label}
                </button>
              )
            })}
          </div>

          {isLearning ? (
            <p className="text-[11px] text-violet-500 dark:text-violet-400 font-medium flex items-center gap-1">
              <BookOpen size={11} />
              Scheduled with spaced repetition
            </p>
          ) : (
            <label className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500">
              <span>Remind on</span>
              <input
                type="date"
                value={form.reminderDate ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, reminderDate: e.target.value || undefined }))
                }
                className="border border-slate-200 dark:border-white/10 rounded-md px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-400 dark:focus:border-violet-500/50 bg-transparent transition-colors"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={!form.title.trim() || submitting || overWordLimit}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-violet-900/30"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Task
          </button>
        </div>
      </form>
      {submitError && <p className="px-4 pb-3 text-xs text-red-400">{submitError}</p>}
    </div>
  )
}
