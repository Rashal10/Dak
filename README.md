# DAK · India in Miniature · डाक

A showcase of real Indian postage stamps and the stories behind them.

The site is static. Stamp data lives in a local TypeScript file and every image is in
`public/assets/`.

## Run it

Requires Node 18 or later.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and build static files into dist/
npm run preview    # serve dist/ locally
```

`dist/` uses relative paths, so it can be uploaded to any static host or sub-folder. Routing uses
the URL hash (`#/stamp/taj-mahal-1949`), so no server rewrites are needed.

## Project layout

| Path | Contents |
| --- | --- |
| `src/data/stamps.ts` | The 37 stamp records |
| `src/data/collections.ts` | Themed collections and the links between stamps |
| `src/data/stamp-dimensions.json` | Pixel sizes of the prepared images |
| `src/assets/haveli-gateway.svg` | The entrance gateway |
| `public/assets/stamps/` | Stamp scans: `-sm.webp` thumbnails and `-lg.webp` inspection sizes |
| `public/assets/patterns`, `illustrations`, `textures` | Decorative SVGs |
| `public/assets/supplied/` | Artwork supplied by the site owner |
| `public/assets/og/` | Link preview cards, one per stamp plus `home.jpg` |
| `public/s/`, `public/l/` | Share pages that give each stamp and letter link its own preview, then open the site |
| `ATTRIBUTION.md` | Source, creator, licence and credit for every image |
| `scripts/` | Image preparation, mandala and attribution scripts |

## Adding a stamp

1. Download a scan with a clear licence (GODL-India or public domain on Wikimedia Commons) into a
   folder, named by slug with no extension, for example `raw/charminar-1931`.
2. Run `npm run stamps:process -- raw` to write the WebP files and record the dimensions.
3. Add a record to `src/data/stamps.ts` and its source details to `scripts/stamp-sources.json`.
4. Run `npm run attribution`.
5. Run `npm run previews` to draw its link preview card and write its share pages. This needs Chrome or Edge.

Read denominations off the stamp itself, and give an exact `issueDate` only when a source records it.

## How it moves

- **Entrance.** The home page opens behind a painted haveli gateway reading "भारत through the
  डाक". Scrolling folds the carved doors back and carries you through the doorway onto the page.
  The doors ease toward the scroll position and appear on every visit to the top of the page.
- **Stamp view.** A stamp lifts off its card to the centre of a teal wall and a postmark lands on
  its corner. *Turn it over* (or F) flips it to a back with its catalogue entry, story and sources.
  Closing flies it back down onto its card.
- **Libraries.** GSAP runs the entrance, the hero opening and the scroll accents; Motion runs the
  stamp cards, the stamp view and the filters. They never animate the same element.
- **Reduced motion.** Visitors who prefer reduced motion skip the entrance and get simplified
  transitions.
