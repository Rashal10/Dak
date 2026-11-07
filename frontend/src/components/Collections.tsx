import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { collections, type EditorialCollection } from '../data/collections'
import { musicTracks } from '../data/music'
import { stampById, type Stamp } from '../data/stamps'
import { ListenButton } from './ListenButton'
import { StampCard } from './StampCard'
import { asset } from '../lib/asset'
import { openStamp } from '../lib/opener'
import { seeded } from '../lib/rand'

gsap.registerPlugin(ScrollTrigger)

export function Collections() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const once = (trigger: string) => ({ trigger, start: 'top 78%', once: true })
        gsap.from('#ed-built .ed-rule', { scaleX: 0, transformOrigin: 'left', duration: 1.1, ease: 'power2.out', scrollTrigger: once('#ed-built') })
        gsap.from('#ed-built .ed-head', { opacity: 0, x: -24, duration: 0.8, ease: 'power3.out', scrollTrigger: once('#ed-built') })
        gsap.from('#ed-living .ed-sprig', { scaleY: 0, transformOrigin: 'bottom', duration: 1.3, ease: 'power2.out', scrollTrigger: once('#ed-living') })
        gsap.from('#ed-living .ed-head', { opacity: 0, y: 18, duration: 0.8, scrollTrigger: once('#ed-living') })
        gsap.from('#ed-minds .ed-head > *', { opacity: 0, y: 10, duration: 0.6, stagger: 0.1, scrollTrigger: once('#ed-minds') })
        gsap.from('#ed-rhythm .ed-band', { xPercent: -6, opacity: 0, duration: 1.2, ease: 'power2.out', scrollTrigger: once('#ed-rhythm') })
        gsap.from('#ed-rhythm .ed-head', { opacity: 0, duration: 0.9, scrollTrigger: once('#ed-rhythm') })
        gsap.from('#ed-dak .ed-route', { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'power1.inOut', scrollTrigger: once('#ed-dak') })
        gsap.from('#ed-dak .ed-mark', { opacity: 0, scale: 1.3, rotation: -18, duration: 0.5, ease: 'power2.out', scrollTrigger: { ...once('#ed-dak'), start: 'top 60%' } })
        gsap.from('#ed-dak .ed-head', { opacity: 0, y: 14, duration: 0.7, scrollTrigger: once('#ed-dak') })
        gsap.from('.ed-divider', { opacity: 0, scaleX: 0.6, duration: 1, ease: 'power3.out', scrollTrigger: once('.ed-divider') })
        gsap.from('#ed-built .ed-rosette', { opacity: 0, rotation: -90, scale: 0.7, duration: 1.2, ease: 'power2.out', scrollTrigger: once('#ed-built') })
        gsap.from('#ed-minds .ed-fish', { opacity: 0, x: -30, duration: 1, ease: 'power2.out', scrollTrigger: once('#ed-minds') })
        gsap.from('#ed-living .ed-elephant', { opacity: 0, rotation: 8, y: 40, duration: 1, ease: 'back.out(1.4)', scrollTrigger: once('#ed-living') })
      },
      root,
    )
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} aria-labelledby="collections-title" className="relative">
      <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6" aria-hidden>
        <img src={asset('assets/illustrations/divider.svg')} alt="" width={900} height={64} className="ed-divider block h-auto w-full" />
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 pt-6 sm:px-6">
        <img src={asset('assets/illustrations/lotus-rosette.svg')} alt="" aria-hidden className="hidden w-20 sm:block" />
        <div>
          <p className="catalog">Five drawers</p>
          <h2 id="collections-title" className="mt-1 max-w-2xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Collections, gathered by subject
          </h2>
        </div>
      </div>
      {collections.map((c, i) => (
        <EditorialSection key={c.id} c={c} n={i} />
      ))}
    </section>
  )
}

const DEVA_NUM = ['१', '२', '३', '४', '५', '६']

function Heading({ c, n }: { c: EditorialCollection; n: number }) {
  return (
    <div className="ed-head max-w-xl">
      <p className="catalog flex items-center gap-2" style={{ color: c.accent }}>
        <span lang="hi" className="font-deva text-lg normal-case tracking-normal" aria-hidden>
          {DEVA_NUM[n]}
        </span>
        <span className="inline-block h-px w-6" style={{ background: c.accent }} aria-hidden />
        {c.kicker}
      </p>
      <h3 id={`ed-${c.id}-title`} className="mt-2 text-[2.1rem] font-semibold leading-[1.05] text-ink sm:text-[2.7rem]">
        {c.title}
        {c.devanagari && (
          <span lang="hi" className="ml-3 align-middle font-deva text-2xl font-normal opacity-80" style={{ color: c.accent }} aria-hidden>
            {c.devanagari}
          </span>
        )}
      </h3>
      <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">{c.intro}</p>
    </div>
  )
}

