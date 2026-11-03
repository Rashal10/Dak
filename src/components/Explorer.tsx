import { forwardRef, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RotateCcw, Shuffle, X } from 'lucide-react'
import { openStamp } from '../lib/opener'
import { stamps, THEMES, type Theme } from '../data/stamps'
import { StampCard } from './StampCard'
import { asset } from '../lib/asset'

type Sort = 'year-asc' | 'year-desc' | 'title'

const ERAS: { id: string; label: string; test: (y: number) => boolean }[] = [
  { id: 'all', label: 'All eras', test: () => true },
  { id: 'colonial', label: 'Before 1947', test: (y) => y < 1947 },
  { id: '1947', label: '1947–1959', test: (y) => y >= 1947 && y < 1960 },
  { id: '1960', label: '1960s', test: (y) => y >= 1960 && y < 1970 },
  { id: '1970', label: '1970s', test: (y) => y >= 1970 && y < 1980 },
  { id: '1980', label: '1980s', test: (y) => y >= 1980 && y < 1990 },
  { id: '1990', label: '1990s', test: (y) => y >= 1990 && y < 2000 },
  { id: '2000', label: '2000 onwards', test: (y) => y >= 2000 },
]

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

const haystack = new Map(
  stamps.map((s) => [
    s.id,
    norm(
      [
        s.title,
        s.shortDescription,
        s.historicalContext,
        s.series,
        s.relatedLocation,
        s.issuingAuthority,
        s.denomination,
        String(s.issueYear),
        s.themes.map((t) => THEMES.find((x) => x.id === t)?.label).join(' '),
      ].join(' '),
    ),
  ]),
)

