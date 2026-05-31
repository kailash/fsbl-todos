import { Briefcase, User, CalendarDays, BookOpen } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import type { Category } from '@/types/todo'

type CategoryLower = 'work' | 'personal' | 'future' | 'learning'

const CONFIG: Record<CategoryLower, { icon: React.ElementType; label: string; cls: string }> = {
  work: {
    icon: Briefcase,
    label: 'Work',
    cls: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  },
  personal: {
    icon: User,
    label: 'Personal',
    cls: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  },
  future: {
    icon: CalendarDays,
    label: 'Future',
    cls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
  learning: {
    icon: BookOpen,
    label: 'Learning',
    cls: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  },
}

function Badge({ category }: { category: CategoryLower }) {
  const { icon: Icon, label, cls } = CONFIG[category]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="img"
          aria-label={label}
          tabIndex={0}
          className={`inline-flex items-center justify-center w-[22px] h-[22px] cursor-default ${cls}`}
        >
          <Icon size={13} strokeWidth={2.5} />
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

interface Props {
  categories: Category[]
}

export function CategoryBadges({ categories }: Props) {
  return (
    <div className="flex gap-1">
      {categories.includes('WORK') && <Badge category="work" />}
      {categories.includes('PERSONAL') && <Badge category="personal" />}
      {categories.includes('FUTURE') && <Badge category="future" />}
      {categories.includes('LEARNING') && <Badge category="learning" />}
    </div>
  )
}
