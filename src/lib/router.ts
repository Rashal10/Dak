import { useEffect, useState } from 'react'

export type Route = { view: 'home' } | { view: 'stamp'; slug: string }

function parse(hash: string): Route {
  const h = hash.replace(/^#\/?/, '')
  if (h.startsWith('stamp/')) return { view: 'stamp', slug: decodeURIComponent(h.slice(6)) }
  return { view: 'home' }
}

export const hrefFor = {
  home: '#/',
  stamp: (slug: string) => `#/stamp/${encodeURIComponent(slug)}`,
}

export function navigate(href: string, replace = false) {
  if (replace) history.replaceState(null, '', href)
  else history.pushState(null, '', href)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(location.hash))
  useEffect(() => {
    const on = () => setRoute(parse(location.hash))
    window.addEventListener('hashchange', on)
    window.addEventListener('popstate', on)
    return () => {
      window.removeEventListener('hashchange', on)
      window.removeEventListener('popstate', on)
    }
  }, [])
  return route
}