export const Explorer = forwardRef<HTMLElement>(function Explorer(_, ref) {
  const [query, setQuery] = useState('')
  const [themes, setThemes] = useState<Theme[]>([])
  const [sort, setSort] = useState<Sort>('year-asc')
  const [era, setEra] = useState('all')
  const q = useDeferredValue(query)
  const searchId = useId()
  const sortId = useId()
  const eraId = useId()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key !== '/' || /INPUT|TEXTAREA|SELECT/.test(t.tagName) || document.querySelector('[role=dialog]')) return
      e.preventDefault()
      searchRef.current?.scrollIntoView({ block: 'center' })
      searchRef.current?.focus({ preventScroll: true })
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean)
    const out = stamps.filter((s) => {
      if (!ERAS.find((e) => e.id === era)!.test(s.issueYear)) return false
      if (themes.length && !themes.some((t) => s.themes.includes(t))) return false
      const h = haystack.get(s.id)!
      return terms.every((t) => h.includes(t))
    })
    return out.sort((a, b) =>
      sort === 'title'
        ? a.title.localeCompare(b.title)
        : sort === 'year-asc'
          ? a.issueYear - b.issueYear || a.title.localeCompare(b.title)
          : b.issueYear - a.issueYear || a.title.localeCompare(b.title),
    )
  }, [q, themes, sort, era])

  const active = query !== '' || themes.length > 0 || sort !== 'year-asc' || era !== 'all'
  const reset = () => {
    setQuery('')
    setThemes([])
    setSort('year-asc')
    setEra('all')
  }
  const surprise = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pool = results.length ? results : stamps
    const pick = pool[Math.floor(Math.random() * pool.length)]
    openStamp(pick.slug, results.includes(pick) ? `explore-${pick.id}` : null, e.currentTarget)
  }
  const toggleTheme = (t: Theme) => setThemes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))

  return (
    <section ref={ref} id="explore" aria-labelledby="explore-title" className="relative scroll-mt-16 border-t border-ink/10 bg-[#e2c98f]/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-clip">
        <div className="sticky top-0 h-screen">
          <img
            src={asset('assets/illustrations/mandala-pink.svg')}
            alt=""
            className="absolute left-0 top-1/2 aspect-square h-[min(92vh,90vw)] max-w-none -translate-x-[46%] -translate-y-1/2 opacity-50"
          />
          <img
            src={asset('assets/illustrations/mandala-marigold.svg')}
            alt=""
            className="absolute right-0 top-1/2 aspect-square h-[min(92vh,90vw)] max-w-none -translate-y-1/2 translate-x-[46%] opacity-80 brightness-0 invert"
          />
        </div>
      </div>
      <div className="strip-paisley relative h-7" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="catalog">The collection</p>
            <h2 id="explore-title" className="mt-1 text-4xl font-semibold text-ink sm:text-5xl">
              Browse the collection
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">
            Search by subject, place, person or year. Every stamp opens onto its story.
          </p>
        </div>

        <div className="relative -mx-4 mt-8 sm:mx-0">
          <div className="form-card px-4 pb-4 pt-3 sm:px-6">
            <div className="flex items-baseline justify-between border-b border-dashed border-oxblood/40 pb-2">
              <p className="flex items-baseline gap-2 text-oxblood">
                <span lang="hi" className="font-deva text-lg">
                  डाक सूची
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Dak Index</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">Form No. {stamps.length}</p>
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-3">
              <div className="relative min-w-0 flex-1 basis-64">
                <label htmlFor={searchId} className="form-label">
                  Look for
                </label>
                <input
                  ref={searchRef}
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="a place, a person, a year…"
                  className="form-field w-full pr-9 font-display text-xl italic"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute bottom-1 right-0 inline-flex h-8 w-8 items-center justify-center text-ink-faded hover:text-oxblood"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
              <div>
                <label htmlFor={sortId} className="form-label">
                  Order
                </label>
                <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="form-field form-select">
                  <option value="year-asc">Oldest first</option>
                  <option value="year-desc">Newest first</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>
              <div>
                <label htmlFor={eraId} className="form-label">
                  Era
                </label>
                <select id={eraId} value={era} onChange={(e) => setEra(e.target.value)} className="form-field form-select">
                  {ERAS.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
              <motion.button
                type="button"
                onClick={surprise}
                whileHover={{ rotate: 0, y: -2 }}
                whileTap={{ scale: 0.92, rotate: -6 }}
                className="perf-stamp mb-0.5 -rotate-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory-soft"
              >
                <span className="inline-flex items-center gap-2 border border-dashed border-ivory-soft/60 px-3 py-2">
                  <Shuffle className="h-3.5 w-3.5" aria-hidden /> Surprise me
                </span>
              </motion.button>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <span className="form-label mt-2.5 hidden shrink-0 sm:block">Subjects</span>
              <div role="group" aria-label="Filter by subject" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="ink-tag"
                    aria-pressed={themes.includes(t.id)}
                    onClick={() => toggleTheme(t.id)}
                    style={{ ['--chip' as string]: t.color }}
                  >
                    <span className="h-2 w-2" style={{ background: t.color }} aria-hidden />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex min-h-[44px] flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft" aria-live="polite" aria-atomic="true">
            {results.length === stamps.length ? (
              <>All {stamps.length} stamps</>
            ) : (
              <>
                Showing {results.length} of {stamps.length} stamps
              </>
            )}
          </p>
          {active && (
            <button type="button" onClick={reset} className="inline-flex min-h-[40px] items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-oxblood underline decoration-dotted underline-offset-4 hover:decoration-solid">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Clear the form
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 flex max-w-md flex-col items-center text-center"
          >
            <img src={asset('assets/illustrations/postmark.svg')} alt="" className="w-40 -rotate-6 opacity-60" />
            <p className="mt-4 font-display text-2xl text-ink">Nothing in this drawer.</p>
            <p className="mt-2 text-ink-soft">
              {'No stamp matches every filter at once. Try fewer themes or a different word.'}
            </p>
            <button type="button" onClick={reset} className="btn-primary mt-6">
              Show all stamps
            </button>
          </motion.div>
        ) : (
          <motion.ul layout className="mt-6 grid grid-cols-2 items-end gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 xl:grid-cols-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((s, i) => (
                <motion.li
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i, 12) * 0.025, type: 'spring', stiffness: 260, damping: 26 } }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                >
                  <StampCard stamp={s} context="explore" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  )
})
