export const GATE_OPEN_EVENT = 'dak:gate-open'

// Vercel captures the deployment thumbnail with this user agent.
export const isVercelScreenshot = /\bVercelbot\b/i.test(navigator.userAgent)
