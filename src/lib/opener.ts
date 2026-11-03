import { hrefFor, navigate } from './router'

export const opener: { layoutKey: string | null; returnFocus: HTMLElement | null; baseHash: string } = {
  layoutKey: null,
  returnFocus: null,
  baseHash: '#/',
}

export function openStamp(slug: string, layoutKey: string | null, trigger?: HTMLElement | null) {
  const current = location.hash || '#/'
  if (!current.startsWith('#/stamp/')) opener.baseHash = current
  opener.layoutKey = layoutKey
  opener.returnFocus = trigger ?? (document.activeElement as HTMLElement | null)
  navigate(hrefFor.stamp(slug), current.startsWith('#/stamp/'))
}
