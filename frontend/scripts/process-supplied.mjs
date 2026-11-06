import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const [elephantStamp, elephantCrest] = process.argv.slice(2)
const out = path.resolve('public/assets/supplied')
fs.mkdirSync(out, { recursive: true })

if (elephantStamp) {
  const { data, info } = await sharp(fs.readFileSync(elephantStamp)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
  while (stack.length) {
    const p = stack.pop()
    if (seen[p]) continue
    seen[p] = 1
    const i = p * 4
    if (Math.min(data[i], data[i + 1], data[i + 2]) < 225) continue
    data[i + 3] = 0
    const x = p % w
    if (x > 0) stack.push(p - 1)
    if (x < w - 1) stack.push(p + 1)
    if (p >= w) stack.push(p - w)
    if (p < w * (h - 1)) stack.push(p + w)
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 }).webp({ quality: 88 }).toFile(path.join(out, 'asian-elephant.webp'))
}

if (elephantCrest) {
  await sharp(fs.readFileSync(elephantCrest)).trim({ threshold: 1 }).resize({ width: 480 }).webp({ quality: 86, alphaQuality: 95 }).toFile(path.join(out, 'elephant-crest.webp'))
}

console.log(fs.readdirSync(out).join('\n'))
