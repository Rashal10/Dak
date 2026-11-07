# DAK · India in Miniature · डाक

A showcase of real Indian postage stamps and the stories behind them.

The site is static. Stamp data lives in a local TypeScript file and every image is in `frontend/public/assets/`.

## Run it

Requires Node 18 or later.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and build static files into dist/
npm run preview    # serve dist/ locally
```

The build output in `frontend/dist/` uses relative paths, so it can be uploaded to any static host or sub-folder. Routing uses
the URL hash (`#/stamp/taj-mahal-1949`), so no server rewrites are needed.

For deployment, set the host's Root Directory to `frontend`, the build command to
`npm run build`, and the output directory to `dist` (relative to that root).

## Project layout

The website and its tool configuration live in `frontend/`. The README, attribution and
Git ignore rules remain at the repository root. Paths below are relative to the repository root.

| Path | Contents |
| --- | --- |
| `frontend/src/data/stamps.ts` | The 53 stamp records |
| `frontend/src/data/collections.ts` | Themed collections and the links between stamps |
| `frontend/src/data/stamp-dimensions.json` | Pixel sizes of the prepared images |
| `frontend/src/assets/haveli-gateway.svg` | The entrance gateway |
| `frontend/public/assets/stamps/` | Stamp scans: `-sm.webp` thumbnails and `-lg.webp` inspection sizes |
| `frontend/public/assets/{patterns,illustrations,textures}/` | Decorative SVGs |
| `frontend/public/assets/supplied/` | Artwork supplied by the site owner |
| `frontend/public/assets/og/` | Link preview cards, one per stamp plus `home.jpg` |
| `frontend/public/s/`, `frontend/public/l/` | Share pages that give each stamp and letter link its own preview, then open the site |
| `ATTRIBUTION.md` | Source, creator, licence and credit for every image |
| `frontend/scripts/` | Image preparation, mandala and attribution scripts |

## Adding a stamp

Run these commands from `frontend/`; paths in these steps are relative to that folder.

1. Download a scan with a clear licence (GODL-India or public domain on Wikimedia Commons) into a
   folder, named by slug with no extension, for example `raw/charminar-1931`.
2. Run `npm run stamps:process -- raw` to write the WebP files and record the dimensions.
   If a pale stamp loses part of its design with the scan background, rerun it with `STAMP_TOLERANCE=6`.
3. Add a record to `src/data/stamps.ts` and its source details to `scripts/stamp-sources.json`.
4. Run `npm run attribution` to update `../ATTRIBUTION.md` at the repository root.
5. Run `npm run previews` to draw its link preview card and write its share pages. This needs Chrome or Edge.

Read denominations off the stamp itself, and give an exact `issueDate` only when a source records it.

## Music player

The Ragamala gramophone pairs each recording with a public-domain Ragamala miniature, shown as a
painted stamp on the record and in the stamp sheet that works as the playlist. A petal ring and the
sitar-string progress bar respond to the live audio. Music keeps playing when the player is
minimized or a stamp is open, and phones get lock-screen controls. Motion is disabled for visitors
who prefer reduced motion.

Add recordings to `frontend/public/audio/` and describe each one in `frontend/src/data/music.ts`.
Use only recordings you are permitted to host and stream. Paintings live in
`frontend/public/assets/ragamala/`, and their credits are written by `npm run attribution`.

## Details about the stamp

Stamp details are stored in `frontend/src/data/stamps.ts`. Image sources, licences, and credits are documented in [ATTRIBUTION.md](ATTRIBUTION.md).

#### Made by Rashal!
