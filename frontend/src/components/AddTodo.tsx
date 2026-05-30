import { useState, useRef } from 'react'
import { PlusCircle, Briefcase, User, CalendarDays, BookOpen, Plus } from 'lucide-react'
import type { NewTodo, Category } from '@/types/todo'
import { cn } from '@/lib/utils'

interface Props {
  onAdd: (data: NewTodo) => Promise<void>
}

const CATEGORIES: { key: Category; label: string; icon: React.ElementType; active: string; border: string }[] = [
  { key: 'PERSONAL', label: 'Personal', icon: User,         active: 'bg-emerald-500 text-white border-emerald-500', border: 'border-emerald-500' },
  { key: 'WORK',     label: 'Work',     icon: Briefcase,    active: 'bg-red-500 text-white border-red-500',         border: 'border-red-500' },
  { key: 'FUTURE',   label: 'Future',   icon: CalendarDays, active: 'bg-blue-500 text-white border-blue-500',       border: 'border-blue-500' },
  { key: 'LEARNING', label: 'Learning', icon: BookOpen,     active: 'bg-violet-500 text-white border-violet-500',   border: 'border-violet-500' },
]

const EMPTY: NewTodo = {
  title: '', categories: ['LEARNING'],
}

export function AddTodo({ onAdd }: Props) {
  const [form, setForm] = useState<NewTodo>({ ...EMPTY })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const toggle = (key: Category) =>
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(key)
        ? prev.categories.filter(c => c !== key)
        : [...prev.categories, key],
    }))

  const submit = async () => {
    if (!form.title.trim() || submitting) return
    try {
      setSubmitError(null)
      setSubmitting(true)
      await onAdd({ ...form, title: form.title.trim() })
      setForm({ ...EMPTY })
      textareaRef.current?.focus()
    } catch {
      setSubmitError('Failed to add task. Please try again.')
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
    <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm px-5 py-4">
      <form onSubmit={handleSubmit}>
        {/* Input row */}
        <div className="flex items-start gap-3 pb-3.5 border-b border-slate-50">
          <PlusCircle size={22} className="text-slate-300 flex-shrink-0 mt-0.5" />
          <textarea
            ref={textareaRef}
            rows={1}
            required
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to learn or remember?"
            className="flex-1 resize-none border-none outline-none bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 pt-3">
          {/* Category toggles */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(({ key, label, icon: Icon, active, border }) => {
              const isActive = form.categories.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-[1.5px] transition-all duration-150',
                    isActive ? active : `bg-slate-50 text-slate-500 ${border}`
                  )}
                >
                  <Icon size={13} strokeWidth={2.5} />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.title.trim() || submitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Task
          </button>
        </div>
      </form>
      {submitError && (
        <p className="mt-2 text-sm text-red-500">{submitError}</p>
      )}
    </div>
  )
}
