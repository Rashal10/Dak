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

Paths below are relative to \`frontend/public/assets/\` unless they start with \`frontend/\`.

Stamp images in \`frontend/public/assets/stamps/\` are scans of real postage stamps from Wikimedia Commons.
Each was converted to WebP, cropped to the stamp and had its flat scanner background made
transparent with \`frontend/scripts/process-stamps.mjs\`. The stamp artwork itself was not altered.

Each stamp has a thumbnail (\`<slug>-sm.webp\`, up to 520 px) and an inspection size
(\`<slug>-lg.webp\`, up to 1200 px).

## Licences

| Licence | Terms | Required credit |
| --- | --- | --- |
${Object.entries(LICENSES)
  .map(([k, v]) => `| ${k} | [${v.name}](${v.url}) | ${v.credit} |`)
  .join('\n')}

The Commons file page is the authoritative record for each image. Check it before reusing an image elsewhere.

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
| \`illustrations/mandala-*.svg\` | Full line mandala in four inks, drawn by \`frontend/scripts/build-mandala.mjs\` |
| \`illustrations/tree-of-life.svg\` | Tree of life inspired by Kalamkari |
| \`illustrations/madhubani-fish.svg\` | Pair of fish inspired by Madhubani painting |
| \`illustrations/divider.svg\` | Lotus and paisley section divider |
| \`illustrations/envelope.svg\` | Vintage airmail envelope with a भारत stamp and postmark |
| \`illustrations/postmark.svg\` | Generic postmark, not a copy of a real cancellation |
| \`illustrations/sprig.svg\` | Botanical sprig |
| \`illustrations/favicon.svg\` | Site icon |
| \`textures/paper.webp\` | Paper grain texture, pre-rendered from procedural noise |

## Fonts

Fraunces, Hanken Grotesk, IBM Plex Mono and Tiro Devanagari Hindi, loaded from Google Fonts under the SIL Open Font License.

## Not affiliated

DAK is an independent, non-commercial project and is not affiliated with or endorsed by India Post.
`

const PAINTINGS = [
  ['shankara', 'Bhairava Raga, Folio from a Ragamala', 'Los Angeles County Museum of Art', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Bhairava_Raga,_Folio_from_a_Ragamala_(Garland_of_Melodies)_LACMA_M.71.1.14.jpg'],
  ['i-wanted-to-leave', 'Todi Ragini, from a Ragamala Series', 'Cleveland Museum of Art', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Anonymous_-_Todi_Ragini,_from_a_Ragamala_Series_-_2013.340_-_Cleveland_Museum_of_Art.tiff'],
  ['tumhi-dekho-naa', 'Radha and Krishna in a Palace (Ragamala)', 'Rijksmuseum', 'CC0', 'https://commons.wikimedia.org/wiki/File:Radha_en_Krishna_in_een_paleis_(Ragamala),_RP-T-1993-477.jpg'],
  ['roslyn', 'Madhumadhavi Ragini, Page from a Dispersed Ragamala Series', 'The Metropolitan Museum of Art', 'Public domain', 'https://commons.wikimedia.org/wiki/File:2%D0%B0_Madhumadhavai_Ragini_Page_from_a_Dispersed_Ragamala_Series_Marwar_1640-50_Metmuseum..jpg'],
  ['tilak-kamod', 'Vilaval Ragini, Page from a Dispersed Ragamala Series', 'The Metropolitan Museum of Art', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Vilaval_Ragini,_Page_from_a_Dispersed_Ragamala_Series_ca_1680_Metmuseum.jpg'],
  ['rama-rama', 'Enthroned Rama and Sita receive homage from their monkey and bear allies', 'Cleveland Museum of Art', 'CC0', 'https://commons.wikimedia.org/wiki/File:Clevelandart_2018.117.jpg'],
  ['mera-satguru-pyaara', 'Guru Nanak with Mardana and Bala, c. 1830', 'Collection not recorded', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Guru_Nanak_With_Mardana_and_Bala,_circa_1830.jpg'],
  ['the-burning-ghat', 'The Burning Ghats, Benares, by Marianne North, 1878', 'See source page', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Marianne_North_(1830-1890)_-_%27The_Burning_Ghats._Benares._India._October_1878%27_-_WD3232_-_British_Library.jpg'],
]

md += `
## Ragamala paintings

Paintings in \`public/assets/ragamala/\` were cropped and converted to WebP for the music player.

| Local file | Work | Collection | Licence | Source |
| --- | --- | --- | --- | --- |
${PAINTINGS.map(([file, work, collection, licence, url]) => `| \`ragamala/${file}.webp\` | ${work} | ${collection} | ${licence} | [Wikimedia Commons](${url}) |`).join('\n')}
`

md += `
## Music

The recordings in \`public/audio/\` are used with the artist's permission and are not covered by this
project's licences. Do not reuse them elsewhere.

| Local file | Recording | Artists |
| --- | --- | --- |
| \`audio/shankara.mp3\` | Shankara | Rishab Rikhiram Sharma |
| \`audio/i-wanted-to-leave.mp3\` | I Wanted to Leave (sitar version) | SYML and Rishab Rikhiram Sharma |
| \`audio/tumhi-dekho-naa.mp3\` | Tumhi Dekho Naa (sitar lofi) | Rishab Rikhiram Sharma and Shankar-Ehsaan-Loy |
| \`audio/roslyn.mp3\` | Roslyn | Rishab Rikhiram Sharma |
| \`audio/tilak-kamod.mp3\` | Tilak Kamod | Rishab Rikhiram Sharma |
| \`audio/rama-rama.mp3\` | Rama Rama | Rishab Rikhiram Sharma |
| \`audio/mera-satguru-pyaara.mp3\` | Mera Satguru Pyaara (Live in Chandigarh) | Rishab Rikhiram Sharma |
| \`audio/the-burning-ghat.mp3\` | The Burning Ghat | Rishab Rikhiram Sharma |
`

fs.writeFileSync(new URL('../../ATTRIBUTION.md', import.meta.url), md)
console.log(`ATTRIBUTION.md written (${rows.length} stamps)`)
