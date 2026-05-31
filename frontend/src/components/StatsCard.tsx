import { Flame, CheckCircle2, BookOpen, Trophy } from 'lucide-react'
import { Tip } from '@/components/ui/tooltip'
import type { StatsResponse } from '@/lib/api'

interface Props {
  stats: StatsResponse | null
}

export function StatsCard({ stats }: Props) {
  const tiles = [
    {
      icon: CheckCircle2,
      label: 'Reviewed today',
      tip: 'Number of learning items you have reviewed today',
      value: stats?.reviewedToday ?? 0,
      suffix: '',
      cardBg: 'bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-[#18181f]',
      border: 'border-teal-100 dark:border-teal-800/40',
      mark: 'text-teal-500',
      num: 'text-teal-700 dark:text-teal-300',
    },
    {
      icon: Flame,
      label: 'Day streak',
      tip: 'Consecutive days you have reviewed at least one item',
      value: stats?.currentStreak ?? 0,
      suffix: stats?.currentStreak ? 'd' : '',
      cardBg: 'bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-[#18181f]',
      border: 'border-amber-100 dark:border-amber-800/40',
      mark: 'text-amber-500',
      num: 'text-amber-700 dark:text-amber-300',
    },
    {
      icon: BookOpen,
      label: 'In rotation',
      tip: 'Active learning items currently scheduled for spaced repetition',
      value: stats?.activeLearningCount ?? 0,
      suffix: '',
      cardBg: 'bg-gradient-to-br from-violet-50 to-white dark:from-violet-900/20 dark:to-[#18181f]',
      border: 'border-violet-100 dark:border-violet-800/40',
      mark: 'text-violet-500',
      num: 'text-violet-700 dark:text-violet-300',
    },
    {
      icon: Trophy,
      label: 'Mastered',
      tip: 'Items you have graduated — reviewed enough times to consider mastered',
      value: stats?.masteredCount ?? 0,
      suffix: '',
      cardBg:
        'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-[#18181f]',
      border: 'border-emerald-100 dark:border-emerald-800/40',
      mark: 'text-emerald-500',
      num: 'text-emerald-700 dark:text-emerald-300',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {tiles.map(({ icon: Icon, label, tip, value, suffix, cardBg, border, mark, num }) => (
        <Tip key={label} label={tip}>
          <div
            className={`relative overflow-hidden rounded-xl border ${border} ${cardBg} px-4 py-4 cursor-default`}
          >
            <Icon
              size={76}
              strokeWidth={1.2}
              className={`absolute right-2 -bottom-4 ${mark} opacity-20 pointer-events-none select-none`}
            />
            <div className="relative z-10">
              <div className={`text-[1.85rem] font-black leading-none tracking-tight ${num}`}>
                {value}
                {suffix}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-tight">
                {label}
              </div>
            </div>
          </div>
        </Tip>
      ))}
    </div>
  )
}
