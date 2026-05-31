interface Props {
  weeklyActivity: number[] // 7 values, oldest = index 0, today = index 6
  streak: number
}

export function WeeklyStreakGraph({ weeklyActivity, streak }: Props) {
  const maxVal = Math.max(...weeklyActivity, 1)
  const BAR_HEIGHT = 44

  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toLocaleDateString('en', { weekday: 'narrow' })
  })

  return (
    <div className="px-4 pb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest">
          Weekly Activity
        </p>
        {streak > 0 && <span className="text-[11px] font-bold text-amber-500">🔥 {streak}d</span>}
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1.5" style={{ height: `${BAR_HEIGHT}px` }}>
        {weeklyActivity.map((count, i) => {
          const isToday = i === 6
          const pct = count > 0 ? Math.max(count / maxVal, 0.2) : 0.15
          return (
            <div
              key={i}
              className="flex-1 flex items-end"
              style={{ height: `${BAR_HEIGHT}px` }}
              title={`${count} review${count !== 1 ? 's' : ''}`}
            >
              <div
                className={`w-full rounded-sm transition-all duration-300 ${
                  isToday
                    ? 'bg-violet-500'
                    : count > 0
                      ? 'bg-violet-300 dark:bg-violet-700'
                      : 'bg-slate-200 dark:bg-slate-700'
                }`}
                style={{ height: `${pct * BAR_HEIGHT}px` }}
              />
            </div>
          )
        })}
      </div>

      {/* Day labels */}
      <div className="flex gap-1.5 mt-1.5">
        {dayLabels.map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-[10px] font-semibold ${
              i === 6 ? 'text-violet-500' : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
