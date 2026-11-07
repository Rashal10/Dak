import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Copy, Mail, Send, Share2, X } from 'lucide-react'
import type { Stamp } from '../data/stamps'
import { StampImage } from './StampImage'
import { LETTER_LIMITS, cleanLetter, emailLinksFor, isEmail, letterUrl, today } from '../lib/letter'
import { useToast } from '../lib/toast'

interface Props {
  stamp: Stamp
  defaultDear?: string
  onClose: () => void
}

const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export function SendStamp({ stamp, defaultDear = '', onClose }: Props) {
  const toast = useToast()
  const id = useId()
  const first = useRef<HTMLInputElement>(null)
  const [to, setTo] = useState('')
  const [dear, setDear] = useState(defaultDear)
  const [note, setNote] = useState('')
  const [from, setFrom] = useState('')
  const [tried, setTried] = useState(false)

  useEffect(() => {
    first.current?.focus({ preventScroll: true })
    document.body.dataset.composing = 'true'
    return () => {
      delete document.body.dataset.composing
    }
  }, [])

  const letter = useMemo(() => cleanLetter({ from, dear, note, sent: today() }), [from, dear, note])
  const url = letter ? letterUrl(stamp.slug, letter) : ''
  const badEmail = to.trim() !== '' && !isEmail(to.trim())
  const noteLeft = LETTER_LIMITS.note - Array.from(note).length

  const ready = () => {
    setTried(true)
    if (!letter) {
      toast('Add your name in the From line')
      return false
    }
    return true
  }

  const sendEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ready() || badEmail) {
      e.preventDefault()
      if (badEmail) toast('That email address doesn’t look right')
      return
    }
  }

  const copyLink = async () => {
    if (!ready()) return
    try {
      await navigator.clipboard.writeText(url)
      toast('Letter link copied')
    } catch {
      window.prompt('Copy this link to share your letter:', url)
    }
  }

  const share = async () => {
    if (!ready() || !letter) return
    try {
      await navigator.share({ title: `A stamp for you from ${letter.from}`, text: `A stamp from India's postal past, with a note from ${letter.from}.`, url })
    } catch {
      /* the visitor closed the share sheet */
    }
  }

  const emailLinks = letter && !badEmail ? emailLinksFor(to.trim(), stamp.title, stamp.issueYear, url, letter) : undefined

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#062e2e]/70 p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose()
        }
      }}
    >
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        onSubmit={(e) => e.preventDefault()}
        initial={{ y: 40, rotate: -2, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0, transition: { duration: 0.18 } }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="letter-paper relative my-auto w-full max-w-lg overflow-hidden rounded-[3px] text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]"
      >
        <div className="airmail-edge h-2.5" aria-hidden />
        <div className="relative px-5 pb-5 pt-4 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-indigo/70">
                <span lang="hi" className="font-deva text-[13px] normal-case tracking-normal">अंतर्देशीय पत्र</span> · Inland letter
              </p>
              <h2 id={`${id}-title`} className="mt-1 font-display text-2xl font-semibold leading-tight text-oxblood">
                Send this stamp to a friend
              </h2>
            </div>
            <div className="mr-8 w-16 shrink-0 rotate-3 bg-[#f8efd8] p-1 shadow-paper sm:w-20" aria-hidden>
              <StampImage stamp={stamp} />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div>
              <label htmlFor={`${id}-to`} className="form-label text-indigo/80">
                Their email <span className="normal-case tracking-normal text-ink-faded">(optional)</span>
              </label>
              <input
                ref={first}
                id={`${id}-to`}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="friend@example.com"
                aria-invalid={badEmail || undefined}
                className="form-field w-full border-indigo/35 font-letter text-lg text-indigo"
              />
              {badEmail && <p className="mt-1 text-xs text-vermilion-deep">That doesn’t look like an email address.</p>}
            </div>
            <div>
              <label htmlFor={`${id}-dear`} className="form-label text-indigo/80">
                Dear
              </label>
              <input
                id={`${id}-dear`}
                value={dear}
                maxLength={LETTER_LIMITS.dear}
                onChange={(e) => setDear(e.target.value)}
                placeholder="their name"
                className="form-field w-full border-indigo/35 font-letter text-lg text-indigo"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor={`${id}-note`} className="form-label text-indigo/80">
                  Your note
                </label>
                <span className={`font-mono text-[10px] ${noteLeft < 20 ? 'text-vermilion-deep' : 'text-ink-faded'}`} aria-live="polite">
                  {noteLeft}
                </span>
              </div>
              <textarea
                id={`${id}-note`}
                value={note}
                rows={4}
                onChange={(e) => setNote(Array.from(e.target.value).slice(0, LETTER_LIMITS.note).join(''))}
                placeholder="Saw this and thought of you…"
                className="letter-lines mt-1 block w-full resize-none rounded-none border-0 bg-transparent px-0.5 font-letter text-[19px] leading-[32px] text-indigo placeholder:text-ink-faded/60 focus:outline-none focus-visible:outline-offset-4"
              />
            </div>
            <div>
              <label htmlFor={`${id}-from`} className="form-label text-indigo/80">
                From <span className="normal-case tracking-normal text-vermilion-deep">*</span>
              </label>
              <input
                id={`${id}-from`}
                value={from}
                required
                maxLength={LETTER_LIMITS.from}
                autoComplete="name"
                onChange={(e) => setFrom(e.target.value)}
                placeholder="your name"
                aria-invalid={(tried && !letter) || undefined}
                className="form-field w-full border-indigo/35 font-letter text-lg text-indigo"
              />
              {tried && !letter && <p className="mt-1 text-xs text-vermilion-deep">Sign your letter so they know who it’s from.</p>}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <a href={emailLinks?.gmail ?? '#'} target="_blank" rel="noreferrer" onClick={sendEmail} className="btn-primary" aria-disabled={!emailLinks || undefined}>
              <Mail className="h-4 w-4" aria-hidden /> Open in Gmail
            </a>
            <a href={emailLinks?.mailto ?? '#'} onClick={sendEmail} className="btn-quiet border-indigo/30" aria-disabled={!emailLinks || undefined}>
              Use email app
            </a>
            <button type="button" onClick={copyLink} className="btn-quiet border-indigo/30">
              <Copy className="h-4 w-4" aria-hidden /> Copy link
            </button>
            {canShare && (
              <button type="button" onClick={share} className="btn-quiet border-indigo/30">
                <Share2 className="h-4 w-4" aria-hidden /> Share
              </button>
            )}
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-snug text-ink-soft">
            <Send className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            Anyone with the link can read your note. DAK keeps it in the link, and your email provider receives it when you open a draft.
          </p>
        </div>
        <button type="button" onClick={onClose} className="icon-btn absolute right-1 top-3 text-ink-soft" aria-label="Close without sending">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </motion.form>
    </motion.div>
  )
}
