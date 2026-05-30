import { Briefcase, User, CalendarDays, BookOpen } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import type { Todo } from '@/types/todo'

type Category = 'work' | 'personal' | 'future' | 'learning'

const CONFIG: Record<Category, { icon: React.ElementType; label: string; cls: string }> = {
  work:     { icon: Briefcase,    label: 'Work',     cls: 'bg-red-50 text-red-600' },
  personal: { icon: User,         label: 'Personal', cls: 'bg-emerald-50 text-emerald-600' },
  future:   { icon: CalendarDays, label: 'Future',   cls: 'bg-blue-50 text-blue-600' },
  learning: { icon: BookOpen,     label: 'Learning', cls: 'bg-violet-50 text-violet-600' },
}

function Badge({ category }: { category: Category }) {
  const { icon: Icon, label, cls } = CONFIG[category]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex items-center justify-center w-[22px] h-[22px] rounded-[6px] cursor-default ${cls}`}>
          <Icon size={13} strokeWidth={2.5} />
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

type Props = Pick<Todo, 'isWork' | 'isPersonal' | 'isFuture' | 'isLearning'>

export function CategoryBadges({ isWork, isPersonal, isFuture, isLearning }: Props) {
  return (
    <div className="flex gap-1">
      {isWork     && <Badge category="work" />}
      {isPersonal && <Badge category="personal" />}
      {isFuture   && <Badge category="future" />}
      {isLearning && <Badge category="learning" />}
    </div>
  )
}
