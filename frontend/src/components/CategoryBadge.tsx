import { Briefcase, User, CalendarDays, BookOpen } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import type { Category } from '@/types/todo'

type CategoryLower = 'work' | 'personal' | 'future' | 'learning'

const CONFIG: Record<CategoryLower, { icon: React.ElementType; label: string; cls: string }> = {
  work:     { icon: Briefcase,    label: 'Work',     cls: 'bg-red-50 text-red-600' },
  personal: { icon: User,         label: 'Personal', cls: 'bg-emerald-50 text-emerald-600' },
  future:   { icon: CalendarDays, label: 'Future',   cls: 'bg-blue-50 text-blue-600' },
  learning: { icon: BookOpen,     label: 'Learning', cls: 'bg-violet-50 text-violet-600' },
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
          className={`inline-flex items-center justify-center w-[22px] h-[22px] rounded-[6px] cursor-default ${cls}`}
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
      {categories.includes('WORK')     && <Badge category="work" />}
      {categories.includes('PERSONAL') && <Badge category="personal" />}
      {categories.includes('FUTURE')   && <Badge category="future" />}
      {categories.includes('LEARNING') && <Badge category="learning" />}
    </div>
  )
}
