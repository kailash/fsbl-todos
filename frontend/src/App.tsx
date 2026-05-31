import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { MobileDrawer } from './components/MobileDrawer'
import { StatsCard } from './components/StatsCard'
import { FilterBar } from './components/FilterBar'
import { LearningSchedulePanel } from './components/LearningSchedulePanel'
import { NewLearningPanel } from './components/NewLearningPanel'
import { TasksPanel } from './components/TasksPanel'
import { ArchiveModal } from './components/ArchiveModal'
import { ToastContainer, type ToastMessage, type ToastType } from './components/Toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useAllTodos } from './hooks/useAllTodos'
import { useStats } from './hooks/useStats'
import { useDarkMode } from './hooks/useDarkMode'
import { useNotifications } from './hooks/useNotifications'
import type { Todo, NewTodo, Category } from './types/todo'

let toastId = 0

export default function App() {
  const {
    learningSchedule,
    newLearning,
    tasks,
    loading,
    reload,
    addTodo,
    updateTodo,
    deleteTodo,
    markReviewed,
    markMastered,
    closeTodo,
    setReminder,
  } = useAllTodos()

  const [refreshKey, setRefreshKey] = useState(0)
  const stats = useStats(refreshKey)
  const { isDark, toggleDark } = useDarkMode()
  useNotifications(learningSchedule)

  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'ALL'>('ALL')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const dismissToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))
  const triggerRefresh = () => {
    reload()
    setRefreshKey((k) => k + 1)
  }

  const q = searchQuery.toLowerCase().trim()
  const filter = (list: Todo[]) => {
    let result = list
    if (q)
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q)
      )
    if (categoryFilter !== 'ALL')
      result = result.filter((t) => t.categories.includes(categoryFilter as Category))
    return result
  }

  const handleAddTodo = async (data: NewTodo) => {
    await addTodo(data)
    triggerRefresh()
    addToast('Task added')
  }
  const handleUpdateTodo = async (todo: Todo) => {
    await updateTodo(todo)
    addToast('Task updated')
  }
  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id)
    triggerRefresh()
    addToast('Task deleted')
  }
  const handleMarkReviewed = async (id: string) => {
    await markReviewed(id)
    triggerRefresh()
    addToast('Marked as reviewed — next review scheduled')
  }
  const handleMarkMastered = async (id: string) => {
    await markMastered(id)
    triggerRefresh()
    addToast('Marked as mastered!')
  }
  const handleCloseTodo = async (id: string) => {
    await closeTodo(id)
    triggerRefresh()
    addToast('Task closed')
  }
  const handleSetReminder = async (id: string, date: string) => {
    await setReminder(id, date)
    addToast('Reminder set')
  }

  const sidebarContent = (
    <Sidebar
      isDark={isDark}
      onToggleDark={toggleDark}
      onAdd={handleAddTodo}
      onArchive={() => setArchiveOpen(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      stats={stats}
    />
  )

  return (
    <div className="bg-[#edf0f7] dark:bg-[#0b0b10] min-h-screen">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={18} />
        </button>
        <span className="text-sm font-bold text-slate-800 dark:text-white tracking-wide">FSBL</span>
      </div>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {sidebarContent}
      </MobileDrawer>

      {/* Page container: sidebar on left, main on right */}
      <div className="max-w-5xl mx-auto md:shadow-sm flex items-start">
        {/*
          Sidebar: sticky so it stays in view while the main column scrolls.
          h-screen keeps it viewport-height. py-5 on the logo strip (inside Sidebar)
          matches the main column's pt-5, so the logo and stats cards start at
          exactly the same y-coordinate.
        */}
        <aside
          className="hidden md:flex flex-col w-72 lg:w-80 flex-shrink-0
                          bg-white dark:bg-slate-900
                          border-r border-slate-200 dark:border-slate-800
                          sticky top-5 h-[calc(100vh-1.25rem)] overflow-y-auto self-start mt-5"
        >
          {sidebarContent}
        </aside>

        {/* Main: normal page flow — scrolls behind the sticky sidebar */}
        <main
          className="flex-1 min-w-0 px-4 md:px-6 pt-16 md:pt-5 pb-8
                         flex flex-col gap-4
                         bg-[#edf0f7] dark:bg-[#0b0b10]"
        >
          <StatsCard stats={stats} />
          <FilterBar active={categoryFilter} onChange={setCategoryFilter} />
          <ErrorBoundary>
            <LearningSchedulePanel
              todos={filter(learningSchedule)}
              loading={loading}
              onMarkReviewed={handleMarkReviewed}
              onMaster={handleMarkMastered}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
            <NewLearningPanel
              todos={filter(newLearning)}
              loading={loading}
              onStartReview={handleMarkReviewed}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
            <TasksPanel
              todos={filter(tasks)}
              loading={loading}
              onClose={handleCloseTodo}
              onRemind={handleSetReminder}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          </ErrorBoundary>
          <div className="h-4" />
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {archiveOpen && <ArchiveModal onClose={() => setArchiveOpen(false)} />}
    </div>
  )
}
