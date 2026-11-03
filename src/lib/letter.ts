export interface Letter {
  from: string
  dear: string
  note: string
  sent: string
}

export const LETTER_LIMITS = { from: 40, dear: 40, note: 280 }

const chars = (s: string, max: number) => Array.from(s).slice(0, max).join('')

const blocked = (c: number) =>
  (c < 32 && c !== 10) || c === 127 || (c >= 0x200b && c <= 0x200f) || (c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069)

function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== 'string') return ''
  let s = Array.from(value.replace(/\r\n?/g, '\n'))
    .filter((ch) => !blocked(ch.codePointAt(0) ?? 0))
    .join('')
  s = multiline ? s.replace(/\n{3,}/g, '\n\n') : s.replace(/\n/g, ' ')
  return chars(s.trim(), max)
}

export function cleanLetter(input: { from?: unknown; dear?: unknown; note?: unknown; sent?: unknown }): Letter | null {
  const from = clean(input.from, LETTER_LIMITS.from)
  if (!from) return null
  const sent = typeof input.sent === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input.sent) && !Number.isNaN(Date.parse(input.sent)) ? input.sent : ''
  return { from, dear: clean(input.dear, LETTER_LIMITS.dear), note: clean(input.note, LETTER_LIMITS.note, true), sent }
}

function toBase64Url(bytes: Uint8Array) {
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(text: string) {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4)
  const bin = atob(b64)
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

export function encodeLetter(letter: Letter): string {
  const json = JSON.stringify({ f: letter.from, d: letter.dear || undefined, n: letter.note || undefined, s: letter.sent || undefined })
  return toBase64Url(new TextEncoder().encode(json))
}

export function decodeLetter(payload: string): Letter | null {
  if (!payload || payload.length > 3000 || !/^[A-Za-z0-9_-]+$/.test(payload)) return null
  try {
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(fromBase64Url(payload)))
    if (!data || typeof data !== 'object') return null
    return cleanLetter({ from: data.f, dear: data.d, note: data.n, sent: data.s })
  } catch {
    return null
  }
}

export const letterHref = (slug: string, letter: Letter) => `#/letter/${encodeURIComponent(slug)}/${encodeLetter(letter)}`

export const letterUrl = (slug: string, letter: Letter) => `${location.origin}${location.pathname}${letterHref(slug, letter)}`

export const today = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const formatSent = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export const isEmail = (s: string) => /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]{2,}$/.test(s)

export function emailLinksFor(to: string, stampTitle: string, stampYear: number, url: string, letter: Letter) {
  const subject = `A stamp for you from ${letter.from}`
  const body = [
    `Dear ${letter.dear || 'friend'},`,
    '',
    `I am sending you a stamp from India's postal past: ${stampTitle} (${stampYear}).`,
    'Open the envelope here, then turn the stamp over to read my note:',
    url,
    '',
    letter.from,
  ].join('\r\n')
  const gmail = new URL('https://mail.google.com/mail/')
  gmail.search = new URLSearchParams({ view: 'cm', fs: '1', su: subject, body }).toString()
  if (to) gmail.searchParams.set('to', to)
  const mailtoQuery = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20')
  return { gmail: gmail.href, mailto: `mailto:${encodeURIComponent(to)}?${mailtoQuery}` }
}
