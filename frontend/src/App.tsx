import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Explorer } from './components/Explorer'
import { Collections } from './components/Collections'
import { StampDetail } from './components/StampDetail'
import { Footer } from './components/Footer'
import { Gateway } from './components/Gateway'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'
import { useToast } from './lib/toast'
import { stampById } from './data/stamps'
import { navigate, useRoute } from './lib/router'
import { opener } from './lib/opener'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </MotionConfig>
  )
}

function Shell() {
  const route = useRoute()
  const toast = useToast()
  const explore = useRef<HTMLElement>(null)
  const stamp = route.view === 'stamp' || route.view === 'letter' ? stampById.get(route.slug) : undefined
  const letter = route.view === 'letter' ? route.letter : null
  const [visit, setVisit] = useState(0)
  const [wasOpen, setWasOpen] = useState(false)
  if (!!stamp !== wasOpen) {
    setWasOpen(!!stamp)
    if (stamp) setVisit((v) => v + 1)
  }

  useEffect(() => {
    if ((route.view === 'stamp' || route.view === 'letter') && !stamp) {
      toast('That stamp isn’t in the collection')
      navigate('#/', true)
    } else if (route.view === 'letter' && !route.letter) {
      toast('This letter couldn’t be read, but here is the stamp')
    }
  }, [route, stamp, toast])

  useEffect(() => {
    document.title = letter ? `A stamp from ${letter.from} · DAK` : stamp ? `${stamp.title} (${stamp.issueYear}) · DAK` : 'DAK · India in Miniature'
  }, [stamp, letter])

  const close = () => navigate(route.view === 'letter' || opener.baseHash.startsWith('#/stamp/') ? '#/' : opener.baseHash)
  const toExplore = () => explore.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  return (
    <>
      <a
        href="#explore"
        onClick={(e) => {
          e.preventDefault()
          toExplore()
          explore.current?.querySelector('input')?.focus()
        }}
        className="sr-only z-[80] rounded bg-indigo px-4 py-2 text-ivory-soft focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to the collection
      </a>
      <Header />
      <ErrorBoundary>
        <main id="main">
          <Gateway>
            <Hero onExplore={toExplore} />
          </Gateway>
          <Explorer ref={explore} />
          <Collections />
        </main>
        <Footer />
      </ErrorBoundary>
      <AnimatePresence>
        {stamp && (
          <ErrorBoundary key={`detail-${visit}`} fallback={null} onError={() => navigate('#/', true)}>
            <StampDetail stamp={stamp} letter={letter} onClose={close} />
          </ErrorBoundary>
        )}
      </AnimatePresence>
    </>
  )
}
