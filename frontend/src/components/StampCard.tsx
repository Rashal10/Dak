import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { Stamp } from '../data/stamps'
import { StampImage } from './StampImage'
import { hrefFor } from '../lib/router'
import { openStamp } from '../lib/opener'
import { seeded } from '../lib/rand'

interface Props {
  stamp: Stamp
    context: string
  meta?: boolean
  eager?: boolean
  className?: string
  imgClassName?: string
    bare?: boolean
}

const finePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function StampCard({ stamp, context, meta = true, eager, className = '', imgClassName = '', bare = false }: Props) {
  const rest = (seeded(stamp.id, context.length) - 0.5) * 2.4

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), { stiffness: 220, damping: 22 })
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 220, damping: 22 })

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!finePointer) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <figure className={`group relative flex flex-col ${className}`}>
      <a
        href={hrefFor.stamp(stamp.slug)}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          reset()
          openStamp(stamp.slug, `${context}-${stamp.id}`, e.currentTarget)
        }}
        onPointerMove={onMove}
        onPointerLeave={reset}
        aria-label={`${stamp.title}, ${stamp.issueYear}. Open details`}
        className={`relative flex flex-1 items-center justify-center rounded-[3px] [perspective:900px] ${bare ? '' : 'mount px-[6%] py-[12%]'}`}
      >
        <motion.div
          whileHover={finePointer ? { y: -6, rotate: rest * 0.4, scale: 1.02 } : undefined}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="w-full"
          style={{
            rotateX: rx,
            rotateY: ry,
            rotate: rest,
            width: bare ? '100%' : `${Math.min(100, 72 * Math.sqrt(stamp.image.width / stamp.image.height))}%`,
          }}
        >
          <div className={imgClassName}>
            <StampImage stamp={stamp} eager={eager} />
          </div>
        </motion.div>
      </a>
      {meta && (
        <figcaption className="mt-2.5 px-0.5">
          <p className="catalog">
            {stamp.issueYear}
            {stamp.denomination ? ` · ${stamp.denomination}` : ''}
          </p>
          <p className="font-display text-[15px] leading-snug text-ink">{stamp.title}</p>
        </figcaption>
      )}
    </figure>
  )
}
