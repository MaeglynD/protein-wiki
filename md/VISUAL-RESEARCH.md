# protein.wiki visual curation research — 9 October 2026

## Recommendation

The user's visual complaint is well founded. A list of unrelated proteins rendered almost entirely as small chain-coloured ribbons still looks like one class of object. The opening collection should deliberately alternate silhouette, material, scale, molecular class and representation. The same scene recipe must produce the thumbnail and the initial stage view.

Mol*'s homepage is a gallery of capabilities, not merely an alphabetical or recent-entry PDB list. It includes CellPack and Petworld environments, coarse-grained membrane/virus scenes, orbital density, a folding trajectory, experimental structures and density maps. Those examples cannot all be reproduced accurately by changing PDB entries. The immediate improvement below remains within deposited experimental coordinates. Future environment/density/trajectory additions should declare their provenance and model type. [Official Mol* examples](https://molstar.org/)

The opening 16 below are a suggested visual rhythm, not an assertion that these are objectively the most scientifically important molecules. Keep this stable curated order when there is no query. Append archive discovery after the curated set; never let a background newest-entry query replace the curated first screen.

```js
// Override the existing records' initial scene recipes and order.
// representation values refer to Mol* names except 'surface', already an app alias.
// colorMode is a recommended new per-record default, not a current catalog requirement.
export const openingScenes = [
  { id:'1CWP', representation:'spacefill', colorMode:'chain-id' }, // faceted viral sphere
  { id:'1BNA', representation:'ball-and-stick', colorMode:'element-symbol' }, // chemical double helix
  { id:'7AHL', representation:'surface', colorMode:'chain-id' }, // broad cap, long pore
  { id:'5T4O', representation:'cartoon', colorMode:'chain-id' }, // head, shaft and rotor
  { id:'1SHS', representation:'surface', colorMode:'uniform' }, // windows in a hollow cage
  { id:'1IGT', representation:'cartoon', colorMode:'chain-id' }, // open asymmetric Y
  { id:'1AOI', representation:'cartoon', colorMode:'chain-id' }, // DNA around a spool
  { id:'1BRF', representation:'ball-and-stick', colorMode:'element-symbol' }, // tiny atomic iron protein
  { id:'2TMV', representation:'spacefill', colorMode:'chain-id' }, // helical viral tube
  { id:'4V9D', representation:'surface', colorMode:'chain-id' }, // irregular RNA/protein machine
  { id:'1YCE', representation:'cartoon', colorMode:'chain-id' }, // eleven-fold ring
  { id:'1CAG', representation:'ball-and-stick', colorMode:'element-symbol' }, // slender three-strand rope
  { id:'1PRC', representation:'cartoon', colorMode:'chain-id' }, // protein plus pigment chemistry
  { id:'1AON', representation:'surface', colorMode:'chain-id' }, // capped double barrel
  { id:'7RSA', representation:'surface', colorMode:'uniform' }, // compact cleft, searchable ribonuclease
  { id:'4HHB', representation:'cartoon', colorMode:'chain-id' }, // familiar four-lobed reference
];
```

If keeping hemoglobin as the initial stage object, move 4HHB into the first 4 so selected object and gallery remain connected. For a stronger first impression, start on 7AHL or 1SHS after validating their camera angles. The intention is for the first viewport to contain at least a sphere, a helix, a pore and an asymmetric molecular machine.

## Verified assembly and cost

Every row below was verified against RCSB entry and **assembly 1** API records on 2026-10-09. `atoms` is RCSB's assembly atom count (includes waters where deposited); rendered counts may differ because solvent/hydrogen are omitted. Bytes are the length of the downloaded BCIF response body, not compressed HTTP transfer size. The stored asymmetric-unit download can be much smaller than the generated assembly. All downloads returned HTTP 200.

Sources for each row: `https://data.rcsb.org/rest/v1/core/entry/ID`, `https://data.rcsb.org/rest/v1/core/assembly/ID/1`, and `https://models.rcsb.org/id.bcif`. Raw verification data: `work/visual-v3-metadata.json`. Retrieval script: `work/visual-v3-fetch.mjs`.