function Threads({ c }: { c: EditorialCollection }) {
  const list = c.threads.filter((t) => stampById.has(t.from) && stampById.has(t.to))
  const songs = musicTracks.filter((t) => t.collectionNote && c.stampIds.includes(t.stampId) && stampById.has(t.stampId))
  if (!list.length && !songs.length) return null
  return (
    <div className="mt-10 border-t border-dashed border-ink/20 pt-5">
      <p className="catalog mb-3">Explore further</p>
      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((t) => {
          const a = stampById.get(t.from)!
          const b = stampById.get(t.to)!
          return (
            <li key={t.from + t.to} className="flex items-start gap-3 text-[15px] leading-snug">
              <span className="mt-0.5 flex shrink-0 -space-x-3" aria-hidden>
                <Thumb s={a} />
                <Thumb s={b} />
              </span>
              <span className="min-w-0">
                <span className="hand text-ink-soft">{t.text}</span>{' '}
                <span className="inline-flex flex-wrap items-center gap-x-1.5">
                  <ThreadLink s={a} /> <ArrowRight className="inline h-3 w-3 text-ink-faded" aria-hidden /> <ThreadLink s={b} />
                </span>
              </span>
            </li>
          )
        })}
        {songs.map((t) => (
          <li key={t.id} className="flex items-start gap-3 text-[15px] leading-snug">
            <span className="mt-0.5 flex shrink-0" aria-hidden>
              <Thumb s={stampById.get(t.stampId)!} />
            </span>
            <span className="min-w-0">
              <span className="hand text-ink-soft">{t.collectionNote}</span>{' '}
              <ListenButton track={t} className="text-oxblood" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Thumb = ({ s }: { s: Stamp }) => (
  <img src={asset(s.image.sm)} alt="" width={s.image.width} height={s.image.height} loading="lazy" className="stamp-shadow h-11 w-auto rotate-[-3deg] last:rotate-[4deg]" />
)

const ThreadLink = ({ s }: { s: Stamp }) => (
  <a
    href={`#/stamp/${s.slug}`}
    onClick={(e) => {
      e.preventDefault()
      openStamp(s.slug, null, e.currentTarget)
    }}
    className="font-medium text-peacock-deep underline decoration-peacock/30 underline-offset-2 hover:decoration-peacock"
  >
    {s.title}
  </a>
)

const reveal = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -60px 0px' },
  transition: { delay: (i % 6) * 0.06, type: 'spring' as const, stiffness: 200, damping: 26 },
})

function EditorialSection({ c, n }: { c: EditorialCollection; n: number }) {
  const items = c.stampIds.map((id) => stampById.get(id)).filter((s): s is Stamp => !!s)
  if (!items.length) return null
  const ctx = `ed-${c.id}`

  if (c.id === 'built') {
    const [lead, ...rest] = items
    return (
      <article id="ed-built" aria-labelledby="ed-built-title" className="relative overflow-clip py-16">
        <div className="tex-jali pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="ed-rule strip-ajrakh mb-8 h-5 w-full rounded-[2px]" aria-hidden />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative">
            <img src={asset('assets/illustrations/lotus-rosette.svg')} alt="" aria-hidden className="ed-rosette pointer-events-none absolute -right-2 -top-4 w-20 opacity-90 sm:w-24" />
            <div>
              <Heading c={c} n={n} />
            </div>
            <motion.div {...reveal(0)} className="mt-8 max-w-md">
              <StampCard stamp={lead} context={ctx} />
            </motion.div>
          </div>
          <ul className="grid grid-cols-2 items-end gap-x-5 gap-y-8 self-end sm:grid-cols-3">
            {rest.map((s, i) => (
              <motion.li key={s.id} {...reveal(i + 1)} style={{ marginTop: `${seeded(s.id) * 24}px` }}>
                <StampCard stamp={s} context={ctx} />
              </motion.li>
            ))}
          </ul>
        </div>
        <Threads c={c} />
        </div>
      </article>
    )
  }

  if (c.id === 'living') {
    return (
      <article id="ed-living" aria-labelledby="ed-living-title" className="relative overflow-hidden bg-[#d6cc92]/55">
        <div className="tex-creeper pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden />
        <div className="strip-vine relative h-8" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
          <div>
            <Heading c={c} n={n} />
          </div>
          <ul className="mt-10 flex flex-wrap items-end justify-center gap-x-6 gap-y-10 sm:justify-start lg:gap-x-10">
            {items.map((s, i) => (
              <motion.li
                key={s.id}
                {...reveal(i)}
                className="w-[42%] sm:w-[26%] lg:w-[21%]"
                style={{ marginBottom: `${(i % 2 ? 0 : 1) * (12 + seeded(s.id, 3) * 26)}px` }}
              >
                <StampCard stamp={s} context={ctx} />
              </motion.li>
            ))}
          </ul>
          <Threads c={c} />
          </div>
          <ElephantFeature />
        </div>
        <div className="strip-vine relative h-8 rotate-180" aria-hidden />
      </article>
    )
  }

  if (c.id === 'minds') {
    return (
      <article id="ed-minds" aria-labelledby="ed-minds-title" className="relative overflow-clip py-16">
        <div className="tex-scales pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="strip-madhubani mb-10 h-6" aria-hidden />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Heading c={c} n={n} />
            <img src={asset('assets/illustrations/madhubani-fish.svg')} alt="" aria-hidden className="ed-fish mt-8 hidden w-56 lg:block" />
          </div>
          <ol className="grid grid-cols-2 items-end gap-x-5 gap-y-9 sm:grid-cols-4">
            {items.map((s, i) => (
              <motion.li key={s.id} {...reveal(i)} className="relative">
                <span className="hand absolute -left-1 -top-6 text-sm" aria-hidden>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <StampCard stamp={s} context={ctx} />
              </motion.li>
            ))}
          </ol>
        </div>
        <Threads c={c} />
        </div>
      </article>
    )
  }

  if (c.id === 'rhythm') {
    return (
      <article id="ed-rhythm" aria-labelledby="ed-rhythm-title" className="relative overflow-hidden py-16">
        <div className="tex-lotus pointer-events-none absolute inset-0 opacity-[0.13]" aria-hidden />
        <div className="ed-band tex-bandhani absolute inset-x-0 top-0 h-36" aria-hidden />
        <div className="strip-paisley absolute inset-x-0 top-36 h-7" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="swatch max-w-xl rounded-[3px] bg-ivory px-5 pb-5 pt-4 sm:px-7">
            <Heading c={c} n={n} />
          </div>
          <ul className="mt-10 grid grid-cols-2 items-end gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
            {items.map((s, i) => (
              <motion.li key={s.id} {...reveal(i)}>
                <StampCard stamp={s} context={ctx} />
              </motion.li>
            ))}
          </ul>
          <Threads c={c} />
        </div>
      </article>
    )
  }

  return (
    <article id="ed-dak" aria-labelledby="ed-dak-title" className="relative overflow-hidden bg-[#dfc386]/55 py-16">
      <div className="tex-kolam pointer-events-none absolute inset-0 opacity-[0.1]" aria-hidden />
      <img src={asset('assets/illustrations/postmark.svg')} alt="" aria-hidden className="ed-mark pointer-events-none absolute right-4 top-10 hidden w-44 -rotate-6 opacity-70 mix-blend-multiply md:block" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div>
          <Heading c={c} n={n} />
        </div>
        <div className="relative mt-12">
          <div className="ed-route absolute inset-x-0 top-1/2 hidden border-t-2 border-dashed md:block" style={{ borderColor: `${c.accent}aa` }} aria-hidden />
          <ol className="relative grid grid-cols-2 items-center gap-x-5 gap-y-8 sm:grid-cols-4 md:grid-cols-7">
            {items.map((s, i) => (
              <motion.li key={s.id} {...reveal(i)}>
                <StampCard stamp={s} context={ctx} />
              </motion.li>
            ))}
          </ol>
        </div>
        <Threads c={c} />
      </div>
    </article>
  )
}

function ElephantFeature() {
  return (
    <figure className="relative mx-auto w-full max-w-[340px] self-start lg:mt-6">
      <img
        src={asset('assets/illustrations/tree-of-life.svg')}
        alt=""
        aria-hidden
        className="ed-sprig pointer-events-none absolute -right-10 -top-10 w-48 opacity-90"
      />
      <div className="ed-elephant relative rotate-[2.5deg]">
        <div className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 bg-marigold/70 shadow-sm" aria-hidden />
        <img
          src={asset('assets/supplied/asian-elephant.webp')}
          alt="Illustrated stamp design: a blue Asian elephant before pink and yellow flowers on saffron, a crow on its head, inscribed भारत INDIA, एशियाई हाथी and ASIAN ELEPHANT, value 7.00."
          width={474}
          height={670}
          loading="lazy"
          className="stamp-shadow block h-auto w-full"
        />
      </div>
      <figcaption className="mt-5 text-sm leading-snug text-ink-soft">
        <span className="font-display text-lg text-ink">Asian Elephant</span>
        <span lang="hi" className="ml-2 font-deva text-vermilion">एशियाई हाथी</span>
      </figcaption>
    </figure>
  )
}
