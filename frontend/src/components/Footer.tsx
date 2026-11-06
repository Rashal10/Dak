import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset'

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const st = { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 }
        gsap.fromTo('.foot-word', { yPercent: 35, scale: 0.86, letterSpacing: '0.12em' }, { yPercent: 0, scale: 1, letterSpacing: '0em', ease: 'none', scrollTrigger: st })
        gsap.fromTo('.foot-shadow', { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: st })
        gsap.fromTo('.foot-mandala', { rotate: -45, scale: 0.75 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: st })
        gsap.fromTo('.foot-mandala-in', { rotate: 60, scale: 0.6 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: st })
        gsap.fromTo('.foot-crest', { xPercent: 45, yPercent: 30, rotate: 12, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, rotate: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { ...st, start: 'top 60%' } })
        gsap.fromTo('.foot-crest-halo', { rotate: -120, scale: 0.6 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: st })
      },
      root,
    )
    return () => mm.revert()
  }, [])

  return (
    <footer ref={root} className="relative isolate mt-10 overflow-hidden bg-[#0b5252]" aria-label="DAK">
      <div className="tex-ajrakh h-4" aria-hidden />
      <div className="toran h-12 sm:h-16" aria-hidden />
      <div className="relative flex min-h-[62vh] items-center justify-center px-4 pb-20 pt-6 sm:min-h-[78vh]">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute left-1/2 top-1/2 aspect-square w-[min(92vh,96vw)] -translate-x-1/2 -translate-y-1/2">
            <img src={asset('assets/illustrations/mandala-marigold.svg')} alt="" className="foot-mandala h-full w-full opacity-40" />
          </div>
          <div className="absolute left-1/2 top-1/2 aspect-square w-[min(38vh,42vw)] -translate-x-1/2 -translate-y-1/2">
            <img src={asset('assets/illustrations/mandala-ivory.svg')} alt="" className="foot-mandala-in h-full w-full opacity-20" />
          </div>
        </div>
        <p className="relative leading-none" lang="hi">
          <span
            aria-hidden
            className="foot-shadow absolute inset-0 translate-x-[0.04em] translate-y-[0.05em] select-none font-deva text-[clamp(9rem,38vw,30rem)] text-[#5e1a18]"
          >
            डाक
          </span>
          <span
            className="foot-word foot-print relative block select-none bg-clip-text font-deva text-[clamp(9rem,38vw,30rem)] text-transparent [-webkit-text-stroke:3px_#f3c04f]"
            style={{ backgroundImage: `url(${asset('assets/patterns/ajrakh.svg')})`, backgroundSize: '64px 64px' }}
          >
            डाक
          </span>
        </p>
        <a
          href="https://github.com/Rashal10/Dak"
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute bottom-6 left-4 z-10 inline-flex min-h-14 items-center gap-3 rounded-full border border-ivory/25 bg-[#0b5252]/90 px-4 py-3 text-ivory-soft shadow-sm transition-colors duration-200 hover:border-marigold/70 hover:bg-peacock-deep hover:text-marigold focus-visible:outline-marigold sm:bottom-8 sm:left-8 sm:px-5"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true" focusable="false">
            <path d="M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.52 11.52 0 0 1 12 6.098c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.652.243 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.625-5.479 5.922.431.372.815 1.102.815 2.222v3.292c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z" />
          </svg>
          <span className="flex flex-col gap-0.5">
            <span className="font-mono text-[9px] uppercase leading-none tracking-[0.18em] text-ivory/75">Source code</span>
            <span className="text-sm font-semibold leading-tight">GitHub</span>
          </span>
          <ArrowUpRight className="ml-1 h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true" />
          <span className="sr-only">repository for DAK (opens in a new tab)</span>
        </a>
        <div aria-hidden className="foot-crest pointer-events-none absolute bottom-3 right-3 w-[clamp(92px,14vw,210px)] sm:bottom-6 sm:right-8">
          <img
            src={asset('assets/illustrations/mandala-marigold.svg')}
            alt=""
            className="foot-crest-halo absolute left-1/2 top-[42%] aspect-square w-[155%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-50"
          />
          <img
            src={asset('assets/supplied/elephant-crest.webp')}
            alt=""
            width={480}
            height={611}
            loading="lazy"
            className="relative block h-auto w-full -rotate-6 [filter:drop-shadow(0_10px_14px_rgba(0,0,0,.45))]"
          />
        </div>
      </div>
      <div className="tex-ajrakh h-4" aria-hidden />
    </footer>
  )
}
