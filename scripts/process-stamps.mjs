import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const rawDir = process.argv[2]
const outDir = path.resolve('public/assets/stamps')
const dimsFile = path.resolve('src/data/stamp-dimensions.json')
const dims = fs.existsSync(dimsFile) ? JSON.parse(fs.readFileSync(dimsFile, 'utf8')) : {}

const TOLERANCE = 34

for (const slug of fs.readdirSync(rawDir).sort()) {
  const buf = fs.readFileSync(path.join(rawDir, slug))
  if (buf.length < 2000) continue
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const px = (x, y) => (y * w + x) * 4

  const corners = [px(1, 1), px(w - 2, 1), px(1, h - 2), px(w - 2, h - 2)].map((i) => [data[i], data[i + 1], data[i + 2]])
  const bg = [0, 1, 2].map((c) => corners.map((k) => k[c]).sort((a, b) => a - b)[1])
  const dist = (i) => Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]))

  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
  while (stack.length) {
    const p = stack.pop()
    if (seen[p]) continue
    seen[p] = 1
    const i = p * 4
    if (dist(i) > TOLERANCE) continue
    data[i + 3] = 0
    const x = p % w
    if (x > 0) stack.push(p - 1)
    if (x < w - 1) stack.push(p + 1)
    if (p >= w) stack.push(p - w)
    if (p < w * (h - 1)) stack.push(p + w)
  }

  const base = sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 })
  const trimmed = await base.png().toBuffer({ resolveWithObject: true })
  const tw = trimmed.info.width
  const th = trimmed.info.height

  const lg = await sharp(trimmed.data)
    .resize({ width: Math.min(tw, 1200), height: Math.min(th, 1200), fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 90 })
    .toBuffer({ resolveWithObject: true })
  fs.writeFileSync(path.join(outDir, `${slug}-lg.webp`), lg.data)
  const sm = await sharp(trimmed.data)
    .resize({ width: 520, height: 520, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 85 })
    .toBuffer({ resolveWithObject: true })
  fs.writeFileSync(path.join(outDir, `${slug}-sm.webp`), sm.data)

  dims[slug] = { w: lg.info.width, h: lg.info.height }
  console.log(slug.padEnd(30), `${w}x${h} -> ${lg.info.width}x${lg.info.height}`, 'bg', bg.join(','))
}

fs.writeFileSync(dimsFile, JSON.stringify(dims, null, 2) + '\n')
