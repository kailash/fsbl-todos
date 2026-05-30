import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

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
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
      {toasts.map(t => (
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

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[220px] ${
      toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {toast.type === 'success'
        ? <CheckCircle2 size={16} className="flex-shrink-0" />
        : <XCircle size={16} className="flex-shrink-0" />}
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  )
}
