# Iteration 6 verification — 9 October 2026

- Removed the visible interaction hint, its event listeners and all associated styles. The viewer retains its accessible control description.
- Production preview rendered 7AHL without the hint and reported no console errors. The central dock and separate display button both ended at y=690 px in the 1280 × 720 viewport.
- Git ignore checks covered 24 representative dependency, build, cache, environment, hosting, log, editor and local-note paths. All 125 tracked source files and three environment template examples remained included.
- Production build passed: 1,281 modules; 25.02 KB gzipped interface JS, 10.42 KB CSS and 855.66 KB lazy Mol* renderer.

---

# Iteration 5 verification — 9 October 2026

- Bond hover on the real 1EC4 structure displayed plain text: `B | 6HC 4 [auth 16] | O3'[idx 527] — 6HT 5 [auth 17] | P[idx 552]`. Mol* fallback labels now disable HTML styling and strip any residual tags; the tooltip continues to use textContent.
- Theme module check confirmed the no-preference default and full cycle: Porcelain → Graphite → Slate → Juniper → Aubergine → Porcelain. Browser T cycling visited all five themes without a status popup; 0 no longer changed the theme. Existing saved preferences remain valid.
- Repeated A → B → A chain isolation on 1EC4 kept the Structure panel open and marked the current chain. Changing colour cleared the active chip. The same selection state is restored when reopening the panel.
- Hovered first-row chain chips had 7 px clearance at the top of their scroll container. Padding also reserves space for keyboard focus outlines.
- Clear distances has an eraser icon. Click-to-isolate helper text is removed from both chain and ligand sections.
- Production preview at 1280 × 720 rendered the real 830-atom 1EC4 assembly in Porcelain, repeated chain switching successfully, and reported no console errors.
- Production build passed: 1,281 modules; 25.08 KB gzipped interface JS, 10.50 KB CSS, 855.65 KB lazy Mol* renderer. These checks cover the changed interactions, not an exhaustive retest of the entire archive.

---

The following records previous iterations. The theme shortcut, order, default and theme status message are superseded above.

# Iteration 4 verification — 9 October 2026

## Download recovery

- Browser simulation deliberately rejected the primary models.rcsb.org BCIF request for 3CUP. The app automatically fetched the real files.rcsb.org/download/3CUP.cif response (HTTP 200), parsed text CIF and rendered the assembly. 3BTN subsequently loaded from the same alternate source while the primary host was cooling down.
- Seven Node regression scenarios passed: network/CORS fallback with successful cache reuse; HTML response rejection; 429 Retry-After across structures; cancellation without retries or cached stale data; permanent failure followed by manual recovery; bounded third-attempt recovery; both hosts cooling down without additional requests.
- Both reported entries currently respond successfully from official sources. The historical CORS screenshot does not identify an underlying HTTP failure. RCSB documents static downloads as unrestricted and API throttling as HTTP 429: https://www.rcsb.org/docs/programmatic-access/web-apis-overview . Download endpoints: https://www.rcsb.org/docs/programmatic-access/file-download-services .
- Failure recovery uses the same deposited entry and assembly operators; it never substitutes a different structure or a third-party proxy.

## Interaction and theme checks

- Desktop checked at 1280 × 720, phone at 390 × 844 in a browser iframe; these are not physical-device tests.
- Slate, Graphite, Juniper, Aubergine and Porcelain reviewed on the real rendered scene. Light-theme thumbnails, controls, custom colour menu and foreground protection were inspected. Theme persists across reload and cycles via 0 with a named status message.
- Display button and central dock share the bottom baseline. Desktop inspector right edge and button right edge both measured 1250 px at 1280 px viewport width. Phone panel stays within 16 px side margins, and the separate button remains aligned after search collapse.
- A two-line 3CUP title measured 64 px height / 32 px line height. Info centre and first-line centre both measured y=73.333 px. Title changes use opacity only; measured label transform remained none and its top remained 36 px.
- First-row tiles now have 16 px top clearance beyond the 6 px fade mask, allowing hover translation and focus outlines without clipping.
- Contextual actions appeared near the picked residue; Focus residue and Isolate chain worked. Focus recorded 28 intermediate camera frames. Contextual cards take their position from actual pointer release, flip/clamp within the scene and dismiss on wheel or outside click.
- Motion remained smooth while matchMedia('(prefers-reduced-motion: reduce)') was true. There is no device-following motion option.
- Porcelain phone gallery, panel and immersive stage visually checked. Ribo immediately retained Ribosome and Ribonuclease A and returned 1,535 archive results; Rubre immediately retained Rubredoxin. Clearing search restored the curated collection.
- Bottom-left wordmark removed. Selection marking changed from Mol*'s default neon edge to a restrained warm highlight.

## Production

