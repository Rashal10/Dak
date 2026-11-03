import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown } from 'lucide-react'
import { stampById } from '../data/stamps'
import { StampCard } from './StampCard'
import { asset } from '../lib/asset'
import { GATE_OPEN_EVENT, isVercelScreenshot } from '../lib/entrance'

const PLACES: {
  id: string
  left: number
  top: number
  width: number
  note?: string
  noteSide?: 'r' | 'b'
  mobile?: boolean
}[] = [
  { id: 'taj-mahal-1949', left: 5, top: 5, width: 46, note: 'Agra · 5 rupees · 1949', noteSide: 'b', mobile: true },
  { id: 'gandhi-1948', left: 58, top: 1, width: 24, note: 'बापू · 15 Aug 1948', noteSide: 'r', mobile: true },
  { id: 'kathakali-1975', left: 84, top: 34, width: 14 },
  { id: 'ajanta-panel-1949', left: 36, top: 47, width: 18, mobile: true },
  { id: 'peafowl-1973', left: 4, top: 52, width: 15 },
  { id: 'dak-bullock-cart-nabha-1938', left: 58, top: 54, width: 36, note: 'overprinted NABHA STATE', noteSide: 'b', mobile: true },
  { id: 'tiger-1963', left: 17, top: 75, width: 26, mobile: true },
]

export function Hero({ onExplore }: { onExplore: () => void }) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (isVercelScreenshot) return
    const mm = gsap.matchMedia()
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const tl = gsap
          .timeline({ paused: true, defaults: { ease: 'power3.out' } })
          .from('.hero-toran', { opacity: 0, y: -22, duration: 0.7, ease: 'back.out(1.6)' })
          .from('.hero-cloth', { opacity: 0, rotation: 6, scale: 0.97, duration: 0.8 }, 0)
          .from('.hero-rosette', { opacity: 0, rotation: -60, scale: 0.8, duration: 1.1, ease: 'power2.out' }, 0.1)
          .from('.hero-paper', { opacity: 0, scale: 0.985, duration: 0.6 }, 0.05)
          .from(
            '.hero-slot',
            { opacity: 0, y: -26, rotation: (i: number) => (i % 2 ? 5 : -5), duration: 0.75, stagger: 0.07, ease: 'back.out(1.3)' },
            0.1,
          )
          .from('.hero-line', { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 }, 0.15)
          .from('.hero-note', { opacity: 0, duration: 0.5, stagger: 0.1 }, 0.75)
          .from('.hero-mark', { opacity: 0, scale: 1.25, rotation: -16, duration: 0.45, ease: 'power2.out' }, 0.95)
        const play = () => tl.play()
        window.addEventListener(GATE_OPEN_EVENT, play, { once: true })
        return () => window.removeEventListener(GATE_OPEN_EVENT, play)
      },
      root,
    )
    return () => mm.revert()
  }, [])

  const placed = PLACES.filter((p) => stampById.has(p.id))

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-ivory"
      style={{ backgroundImage: `url(${asset('assets/textures/paper.webp')})` }}
    >
      <div aria-hidden className="hero-toran toran pointer-events-none h-10 w-full sm:h-14" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8 lg:pb-24 lg:pt-14">
        <div className="relative z-10 max-w-xl">
          <p className="hero-line mb-8 flex flex-wrap items-baseline gap-x-2 leading-normal">
            <span lang="hi" className="font-deva text-2xl text-vermilion">भारत</span>
            <span className="font-display italic text-ink-soft">through the</span>
            <span lang="hi" className="font-deva text-2xl text-vermilion">डाक</span>
          </p>
          <h1 id="hero-title" className="hero-line leading-none">
            <span className="block pt-[0.04em] font-display text-[clamp(5.5rem,17vw,10.5rem)] font-extrabold leading-[0.9] tracking-[0.05em] text-oxblood">
              DAK
            </span>
            <span aria-hidden className="strip-paisley mt-7 block h-6 w-[min(100%,22rem)] rounded-[2px]" />
            <span className="sr-only"> India in Miniature</span>
          </h1>
          <p className="hero-line mt-2 flex items-baseline gap-3" aria-hidden>
            <span lang="hi" className="font-deva text-4xl text-vermilion">
              ॥ डाक ॥
            </span>
            <span className="font-display text-xl italic text-ink-soft">India in Miniature</span>
          </p>
          <div className="hero-line mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onExplore} className="btn-primary">
              Explore the collection <ArrowDown className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="hero-line mt-10 flex items-center gap-5 border-t border-dashed border-oxblood/30 pt-6">
            <img
              src={asset('assets/illustrations/envelope.svg')}
              alt=""
              aria-hidden
              width={240}
              height={160}
              className="w-24 shrink-0 -rotate-6 drop-shadow-[0_6px_8px_rgba(94,26,24,.25)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 sm:w-28"
            />
            <div>
              <p className="font-display text-[1.3rem] italic leading-snug text-oxblood sm:text-[1.45rem]">
                Before phones, a nation spoke in letters. These were their passports.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[720px]">
          <img
            src={asset('assets/illustrations/lotus-rosette.svg')}
            alt=""
            aria-hidden
            className="hero-rosette pointer-events-none absolute -right-8 -top-14 w-28 sm:-right-14 sm:w-44"
          />
          <div aria-hidden className="hero-cloth swatch tex-paisley absolute inset-[-6%_-5%] rotate-[1.8deg] overflow-hidden rounded-[3px] bg-ivory-soft">
            <div className="tex-ajrakh absolute inset-x-0 top-0 h-5" />
            <div className="tex-ajrakh absolute inset-x-0 bottom-0 h-5" />
            <div className="absolute inset-x-0 top-5 h-1 bg-marigold" />
            <div className="absolute inset-x-0 bottom-5 h-1 bg-marigold" />
          </div>
          <div aria-hidden className="hero-paper mount absolute inset-[-1%_-1.5%] -rotate-[0.8deg] rounded-sm shadow-lift">
            <div className="strip-madhubani absolute inset-x-3 top-2 h-4 opacity-70" />
            <div className="strip-madhubani absolute inset-x-3 bottom-2 h-4 rotate-180 opacity-70" />
            <img
              src={asset('assets/illustrations/sprig.svg')}
              alt=""
              className="absolute -bottom-8 left-[46%] hidden w-14 -rotate-[20deg] opacity-80 sm:block"
            />
          </div>
          <ul className="relative aspect-[10/9] sm:aspect-[10/8]" aria-label="Featured stamps">
            {placed.map((p, i) => {
              const s = stampById.get(p.id)!
              return (
                <li
                  key={p.id}
                  className={`hero-slot absolute ${p.mobile ? '' : 'hidden sm:block'}`}
                  style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.width}%` }}
                >
                  <StampCard stamp={s} context="hero" meta={false} eager={i < 3} bare />
                  {p.note && (
                    <span
                      aria-hidden
                      className={`hero-note hand pointer-events-none absolute hidden whitespace-nowrap text-[13px] md:block ${
                        p.noteSide === 'r' ? 'left-[104%] top-[40%] max-w-[9rem] whitespace-normal' : 'left-[4%] top-[103%]'
                      }`}
                    >
                      ↳ {p.note}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
          <img
            src={asset('assets/illustrations/postmark.svg')}
            alt=""
            aria-hidden
            className="hero-mark pointer-events-none absolute right-[-1%] top-[30%] w-[30%] max-w-[190px] -rotate-6 opacity-80"
          />
        </div>
      </div>
    </section>
  )
}
