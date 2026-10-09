# Forma — Molecular explorer

A continuous 3D workspace for finding and inspecting experimental molecular structures. Search and visual results float over a softly lit Mol* stage. There is no navigation bar, fixed sidebar, saved collection, autoplay, or promotional copy.

## Run

Requires Node.js 22.12+ and pnpm.

```sh
pnpm install
pnpm dev
```

Open `http://127.0.0.1:5187`. Build with `pnpm build`; deploy `dist`. No API keys or database are needed.

The repository includes the source, lockfile, bundled coordinates, thumbnails, fonts, licences and hosting manifest. Environment example files remain trackable.

## Search

Every search goes directly to the full experimental Protein Data Bank: 261,031 entries when verified on 9 October 2026. That total is fetched live. The initial arrangement includes 44 bundled structures for a varied, immediate starting view, followed by recent archive entries. Scrolling continues loading the archive.

Search by molecular name, organism, ligand, exact PDB ID, or a pasted RCSB structure URL. Results prioritize matching names, titles, source organisms, keywords, and ligands. Partial words use RCSB molecular-name completions; matching curated and previously seen names remain visible immediately. Broader annotation matches follow the name results or act as a labelled fallback when there are no name matches. A small explicit alias dictionary supports terms such as “glowing protein” and “DNA scissors”; the interpreted term is displayed.

Filters cover protein/DNA/RNA content, source organism and experiment. Sort by relevance, release date or resolution. Counts are structures, not unique molecules: several experiments can describe variants of the same molecule. Search uses debouncing, request cancellation, batched metadata, bounded caches, continuous pagination and an explicit Load more button.

## Viewing

- Drag to rotate, scroll or pinch to zoom; right-drag to pan.
- Switch between ribbons, a Gaussian surface, atom spacefill and ball-and-stick bonds.
- Click a residue for a nearby, edge-aware action card to focus it or isolate its chain. Scrolling or clicking outside dismisses it.
- Open the separate bottom-right display control to isolate chains, ligands or ions, choose colours, measure atom distances, export an image or copy a view link with the structure, camera, representation and colour.
- Fit / R returns to the complete structure. F hides search. / focuses search. Arrow keys move among results.
- Press **T** to cycle Porcelain (default), Graphite, Slate, Juniper and Aubergine. Themes blend without a status popup, and your last choice persists locally. Scientific colour modes are unchanged.
- The Structure panel stays open while switching chains or ligands, with the isolated component marked in its controls.
- The structure name opens experimental metadata and the original PDB record.

Coordinates load through a visible three-stage process: download, parsing and geometry. The scene fades between structures. Search loading, no-results, unavailable images and network failure states retain the current scene. Smooth motion is intentional and independent of device reduced-motion preferences. Titles crossfade in place without a positional jump. Camera focus uses eased transitions; context fades around an isolated component. Popovers share anchored positioning, animated entry/exit and keyboard-accessible custom menus. Soft opaque protection fields keep UI readable at close zoom. Phone layouts keep the stage and a horizontal result strip visible together.

## Scientific scope

All structures in this release are experimental PDB entries, including proteins, nucleic acids and their complexes. This is not a universal chemical catalogue or an AlphaFold prediction search. Assembly IDs come from RCSB metadata. Displayed atom counts are calculated from the actual loaded assembly. Water is omitted from the rendered representations.

Colours are illustrative. Surface mode is a smoothed Gaussian envelope, not an electron-density map. Camera motion is not molecular dynamics. Metadata and the source record identify fragments, engineered constructs and experimental details. Resolution is not a complete measure of model quality.

## Source

- `src/main.js`: interface, scene state, selection and interaction.
- `src/search.js`: complete archive search, metadata and aliases.
- `src/coordinates.js`: validated coordinate caching, bounded retries, aborts, server backoff and an official alternate download source.
- `src/molecule.js`: real Mol* renderer, assembly loading, lighting and component isolation.
- `src/style.css`, `src/refinement.css` and `src/polish.css`: continuous scene, protected foreground UI and responsive layout.
- `src/ui.js` and `src/motion.js`: anchored layers, custom choices, image loading and smooth motion.
- `src/themes.js` and `src/themes.css`: five complete palettes, interpolated colour transitions and keyboard theme cycling.
- `public/structures/`: 44 bundled BinaryCIF structures.
- `public/thumbs/`: previews rendered with the stage's lighting and palette.

Unbundled coordinates first use RCSB BinaryCIF, then the official RCSB full-entry text CIF endpoint if necessary. Both retain assembly operators and use the same mmCIF parser. Recovery is bounded, cancels on navigation, respects visible Retry-After values, rejects error documents and caches only valid responses (48 MB budget).

Public RCSB services are required for live search and unbundled structures. WebGL is required. Large assemblies can take longer to load. No login or personal data is needed by the application itself; hosted Site access is separately owner-private.

PDB coordinates: CC0. Mol*: MIT. Remote assembly images: RCSB PDB. Font and software licences are in `public/licenses`; see `public/credits.txt`. `RESEARCH.md` records original catalogue sources, and `SEARCH-RESEARCH.md` documents verified archive queries. `VERIFICATION.md` records checks and limits. The development-only thumbnail studio and phone layout page are excluded from the production build.


Coordinate recovery regression checks: `node tests/coordinate-recovery.mjs`. These use simulated server responses; the verification record also documents real browser fallback downloads.
