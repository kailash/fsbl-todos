import { Briefcase, User, CalendarDays, BookOpen, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tip } from '@/components/ui/tooltip'
import type { Category } from '@/types/todo'

const FILTERS: {
  key: Category | 'ALL'
  label: string
  tip: string
  icon: React.ElementType
  active: string
  idle: string
}[] = [
  {
    key: 'ALL',
    label: 'All',
    tip: 'Show all items across every category',
    icon: LayoutGrid,
    active:
      'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-800 dark:border-slate-100',
    idle: 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200',
  },
  {
    key: 'LEARNING',
    label: 'Learning',
    tip: 'Show only items tagged as Learning',
    icon: BookOpen,
    active: 'bg-violet-600 text-white border-violet-600',
    idle: 'border-violet-400/50 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 hover:border-violet-500',
  },
  {
    key: 'WORK',
    label: 'Work',
    tip: 'Show only items tagged as Work',
    icon: Briefcase,
    active: 'bg-red-500 text-white border-red-500',
    idle: 'border-red-400/50 dark:border-red-400/30 text-red-500 dark:text-red-400 hover:border-red-400',
  },
  {
    key: 'PERSONAL',
    label: 'Personal',
    tip: 'Show only items tagged as Personal',
    icon: User,
    active: 'bg-emerald-500 text-white border-emerald-500',
    idle: 'border-emerald-500/50 dark:border-emerald-400/30 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500',
  },
  {
    key: 'FUTURE',
    label: 'Future',
    tip: 'Show only items tagged as Future',
    icon: CalendarDays,
    active: 'bg-blue-500 text-white border-blue-500',
    idle: 'border-blue-400/50 dark:border-blue-400/30 text-blue-500 dark:text-blue-400 hover:border-blue-400',
  },
]

interface Props {
  active: Category | 'ALL'
  onChange: (cat: Category | 'ALL') => void
}

export function FilterBar({ active, onChange }: Props) {
  return (
    <div className="bg-white dark:bg-[#18181f] border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pr-1">
        Filter
      </span>
      {FILTERS.map(({ key, label, tip, icon: Icon, active: activeClass, idle }) => (
        <Tip key={key} label={tip}>
          <button
            onClick={() => onChange(key)}
            className={cn(
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150',
              active === key ? activeClass : `bg-transparent ${idle}`
            )}
          >
            <Icon size={11} strokeWidth={2.5} />
            {label}
          </button>
        </Tip>
      ))}
    </div>
  )
}
