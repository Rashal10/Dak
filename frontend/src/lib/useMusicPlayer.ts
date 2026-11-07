import { useCallback, useEffect, useRef, useState } from 'react'
import { musicTracks } from '../data/music'
import { asset } from './asset'
import { PLAY_TRACK_EVENT } from './playTrack'

type AudioContextClass = typeof AudioContext

const localAudioOnly = musicTracks.every((song) => !song.audioSrc || !/^https?:/i.test(song.audioSrc))

export function useMusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null)
  const graph = useRef<{ context: AudioContext; analyser: AnalyserNode; levels: Uint8Array<ArrayBuffer> } | null>(null)
  const playOnSelect = useRef(false)
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [error, setError] = useState('')
  const track = musicTracks[selected]
  const src = track.audioSrc ? (/^https:\/\//i.test(track.audioSrc) ? track.audioSrc : asset(track.audioSrc)) : undefined

  const listen = useCallback((element: HTMLAudioElement) => {
    if (graph.current) {
      void graph.current.context.resume()
      return
    }
    const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextClass }).webkitAudioContext
    if (!Context || !localAudioOnly) return
    try {
      const context = new Context()
      const analyser = context.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.8
      context.createMediaElementSource(element).connect(analyser)
      analyser.connect(context.destination)
      graph.current = { context, analyser, levels: new Uint8Array(analyser.frequencyBinCount) }
      void context.resume()
    } catch {
      graph.current = null
    }
  }, [])

  const spectrum = useCallback(() => {
    const live = graph.current
    if (!live) return null
    live.analyser.getByteFrequencyData(live.levels)
    return live.levels
  }, [])

  const play = useCallback(async (element: HTMLAudioElement) => {
    setError('')
    listen(element)
    try {
      await element.play()
    } catch (reason) {
      if (audio.current !== element || (reason instanceof DOMException && reason.name === 'AbortError')) return
      setPlaying(false)
      setBuffering(false)
      setError('Unable to play this track. Please try again.')
    }
  }, [listen])

  useEffect(() => {
    const element = audio.current
    if (!element) return
    element.volume = volume
    element.muted = muted
  }, [selected, volume, muted])

  useEffect(() => {
    if (playOnSelect.current && src && audio.current) void play(audio.current)
    playOnSelect.current = false
  }, [selected, src, play])

  const pause = () => {
    playOnSelect.current = false
    audio.current?.pause()
    setPlaying(false)
    setBuffering(false)
  }

  const toggle = () => {
    if (!audio.current || !src) return
    if (!audio.current.paused) pause()
    else void play(audio.current)
  }

  const select = (index: number, autoplay = true) => {
    if (index === selected) {
      if (autoplay && src && audio.current) {
        audio.current.currentTime = 0
        void play(audio.current)
      }
      return
    }
    pause()
    playOnSelect.current = autoplay
    setPosition(0)
    setDuration(0)
    setError('')
    setSelected(index)
  }

  const skip = (direction: number) => {
    const candidates = musicTracks.map((song, index) => song.audioSrc ? index : -1).filter((index) => index >= 0)
    if (!candidates.length) return
    const target = direction > 0
      ? candidates.find((index) => index > selected) ?? candidates[0]
      : [...candidates].reverse().find((index) => index < selected) ?? candidates[candidates.length - 1]
    select(target, !!audio.current && !audio.current.paused)
  }

  const ended = () => {
    setPlaying(false)
    setBuffering(false)
    const next = musicTracks.findIndex((song, index) => index > selected && !!song.audioSrc)
    const first = musicTracks.findIndex((song) => !!song.audioSrc)
    if (next >= 0) select(next)
    else if (repeat && first >= 0) select(first)
  }

  const seek = (time: number) => {
    if (!audio.current || !Number.isFinite(duration) || duration <= 0) return
    audio.current.currentTime = Math.max(0, Math.min(time, duration))
    setPosition(audio.current.currentTime)
  }

  const playTrack = (id: string) => {
    const index = musicTracks.findIndex((song) => song.id === id)
    if (index < 0) return
    if (index !== selected) select(index)
    else if (audio.current?.paused) toggle()
  }

  const remote = useRef({ toggle, skip, seek, playTrack })
  useEffect(() => {
    remote.current = { toggle, skip, seek, playTrack }
  })

  useEffect(() => {
    const onPlayTrack = (event: Event) => remote.current.playTrack((event as CustomEvent<string>).detail)
    window.addEventListener(PLAY_TRACK_EVENT, onPlayTrack)
    return () => window.removeEventListener(PLAY_TRACK_EVENT, onPlayTrack)
  }, [])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.detail,
      album: `DAK Ragamala · ${track.raga}`,
      artwork: [{ src: new URL(asset(track.painting), location.href).href, sizes: `${track.paintingWidth}x${track.paintingHeight}`, type: 'image/webp' }],
    })
  }, [track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const session = navigator.mediaSession
    const actions: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => remote.current.toggle()],
      ['pause', () => remote.current.toggle()],
      ['previoustrack', () => remote.current.skip(-1)],
      ['nexttrack', () => remote.current.skip(1)],
      ['seekto', (details) => remote.current.seek(details.seekTime ?? 0)],
    ]
    for (const [action, handler] of actions) {
      try {
        session.setActionHandler(action, handler)
      } catch {
        continue
      }
    }
    return () => actions.forEach(([action]) => {
      try {
        session.setActionHandler(action, null)
      } catch {
        return
      }
    })
  }, [])

  useEffect(() => {
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
  }, [playing])

  return {
    audio, track, src, selected, playing, buffering, position, duration, volume, muted, repeat, error,
    toggle, pause, select, skip, ended, seek, setVolume, setMuted, setRepeat, spectrum,
    onPlaying: () => { setPlaying(true); setBuffering(false); setError('') },
    onPause: () => { setPlaying(false); setBuffering(false) },
    onWaiting: () => setBuffering(true),
    onTimeUpdate: () => setPosition(audio.current?.currentTime ?? 0),
    onDurationChange: () => {
      const value = audio.current?.duration ?? 0
      setDuration(Number.isFinite(value) ? value : 0)
    },
    onError: () => {
      setPlaying(false)
      setBuffering(false)
      setError('This recording is unavailable. Try another track.')
    },
  }
}
