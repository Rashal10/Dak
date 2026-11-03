import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { ChevronLeft, ChevronRight, ExternalLink, Link2, RefreshCcw, Search, X, ZoomIn, ZoomOut } from 'lucide-react'
import { stamps, THEMES, type Stamp } from '../data/stamps'
import { StampImage } from './StampImage'
import { opener, openStamp } from '../lib/opener'
import { asset } from '../lib/asset'
import { useToast } from './Toast'

const byYear = [...stamps].sort((a, b) => a.issueYear - b.issueYear || a.title.localeCompare(b.title))
const finePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
const SPRING = { type: 'spring', stiffness: 190, damping: 26 } as const

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

interface Props {
  stamp: Stamp
  onClose: () => void
}

function useCardSize(stamp: Stamp) {
  const calc = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const wide = vw >= 768
    const availW = Math.min(vw - (wide ? 220 : 40), 860)
    const availH = Math.max(240, vh - (wide ? 270 : 300))
    const a = stamp.image.width / stamp.image.height
    let sw = Math.min(availW, availH * a, stamp.image.width * 2.6)
    let sh = sw / a
    if (sh > availH) {
      sh = availH
      sw = sh * a
    }
    const cw = Math.max(sw, Math.min(availW, 330))
    const ch = Math.max(sh, Math.min(availH, 400))
    return { sw, sh, cw, ch }
  }
  const [size, setSize] = useState(calc)
  useLayoutEffect(() => {
    setSize(calc())
    const on = () => setSize(calc())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamp.id])
  return size
}

function cardImageFor(slug: string, prefer: HTMLElement | null): HTMLElement | null {
  const onScreen = (el: Element) => {
    const r = el.getBoundingClientRect()
    return r.width > 4 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
  }
  const preferred = prefer?.getAttribute('href') === `#/stamp/${slug}` ? prefer.querySelector('img') : null
  if (preferred && onScreen(preferred)) return preferred
  const all = [...document.querySelectorAll<HTMLElement>(`a[href="#/stamp/${slug}"] img`)].filter((el) => !el.closest('[role=dialog]') && onScreen(el))
  return all[0] ?? null
}

function flightTo(front: HTMLElement, target: HTMLElement) {
  const f = front.getBoundingClientRect()
  const t = target.getBoundingClientRect()
  return {
    x: t.left + t.width / 2 - (f.left + f.width / 2),
    y: t.top + t.height / 2 - (f.top + f.height / 2),
    scale: t.width / f.width,
  }
}

