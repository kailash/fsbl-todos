import { Zap } from 'lucide-react'
import { AddTodo } from './components/AddTodo'
import { TodoList } from './components/TodoList'
import { RevisionList } from './components/RevisionList'
import { useTodos } from './hooks/useTodos'
import { useRevisionList } from './hooks/useRevisionList'

export default function App() {
  const { todos, loading, error, mutationError, addTodo, updateTodo, markComplete, deleteTodo } = useTodos()
  const {
    todos: revTodos,
    loading: revLoading,
    error: revError,
    mutationError: revMutationError,
    markReviewed,
    updateTodo: updateRevTodo,
    deleteTodo: deleteRevTodo,
  } = useRevisionList()

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Header */}
      <header className="bg-zinc-900 sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={19} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-white text-base font-bold tracking-wide leading-tight">FSBL</span>
              <span className="text-zinc-500 text-[11px] font-normal leading-tight">Fibonacci Spaced Learning</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-7 flex flex-col gap-5">
        <AddTodo onAdd={addTodo} />

        <div className="flex gap-5 items-start flex-col md:flex-row">
          <div className="flex-1 min-w-0 w-full">
            <TodoList
              todos={todos}
              loading={loading}
              error={error}
              mutationError={mutationError}
              onToggle={markComplete}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          </div>
          <div className="flex-1 min-w-0 w-full">
            <RevisionList
              todos={revTodos}
              loading={revLoading}
              error={revError}
              mutationError={revMutationError}
              onMarkReviewed={markReviewed}
              onUpdate={updateRevTodo}
              onDelete={deleteRevTodo}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
