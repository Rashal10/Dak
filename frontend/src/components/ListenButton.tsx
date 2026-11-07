import { Music2 } from 'lucide-react'
import type { MusicTrack } from '../data/music'
import { playTrack } from '../lib/playTrack'
import { useToast } from '../lib/toast'

export function ListenButton({ track, className = '' }: { track: MusicTrack; className?: string }) {
  const toast = useToast()
  const listen = () => {
    playTrack(track.id)
    toast(`Now playing ${track.title}`)
  }
  return (
    <button type="button" onClick={listen} className={`inline-flex min-h-[44px] items-center gap-1.5 text-left font-semibold underline decoration-1 underline-offset-2 ${className}`}>
      <Music2 className="h-4 w-4 shrink-0" aria-hidden />
      <span>Listen: {track.title}</span>
    </button>
  )
}