export function StampDetail({ stamp, onClose }: Props) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const wall = useRef<HTMLDivElement>(null)
  const [flight, animate] = useAnimate<HTMLDivElement>()
  const toast = useToast()
  const idx = byYear.findIndex((s) => s.id === stamp.id)
  const prev = byYear[idx - 1]
  const next = byYear[idx + 1]
  const [fromCard] = useState(() => !!opener.layoutKey)
  const [dir, setDir] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [loupeOn, setLoupeOn] = useState(false)
  const closing = useRef(false)
  const titleId = 'stamp-detail-title'

  useEffect(() => {
    const returnTo = opener.returnFocus
    const sw = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${sw}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = ''
      if (returnTo && document.contains(returnTo)) returnTo.focus({ preventScroll: true })
    }
  }, [])

  useLayoutEffect(() => {
    if (!fromCard) return
    const front = flight.current?.querySelector<HTMLElement>('[data-front]')
    const card = cardImageFor(stamp.slug, opener.returnFocus)
    if (!front || !card) return
    const from = flightTo(front, card)
    flight.current.style.transform = `translate(${from.x}px, ${from.y}px) scale(${from.scale})`
    animate(flight.current, { x: [from.x, 0], y: [from.y, 0], scale: [from.scale, 1], rotate: [-4, 0] }, SPRING)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFlipped(false)
    setZoom(false)
    closeBtn.current?.focus({ preventScroll: true })
  }, [stamp.id])

  useEffect(() => {
    if (flipped) setZoom(false)
  }, [flipped])

    const requestClose = useCallback(async () => {
    if (closing.current) return
    closing.current = true
    dialog.current!.style.pointerEvents = 'none'
    setFlipped(false)
    setZoom(false)
    const front = flight.current?.querySelector<HTMLElement>('[data-front]')
    const card = front ? cardImageFor(stamp.slug, opener.returnFocus) : null
    const chrome = dialog.current!.querySelectorAll('[data-chrome]')
    const fades = dialog.current!.querySelectorAll('[data-fade]')
    const to = front && card ? flightTo(front, card) : null
    const settled = Promise.all([
      animate(fades, { opacity: 0 }, { duration: 0.15 }),
      animate(chrome, { opacity: 0, y: 12 }, { duration: 0.2 }),
      animate(wall.current!, { opacity: 0 }, { duration: 0.45, delay: 0.08, ease: 'easeOut' }),
      to
        ? animate(flight.current, { x: to.x, y: to.y, scale: to.scale, rotate: 0 }, { ...SPRING, stiffness: 230, damping: 30 })
        : animate(flight.current, { y: 60, scale: 0.75, opacity: 0 }, { duration: 0.35, ease: 'easeIn' }),
    ])
    await Promise.race([settled, new Promise((r) => setTimeout(r, 1100))])
    onClose()
  }, [animate, flight, onClose, stamp.slug])

  const go = (s: Stamp | undefined, d: number) => {
    if (!s || closing.current) return
    setDir(d)
    openStamp(s.slug, null, opener.returnFocus)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      requestClose()
      return
    }
    if (e.key === 'Tab') {
      const f = [...dialog.current!.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.closest('[inert]'),
      )
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
      return
    }
    const t = e.target as HTMLElement
    if (/INPUT|TEXTAREA|SELECT/.test(t.tagName)) return
    if (e.key === 'ArrowLeft') go(prev, -1)
    if (e.key === 'ArrowRight') go(next, 1)
    if (e.key === 'f' || e.key === 'F') setFlipped((v) => !v)
    if ((e.key === 'z' || e.key === 'Z') && !flipped) setZoom((v) => !v)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href)
      toast('Link copied')
    } catch {
      toast('Copy the address bar to share')
    }
  }

  const chromeBtn = 'icon-btn text-ivory-soft/85 hover:bg-white/10 hover:text-ivory-soft'

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[65] flex flex-col overflow-hidden text-ivory-soft"
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <motion.div
        ref={wall}
        aria-hidden
        className="absolute inset-0 bg-[#0b5252]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        onClick={requestClose}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(240,180,60,.35),rgba(11,82,82,0)_60%)]" />
        <div className="tex-ajrakh absolute inset-x-0 top-0 h-3" />
        <div className="tex-ajrakh absolute inset-x-0 bottom-0 h-3" />
      </motion.div>

      <motion.div
        data-chrome
        className="relative z-10 flex items-center justify-between gap-2 px-3 pt-4 sm:px-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-1">
          <button type="button" className={`${chromeBtn} md:hidden`} onClick={() => go(prev, -1)} disabled={!prev} aria-label={prev ? `Previous stamp: ${prev.title}` : 'No previous stamp'}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <span className="catalog rounded-full bg-black/15 px-3 py-1.5 tabular-nums text-ivory-soft/80">
            {idx + 1} / {byYear.length}
          </span>
          <button type="button" className={`${chromeBtn} md:hidden`} onClick={() => go(next, 1)} disabled={!next} aria-label={next ? `Next stamp: ${next.title}` : 'No next stamp'}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className={chromeBtn} onClick={copyLink} aria-label="Copy link to this stamp">
            <Link2 className="h-5 w-5" aria-hidden />
          </button>
          <button ref={closeBtn} type="button" className={chromeBtn} onClick={requestClose} aria-label="Close stamp">
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </motion.div>

      <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 items-center justify-center gap-3 px-3 sm:gap-8">
        <NavArrow side="left" target={prev} onGo={() => go(prev, -1)} />
        <div ref={flight} className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <FlipCard key={stamp.id} stamp={stamp} fromCard={fromCard} flipped={flipped} dir={dir} zoom={zoom} loupeOn={loupeOn} onToggleZoom={() => setZoom((z) => !z)} />
          </AnimatePresence>
        </div>
        <NavArrow side="right" target={next} onGo={() => go(next, 1)} />
      </div>

      <motion.div
        data-chrome
        className="relative z-20 flex flex-col items-center gap-3 px-3 pb-6 pt-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 26 }}
      >
        <div className="text-center">
          <p className="catalog text-marigold/90">
            {stamp.issueYear}
            {stamp.denomination ? ` · ${stamp.denomination}` : ''}
          </p>
          <h2 id={titleId} className="font-display text-2xl font-semibold leading-tight text-ivory-soft sm:text-3xl">
            {stamp.title}
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-[28px] bg-ivory/95 p-1.5 text-ink shadow-lift">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            className="btn bg-indigo text-ivory-soft hover:bg-indigo-deep"
            aria-pressed={flipped}
            onClick={() => setFlipped((f) => !f)}
          >
            <motion.span animate={{ rotate: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="inline-flex">
              <RefreshCcw className="h-4 w-4" aria-hidden />
            </motion.span>
            {flipped ? 'Show the front' : 'Turn it over'}
          </motion.button>
          <span className="mx-0.5 hidden h-6 w-px bg-ink/15 sm:block" aria-hidden />
          <button
            type="button"
            className={`icon-btn ${zoom ? 'bg-ink text-ivory-soft hover:bg-ink hover:text-ivory-soft' : ''}`}
            onClick={() => setZoom((z) => !z)}
            disabled={flipped}
            aria-pressed={zoom}
            aria-label={zoom ? 'Zoom out' : 'Zoom in (drag to look around)'}
            title={zoom ? 'Zoom out (Z)' : 'Zoom in (Z)'}
          >
            {zoom ? <ZoomOut className="h-4 w-4" aria-hidden /> : <ZoomIn className="h-4 w-4" aria-hidden />}
          </button>
          {finePointer && (
            <button
              type="button"
              className={`icon-btn ${loupeOn ? 'bg-marigold text-ink hover:bg-marigold hover:text-ink' : ''}`}
              onClick={() => setLoupeOn((l) => !l)}
              disabled={flipped || zoom}
              aria-pressed={loupeOn}
              aria-label="Magnifying loupe"
              title="Magnifying loupe"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function NavArrow({ side, target, onGo }: { side: 'left' | 'right'; target?: Stamp; onGo: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      data-chrome
      onClick={onGo}
      disabled={!target}
      aria-label={target ? `${side === 'left' ? 'Previous' : 'Next'} stamp: ${target.title}` : `No ${side === 'left' ? 'previous' : 'next'} stamp`}
      className="pointer-events-auto hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ivory-soft/30 bg-black/20 text-ivory-soft transition-colors hover:bg-white/15 disabled:opacity-25 md:inline-flex"
    >
      <Icon className="h-6 w-6" aria-hidden />
    </button>
  )
}

interface CardProps {
  stamp: Stamp
  fromCard: boolean
  flipped: boolean
  dir: number
  zoom: boolean
  loupeOn: boolean
  onToggleZoom: () => void
}

function FlipCard({ stamp, fromCard, flipped, dir, zoom, loupeOn, onToggleZoom }: CardProps) {
  const { sw, sh, cw, ch } = useCardSize(stamp)
  const [loupe, setLoupe] = useState<{ x: number; y: number } | null>(null)
  const showLoupe = loupeOn && finePointer && !zoom && !flipped
  const arrivedByArrow = dir !== 0

  return (
    <motion.div
      className="pointer-events-auto relative"
      style={{ width: cw, height: ch, perspective: 1800 }}
      initial={fromCard && !arrivedByArrow ? false : { opacity: 0, x: dir * 120, y: dir ? 0 : -90, rotateX: dir ? 0 : 35, rotateZ: dir ? dir * 6 : -8, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }}
      exit={{ opacity: 0, x: -dir * 120, rotateZ: -dir * 6, transition: { duration: 0.22 } }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
    >
      <div data-fade className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <motion.img
          src={asset('assets/illustrations/lotus-rosette.svg')}
          alt=""
          className="max-w-none"
          style={{ width: Math.max(cw, ch) * 1.45 }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.16, rotate: 360 }}
          transition={{ scale: { duration: 0.9 }, opacity: { duration: 0.9 }, rotate: { duration: 140, repeat: Infinity, ease: 'linear' } }}
        />
      </div>
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 110, damping: 16 }}
        initial={false}
      >
        <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]" aria-hidden={flipped} inert={flipped || undefined}>
          <div data-front className="relative" style={{ width: sw, height: sh }}>
            <div
              className={`absolute inset-0 ${zoom ? 'cursor-grab overflow-hidden active:cursor-grabbing' : showLoupe ? 'cursor-crosshair' : ''}`}
              onPointerMove={(e) => {
                if (!showLoupe) return
                const r = e.currentTarget.getBoundingClientRect()
                setLoupe({ x: e.clientX - r.left, y: e.clientY - r.top })
              }}
              onPointerLeave={() => setLoupe(null)}
              onDoubleClick={onToggleZoom}
            >
              <motion.div
                drag={zoom}
                dragConstraints={{ left: -sw * 0.6, right: sw * 0.6, top: -sh * 0.6, bottom: sh * 0.6 }}
                dragElastic={0.08}
                animate={zoom ? { scale: 2.2 } : { scale: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                className="h-full w-full [filter:drop-shadow(0_24px_30px_rgba(0,0,0,.45))]"
              >
                <StampImage stamp={stamp} size="lg" eager className="!h-full [filter:none]" />
              </motion.div>
              {showLoupe && loupe && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute h-40 w-40 rounded-full border-[3px] border-marigold shadow-lift"
                  style={{
                    left: loupe.x - 80,
                    top: loupe.y - 80,
                    backgroundImage: `url(${asset(stamp.image.lg)})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#0b5252',
                    backgroundSize: `${sw * 2.6}px ${sh * 2.6}px`,
                    backgroundPosition: `${-(loupe.x * 2.6 - 80)}px ${-(loupe.y * 2.6 - 80)}px`,
                  }}
                />
              )}
            </div>
            {!zoom && (
              <div data-fade className="pointer-events-none absolute inset-0">
                <Postmark year={stamp.issueYear} size={Math.max(72, Math.min(130, Math.min(sw, sh) * 0.38))} />
              </div>
            )}
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-[4px] text-ink shadow-[0_24px_40px_rgba(0,0,0,.45)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-hidden={!flipped}
          inert={!flipped || undefined}
          style={{ background: 'linear-gradient(135deg, #f6eedd 0%, #efe2c4 55%, #f6eedd 100%)' }}
        >
          <img
            src={asset('assets/illustrations/mandala-teal.svg')}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 aspect-square h-[130%] max-w-none -translate-y-1/2 translate-x-1/2 opacity-[0.13]"
          />
          <div className="absolute left-1/2 top-0 h-7 w-24 -translate-x-1/2 border-x border-b border-white/70 bg-white/45" aria-hidden />
          <div className="strip-madhubani absolute inset-x-0 bottom-0 h-4 opacity-60" aria-hidden />
          <BackDetails stamp={stamp} />
        </div>
      </motion.div>
    </motion.div>
  )
}

function BackDetails({ stamp }: { stamp: Stamp }) {
  const num = byYear.findIndex((s) => s.id === stamp.id) + 1
  return (
    <div className="relative h-full overflow-y-auto overscroll-contain px-5 pb-8 pt-9 sm:px-7">
      <p className="hand absolute right-4 top-2 -rotate-3 text-sm text-ink-faded">DAK / {String(num).padStart(2, '0')}</p>
      <p className="catalog">
        {stamp.issueYear}
        {stamp.series ? ` · ${stamp.series}` : ''}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold leading-tight text-oxblood">{stamp.title}</p>
      <p className="mt-1.5 font-display italic leading-snug text-ink-soft">{stamp.shortDescription}</p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-y border-dashed border-ink/20 py-3 text-[14px]">
        <dt className="catalog pt-0.5">Issued by</dt>
        <dd>{stamp.issuingAuthority}</dd>
        <dt className="catalog pt-0.5">{stamp.issueDate ? 'Issued' : 'Year'}</dt>
        <dd>{stamp.issueDate ? fmtDate(stamp.issueDate) : stamp.issueYear}</dd>
        {stamp.denomination && (
          <>
            <dt className="catalog pt-0.5">Value</dt>
            <dd>{stamp.denomination}</dd>
          </>
        )}
        {stamp.relatedLocation && (
          <>
            <dt className="catalog pt-0.5">Place</dt>
            <dd>{stamp.relatedLocation}</dd>
          </>
        )}
        <dt className="catalog pt-0.5">Themes</dt>
        <dd className="flex flex-wrap gap-x-3">
          {stamp.themes.map((t) => {
            const th = THEMES.find((x) => x.id === t)!
            return (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: th.color }} aria-hidden />
                {th.label}
              </span>
            )
          })}
        </dd>
      </dl>
      <p className="mt-3 text-[14.5px] leading-relaxed">{stamp.historicalContext}</p>
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
        {stamp.sourceUrls.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-peacock-deep underline decoration-peacock/30 underline-offset-2">
            {s.label}
            <ExternalLink className="h-3 w-3" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}
      </p>
      <p className="mt-2 text-[11px] leading-snug text-ink-faded">{stamp.imageCredit}</p>
    </div>
  )
}

function Postmark({ year, size }: { year: number; size: number }) {
  return (
    <motion.svg
      viewBox="0 0 120 120"
      aria-hidden
      className="absolute"
      style={{ width: size, height: size, right: -size * 0.38, top: -size * 0.28 }}
      initial={{ scale: 2.2, opacity: 0, rotate: -40 }}
      animate={{ scale: 1, opacity: 0.92, rotate: -14 }}
      transition={{ delay: 0.55, type: 'spring', stiffness: 520, damping: 17 }}
    >
      <g fill="none" stroke="#9b1b1b" strokeWidth="3">
        <circle cx="60" cy="60" r="54" />
        <circle cx="60" cy="60" r="40" strokeWidth="1.6" />
      </g>
      <path id="pm-arc" d="M60 60 m-47 0 a47 47 0 1 1 94 0" fill="none" />
      <text fontFamily="IBM Plex Mono, monospace" fontSize="10.5" letterSpacing="3" fill="#9b1b1b">
        <textPath href="#pm-arc" startOffset="50%" textAnchor="middle">
          DAK · INDIA · डाक
        </textPath>
      </text>
      <text x="60" y="58" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="22" fontWeight="700" fill="#9b1b1b">
        {year}
      </text>
      <text x="60" y="76" textAnchor="middle" fontFamily="'Tiro Devanagari Hindi', serif" fontSize="12" fill="#9b1b1b">
        भारत
      </text>
    </motion.svg>
  )
}