| PDB | Assembly atoms | BCIF bytes | Assembly content / visual reason |
|---|---:|---:|---|
| [1CWP](https://www.rcsb.org/structure/1CWP) | 227,040 | 338,794 | 180 coat proteins plus resolved RNA; complete icosahedral shell |
| [1BNA](https://www.rcsb.org/structure/1BNA) | 566 | 167,352 | Two DNA strands; slender atomic double helix |
| [7AHL](https://www.rcsb.org/structure/7AHL) | 17,207 | 1,183,400 | Seven proteins; mushroom-shaped pore |
| [5T4O](https://www.rcsb.org/structure/5T4O) | 23,568 | 1,394,651 | 22 protein chains; rotary machine's multi-part silhouette |
| [1SHS](https://www.rcsb.org/structure/1SHS) | 21,432 | 475,590 | 24 proteins; octahedral cage with large windows |
| [1IGT](https://www.rcsb.org/structure/1IGT) | 10,434 | 783,292 | Four proteins; flexible Y architecture |
| [1AOI](https://www.rcsb.org/structure/1AOI) | 12,385 | 777,987 | Eight histones plus two DNA strands; wrapped spool |
| [1BRF](https://www.rcsb.org/structure/1BRF) | 600 | 185,955 | One 53-residue protein and iron; readable atom-scale network |
| [2TMV](https://www.rcsb.org/structure/2TMV) | 66,346 | 237,658 | 49 coat proteins plus RNA segments; helical tube segment |
| [4V9D](https://www.rcsb.org/structure/4V9D) | 146,921 | 14,677,821 | 50 protein chains plus five RNA chains; large irregular ribosome |
| [1YCE](https://www.rcsb.org/structure/1YCE) | 7,040 | 1,521,531 | One ring of 11 c subunits; hollow hourglass cylinder |
| [1CAG](https://www.rcsb.org/structure/1CAG) | 674 | 165,835 | Three short experimental collagen-like peptides; rope |
| [1PRC](https://www.rcsb.org/structure/1PRC) | 10,288 | 720,647 | Four proteins and pigments/cofactors; chemistry within membrane machine |
| [1AON](https://www.rcsb.org/structure/1AON) | 58,870 | 2,916,219 | 14 GroEL + seven GroES; asymmetric capped barrel |
| [7RSA](https://www.rcsb.org/structure/7RSA) | 1,197 | 240,022 | One 124-residue protein; RNA-cleaving enzyme |
| [4HHB](https://www.rcsb.org/structure/4HHB) | 4,779 | 552,871 | Four protein chains plus hemes; four lobes |
| [1RB8](https://www.rcsb.org/structure/1RB8) | 306,720 | 446,453 | Experimental chimeric phage particle; 180 proteins plus resolved DNA |
| [1D66](https://www.rcsb.org/structure/1D66) | 1,762 | 286,084 | Two GAL4 fragments plus DNA duplex; an open DNA clamp |
| [1GRM](https://www.rcsb.org/structure/1GRM) | 272 | 196,274 | Two gramicidin chains; tiny ion-channel dimer |

Important: assembly 1 of 1YCE is **one 11-member ring**. Its asymmetric unit contains four rings, so using the raw model without assembly construction gives the wrong intended view. 1GRM contains five submitted NMR models; use the first model, and report that it is one representative NMR conformer. 1RB8 is **not** a plain wild-type phiX174 particle: it is alpha3 capsid/spike proteins with phiX174 protein J. Its name must acknowledge that.

## Eight new code-ready records

These are optional records, not app edits. Recommended priority: 7AHL, 1SHS, 1YCE, 1BRF, 7RSA, 1GRM. 1D66 and 1RB8 widen the next screen. They are experimental structures; no invented or AI-generated molecular coordinates are proposed. `remote:true` can be used until local coordinate/thumb assets are built, then removed. Current app engine must honor `colorMode` and real `ball-and-stick`, and both stage and thumbnail generator must consume the same defaults.

```js
export const additionalVisualRecords = [
  {
    id:'7AHL', name:'Alpha-hemolysin pore',
    subtitle:'A seven-part channel through a membrane',
    description:'Seven alpha-hemolysin proteins form a mushroom-shaped assembly with a long central pore. This experimental structure shows the protein channel; the surrounding lipid membrane is not included.',
    category:'Molecular machines',
    tags:['alpha hemolysin','alpha-haemolysin','pore','membrane','channel','sevenfold','mushroom','bacteria'],
    color:'#85B6B4', representation:'surface', colorMode:'chain-id', assembly:'1'
  },
  {
    id:'1SHS', name:'Heat-shock protein cage',
    subtitle:'A hollow shell with geometric windows',
    description:'Twenty-four small heat-shock proteins assemble into a hollow cage. Its octahedral symmetry leaves triangular and square openings between the subunits. The protein comes from a heat-loving archaeon.',
    category:'Molecular machines',
    tags:['heat shock','Hsp16.5','chaperone','archaea','cage','sphere','hollow','windows','octahedral','24'],
    color:'#D1AB7D', representation:'surface', colorMode:'uniform', assembly:'1'
  },
  {
    id:'1YCE', name:'ATP synthase rotor ring',
    subtitle:'Eleven subunits arranged around a hollow centre',
    description:'Eleven c subunits form the sodium-coupled rotor ring of a bacterial ATP synthase. This is the membrane rotor, rather than the complete ATP-producing machine. Sodium ions are resolved near the outside of the ring.',
    category:'Molecular machines',
    tags:['ATP','synthase','rotor','ring','motor','sodium','Na','energy','elevenfold','c subunit','hourglass'],
    color:'#9CB99B', representation:'cartoon', colorMode:'chain-id', assembly:'1'
  },
  {
    id:'1BRF', name:'Rubredoxin',
    subtitle:'A tiny protein organised around one iron atom',
    description:'This 53-residue electron-transfer protein comes from Pyrococcus furiosus. Four cysteine side chains surround its iron centre. The structure was determined by X-ray crystallography at 0.95 angstrom resolution.',
    category:'Molecular machines',
    tags:['rubredoxin','rubr','rubre','iron','electron transfer','electron transport','metal','cysteine','small','tiny','archaea'],
    color:'#A9C4CC', representation:'ball-and-stick', colorMode:'element-symbol', assembly:'1'
  },
  {
    id:'7RSA', name:'Ribonuclease A',
    subtitle:'A compact enzyme that cuts RNA',
    description:'Bovine pancreatic ribonuclease A is a compact, 124-residue enzyme that cleaves RNA. This phosphate-free experimental structure contains one protein chain and does not include an RNA substrate.',
    category:'Molecular machines',
    tags:['ribonuclease A','ribonuclease','RNase A','RNase','RNA','ribo','enzyme','pancreas','bovine','cleft'],
    color:'#BAA1CA', representation:'surface', colorMode:'uniform', assembly:'1'
  },
  {
    id:'1GRM', name:'Gramicidin channel',
    subtitle:'Two tiny peptide helices meet to form a pore',
    description:'Gramicidin A is a short antibiotic peptide that can form a transmembrane ion channel as a dimer. This view shows the first conformer from a five-model solution NMR ensemble, without a lipid membrane.',
    category:'Molecular machines',
    tags:['gramicidin','gramicidin A','antibiotic','peptide','ion','channel','pore','dimer','tiny','NMR'],
    color:'#B7C5B1', representation:'ball-and-stick', colorMode:'element-symbol', assembly:'1'
  },
  {
    id:'1D66', name:'GAL4 on DNA',
    subtitle:'Two protein fragments recognise a DNA sequence',
    description:'Two DNA-binding fragments of the yeast regulator GAL4 bind a DNA duplex. The extended protein connections and central coiled coil leave an unusually open outline around the DNA. This is a fragment complex, rather than full-length GAL4.',
    category:'DNA & RNA',
    tags:['GAL4','DNA','gene regulation','transcription','yeast','coiled coil','recognition','dimer','clamp'],
    color:'#A9B7D0', representation:'cartoon', colorMode:'chain-id', assembly:'1'
  },
  {
    id:'1RB8', name:'Chimeric bacteriophage capsid',
    subtitle:'An icosahedral shell with protruding spikes',
    description:'This experimentally determined chimeric particle combines alpha3 bacteriophage capsid and spike proteins with the DNA-binding protein J of phiX174. The assembly contains the resolved DNA segments; it does not model the entire viral genome.',
    category:'Viruses',
    tags:['bacteriophage','phage','alpha3','phiX174','chimeric','capsid','virus','shell','sphere','spikes','icosahedral'],
    color:'#CF9EAC', representation:'spacefill', colorMode:'chain-id', assembly:'1'
  }
];
```

The factual basis for these records is the corresponding RCSB entry linked in the table, its assembly endpoint, and its linked primary publication. For 7AHL the sevenfold pore and shape are documented by [Song et al., Science](https://doi.org/10.1126/science.274.5294.1859); the windowed 1SHS cage by [Kim et al., Nature](https://doi.org/10.1038/29106); the 1YCE rotor by [Meier et al., Science](https://doi.org/10.1126/science.1111199). The RCSB pages confirm the 1BRF identity/iron, 7RSA absence of bound RNA, 1GRM model count, 1D66 fragment scope, and 1RB8 chimeric composition.

## Scene recipes and safeguards

- **Capsids, 1CWP / 1RB8:** use spacefill at distant camera and chain/entity palette, not nearly transparent ribbons. Render the biological assembly, not an asymmetric fragment. Do not add an invented lipid envelope. Neither entry is an enveloped-virus reconstruction. Medium sphere quality is sufficient when far away; use the stored same-camera thumbnail while the first frame is being prepared.
- **DNA 1BNA:** ball-and-stick with conventional element colors, modest atom radius and clearly visible bonds. A three-quarter view makes the two backbones, grooves and paired bases legible. It is small enough to show atom detail at gallery scale.
- **7AHL pore:** a smooth surface with seven subtle chain colours and a three-quarter angle roughly 25–35 degrees away from looking down the pore axis. The cavity and stem must both be visible. Do not show only the broad top or use over-smoothed density that seals the channel. Verify surface resolution before committing the thumbnail.
- **1SHS cage:** a uniform warm surface makes light and shadow explain its square/triangular windows. Avoid Gaussian smoothing so coarse that the windows close. If that happens, use spacefill instead. A three-quarter angle through a large window is better than a flat front-on silhouette.
- **1YCE ring:** cartoon, moderate rod/ribbon thickness, view tilted from ring axis. Keep central negative space. Show only assembly 1, and no membrane slab unless explicitly labelled as a schematic context element.
- **1AON chamber:** surface or spacefill with alternating but related chain colours. A side-biased three-quarter angle makes the small lid distinguishable from the two main rings.
- **2TMV:** spacefill makes the coarse helical corrugation and tube legible. View from a tilted side with one opening visible. Label the displayed structure as a segment, not an entire rod-shaped virion.
- **4V9D ribosome:** smoother surface yields a materially different object from the cartoons. Prefer distinct coherent RNA/protein palettes if component themes are implemented. A surface over 147k atoms can be expensive: precompute the thumbnail, let the stage show an actual progress state, and do not initiate this expensive render on hover.
- **1BRF / 1GRM / 1CAG:** ball-and-stick brings atomic chemistry into the default collection. Element colours have meaning; do not recolour all atoms purely for aesthetic variety. Hide solvent and hydrogen consistently. 1BRF's Fe and sulfur coordination should remain visible; for 1GRM only one NMR model should be drawn.
- **1AOI:** the current cartoon is useful, but a mixed recipe is stronger: histone proteins as a muted surface or cartoon core, DNA as thicker coloured backbone with base blocks. Avoid washing out both into a uniform blob.
- **1PRC:** keep protein cartoon and pigment/cofactor atoms. A future real interaction could smoothly fade protein opacity and focus the *actual pigment network*; no copy-only reveal. Retain context at a low alpha so the cofactor arrangement is interpretable.
- **1IGT and 4HHB:** cartoons remain valuable when contrasted with the above. Thin transparency is not required for visual elegance; lighting, occlusion and a readable silhouette matter more.

All scene suggestions are visual design recommendations and require rendered QA; they have not been camera-tested in the actual app by this research agent. No specific quaternion is asserted as verified. Use a fixed per-entry tested camera and save it with the thumbnail recipe.

## Search implications

The user should be able to retrieve any currently displayed object's visible name with a prefix. `ribo` must retain Ribonuclease A **and** Ribosome; `rubre` must retrieve Rubredoxin. This is a retrieval guarantee, not a reason to hardcode only two typo cases: token-prefix matching on name, aliases, polymer descriptions and IDs should run on every loaded/curated record immediately while remote search follows. Rank exact title/token prefix above broad substring matches; merge by PDB identifier so curated aliases survive metadata hydration. A broad remote search is complementary to these guarantees. Search need not replace readable common names with uppercase deposition titles.

There should be one stable route back to the opening curated selection: emptying the query. Avoid a separate novelty feature or extra navigation section to expose this curation.
