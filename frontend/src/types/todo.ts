export type Category = 'WORK' | 'PERSONAL' | 'FUTURE' | 'LEARNING'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt?: string
  categories: Category[]
  nextRevisionDate?: string
  revisionIteration?: number
  description?: string
  reminderDate?: string
  lastReviewedAt?: string
  mastered?: boolean
}

export interface NewTodo {
  title: string
  categories: Category[]
  description?: string
  reminderDate?: string
}
