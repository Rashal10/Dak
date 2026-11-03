import fs from 'node:fs'

const r2 = (n) => Math.round(n * 100) / 100
const around = (count, fn, offset = 0) =>
  Array.from({ length: count }, (_, i) => `<g transform="rotate(${r2((360 / count) * i + offset)})">${fn(i)}</g>`).join('')
const ring = (r, extra = '') => `<circle r="${r}" ${extra}/>`

const petal = (r0, r1, w) => {
  const m = (r0 + r1) / 2
  return `M0 ${-r0}C${w} ${-m + w * 0.2} ${w * 0.6} ${-r1 + w * 0.5} 0 ${-r1}C${-w * 0.6} ${-r1 + w * 0.5} ${-w} ${-m + w * 0.2} 0 ${-r0}Z`
}
const lotus = (r0, r1, w) =>
  `M0 ${-r0}C${w * 1.15} ${-r0 - (r1 - r0) * 0.25} ${w} ${-r1 + w * 0.3} ${w * 0.25} ${-r1}Q0 ${-r1 + w * 0.35} ${-w * 0.25} ${-r1}C${-w} ${-r1 + w * 0.3} ${-w * 1.15} ${-r0 - (r1 - r0) * 0.25} 0 ${-r0}Z`
const flower = (cx, cy, s) =>
  around(5, () => `<ellipse cx="0" cy="${-s}" rx="${s * 0.55}" ry="${s * 0.95}"/>`)
    .replace(/^/, `<g transform="translate(${cx} ${cy})">`) + `<circle r="${s * 0.45}"/></g>`

function mandala(ink, accent) {
  const body = [
    ring(14), ring(24),
    around(8, () => `<path d="${petal(24, 62, 15)}"/><path d="M0 -30V-54"/>`),
    around(8, () => `<path d="${petal(30, 56, 9)}"/>`, 22.5),
    ring(70),
    around(24, () => `<circle cy="-78" r="3.2" fill="${accent}" stroke="none"/>`),
    around(12, () => `<path d="${lotus(84, 168, 34)}"/><path d="${lotus(96, 150, 18)}"/><path d="M0 -104V-140"/>`),
    around(12, () => `<path d="${petal(100, 150, 14)}"/>`, 15),
    ring(178), ring(186),
    around(36, () => `<path d="M-16.3 -190A16.3 16.3 0 0 0 16.3 -190"/><circle cy="-200" r="2.4" fill="${accent}" stroke="none"/>`),
    ring(212),
    around(16, () => `<path d="${petal(214, 316, 46)}"/><path d="${petal(228, 294, 24)}"/><circle cy="-246" r="5"/>`),
    around(16, () => `<path d="${petal(222, 280, 15)}"/><circle cy="-292" r="4" fill="${accent}" stroke="none"/>`, 11.25),
    ring(318),
    around(48, () => `<circle cy="-328" r="3" fill="${accent}" stroke="none"/>`),
    ring(338),
    around(
      20,
      () =>
        `<path d="M0 -346C24 -352 36 -380 22 -404C12 -420 -8 -418 -12 -404C-16 -390 -2 -382 6 -390"/><path d="M2 -356C14 -362 20 -378 14 -392"/><circle cx="6" cy="-372" r="4"/>`,
    ),
    around(20, () => `<path d="M0 -350C10 -370 10 -392 0 -412C-10 -392 -10 -370 0 -350Z"/><path d="M0 -356V-404"/>`, 9),
    ring(424),
    around(
      16,
      () =>
        `<path d="${lotus(426, 560, 86)}"/><path d="${lotus(440, 534, 58)}"/><path d="${lotus(454, 510, 30)}"/><circle cy="-470" r="5" fill="${accent}" stroke="none"/>`,
    ),
    around(16, () => flower(0, -548, 9), 11.25),
    around(16, () => `<circle cy="-590" r="3.4" fill="${accent}" stroke="none"/>`, 11.25),
  ].join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-600 -600 1200 1200"><!-- Original full mandala drawn for DAK. Decorative, not historical artwork. --><g fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>\n`
}

const inks = {
  marigold: ['#f0b43c', '#f6d27e'],
  ivory: ['#f6eedd', '#f0b43c'],
  pink: ['#d98cbc', '#e8a8cf'],
  teal: ['#0f6e6e', '#c8402a'],
}
for (const [name, [ink, accent]] of Object.entries(inks)) {
  fs.writeFileSync(`public/assets/illustrations/mandala-${name}.svg`, mandala(ink, accent))
}
console.log('mandalas written:', Object.keys(inks).join(', '))
