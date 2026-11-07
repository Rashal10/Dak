import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown, LoaderCircle, Pause, Play, Repeat2, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import { musicTracks } from '../data/music'
import { stampById } from '../data/stamps'
import { asset } from '../lib/asset'
import { GATE_ENTERED_EVENT, hasEntered } from '../lib/entrance'
import { hrefFor } from '../lib/router'
import { useMusicPlayer } from '../lib/useMusicPlayer'
import { Gramophone } from './Gramophone'
import { RagaStamp } from './RagaStamp'
import { SitarStrings } from './SitarStrings'
import './MusicPlayer.css'

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

export function MusicPlayer({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(hasEntered)
  if (compact && !entered) setEntered(true)
  const trigger = useRef<HTMLButtonElement>(null)
  const minimizeButton = useRef<HTMLButtonElement>(null)
  const sheet = useRef<HTMLOListElement>(null)
  const id = useId()
  const player = useMusicPlayer()
  const { track, src, playing, buffering, spectrum } = player
  const sounding = playing && !buffering
  const hasAudio = musicTracks.some((song) => !!song.audioSrc)
  const status = player.error || (!src ? 'Recording coming soon' : buffering ? 'Lowering the needle…' : playing ? 'Now playing' : 'Press play to lower the needle')
  const related = stampById.get(track.stampId)

  useEffect(() => {
    const reveal = () => setEntered(true)
    if (hasEntered()) reveal()
    window.addEventListener(GATE_ENTERED_EVENT, reveal)
    return () => window.removeEventListener(GATE_ENTERED_EVENT, reveal)
  }, [])

  useEffect(() => {
    if (open) minimizeButton.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    const row = sheet.current
    const stamp = row?.children[player.selected] as HTMLElement | undefined
    if (!row || !stamp) return
    const box = row.getBoundingClientRect()
    const item = stamp.getBoundingClientRect()
    row.scrollLeft += item.left - box.left - (box.width - item.width) / 2
  }, [open, player.selected])

  const minimize = () => {
    setOpen(false)
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }))
  }

  const playIcon = buffering
    ? <LoaderCircle className="h-6 w-6 motion-safe:animate-spin" aria-hidden="true" />
    : playing ? <Pause className="h-6 w-6" fill="currentColor" aria-hidden="true" /> : <Play className="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden="true" />

  return (
    <aside
      aria-label="Music player"
      className="raga-dock"
      hidden={!entered}
      data-compact={compact && !open}
      data-open={open}
      onKeyDown={(event) => {
        if (open && event.key === 'Escape') {
          event.preventDefault()
          event.stopPropagation()
          minimize()
        }
      }}
    >
      <audio
        ref={player.audio}
        src={src}
        preload="metadata"
        onPlaying={player.onPlaying}
        onPause={player.onPause}
        onWaiting={player.onWaiting}
        onTimeUpdate={player.onTimeUpdate}
        onDurationChange={player.onDurationChange}
        onEnded={player.ended}
        onError={player.onError}
      />
      {!open ? (
        <div className="raga-pill">
          <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-label={`Open the Ragamala music player${playing ? `, now playing ${track.title}` : ''}`} aria-expanded={false} className="raga-pill-open">
            <span className="raga-pill-disc" data-spinning={sounding}>
              <img src={asset(track.painting)} alt="" draggable={false} />
            </span>
            {!compact && (
              <span className="raga-pill-text">
                <span lang="hi" className="raga-pill-deva">रागमाला</span>
                <span className="raga-pill-title">{playing ? track.title : 'Play a raga'}</span>
              </span>
            )}
            {sounding && (
              <span className="raga-pill-bars" aria-hidden="true">
                <i /><i /><i />
              </span>
            )}
          </button>
          {src && !compact && (
            <button type="button" onClick={player.toggle} aria-label={playing || buffering ? 'Pause music' : 'Play music'} className="raga-pill-play">
              {buffering ? <LoaderCircle className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" /> : playing ? <Pause className="h-5 w-5" fill="currentColor" aria-hidden="true" /> : <Play className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true" />}
            </button>
          )}
        </div>
      ) : (
        <motion.section
          aria-labelledby={`${id}-title`}
          className="raga-panel"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          <div className="toran raga-toran" aria-hidden="true" />
          <header className="raga-head">
            <div>
              <h2 id={`${id}-title`} className="raga-title">
                <span lang="hi" className="raga-title-deva">रागमाला</span>
                <span className="raga-title-en">A garland of ragas</span>
              </h2>
            </div>
            <div className="flex">
              <button ref={minimizeButton} type="button" onClick={minimize} aria-label="Minimize player; keep music playing" className="raga-icon"><ChevronDown className="h-5 w-5" aria-hidden="true" /></button>
              <button type="button" onClick={() => { player.pause(); minimize() }} aria-label="Close player and pause music" className="raga-icon"><X className="h-5 w-5" aria-hidden="true" /></button>
            </div>
          </header>

          <div className="raga-body">
            <figure className="raga-miniature">
              <div className="raga-frame">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={track.id}
                    src={asset(track.painting)}
                    alt={`${track.raga}: ${track.scene}`}
                    width={track.paintingWidth}
                    height={track.paintingHeight}
                    draggable={false}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </AnimatePresence>
              </div>
              <figcaption>
                <span lang="hi" className="raga-cap-deva">{track.ragaHindi}</span>
                <span className="raga-cap-scene">{track.scene}</span>
                <span className="raga-cap-credit">{track.paintingCredit}</span>
              </figcaption>
            </figure>

            <div className="raga-deck">
              <Gramophone track={track} playing={sounding} progress={player.duration ? player.position / player.duration : 0} spectrum={spectrum} />

              <div className="raga-now">
                <p className="raga-now-raga">{track.raga}</p>
                <h3 className="raga-now-title">{track.title}</h3>
                <p className="raga-now-detail">{track.detail}</p>
                <p role="status" className={`raga-now-status ${player.error ? 'raga-now-error' : ''}`}>{status}</p>
              </div>

              <SitarStrings
                position={player.position}
                duration={player.duration}
                disabled={!src || !player.duration}
                playing={sounding}
                valueText={`${clock(player.position)} of ${clock(player.duration)}`}
                spectrum={spectrum}
                onSeek={player.seek}
              />
              <div className="raga-times"><span>{clock(player.position)}</span><span>{clock(player.duration)}</span></div>

              <div className="raga-controls">
                <button type="button" onClick={() => player.setRepeat(!player.repeat)} aria-label="Repeat playlist" aria-pressed={player.repeat} className="raga-icon" data-on={player.repeat}><Repeat2 className="h-5 w-5" aria-hidden="true" /></button>
                <button type="button" onClick={() => player.skip(-1)} disabled={!hasAudio} aria-label="Previous track" className="raga-icon"><SkipBack className="h-6 w-6" fill="currentColor" aria-hidden="true" /></button>
                <button type="button" onClick={player.toggle} disabled={!src} aria-label={playing || buffering ? 'Pause music' : 'Play music'} className="raga-play">{playIcon}</button>
                <button type="button" onClick={() => player.skip(1)} disabled={!hasAudio} aria-label="Next track" className="raga-icon"><SkipForward className="h-6 w-6" fill="currentColor" aria-hidden="true" /></button>
                <button type="button" onClick={() => player.setMuted(!player.muted)} aria-label={player.muted ? 'Unmute music' : 'Mute music'} aria-pressed={player.muted} className="raga-icon">{player.muted || player.volume === 0 ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}</button>
              </div>
              <input
                type="range"
                aria-label="Volume"
                aria-valuetext={`${player.muted ? 0 : Math.round(player.volume * 100)} percent`}
                min={0}
                max={1}
                step={0.01}
                value={player.muted ? 0 : player.volume}
                onChange={(event) => { player.setVolume(Number(event.target.value)); player.setMuted(false) }}
                className="raga-volume"
                style={{ '--range-progress': `${player.muted ? 0 : player.volume * 100}%` } as CSSProperties}
              />
            </div>
          </div>

          <div className="raga-sheet">
            <p className="raga-sheet-head"><span className="shrink-0">Sheet of {musicTracks.length}</span>{related && <a href={hrefFor.stamp(related.slug)} onClick={minimize} className="raga-sheet-link">In the collection: {related.title} <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a>}</p>
            <ol ref={sheet} className="raga-sheet-row" tabIndex={0} aria-label="Songs">
              {musicTracks.map((song, index) => {
                const current = player.selected === index
                return (
                  <li key={song.id}>
                    <button type="button" onClick={() => player.select(index)} aria-label={`Play ${song.title}, ${song.raga}`} aria-pressed={current} className="raga-sheet-stamp" data-current={current}>
                      <RagaStamp track={song} unit={6} across={10} down={13} />
                      <AnimatePresence initial={false}>
                        {current && (
                          <motion.svg
                            className="raga-cancel"
                            viewBox="0 0 64 64"
                            aria-hidden="true"
                            initial={{ scale: 1.9, opacity: 0, rotate: -34 }}
                            animate={{ scale: 1, opacity: 0.86, rotate: -14 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 20 }}
                          >
                            <g fill="none" stroke="#9b1b1b"><circle cx="32" cy="32" r="29" strokeWidth="2.5" /><circle cx="32" cy="32" r="20" strokeWidth="1.5" /></g>
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </motion.section>
      )}
    </aside>
  )
}
