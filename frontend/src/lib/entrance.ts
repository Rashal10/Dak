export const GATE_OPEN_EVENT = 'dak:gate-open'
export const GATE_ENTERED_EVENT = 'dak:gate-entered'

let entered = false

export const hasEntered = () => entered

export function markEntered() {
  if (entered) return
  entered = true
  window.dispatchEvent(new Event(GATE_ENTERED_EVENT))
}

// Vercel and other preview bots photograph the page, so they get the opened hall instead of the door.
export const isVercelScreenshot =
  /vercel|headless|screenshot|lighthouse|bot\b|crawler|spider/i.test(navigator.userAgent) || navigator.webdriver === true
