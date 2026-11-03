export const GATE_OPEN_EVENT = 'dak:gate-open'

// Vercel and other preview bots photograph the page, so they get the opened hall instead of the door.
export const isVercelScreenshot =
  /vercel|headless|screenshot|lighthouse|bot\b|crawler|spider/i.test(navigator.userAgent) || navigator.webdriver === true
