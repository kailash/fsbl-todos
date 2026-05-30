export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string | number[]
  isWork: boolean
  isPersonal: boolean
  isFuture: boolean
  isLearning: boolean
  nextRevisionDate?: string | number[]
  revisionIeration?: number  // backend typo preserved
}

export interface NewTodo {
  title: string
  isWork: boolean
  isPersonal: boolean
  isFuture: boolean
  isLearning: boolean
}
