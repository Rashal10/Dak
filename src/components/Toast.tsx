import { useCallback, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ToastContext } from '../lib/toast'

type Toast = { id: number; text: string }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const n = useRef(0)
  const push = useCallback((text: string) => {
    const id = ++n.current
    setToasts((t) => [...t.slice(-2), { id, text }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10, scale: 0.96, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -0.5 }}
              exit={{ opacity: 0, y: 6, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              className="rounded-md border border-oxblood/25 bg-ivory-soft px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-oxblood shadow-paper"
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
