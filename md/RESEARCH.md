# protein.wiki catalogue: sources and interpretation

Verified on 9 October 2026 against the RCSB PDB Data API. The catalogue contains 36 experimental PDB entries. Each chosen entry and biological assembly 1 was retrieved successfully from `https://data.rcsb.org/rest/v1/core/entry/{id}` and `https://data.rcsb.org/rest/v1/core/assembly/{id}/1`. Polymer-entity and nonpolymer-entity endpoints were also checked where organism identity or a highlighted cofactor mattered.

The short descriptions are original explanatory copy. Categories are discovery themes, not biological taxonomies: “Inside you” includes nonhuman homologues and model peptides that illustrate familiar human biology. Species is stated in the description when relevant and should also remain visible in source metadata.

## Assembly and interpretation notes

- **4HHB:** deoxygenated human hemoglobin. Show four heme groups, but never imply that oxygen molecules are present in this model.
- **1EMA:** GFP with its chromophore represented within the polymer. A generic nonpolymer-ligand selector will not find it. The feature intentionally explores the whole fold.
- **1AON:** the GroEL/GroES complex has fourteen GroEL and seven GroES chains; one end is capped.
- **1FHA:** assembly 1 builds the 24-subunit H-chain ferritin cage from a much smaller asymmetric unit. The model does not contain a complete iron mineral core.
- **6VSB:** an engineered prefusion spike ectodomain with one receptor-binding domain up, not full-length native spike or a whole SARS-CoV-2 virion. Many flexible residues and glycan portions are unresolved.
- **1IGT:** intact mouse IgG2a, not a human antibody; no bound antigen.
- **1ATP:** catalytic subunit of protein kinase A with ATP, manganese ions and an inhibitory peptide. It does not depict a completed phosphate-transfer reaction.
- **1AOI:** nucleosome core with 146 base pairs of DNA and eight histones.
- **1EHZ:** yeast phenylalanine tRNA, with no attached amino acid.
- **4INS:** porcine insulin. Assembly 1 has two peptide chains forming one insulin molecule. Do not call this chosen view an insulin hexamer.
- **1CAG:** synthetic collagen-like model peptide, not a full collagen molecule or fibre.
- **1J4N:** bovine aquaporin-1 tetramer. Water passes through each individual subunit, rather than a single shared central water pore.
- **1LYZ:** hen egg-white lysozyme without bound sugar substrate.
- **1MBN:** sperm-whale myoglobin; avoid implying that an oxygen molecule is shown.
- **5T4O:** inhibited E. coli ATP synthase at 6.9 Å resolution. A static structural model; neither spin animation nor a transition between rendering styles is a scientific simulation of its real motion.
- **4V9D:** assembly 1 is a single bacterial ribosome complex, with approximately 147,000 atoms including solvent. The entire deposited entry contains additional crystallographic content. BinaryCIF is preferable to legacy PDB format for this large structure.
- **1CWP:** assembly 1 has 180 viral coat proteins plus short resolved RNA segments; roughly 227,000 atoms. It is a capsid with partial genome coordinates, not a complete model of all viral contents.
- **1C3W:** trimeric bacteriorhodopsin/lipid assembly. Retinal and surrounding lipids are present; this is the ground-state structure.
- **1RCX:** spinach RuBisCO in a non-activated state with ribulose-1,5-bisphosphate. Do not call its bound ligand carbon dioxide.
- **4OO8:** engineered inactive Cas9, one guide RNA and one target DNA strand in assembly 1. The noncomplementary DNA strand is not present. The whole entry contains two copies of this complex.
- **1TUP:** DNA-binding core domains of p53, not full-length tetrameric p53.
- **1BL8:** KcsA potassium-channel tetramer. Preferred over 1K4C because 1K4C contains additional Fab antibody fragments. A feature selector for its potassium must include ions as well as organic ligands.
- **2POR:** three porin beta barrels, each forming its own pore.
- **1PRC:** bacterial photosynthetic reaction centre with its pigment/electron-transfer cofactors.
- **3WU2:** cyanobacterial photosystem II dimer. Many different bound cofactors are present; a generic ligand highlight is broader than a specific manganese-cluster selection.
- **1UBQ:** free human ubiquitin, not ubiquitin attached to a target protein.
- **1F88:** assembly 1 is a software-generated two-molecule rhodopsin assembly. Author-assigned assemblies 2 and 3 are monomers. The copy acknowledges the two visible molecules without claiming a universal physiological dimer.
- **1TQN:** human CYP3A4 structural construct with heme, without a bound drug.
- **1HSG:** HIV protease with indinavir (component MK1). The record title cites a study of HIV-II protease, but this entry’s actual polymer entity is labelled HIV-1 protease. The catalogue uses the accurate broader name “HIV protease”.
- **1CRN:** crambin, 46 residues. Avoid a specific physiological-function claim: the catalogue describes the verified fold and seed origin.
- **1DGF:** tetrameric human catalase, including heme and NADPH (component NDP).
- **1BEB:** bovine beta-lactoglobulin. Assembly 1 is a monomer and contains no bound nutrient in the central pocket.
- **1ZIK:** a mutant leucine-zipper fragment of yeast GCN4. It has two helices but no DNA-binding region or DNA.
- **2HYY:** isolated human Abl kinase domain with imatinib, not full-length Abl.
- **2TMV:** a short reconstructed helical segment with 49 coat proteins and corresponding RNA fragments. It does not depict the entire tobacco mosaic virus rod.

