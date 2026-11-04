import { execFile } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { build } from 'esbuild'
import sharp from 'sharp'

const SITE = 'https://dak-puce.vercel.app'
const WIDTH = 1200
const HEIGHT = 630
const QUALITY = 82
const PARALLEL = 4
const STAMP_BOX = { w: 470, h: 490 }

const run = promisify(execFile)
const root = process.cwd()
const pub = path.join(root, 'public')
const fileUrl = (p) => pathToFileURL(path.resolve(p)).href
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && fs.existsSync(p))

async function loadStamps() {
  const out = await build({ entryPoints: ['src/data/stamps.ts'], bundle: true, format: 'esm', write: false, logLevel: 'silent' })
  const mod = await import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`)
  return mod.stamps
}

const FONTS =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..600&family=IBM+Plex+Mono:wght@500&family=Tiro+Devanagari+Hindi&display=block'

const shell = (body) => `<!doctype html><html><head><meta charset="UTF-8"><link href="${FONTS}" rel="stylesheet"><style>
*{box-sizing:border-box;margin:0}
html,body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}
body{position:relative;background:#e9d4a0 url(${fileUrl('public/assets/textures/paper.webp')});color:#2a1d17;font-family:Fraunces,Georgia,serif}
.edge{position:absolute;left:0;right:0;height:18px;background:repeating-linear-gradient(-45deg,#c8402a 0 26px,#f8efd8 26px 42px,#26305e 42px 68px,#f8efd8 68px 84px)}
.stage{position:absolute;inset:18px 0;display:grid;grid-template-columns:560px 1fr;align-items:center}
.left{position:relative;height:100%;display:flex;align-items:center;justify-content:center;padding:0 20px 0 56px}
.left img.stamp{transform:rotate(-2deg);filter:drop-shadow(0 16px 18px rgba(60,35,20,.42))}
.mark{position:absolute;right:6px;top:30px;width:150px;height:150px;opacity:.72;transform:rotate(-14deg)}
.right{padding:0 64px 0 36px;display:flex;flex-direction:column;height:100%;justify-content:center;gap:16px}
.label{font:500 19px 'IBM Plex Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:#26305e}
h1{font-weight:800;line-height:1.04;color:#6e1f1c}
.sub{font-style:italic;font-size:29px;color:#5b4637;line-height:1.25}
.brand{margin-top:22px;padding-top:18px;border-top:2px dashed rgba(110,31,28,.35);display:flex;align-items:baseline;gap:18px}
.dak{font-weight:800;font-size:64px;letter-spacing:.05em;line-height:1;color:#6e1f1c}
.deva{font-family:'Tiro Devanagari Hindi',serif;font-size:36px;color:#c8402a}
.tag{font-style:italic;font-size:25px;color:#5b4637}
</style></head><body>${body}</body></html>`

const postmark = (year) => `<svg class="mark" viewBox="0 0 150 150" aria-hidden="true">
<defs><path id="ring" d="M75 75m-56 0a56 56 0 1 1 112 0a56 56 0 1 1-112 0"/></defs>
<g fill="none" stroke="#9b1b1b"><circle cx="75" cy="75" r="72" stroke-width="3"/><circle cx="75" cy="75" r="42" stroke-width="2"/></g>
<text font-family="'IBM Plex Mono',monospace" font-size="15.5" letter-spacing="3" fill="#9b1b1b"><textPath href="#ring">INDIA IN MINIATURE · DAK ·</textPath></text>
<text x="75" y="84" text-anchor="middle" font-family="Fraunces,serif" font-weight="700" font-size="26" fill="#9b1b1b">${year}</text></svg>`

const titleSize = (t) => (t.length > 44 ? 46 : t.length > 30 ? 54 : t.length > 18 ? 64 : 76)

function stampCard(s) {
  const sub = [s.denomination, s.relatedLocation].filter(Boolean).join(' · ') || s.issuingAuthority
  const fit = Math.min(STAMP_BOX.w / s.image.width, STAMP_BOX.h / s.image.height)
  const size = `width:${Math.round(s.image.width * fit)}px;height:${Math.round(s.image.height * fit)}px`
  return shell(`<div class="edge" style="top:0"></div><div class="edge" style="bottom:0"></div>
<div class="stage">
  <div class="left"><img class="stamp" style="${size}" src="${fileUrl(`public/${s.image.lg}`)}" alt="">${postmark(s.issueYear)}</div>
  <div class="right">
    <p class="label">Indian stamp · ${s.issueYear}</p>
    <h1 style="font-size:${titleSize(s.title)}px">${esc(s.title)}</h1>
    <p class="sub">${esc(sub)}</p>
    <div class="brand"><span class="dak">DAK</span><span class="deva">॥ डाक ॥</span><span class="tag">India in Miniature</span></div>
  </div>
</div>`)
}

function homeCard() {
  const gateway = fs
    .readFileSync('src/assets/haveli-gateway.svg', 'utf8')
    .split('__MANDALA_L__').join(fileUrl('public/assets/illustrations/mandala-ivory.svg'))
    .split('__MANDALA_R__').join(fileUrl('public/assets/illustrations/mandala-marigold.svg'))
  const title = fs.readFileSync('src/assets/haveli-title.svg', 'utf8')
  const layer = 'position:absolute;inset:0;width:100%;height:100%'
  return shell(`<style>.fill>svg{width:100%;height:100%;overflow:visible}.gate-word{font-family:'Tiro Devanagari Hindi',serif}</style>
<div style="position:absolute;inset:0;background:#1d6a5f">
  <div class="fill" style="${layer}">${gateway}</div>
  <img src="${fileUrl('public/assets/gateway/door-left.svg')}" alt="" style="${layer}">
  <img src="${fileUrl('public/assets/gateway/door-right.svg')}" alt="" style="${layer}">
  <div class="fill" style="${layer}">${title}</div>
</div>`)
}

async function renderCard(html, name, tmp, profile) {
  const page = path.join(tmp, `${name}.html`)
  const shot = path.join(tmp, `${name}.png`)
  fs.writeFileSync(page, html)
  await run(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--allow-file-access-from-files',
    `--user-data-dir=${profile}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    '--virtual-time-budget=6000',
    `--screenshot=${shot}`,
    fileUrl(page),
  ])
  await sharp(shot)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'top' })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(path.join(pub, 'assets/og', `${name}.jpg`))
}

function previewPage({ s, folder, title, description }) {
  const url = `${SITE}/${folder}/${s.slug}.html`
  const image = `${SITE}/assets/og/${s.slug}.jpg`
  const fallback = `#/stamp/${encodeURIComponent(s.slug)}`
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="theme-color" content="#e9d4a0" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DAK · India in Miniature" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="${WIDTH}" />
    <meta property="og:image:height" content="${HEIGHT}" />
    <meta property="og:image:alt" content="${esc(s.image.alt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <script>
      location.replace('../' + (/^#\\//.test(location.hash) ? location.hash : '${fallback}'));
    </script>
  </head>
  <body style="background: #e9d4a0">
    <a href="../${fallback}">Open this stamp on DAK</a>
  </body>
</html>
`
}

function writePages(stamps) {
  for (const folder of ['s', 'l']) {
    fs.rmSync(path.join(pub, folder), { recursive: true, force: true })
    fs.mkdirSync(path.join(pub, folder), { recursive: true })
  }
  for (const s of stamps) {
    const year = `${s.title} (${s.issueYear})`
    fs.writeFileSync(
      path.join(pub, 's', `${s.slug}.html`),
      previewPage({ s, folder: 's', title: `${year} · DAK`, description: s.shortDescription }),
    )
    fs.writeFileSync(
      path.join(pub, 'l', `${s.slug}.html`),
      previewPage({
        s,
        folder: 'l',
        title: `A stamp has arrived for you: ${s.title}`,
        description: 'Open the envelope on DAK, then turn the stamp over to read the note.',
      }),
    )
  }
}

async function writeCards(stamps) {
  if (!chrome) throw new Error('Chrome or Edge is needed to draw the preview cards. Set CHROME_PATH.')
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dak-previews-'))
  fs.rmSync(path.join(pub, 'assets/og'), { recursive: true, force: true })
  fs.mkdirSync(path.join(pub, 'assets/og'), { recursive: true })
  const jobs = [{ name: 'home', html: homeCard() }, ...stamps.map((s) => ({ name: s.slug, html: stampCard(s) }))]
  let next = 0
  const worker = async (n) => {
    const profile = path.join(tmp, `profile-${n}`)
    while (next < jobs.length) {
      const job = jobs[next++]
      await renderCard(job.html, job.name, tmp, profile)
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, (_, n) => worker(n)))
  fs.rmSync(tmp, { recursive: true, force: true })
  return jobs.length
}

const stamps = await loadStamps()
const pagesOnly = process.argv.includes('--pages')
writePages(stamps)
const cards = pagesOnly ? 0 : await writeCards(stamps)
console.log(`${stamps.length * 2} preview pages, ${cards} cards`)
