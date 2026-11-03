import { useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Explorer } from './components/Explorer'
import { Collections } from './components/Collections'
import { StampDetail } from './components/StampDetail'
import { Footer } from './components/Footer'
import { Gateway } from './components/Gateway'
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
  const stamp = route.view === 'stamp' ? stampById.get(route.slug) : undefined

  useEffect(() => {
    if (route.view === 'stamp' && !stamp) {
      toast('That stamp isn’t in the collection')
      navigate('#/', true)
    }
  }, [route, stamp, toast])

  useEffect(() => {
    document.title = stamp ? `${stamp.title} (${stamp.issueYear}) · DAK` : 'DAK · India in Miniature'
  }, [stamp])

  const close = () => navigate(opener.baseHash.startsWith('#/stamp/') ? '#/' : opener.baseHash)
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
      <main id="main">
        <Gateway>
          <Hero onExplore={toExplore} />
        </Gateway>
        <Explorer ref={explore} />
        <Collections />
      </main>
      <Footer />
      <AnimatePresence>{stamp && <StampDetail key="detail" stamp={stamp} onClose={close} />}</AnimatePresence>
    </>
  )
}
