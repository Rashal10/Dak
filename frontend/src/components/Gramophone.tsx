import { useEffect, useId, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { MusicTrack } from '../data/music'
import { RagaStamp } from './RagaStamp'

const VIEW = { w: 360, h: 270 }
const RECORD = { x: 136, y: 140, r: 88 }
const BELL = { x: 280, y: 74 }
const PETALS = 60
const MOTES = 16

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function hornPetals() {
  return Array.from({ length: 16 }, (_, i) => (i * 360) / 16)
}

function SurRing({ playing, spectrum, track }: { playing: boolean; spectrum: () => Uint8Array | null; track: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext('2d')
    if (!el || !ctx) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    el.width = VIEW.w * dpr
    el.height = VIEW.h * dpr
    ctx.scale(dpr, dpr)
    const heights = new Float32Array(PETALS)
    const motes = Array.from({ length: MOTES }, (_, i) => ({ life: i / MOTES, drift: Math.random(), size: 1.4 + Math.random() * 2 }))
    let frame = 0
    let last = performance.now()

    const draw = (now: number, animate: boolean) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const levels = animate ? spectrum() : null
      ctx.clearRect(0, 0, VIEW.w, VIEW.h)
      ctx.save()
      ctx.translate(RECORD.x, RECORD.y)
      for (let i = 0; i < PETALS; i++) {
        const mirrored = i < PETALS / 2 ? i : PETALS - 1 - i
        const bin = levels ? levels[3 + mirrored * 2] / 255 : 0
        const idle = animate ? 0.1 + 0.05 * Math.sin(now / 500 + i * 0.7) : 0.12
        const target = Math.max(idle, bin * bin)
        heights[i] += (target - heights[i]) * Math.min(1, dt * 16)
        const length = 9 + heights[i] * 30
        ctx.save()
        ctx.rotate((i / PETALS) * Math.PI * 2)
        ctx.translate(0, -RECORD.r - 3)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(4.6, -length * 0.5, 0, -length)
        ctx.quadraticCurveTo(-4.6, -length * 0.5, 0, 0)
        ctx.fillStyle = i % 2 ? '#f0b43c' : heights[i] > 0.45 ? '#ef6a3a' : '#c8402a'
        ctx.globalAlpha = 0.72 + heights[i] * 0.28
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()

      if (animate) {
        const loud = levels ? levels[8] / 255 : 0
        for (const mote of motes) {
          mote.life += dt * (0.1 + loud * 0.16)
          if (mote.life > 1) {
            mote.life = 0
            mote.drift = Math.random()
          }
          const angle = -2.35 + mote.drift * 1.2
          const distance = 18 + mote.life * 92
          const x = BELL.x + Math.cos(angle) * distance + Math.sin(mote.life * 7 + mote.drift * 9) * 5
          const y = BELL.y + Math.sin(angle) * distance
          ctx.globalAlpha = Math.sin(mote.life * Math.PI) * 0.9
          ctx.fillStyle = mote.drift > 0.5 ? '#f0b43c' : '#fbe7ae'
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(mote.life * 6 + mote.drift * 6)
          ctx.beginPath()
          ctx.ellipse(0, 0, mote.size * 1.5, mote.size * 0.7, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
        ctx.globalAlpha = 1
      }
    }

    const moving = playing && !reducedMotion()
    if (!moving) {
      draw(performance.now(), false)
      return
    }
    const loop = (now: number) => {
      draw(now, true)
      frame = requestAnimationFrame(loop)
    }
    draw(performance.now(), true)
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [playing, spectrum, track])

  return <canvas ref={canvas} className="raga-sur" aria-hidden="true" />
}

export function Gramophone({ track, playing, progress, spectrum }: { track: MusicTrack; playing: boolean; progress: number; spectrum: () => Uint8Array | null }) {
  const id = useId()
  const armAngle = playing ? 13 + Math.min(1, progress) * 21 : -6

  return (
    <div className="raga-stage" data-playing={playing} onContextMenu={(event) => event.preventDefault()}>
      <svg className="raga-niche" viewBox="0 0 360 270" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          d="M10 270V96c0-14 12-14 18-24 2-14 16-18 26-18 6-16 24-22 38-18 10-16 30-24 46-20 12-10 30-12 42-6 12-6 30-4 42 6 16-4 36 4 46 20 14-4 32 2 38 18 10 0 24 4 26 18 6 10 18 10 18 24v174z"
          fill="#f3dfa6"
          stroke="#a48741"
          strokeWidth="2"
        />
        <path
          d="M20 270V100c0-10 12-12 16-22 3-11 13-14 24-14 6-15 21-20 36-16 10-15 27-22 44-18 12-9 26-10 38-5 12-5 26-4 38 5 17-4 34 3 44 18 15-4 30 1 36 16 11 0 21 3 24 14 4 10 16 12 16 22v170z"
          fill="#bd542d"
          opacity=".92"
        />
      </svg>

      <svg className="raga-cabinet" viewBox="0 0 360 270" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#6b3a1e" /><stop offset=".5" stopColor="#40200f" /><stop offset="1" stopColor="#2a130a" />
          </linearGradient>
        </defs>
        <rect x="20" y="28" width="232" height="226" rx="10" fill={`url(#${id}-wood)`} stroke="#e7c46e" strokeWidth="1.6" />
        <rect x="27" y="35" width="218" height="212" rx="6" fill="none" stroke="#a48741" strokeWidth=".8" strokeDasharray="3 3" />
      </svg>

      <SurRing playing={playing} spectrum={spectrum} track={track.id} />

      <div className="raga-disc-rim">
        <div className="raga-disc" data-spinning={playing}>
          <div className="raga-disc-label">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={track.id}
                className="raga-disc-stamp"
                initial={{ scale: 1.5, opacity: 0, rotate: -14 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              >
                <RagaStamp track={track} unit={5} across={10} down={13} />
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <span className="raga-disc-gloss" aria-hidden="true" />
      </div>

      <svg className="raga-horn" viewBox="0 0 360 270" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff0bd" /><stop offset=".35" stopColor="#e1b96a" /><stop offset=".7" stopColor="#a48741" /><stop offset="1" stopColor="#6d5420" />
          </linearGradient>
          <radialGradient id={`${id}-throat`}>
            <stop stopColor="#1a0a05" /><stop offset=".3" stopColor="#3a160b" /><stop offset="1" stopColor="#7c2c17" />
          </radialGradient>
        </defs>
        <path d="M300 214c26-14 40-46 26-82-6-14-16-24-28-30l-14 16c10 6 16 14 20 24 8 24-2 46-16 56z" fill={`url(#${id}-brass)`} stroke="#5a431a" strokeWidth="1" />
        <g transform={`translate(${BELL.x} ${BELL.y}) rotate(-14) scale(1 .86)`}>
          <g className="raga-bell">
            {hornPetals().map((angle, i) => (
              <path key={angle} transform={`rotate(${angle})`} d="M0-14C-13-26-18-46 0-66 18-46 13-26 0-14z" fill={i % 2 ? '#c8402a' : `url(#${id}-brass)`} stroke="#5a431a" strokeWidth=".8" />
            ))}
            <circle r="26" fill={`url(#${id}-throat)`} stroke="#e7c46e" strokeWidth="1.5" />
            <circle r="9" fill="#0d0502" />
          </g>
        </g>
        <g className="raga-arm" style={{ transform: `rotate(${armAngle}deg)` }}>
          <path d="M296 212C272 206 244 186 214 152" fill="none" stroke="#3b230c" strokeWidth="9" strokeLinecap="round" />
          <path d="M296 212C272 206 244 186 214 152" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="6" strokeLinecap="round" />
          <g transform="translate(212 150) rotate(-40)">
            <circle r="13" fill={`url(#${id}-brass)`} stroke="#5a431a" />
            <circle r="8" fill="#f4e7c3" stroke="#a48741" />
            <circle r="2.5" fill="#6d5420" />
            <path d="M-3 12 0 24 3 12z" fill="#2f1c16" />
          </g>
        </g>
        <circle cx="296" cy="212" r="13" fill={`url(#${id}-brass)`} stroke="#5a431a" />
        <circle cx="296" cy="212" r="5.5" fill="#402e27" stroke="#f4d788" />
      </svg>

      <span className="raga-lamp" aria-hidden="true" />
    </div>
  )
}
