import { useEffect } from 'react'
import { Info, XCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error'

export interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

interface Props {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 items-center pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const isSuccess = toast.type === 'success'

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium min-w-[240px] max-w-sm whitespace-nowrap ${
        isSuccess
          ? 'bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/25 dark:to-[#18181f] border-teal-100 dark:border-teal-800/40 text-teal-700 dark:text-teal-300'
          : 'bg-gradient-to-br from-red-50 to-white dark:from-red-900/25 dark:to-[#18181f] border-red-100 dark:border-red-800/40 text-red-700 dark:text-red-300'
      }`}
    >
      {isSuccess ? (
        <Info size={15} className="flex-shrink-0 text-teal-500" />
      ) : (
        <XCircle size={15} className="flex-shrink-0 text-red-500" />
      )}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-50 hover:opacity-100 transition-opacity ml-1"
      >
        <X size={13} />
      </button>
    </div>
  )
}
