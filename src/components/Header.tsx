import { hrefFor } from '../lib/router'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory">
      <div className="strip-ajrakh h-1.5" aria-hidden />
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href={hrefFor.home} className="flex items-baseline gap-2" aria-label="DAK, India in Miniature, home">
          <span className="font-display text-xl font-bold tracking-[0.18em] text-oxblood">DAK</span>
          <span lang="hi" className="font-deva text-base text-vermilion">
            डाक
          </span>
          <span className="catalog hidden sm:inline">India in Miniature</span>
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-medium">
          <a href="#explore" onClick={(e) => { e.preventDefault(); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-full px-3 py-2 text-ink-soft hover:text-oxblood">
            Collection
          </a>
        </nav>
      </div>
    </header>
  )
}
