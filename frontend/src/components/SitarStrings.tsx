import { useEffect, useRef, type CSSProperties } from 'react'

const STRINGS = 7
const HEIGHT = 58
const FRETS = 19
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

interface Props {
  position: number
  duration: number
  disabled: boolean
  playing: boolean
  valueText: string
  spectrum: () => Uint8Array | null
  onSeek: (time: number) => void
}

export function SitarStrings({ position, duration, disabled, playing, valueText, spectrum, onSeek }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const plucks = useRef(new Float32Array(STRINGS))
  const pluckAt = useRef(new Float32Array(STRINGS).fill(0.5))
  const lastString = useRef(-1)
  const wake = useRef<() => void>(() => {})
  const progress = useRef(0)
  const share = duration ? Math.min(1, position / duration) : 0

  useEffect(() => {
    progress.current = share
    wake.current()
  }, [share])

  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext('2d')
    if (!el || !ctx) return
    const still = reducedMotion()
    let frame = 0
    let running = false
    let width = 0

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      width = el.clientWidth
      el.width = Math.max(1, width * dpr)
      el.height = HEIGHT * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = (now: number) => {
      const levels = playing ? spectrum() : null
      ctx.clearRect(0, 0, width, HEIGHT)
      const head = progress.current * width
      for (let f = 0; f <= FRETS; f++) {
        const x = (f / FRETS) ** 0.86 * width
        ctx.beginPath()
        ctx.moveTo(x - 2, 4)
        ctx.quadraticCurveTo(x + 3, HEIGHT / 2, x - 2, HEIGHT - 4)
        ctx.strokeStyle = x <= head ? '#f0b43c' : '#a4874166'
        ctx.lineWidth = 1.4
        ctx.stroke()
      }
      let active = false
      for (let s = 0; s < STRINGS; s++) {
        const y = 9 + (s * (HEIGHT - 18)) / (STRINGS - 1)
        const band = levels ? (levels[2 + s * 7] / 255) ** 2 : 0
        const pluck = plucks.current[s]
        const amp = still ? 0 : band * 3.4 + pluck * 4.5
        if (pluck > 0.01) {
          plucks.current[s] = pluck * 0.93
          active = true
        } else {
          plucks.current[s] = 0
        }
        const paint = (from: number, to: number, color: string) => {
          if (to <= from) return
          ctx.beginPath()
          for (let x = from; x <= to; x += 4) {
            const u = x / width
            const envelope = Math.sin(Math.PI * u)
            const wave = Math.sin(u * (9 + s * 3) * Math.PI + now / (46 + s * 5))
            const focus = pluck > 0.01 ? Math.exp(-((u - pluckAt.current[s]) ** 2) / 0.04) : 0
            const dy = amp * wave * (envelope * 0.65 + focus)
            if (x === from) ctx.moveTo(x, y + dy)
            else ctx.lineTo(x, y + dy)
          }
          ctx.strokeStyle = color
          ctx.lineWidth = 0.7 + (STRINGS - s) * 0.14
          ctx.stroke()
        }
        paint(0, head, s % 2 ? '#ffe7a6' : '#f0b43c')
        paint(Math.floor(head / 4) * 4, width, '#f7ecd2a6')
      }
      ctx.beginPath()
      ctx.moveTo(head, 1)
      ctx.lineTo(head + 6, HEIGHT / 2)
      ctx.lineTo(head, HEIGHT - 1)
      ctx.lineTo(head - 6, HEIGHT / 2)
      ctx.closePath()
      ctx.fillStyle = '#f0b43c'
      ctx.strokeStyle = '#3b230c'
      ctx.lineWidth = 1
      ctx.fill()
      ctx.stroke()
      return active || (!!levels && !still)
    }

    const tick = (now: number) => {
      if (render(now)) {
        frame = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }
    const start = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(tick)
    }

    size()
    render(performance.now())
    start()
    wake.current = () => {
      render(performance.now())
      start()
    }
    const observer = new ResizeObserver(() => {
      size()
      render(performance.now())
    })
    observer.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      wake.current = () => {}
    }
  }, [playing, spectrum])

  const strum = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const s = Math.round(((event.clientY - box.top - 9) / (HEIGHT - 18)) * (STRINGS - 1))
    if (s < 0 || s >= STRINGS || s === lastString.current) return
    lastString.current = s
    plucks.current[s] = 1
    pluckAt.current[s] = (event.clientX - box.left) / box.width
    wake.current()
  }

  return (
    <div className="raga-sitar" onPointerMove={strum} onPointerLeave={() => (lastString.current = -1)} style={{ height: HEIGHT } as CSSProperties}>
      <canvas ref={canvas} aria-hidden="true" />
      <input
        type="range"
        aria-label="Track progress"
        aria-valuetext={valueText}
        min={0}
        max={duration || 1}
        step={0.1}
        value={Math.min(position, duration || 1)}
        disabled={disabled}
        onChange={(event) => onSeek(Number(event.target.value))}
      />
    </div>
  )
}
