export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt?: string
  isWork: boolean
  isPersonal: boolean
  isFuture: boolean
  isLearning: boolean
  nextRevisionDate?: string
  revisionIteration?: number
}

export interface NewTodo {
  title: string
  isWork: boolean
  isPersonal: boolean
  isFuture: boolean
  isLearning: boolean
}
