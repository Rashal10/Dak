import type { CSSProperties } from 'react'
import type { MusicTrack } from '../data/music'
import { asset } from '../lib/asset'

export function RagaStamp({ track, unit = 5, across = 11, down = 14 }: { track: MusicTrack; unit?: number; across?: number; down?: number }) {
  const style = { '--perf': `${unit}px`, width: unit * across, height: unit * down } as CSSProperties
  return (
    <span className="raga-stamp" style={style} aria-hidden="true">
      <span className="raga-stamp-face">
        <img src={asset(track.painting)} alt="" width={track.paintingWidth} height={track.paintingHeight} draggable={false} />
        <span lang="hi" className="raga-stamp-india">भारत</span>
      </span>
    </span>
  )
}