## Primary source index

| PDB entry | Catalogue subject | Primary record |
| --- | --- | --- |
| 4HHB | Hemoglobin | [RCSB PDB](https://www.rcsb.org/structure/4HHB) |
| 1EMA | Green fluorescent protein | [RCSB PDB](https://www.rcsb.org/structure/1EMA) |
| 1BNA | DNA double helix | [RCSB PDB](https://www.rcsb.org/structure/1BNA) |
| 1AON | Protein-folding chamber | [RCSB PDB](https://www.rcsb.org/structure/1AON) |
| 1FHA | Ferritin | [RCSB PDB](https://www.rcsb.org/structure/1FHA) |
| 6VSB | Coronavirus spike | [RCSB PDB](https://www.rcsb.org/structure/6VSB) |
| 1IGT | Antibody | [RCSB PDB](https://www.rcsb.org/structure/1IGT) |
| 1ATP | Protein kinase | [RCSB PDB](https://www.rcsb.org/structure/1ATP) |
| 1AOI | Nucleosome | [RCSB PDB](https://www.rcsb.org/structure/1AOI) |
| 1EHZ | Transfer RNA | [RCSB PDB](https://www.rcsb.org/structure/1EHZ) |
| 4INS | Insulin | [RCSB PDB](https://www.rcsb.org/structure/4INS) |
| 1CAG | Collagen triple helix | [RCSB PDB](https://www.rcsb.org/structure/1CAG) |
| 1J4N | Aquaporin | [RCSB PDB](https://www.rcsb.org/structure/1J4N) |
| 1LYZ | Lysozyme | [RCSB PDB](https://www.rcsb.org/structure/1LYZ) |
| 1MBN | Myoglobin | [RCSB PDB](https://www.rcsb.org/structure/1MBN) |
| 5T4O | ATP synthase | [RCSB PDB](https://www.rcsb.org/structure/5T4O) |
| 4V9D | Ribosome | [RCSB PDB](https://www.rcsb.org/structure/4V9D) |
| 1CWP | Plant virus shell | [RCSB PDB](https://www.rcsb.org/structure/1CWP) |
| 1C3W | Bacteriorhodopsin | [RCSB PDB](https://www.rcsb.org/structure/1C3W) |
| 1RCX | RuBisCO | [RCSB PDB](https://www.rcsb.org/structure/1RCX) |
| 4OO8 | CRISPR–Cas9 | [RCSB PDB](https://www.rcsb.org/structure/4OO8) |
| 1TUP | p53 on DNA | [RCSB PDB](https://www.rcsb.org/structure/1TUP) |
| 1BL8 | Potassium channel | [RCSB PDB](https://www.rcsb.org/structure/1BL8) |
| 2POR | Porin | [RCSB PDB](https://www.rcsb.org/structure/2POR) |
| 1PRC | Reaction centre | [RCSB PDB](https://www.rcsb.org/structure/1PRC) |
| 3WU2 | Photosystem II | [RCSB PDB](https://www.rcsb.org/structure/3WU2) |
| 1UBQ | Ubiquitin | [RCSB PDB](https://www.rcsb.org/structure/1UBQ) |
| 1F88 | Rhodopsin | [RCSB PDB](https://www.rcsb.org/structure/1F88) |
| 1TQN | Cytochrome P450 | [RCSB PDB](https://www.rcsb.org/structure/1TQN) |
| 1HSG | HIV protease | [RCSB PDB](https://www.rcsb.org/structure/1HSG) |
| 1CRN | Crambin | [RCSB PDB](https://www.rcsb.org/structure/1CRN) |
| 1DGF | Catalase | [RCSB PDB](https://www.rcsb.org/structure/1DGF) |
| 1BEB | A milk protein | [RCSB PDB](https://www.rcsb.org/structure/1BEB) |
| 1ZIK | Leucine zipper | [RCSB PDB](https://www.rcsb.org/structure/1ZIK) |
| 2HYY | A kinase and its medicine | [RCSB PDB](https://www.rcsb.org/structure/2HYY) |
| 2TMV | Tobacco mosaic virus | [RCSB PDB](https://www.rcsb.org/structure/2TMV) |

Assembly counts must come from the selected assembly endpoint, not blindly from the deposited-entry totals. RCSB’s [biological assembly guide](https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies) explains the distinction. The [Data API documentation](https://data.rcsb.org/index.html) documents the endpoint families used for verification.

Additional educational cross-checks: [GFP paper-model activity](https://pdb101.rcsb.org/learn/paper-models/gfp-activity-page), [bacteriorhodopsin](https://pdb101.rcsb.org/motm/27), [ferritin and transferrin](https://pdb101.rcsb.org/motm/35), and [rhodopsin](https://pdb101.rcsb.org/motm/147).
