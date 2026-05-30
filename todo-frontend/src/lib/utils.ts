import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRevisionDate(date: string | number[] | undefined): string | null {
  if (!date) return null
  let d: Date
  if (Array.isArray(date)) {
    const [year, month, day] = date as number[]
    d = new Date(year, month - 1, day)
  } else {
    d = new Date(date)
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