- JavaScript syntax checks passed. Vite build passed: 1,281 modules, 25.04 KB gzipped interface JS, 10.45 KB CSS and 855.62 KB lazy Mol* renderer.
- Production preview loaded remote 3CUP, rendered the complete molecular scene and exercised the new interaction layout. The deliberate failure harness was removed and was never part of the production build.
- Large structures still depend on WebGL performance. Live search and unbundled coordinates still depend on public archive services; bounded fallback reduces transient failures but cannot guarantee upstream availability.

---

The following records the previous iteration. Its device-following motion policy is superseded above.

# Interaction refinement verification — 9 October 2026

## Search and data

- Full experimental PDB count: 261,031, obtained from RCSB at runtime.
- `Ribo` immediately retains Ribosome and Ribonuclease A; the name-first archive query returned 1,535 entries.
- `Rubre` immediately retains Rubredoxin; the name-first query returned 166 entries, including Rubredoxin and Rubrerythrin. Consecutive 24-entry archive pages had no overlap.
- `human insulin` returned 623 name/metadata matches. Human + protein + X-ray + highest-resolution controls returned 407 PDB matches in the production browser. The leading API results were insulin at 0.92, 0.9519 and 0.97 Å.
- Exact `4hhb` returned only 4HHB. Nonsense input returned no results. Suggestions are cached per token, requests are cancelled on new input, and broader annotation results remain pageable after the stronger name matches.
- Filter Reset and Clear search restored the stable 44-structure opening collection. Clearing search no longer substitutes a list of recent depositions.
- A live, unbundled result, 1LKM, loaded as a 3,516-atom assembly with real chain and iron controls.
- All 44 bundled coordinate files and all 44 rendered thumbnails are present. The thumbnail studio successfully loaded and rendered every curated structure with the current normal-scene lighting, representation, colour and orientation recipes.

## Interaction and visual checks

- Desktop rendering checked at 1280 × 720; wide layout inspected in a 1920 × 1080 iframe; phone layout inspected in a 390 × 844 iframe. These are browser checks, not physical-device tests.
- Soft opaque foreground protection kept search, gallery, title and dock readable during close zoom that filled the viewport with geometry.
- Filter, information, display and selection popovers were checked for anchoring and clear foreground precedence. Native selects were replaced by custom combobox/listbox controls.
- Contains, organism, experiment and order controls were exercised together in the production build. Keyboard ArrowDown, End, Enter and Escape were exercised on phone filter controls. Focus returns to the relevant trigger.
- Motion was checked in the browser's reduced-motion mode and with the app's explicit Smooth transitions override. A ligand focus recorded intermediate camera frames with a 950 ms eased transition. Return-to-whole-structure also recorded intermediate frames.
- Search collapse/reopen now translates a stable-size WebGL canvas. A captured intermediate frame confirmed the molecule remains visible during the slide; resizing the buffer during that animation had previously blanked it.
- Thumbnail decoding/fades, card hover styling, scene changes, representation and colour changes, loading progress, information panels and component-context fades were visually inspected.
- Ribbons, Gaussian surface, spacefill atoms and ball-and-stick bonds rendered correctly. Hard shadow artifacts observed during QA were removed; ambient occlusion retains soft geometric depth.
- Picking and iron isolation were exercised. A real two-atom measurement returned 6.00 Å; selection and distance cleanup controls were exercised.
- A coordinate file was temporarily withheld to verify the error/retry UI, then restored. Retry successfully loaded the DNA double helix. HTML fallback responses are rejected and failed coordinate buffers are evicted, preventing a cached error from defeating Retry.
- Copy view link included structure ID, representation, colour and camera. The production build restored an atom/sequence-colour Rubredoxin view, retained the complete URL on reload, and handled subsequent hash navigation. Pending metadata requests cannot override newer navigation.
- Export invoked Mol*'s native PNG screenshot and reached the success state without application errors. The in-app browser did not expose a download event or OS file path; filesystem completion of that download was not independently verified.
- Final production checks reported no application console errors. The deliberate missing-coordinate test produced expected development errors only.

## Build and scope

- JavaScript syntax checks passed. Final Vite production build passed: 1,277 modules, about 23.43 KB gzipped interface JavaScript, 8.05 KB CSS and 855.54 KB lazy-loaded Mol* renderer.
- Public RCSB services are required for live search, remote thumbnails and unbundled coordinates. WebGL is required; very large assemblies can take longer to render.
- This is experimental PDB search, not an AlphaFold, PubChem, CellPack or molecular-dynamics database. Counts are PDB entries, not unique molecular species.
- Surface mode is a Gaussian molecular envelope, not measured electron density. Element/chain colours are illustrative. Coordinate provenance and source records remain available from the structure title.
- Temporary isolation, selections and distance annotations are not included in view links.
- Default motion follows device preference. The display controls allow an explicit Smooth transitions or Reduced motion preference.
- The development-only thumbnail, phone and wide-layout pages are excluded from the production bundle.
