import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronsDown } from 'lucide-react'
import { asset } from '../lib/asset'
import gatewaySvg from '../assets/haveli-gateway.svg?raw'
import titleSvg from '../assets/haveli-title.svg?raw'

gsap.registerPlugin(ScrollTrigger)

export const GATE_OPEN_EVENT = 'dak:gate-open'

ScrollTrigger.config({ ignoreMobileResize: true })

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const VIEW = { x: 44, y: 38, w: 1352, h: 966 }
const DOORWAY = { left: 530, right: 910, top: 349, bottom: 894 }

function toScreen(x: number, y: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const s = Math.min(vw / VIEW.w, vh / VIEW.h)
  return { x: (vw - VIEW.w * s) / 2 + (x - VIEW.x) * s, y: (vh - VIEW.h * s) / 2 + (y - VIEW.y) * s }
}

const layer = 'pointer-events-none absolute inset-0 h-full w-full [will-change:transform]'

export function Gateway({ children }: { children: ReactNode }) {
  const pinRef = useRef<HTMLDivElement>(null)
  const gateRef = useRef<HTMLDivElement>(null)
  const seamRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const [active] = useState(() => !reducedMotion())
  const markup = useMemo(
    () =>
      gatewaySvg
        .split('__MANDALA_L__').join(asset('assets/illustrations/mandala-ivory.svg'))
        .split('__MANDALA_R__').join(asset('assets/illustrations/mandala-marigold.svg')),
    [],
  )

  useLayoutEffect(() => {
    const announce = () => window.dispatchEvent(new Event(GATE_OPEN_EVENT))
    if (!active) {
      announce()
      return
    }
    const gate = gateRef.current!
    let announced = false
    const header = () => document.querySelector('header')?.offsetHeight ?? 0
    const ctx = gsap.context(() => {
      const place = () => {
        const tl = toScreen(DOORWAY.left, DOORWAY.top)
        const br = toScreen(DOORWAY.right, DOORWAY.bottom)
        const midY = (tl.y + br.y) / 2
        gsap.set('.gate-scene', { transformOrigin: `${(tl.x + br.x) / 2}px ${midY}px` })
        gsap.set('.gate-door-l', { transformOrigin: `${tl.x}px ${midY}px` })
        gsap.set('.gate-door-r', { transformOrigin: `${br.x}px ${midY}px` })
        Object.assign(seamRef.current!.style, { left: `${(tl.x + br.x) / 2 - 3}px`, top: `${tl.y}px`, height: `${br.y - tl.y}px` })
      }
      place()
      ScrollTrigger.addEventListener('refreshInit', place)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pinRef.current,
          start: () => `top ${header()}px`,
          end: '+=170%',
          pin: true,
          scrub: 0.15,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (!announced && self.progress > 0.38) {
              announced = true
              announce()
            }
          },
        },
      })
      stRef.current = tl.scrollTrigger ?? null
      const ir = { immediateRender: false }
      tl.fromTo('.gate-cue', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 20, duration: 0.08, ...ir }, 0)
        .fromTo('.gate-seam', { opacity: 0 }, { opacity: 1, duration: 0.06, ...ir }, 0)
        .fromTo('.gate-door-l', { scaleX: 1, skewY: 0 }, { scaleX: 0.07, skewY: -9, duration: 0.48, ease: 'power1.in', ...ir }, 0.05)
        .fromTo('.gate-door-r', { scaleX: 1, skewY: 0 }, { scaleX: 0.07, skewY: 9, duration: 0.48, ease: 'power1.in', ...ir }, 0.05)
        .fromTo('.gate-seam', { opacity: 1 }, { opacity: 0, duration: 0.12, ...ir }, 0.2)
        .fromTo('.gate-title', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25, ...ir }, 0.2)
        .fromTo('.gate-scene', { scale: 1 }, { scale: 7, duration: 0.55, ease: 'power2.in', ...ir }, 0.42)
        .set(gate, { pointerEvents: 'none' }, 0.59)
        .fromTo('.gate-scene', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.14, ...ir }, 0.84)
        .set(gate, { visibility: 'hidden' }, 0.98)

      gsap.from('.gate-title > svg', { y: 18, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 })

      return () => ScrollTrigger.removeEventListener('refreshInit', place)
    }, gateRef)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    let live = true
    document.fonts?.ready.then(() => live && refresh())
    return () => {
      live = false
      window.removeEventListener('load', refresh)
      ctx.revert()
      stRef.current = null
    }
  }, [active])

  const enter = () => {
    const st = stRef.current
    if (st) window.scrollTo({ top: st.end + 4, behavior: 'smooth' })
  }

  return (
    <div>
      <div ref={pinRef}>{children}</div>
      {active && (
        <div ref={gateRef} className="fixed inset-0 z-[60] overflow-hidden" role="region" aria-label="Entrance: भारत through the डाक">
          <div className="gate-scene absolute inset-0 [will-change:transform,opacity]">
            <div className={`${layer} [&>svg]:h-full [&>svg]:w-full [&>svg]:overflow-visible`} dangerouslySetInnerHTML={{ __html: markup }} />
            <img src={asset('assets/gateway/door-left.svg')} alt="" aria-hidden className={`gate-door-l ${layer}`} />
            <img src={asset('assets/gateway/door-right.svg')} alt="" aria-hidden className={`gate-door-r ${layer}`} />
            <div ref={seamRef} className="gate-seam absolute w-1.5 bg-marigold opacity-0 shadow-[0_0_30px_10px_rgba(240,180,60,.8)] [will-change:opacity]" aria-hidden />
            <div className={`gate-title ${layer} [&>svg]:h-full [&>svg]:w-full`} dangerouslySetInnerHTML={{ __html: titleSvg }} />
          </div>
          <p className="sr-only">Bharat through the Dak</p>
          <div className="absolute inset-x-0 bottom-[3vh] flex justify-center">
            <button
              type="button"
              onClick={enter}
              className="gate-cue inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ivory-soft/50 bg-[#1d5a51]/85 px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory-soft shadow-lift hover:bg-[#1d5a51]"
            >
              <ChevronsDown className="h-4 w-4 animate-bounce motion-reduce:animate-none" aria-hidden />
              Scroll to open the door
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
