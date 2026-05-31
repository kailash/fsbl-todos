import { Moon, Sun, Archive, Zap, Search } from 'lucide-react'
import { AddTodo } from './AddTodo'
import { WeeklyStreakGraph } from './WeeklyStreakGraph'
import { Tip } from '@/components/ui/tooltip'
import type { StatsResponse } from '@/lib/api'
import type { NewTodo } from '@/types/todo'

interface Props {
  isDark: boolean
  onToggleDark: () => void
  onAdd: (data: NewTodo) => Promise<void>
  onArchive: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  stats: StatsResponse | null
}

export function Sidebar({
  isDark,
  onToggleDark,
  onAdd,
  onArchive,
  searchQuery,
  onSearchChange,
  stats,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo strip */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-200">
            <Zap size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[15px] font-black text-slate-900 dark:text-white tracking-wide leading-tight">
              FSBL
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight font-medium">
              Fibonacci Spaced Learning
            </div>
          </div>
        </div>
        <Tip label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </Tip>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search todos…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-8 pr-3 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white dark:focus:bg-slate-700 transition-all"
          />
        </div>
      </div>

      {/* Add todo form */}
      <div className="px-4 py-2">
        <AddTodo onAdd={onAdd} />
      </div>

      {/* Weekly streak graph */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
        <WeeklyStreakGraph
          weeklyActivity={stats?.weeklyActivity ?? [0, 0, 0, 0, 0, 0, 0]}
          streak={stats?.currentStreak ?? 0}
        />
      </div>

      {/* Archive link */}
      <div className="mt-auto border-t border-slate-100 dark:border-slate-800 px-4 pb-5 pt-4">
        <Tip label="View completed and archived todos">
          <button
            onClick={onArchive}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-150"
          >
            <Archive size={15} />
            <span className="font-medium">View Archive</span>
          </button>
        </Tip>
      </div>
    </div>
  )
}
