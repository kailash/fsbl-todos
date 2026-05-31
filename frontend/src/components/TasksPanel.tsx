import { useState } from 'react'
import { ListChecks, ChevronDown, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { TodoItem } from './TodoItem'
import { cn } from '@/lib/utils'
import type { Todo } from '@/types/todo'

const ITEMS_PER_PAGE = 5

interface Props {
  todos: Todo[]
  loading: boolean
  onClose: (id: string) => void
  onRemind: (id: string, date: string) => void
  onUpdate: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TasksPanel({ todos, loading, onClose, onRemind, onUpdate, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [page, setPage] = useState(0)
  const today = new Date().toISOString().slice(0, 10)

  const totalPages = Math.ceil(todos.length / ITEMS_PER_PAGE)
  const paginated = todos.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <section className="overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
      <button
        className="w-full bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-4 flex items-center gap-3 text-left"
        onClick={() => setIsOpen((p) => !p)}
      >
        <div className="w-8 h-8 bg-white/15 flex items-center justify-center flex-shrink-0">
          <ListChecks size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-[15px] font-bold text-white leading-tight">Tasks &amp; Reminders</h2>
          <p className="text-[11px] text-slate-300/60 font-medium">
            Close when done or set a reminder
          </p>
        </div>
        <span className="text-sm font-black text-white bg-white/20 px-3 py-1 min-w-[32px] text-center rounded-full">
          {todos.length}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'text-white/70 transition-transform duration-200 flex-shrink-0',
            isOpen ? 'rotate-0' : '-rotate-90'
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="bg-white dark:bg-[#18181f] py-2">
            {loading ? (
              <p className="text-sm text-slate-400 py-6 text-center">Loading…</p>
            ) : todos.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-slate-400 dark:text-slate-600">
                <CheckCheck size={28} strokeWidth={1.5} />
                <p className="text-sm font-medium">No tasks</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginated.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      variant="task"
                      onToggle={() => onClose(todo.id)}
                      onClose={onClose}
                      onRemind={onRemind}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      isDueToday={todo.reminderDate === today}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-2 pt-3 pb-1 mx-4 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 hover:bg-slate-100 dark:hover:bg-white/8"
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 hover:bg-slate-100 dark:hover:bg-white/8"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
