import { useState, useEffect } from 'react'
import { api, type StatsResponse } from '@/lib/api'

export function useStats(refreshKey: number) {
  const [stats, setStats] = useState<StatsResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .getStats()
      .then((s) => {
        if (!cancelled) setStats(s)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return stats
}
