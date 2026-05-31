import { useState, useEffect } from 'react'
import { X, Trophy, CheckCircle2 } from 'lucide-react'
import { api, type ArchiveResponse } from '@/lib/api'

interface Props {
  onClose: () => void
}

export function ArchiveModal({ onClose }: Props) {
  const [archive, setArchive] = useState<ArchiveResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getArchive()
      .then((a) => {
        setArchive(a)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Archive</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {loading ? (
            <p className="text-sm text-slate-400 text-center py-8">Loading…</p>
          ) : (
            <>
              {(archive?.masteredItems.length ?? 0) > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
                    <Trophy size={12} /> Mastered
                  </div>
                  {archive!.masteredItems.map((t) => (
                    <div
                      key={t.id}
                      className="py-2 border-b border-slate-50 dark:border-slate-800 last:border-0"
                    >
                      <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                        {t.title}
                      </div>
                      {t.description && (
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {t.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {(archive?.closedTasks.length ?? 0) > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    <CheckCircle2 size={12} /> Closed Tasks
                  </div>
                  {archive!.closedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="py-2 border-b border-slate-50 dark:border-slate-800 last:border-0"
                    >
                      <div className="text-sm text-slate-500 dark:text-slate-400 line-through">
                        {t.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!archive?.masteredItems.length && !archive?.closedTasks.length && (
                <p className="text-sm text-slate-400 text-center py-8">Archive is empty</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
