import fs from 'node:fs'

const rows = JSON.parse(fs.readFileSync('scripts/stamp-sources.json', 'utf8'))

const LICENSES = {
  'GODL-India': {
    name: 'Government Open Data License, India (GODL-India)',
    url: 'https://www.data.gov.in/Godl',
    credit: 'India Post, Government of India',
  },
  'Public domain': {
    name: 'Public domain in India (PD-India)',
    url: 'https://commons.wikimedia.org/wiki/Template:PD-India',
    credit: 'India Post or the issuing postal administration (public domain)',
  },
}

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()

let md = `# Asset attribution

Stamp images in \`public/assets/stamps/\` are scans of real postage stamps from Wikimedia Commons.
Each was converted to WebP, cropped to the stamp and had its flat scanner background made
transparent with \`scripts/process-stamps.mjs\`. The stamp artwork itself was not altered.

Each stamp has a thumbnail (\`<slug>-sm.webp\`, up to 520 px) and an inspection size
(\`<slug>-lg.webp\`, up to 1200 px).

## Licences

| Licence | Terms | Required credit |
| --- | --- | --- |
${Object.entries(LICENSES)
  .map(([k, v]) => `| ${k} | [${v.name}](${v.url}) | ${v.credit} |`)
  .join('\n')}

The Commons file page is the authoritative record for each image. Check it before reusing an image
elsewhere.

## Stamp images

| Local files | Commons source page | Creator / institution | Licence | Required credit |
| --- | --- | --- | --- | --- |
`
for (const r of rows) {
  const lic = LICENSES[r.lic] ?? { credit: r.artist }
  md += `| \`stamps/${r.slug}-sm.webp\`, \`-lg.webp\` | [${esc(r.title)}](${r.page}) | ${esc(r.artist) || 'India Post'} | ${esc(r.lic)} | ${esc(lic.credit)}; scan via Wikimedia Commons |\n`
}

md += `
## Decorative artwork made for this project

These are not historical material.

| File | Description |
| --- | --- |
| \`patterns/ajrakh.svg\` | Star-lattice tile inspired by Ajrakh resist printing |
| \`patterns/bandhani.svg\` | Dot tile inspired by Bandhani tie-dye |
| \`patterns/paisley-block.svg\` | Paisley and flower repeat inspired by Sanganeri block printing |
| \`patterns/kolam.svg\` | Dot-and-loop tile inspired by kolam |
| \`patterns/jali.svg\` | Lattice tile inspired by carved stone jali screens |
| \`patterns/creeper.svg\` | Creeping vine tile |
| \`patterns/fish-scales.svg\` | Fish-scale tile inspired by Madhubani painting |
| \`patterns/lotus-line.svg\` | Small lotus and dot tile |
| \`patterns/border-paisley.svg\` | Paisley chain border |
| \`patterns/border-vine.svg\` | Creeper border inspired by Kalamkari |
| \`patterns/border-madhubani.svg\` | Hatched double-line border inspired by Madhubani painting |
| \`illustrations/toran.svg\` | Marigold and mango-leaf toran garland |
| \`illustrations/lotus-rosette.svg\` | Lotus rosette |
| \`illustrations/mandala-*.svg\` | Full line mandala in four inks, drawn by \`scripts/build-mandala.mjs\` |
| \`illustrations/tree-of-life.svg\` | Tree of life inspired by Kalamkari |
| \`illustrations/madhubani-fish.svg\` | Pair of fish inspired by Madhubani painting |
| \`illustrations/divider.svg\` | Lotus and paisley section divider |
| \`illustrations/envelope.svg\` | Vintage airmail envelope with a भारत stamp and postmark |
| \`illustrations/postmark.svg\` | Generic postmark, not a copy of a real cancellation |
| \`illustrations/sprig.svg\` | Botanical sprig |
| \`illustrations/favicon.svg\` | Site icon |
| \`textures/paper.webp\` | Paper grain texture, pre-rendered from procedural noise |

## Artwork supplied by the site owner

The source, creator and licence of these images were not recorded. Confirm you have the right to use
them before publishing.

| File | Description |
| --- | --- |
| \`src/assets/haveli-gateway.svg\`, \`src/assets/haveli-title.svg\`, \`gateway/door-left.svg\`, \`gateway/door-right.svg\` | Painted haveli gateway with carved doors, used as the entrance. Adapted from \`haveli-entrance.svg\`: split into wall, doors and title layers, doorway cut out, wall extended, title added |
| \`supplied/elephant-crest.webp\` | Ornamented elephant head in the footer corner |
| \`supplied/asian-elephant.webp\` | Illustrated "Asian Elephant" ₹7.00 stamp design. Not matched to a catalogued India Post issue, so it is shown as artwork, not as a collection record |

## Fonts

Fraunces, Hanken Grotesk, IBM Plex Mono and Tiro Devanagari Hindi, loaded from Google Fonts under
the SIL Open Font License.

## Not affiliated

DAK is an independent, non-commercial project and is not affiliated with or endorsed by India Post.
`

fs.writeFileSync('ATTRIBUTION.md', md)
console.log(`ATTRIBUTION.md written (${rows.length} stamps)`)
