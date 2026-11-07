export const PLAY_TRACK_EVENT = 'dak:play-track'

export const playTrack = (id: string) => window.dispatchEvent(new CustomEvent<string>(PLAY_TRACK_EVENT, { detail: id }))
