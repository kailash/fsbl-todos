import type { StatsResponse } from '@/lib/api'

interface Props {
  stats: StatsResponse | null
}

const TILES = [
  {
    key: 'reviewedToday' as const,
    label: 'Reviewed today',
    format: (v: number) => String(v),
    gradient: 'from-teal-500/20 to-teal-600/10',
    numCls: 'text-teal-400',
    dot: 'bg-teal-500',
  },
  {
    key: 'currentStreak' as const,
    label: 'Day streak',
    format: (v: number) => (v === 0 ? '0' : `${v}`),
    suffix: 'd',
    gradient: 'from-amber-500/20 to-amber-600/10',
    numCls: 'text-amber-400',
    dot: 'bg-amber-500',
  },
  {
    key: 'activeLearningCount' as const,
    label: 'Active',
    format: (v: number) => String(v),
    gradient: 'from-violet-500/20 to-violet-600/10',
    numCls: 'text-violet-400',
    dot: 'bg-violet-500',
  },
  {
    key: 'masteredCount' as const,
    label: 'Mastered',
    format: (v: number) => String(v),
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    numCls: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
]

export function StatsBar({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TILES.map(({ key, label, format, suffix, gradient, numCls, dot }) => {
        const raw = stats?.[key] ?? 0
        const display = format(Number(raw))
        return (
          <div
            key={key}
            className={`bg-gradient-to-br ${gradient} border border-white/5 rounded-xl px-3 py-3`}
          >
            <div className="flex items-baseline gap-0.5">
              <span className={`text-2xl font-black leading-none ${numCls}`}>{display}</span>
              {suffix && <span className={`text-sm font-bold ${numCls} opacity-70`}>{suffix}</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
              <span className="text-[11px] text-slate-500 font-medium">{label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
