import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { Stamp } from '../data/stamps'
import { asset } from '../lib/asset'

interface Props {
  stamp: Stamp
  size?: 'sm' | 'lg'
  eager?: boolean
  className?: string
  draggable?: boolean
}

export function StampImage({ stamp, size = 'sm', eager, className = '', draggable = false }: Props) {
  const [failed, setFailed] = useState(false)
  const { width, height } = stamp.image
  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${stamp.title}, image unavailable`}
        style={{ aspectRatio: `${width} / ${height}` }}
        className={`flex w-full flex-col items-center justify-center gap-1 border border-dashed border-ink/30 bg-ivory-soft p-2 text-center ${className}`}
      >
        <ImageOff className="h-5 w-5 text-ink-faded" aria-hidden />
        <span className="catalog text-[10px]">Image unavailable</span>
      </div>
    )
  }
  return (
    <img
      src={asset(size === 'sm' ? stamp.image.sm : stamp.image.lg)}
      alt={stamp.image.alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={draggable}
      onError={() => setFailed(true)}
      className={`stamp-shadow block h-auto w-full select-none ${className}`}
    />
  )
}
