const originalCatalog = [
  {
    id: '4HHB', name: 'Hemoglobin', subtitle: 'The oxygen carrier in your blood',
    description: 'Four folded chains work together to carry oxygen through the bloodstream. This human structure captures hemoglobin after oxygen has been released, with its four iron-containing heme groups still in place.',
    category: 'Inside you', tags: ['blood', 'oxygen', 'breathing', 'iron', 'human', 'four lobes', 'globular'], color: '#69867A', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the heme groups', featureDescription: 'Each chain cradles a heme group with an iron atom at its centre. These are the sites that bind oxygen; no oxygen is bound in this structure.', featureSelector: 'ligand'
  },
  {
    id: '1EMA', name: 'Green fluorescent protein', subtitle: 'A tiny barrel that glows',
    description: 'Originally discovered in a jellyfish, GFP turns absorbed light into green fluorescence. Its folded barrel shields a light-producing group made from the protein itself.',
    category: 'Light & life', tags: ['GFP', 'green', 'glow', 'jellyfish', 'fluorescence', 'barrel', 'light'], color: '#709580', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore the barrel', featureDescription: 'A cylinder of eleven beta strands surrounds a central helix. The chromophore forms within that helix, inside the same protein chain.', featureSelector: 'all'
  },
  {
    id: '1BNA', name: 'DNA double helix', subtitle: 'The familiar twist of genetic information',
    description: 'Two complementary DNA strands wind around one another in a right-handed helix. This twelve-base-pair fragment reveals the wide and narrow grooves that proteins use to recognise DNA.',
    category: 'DNA & RNA', tags: ['genes', 'genetics', 'double helix', 'spiral', 'twist', 'ladder', 'DNA'], color: '#8C83A9', representation: 'cartoon', assembly: '1',
    featureTitle: 'Follow the double helix', featureDescription: 'Trace the two sugar-phosphate backbones around the paired bases. The alternating major and minor grooves give the helix its uneven spiral outline.', featureSelector: 'nucleic'
  },
  {
    id: '1AON', name: 'Protein-folding chamber', subtitle: 'A sheltered place to find the right fold',
    description: 'GroEL helps other proteins fold inside a protected chamber. Two stacked rings make the barrel, and a smaller GroES ring caps one end in this bacterial complex.',
    category: 'Molecular machines', tags: ['GroEL', 'GroES', 'chaperonin', 'folding', 'barrel', 'rings', 'chamber'], color: '#B39764', representation: 'cartoon', assembly: '1',
    featureTitle: 'Look through the rings', featureDescription: 'Fourteen GroEL chains form two rings of seven. Seven smaller GroES chains form the lid, giving this assembly its striking asymmetry.', featureSelector: 'all'
  },
  {
    id: '1FHA', name: 'Ferritin', subtitle: 'A hollow vault for iron',
    description: 'Ferritin stores iron inside a hollow protein shell. Here, twenty-four human H chains assemble into a symmetrical cage with small openings between its subunits.',
    category: 'Inside you', tags: ['iron', 'storage', 'cage', 'sphere', 'shell', 'hollow', 'human'], color: '#B29370', representation: 'cartoon', assembly: '1',
    featureTitle: 'Discover the hollow shell', featureDescription: 'The cage is built from twenty-four copies of one protein. The large iron mineral core that can form inside cellular ferritin is not modelled here.', featureSelector: 'all'
  },
  {
    id: '6VSB', name: 'Coronavirus spike', subtitle: 'A three-part gateway to a cell',
    description: 'The SARS-CoV-2 spike helps the virus attach to and enter host cells. This engineered, stabilised outer portion has one receptor-binding domain raised above its two neighbours.',
    category: 'Viruses', tags: ['coronavirus', 'SARS-CoV-2', 'covid', 'spike', 'crown', 'trimer', 'glycoprotein'], color: '#B58382', representation: 'cartoon', assembly: '1',
    featureTitle: 'See the three-part spike', featureDescription: 'Three protein chains form the spike, with one receptor-binding domain in the up position. This is the spike ectodomain, not a complete virus particle.', featureSelector: 'all'
  },
  {
    id: '1IGT', name: 'Antibody', subtitle: 'Two arms for recognising a target',
    description: 'Antibodies recognise molecular targets with the tips of two flexible arms. This intact mouse IgG antibody reveals the familiar Y-shaped arrangement of two heavy and two light chains.',
    category: 'Inside you', tags: ['immune', 'immunity', 'IgG', 'antibody', 'Y shape', 'arms', 'defence'], color: '#9387AC', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore the Y shape', featureDescription: 'Each arm combines part of a heavy chain with a light chain. The stem recruits other immune responses; no target antigen is bound in this structure.', featureSelector: 'all'
  },
  {
    id: '1ATP', name: 'Protein kinase', subtitle: 'Passing a chemical signal onward',
    description: 'Protein kinases transfer a phosphate group from ATP onto other proteins. This catalytic part of protein kinase A holds ATP and an inhibitory peptide between its two lobes.',
    category: 'Molecular machines', tags: ['ATP', 'energy', 'signals', 'phosphate', 'PKA', 'enzyme', 'two lobes', 'pocket'], color: '#74989A', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the ATP pocket', featureDescription: 'ATP sits in the cleft between the kinase lobes, alongside manganese ions. The bound peptide inhibits the enzyme rather than showing a completed phosphorylation reaction.', featureSelector: 'ligand'
  },
  {
    id: '1AOI', name: 'Nucleosome', subtitle: 'DNA wrapped around a protein spool',
    description: 'Cells organise their DNA by wrapping it around histone proteins. This nucleosome core contains 146 base pairs of DNA wound around an eight-protein centre.',
    category: 'DNA & RNA', tags: ['DNA', 'chromatin', 'histone', 'genes', 'spool', 'coil', 'wrapped'], color: '#9A8EAC', representation: 'cartoon', assembly: '1',
    featureTitle: 'Trace the wrapped DNA', featureDescription: 'The DNA makes almost two turns around the histone core. Follow its curved path to see how a long genetic thread can be compacted.', featureSelector: 'nucleic'
  },
  {
    id: '1EHZ', name: 'Transfer RNA', subtitle: 'The adapter between genes and proteins',
    description: 'Transfer RNA connects a genetic instruction to the amino acid it specifies. This yeast phenylalanine tRNA folds a single RNA chain into a compact L shape.',
    category: 'DNA & RNA', tags: ['tRNA', 'RNA', 'translation', 'adapter', 'amino acid', 'L shape', 'folded'], color: '#76999C', representation: 'cartoon', assembly: '1',
    featureTitle: 'Follow the folded RNA', featureDescription: 'One end reads a three-letter code on messenger RNA, while the other can carry an amino acid. This structure shows the RNA without an attached amino acid.', featureSelector: 'nucleic'
  },
  {
    id: '4INS', name: 'Insulin', subtitle: 'A small hormone with a large influence',
    description: 'Insulin signals cells to take up and store nutrients, helping regulate blood glucose. This porcine insulin molecule has two short chains linked by disulfide bonds.',
    category: 'Inside you', tags: ['hormone', 'blood sugar', 'glucose', 'diabetes', 'small', 'two chains', 'compact'], color: '#B58C86', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore the two chains', featureDescription: 'The A and B chains together form one insulin molecule. This selected assembly shows a single molecule, rather than the six-molecule storage form.', featureSelector: 'all'
  },
  {
    id: '1CAG', name: 'Collagen triple helix', subtitle: 'Three strands woven into a rope',
    description: 'Collagen gives connective tissues much of their tensile strength. This short, synthetic collagen-like peptide reveals the three-stranded helix that underlies its rope-like architecture.',
    category: 'Inside you', tags: ['collagen', 'skin', 'tendon', 'connective tissue', 'rope', 'triple helix', 'long'], color: '#B99A75', representation: 'cartoon', assembly: '1',
    featureTitle: 'Follow one of three strands', featureDescription: 'Three peptide chains wind closely around one another. This is a model of a short collagen segment, not a full collagen molecule or tissue fibre.', featureSelector: 'chain'
  },
  {
    id: '1J4N', name: 'Aquaporin', subtitle: 'A selective doorway for water',
    description: 'Aquaporins let water move rapidly across cell membranes. Four copies of bovine aquaporin-1 assemble together, each with its own narrow water passage.',
    category: 'Inside you', tags: ['water', 'kidney', 'membrane', 'channel', 'fourfold', 'pores', 'aquaporin'], color: '#709CA3', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore one water channel', featureDescription: 'Each subunit carries a separate water pathway through its helical bundle. The four subunits do not share a single central water pore.', featureSelector: 'chain'
  },
  {
    id: '1LYZ', name: 'Lysozyme', subtitle: 'An enzyme that breaks bacterial walls',
    description: 'Lysozyme cuts the sugar-based mesh that supports many bacterial cell walls. This classic structure comes from hen egg white, where the enzyme helps protect the developing egg.',
    category: 'Molecular machines', tags: ['enzyme', 'eggs', 'tears', 'bacteria', 'defence', 'cleft', 'compact'], color: '#B79B6C', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore the central cleft', featureDescription: 'The groove between the two parts of this small protein accommodates a chain of bacterial cell-wall sugars. No sugar substrate is bound in this structure.', featureSelector: 'all'
  },
  {
    id: '1MBN', name: 'Myoglobin', subtitle: 'An oxygen reserve for muscle',
    description: 'Myoglobin binds oxygen in muscle with a single heme group. This sperm-whale protein was among the first proteins whose three-dimensional structure was solved.',
    category: 'Inside you', tags: ['muscle', 'oxygen', 'whale', 'diving', 'heme', 'globular', 'helices'], color: '#AF807B', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the buried heme', featureDescription: 'A flat, iron-containing heme group sits among the surrounding helices. Myoglobin uses one protein chain, compared with hemoglobin\'s four.', featureSelector: 'ligand'
  },
  {
    id: '5T4O', name: 'ATP synthase', subtitle: 'The cell\'s rotary energy machine',
    description: 'ATP synthase links a membrane motor to a head that makes ATP, a chemical energy carrier. This bacterial complex was captured in an inhibited state, with a central stalk connecting its two main sections.',
    category: 'Molecular machines', tags: ['ATP', 'energy', 'motor', 'rotation', 'turbine', 'ring', 'machine'], color: '#769784', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore the motor and head', featureDescription: 'The membrane ring and catalytic head are joined by a central shaft and an outer support. The model is a static inhibited conformation, not a record of rotation.', featureSelector: 'all'
  },
  {
    id: '4V9D', name: 'Ribosome', subtitle: 'The machine that builds proteins',
    description: 'Ribosomes read messenger RNA and join amino acids into proteins. This bacterial assembly brings together large folded RNA molecules, dozens of proteins and a bound transfer RNA.',
    category: 'DNA & RNA', tags: ['RNA', 'translation', 'protein factory', 'ribosome', 'large', 'complex', 'two subunits'], color: '#988DAA', representation: 'cartoon', assembly: '1',
    featureTitle: 'Reveal the RNA core', featureDescription: 'RNA forms much of the ribosome\'s framework and performs the chemistry of peptide-bond formation. The proteins support and organise that RNA architecture.', featureSelector: 'nucleic'
  },
  {
    id: '1CWP', name: 'Plant virus shell', subtitle: 'A sphere made from repeating proteins',
    description: 'Cowpea chlorotic mottle virus packages its RNA inside a symmetrical protein shell. This assembly contains 180 coat proteins and the short RNA segments resolved in the experiment.',
    category: 'Viruses', tags: ['CCMV', 'cowpea', 'capsid', 'virus', 'sphere', 'shell', 'icosahedral', 'symmetry'], color: '#B58E94', representation: 'spacefill', assembly: '1',
    featureTitle: 'Discover the repeating shell', featureDescription: 'The coat proteins form a closed shell with icosahedral symmetry. Only small portions of the genome are modelled, so the structure does not show all of the viral RNA.', featureSelector: 'all'
  },
  {
    id: '1C3W', name: 'Bacteriorhodopsin', subtitle: 'A light-powered proton pump',
    description: 'Salt-loving archaea use bacteriorhodopsin to convert light into a proton gradient across their membrane. Each protein holds a retinal molecule that changes shape when it absorbs light.',
    category: 'Light & life', tags: ['light', 'retinal', 'pump', 'archaea', 'solar', 'helices', 'trimer'], color: '#9384AA', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the light-absorbing groups', featureDescription: 'Retinal lies inside each seven-helix bundle, with lipid molecules around the proteins. This assembly contains three pumps in their ground state.', featureSelector: 'ligand'
  },
  {
    id: '1RCX', name: 'RuBisCO', subtitle: 'Bringing carbon from the air into life',
    description: 'RuBisCO helps photosynthetic organisms incorporate carbon dioxide into organic molecules. This spinach enzyme contains eight large and eight small subunits, with its sugar substrate bound.',
    category: 'Light & life', tags: ['plants', 'spinach', 'carbon', 'photosynthesis', 'RuBisCO', 'symmetry', 'large'], color: '#7D9872', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the bound sugar', featureDescription: 'Ribulose-1,5-bisphosphate occupies pockets in the large subunits. The enzyme was captured in a non-activated state, before carbon fixation could proceed.', featureSelector: 'ligand'
  },
  {
    id: '4OO8', name: 'CRISPR–Cas9', subtitle: 'RNA-guided recognition of DNA',
    description: 'Cas9 uses a guide RNA to recognise a matching DNA sequence. This engineered, inactive bacterial protein holds the guide and a target DNA strand in a groove between two lobes.',
    category: 'DNA & RNA', tags: ['CRISPR', 'Cas9', 'gene editing', 'RNA', 'DNA', 'scissors', 'two lobes', 'groove'], color: '#72979D', representation: 'cartoon', assembly: '1',
    featureTitle: 'Follow the guide and target', featureDescription: 'The guide RNA pairs with its complementary target DNA strand inside Cas9. The other DNA strand is absent from this crystallographic model.', featureSelector: 'nucleic'
  },
  {
    id: '1TUP', name: 'p53 on DNA', subtitle: 'Recognising a signal in the genome',
    description: 'The tumour suppressor p53 helps cells respond to stress by controlling gene activity. This structure shows its DNA-binding core domains associated with a short DNA double helix.',
    category: 'DNA & RNA', tags: ['p53', 'DNA', 'genes', 'cancer research', 'recognition', 'helix', 'complex'], color: '#9D8AA6', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the DNA interface', featureDescription: 'The core domains contact DNA along its surface and grooves. These are fragments of p53, rather than the full-length four-part protein.', featureSelector: 'nucleic'
  },
  {
    id: '1BL8', name: 'Potassium channel', subtitle: 'A pore that chooses one kind of ion',
    description: 'The bacterial KcsA channel lets potassium ions pass through a membrane. Four protein subunits surround a central pore whose narrow filter distinguishes potassium from smaller sodium ions.',
    category: 'Molecular machines', tags: ['potassium', 'ions', 'membrane', 'channel', 'KcsA', 'pore', 'fourfold'], color: '#779B97', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the potassium ions', featureDescription: 'Potassium ions line the central pathway formed by all four subunits. The selectivity filter uses precisely positioned protein oxygen atoms to coordinate them.', featureSelector: 'ligand'
  },
  {
    id: '2POR', name: 'Porin', subtitle: 'Three barrels through a membrane',
    description: 'Porins provide routes for small molecules across the outer membranes of many bacteria. Three folded beta barrels form this assembly, each enclosing its own channel.',
    category: 'Molecular machines', tags: ['bacteria', 'membrane', 'porin', 'barrel', 'pores', 'trimer', 'transport'], color: '#B29B77', representation: 'cartoon', assembly: '1',
    featureTitle: 'Trace a beta barrel', featureDescription: 'Each chain folds a sheet of beta strands into a closed cylinder. An internal loop narrows the passage through the barrel.', featureSelector: 'chain'
  },
  {
    id: '1PRC', name: 'Reaction centre', subtitle: 'Where sunlight becomes an electron flow',
    description: 'This bacterial photosynthetic reaction centre converts absorbed light into separated electrical charges. A protein framework holds pigments and other cofactors in positions that allow electrons to move between them.',
    category: 'Light & life', tags: ['photosynthesis', 'sunlight', 'pigments', 'electrons', 'bacteria', 'membrane', 'bundle'], color: '#A59866', representation: 'cartoon', assembly: '1',
    featureTitle: 'Reveal the pigment network', featureDescription: 'Bacteriochlorophylls, bacteriopheophytins and quinones form the light-driven electron-transfer machinery. The surrounding proteins position and tune these smaller molecules.', featureSelector: 'ligand'
  },
  {
    id: '3WU2', name: 'Photosystem II', subtitle: 'Using sunlight to split water',
    description: 'Photosystem II uses light energy to extract electrons from water, releasing oxygen. This cyanobacterial complex combines many proteins with chlorophylls, pigments and a manganese-calcium catalytic cluster.',
    category: 'Light & life', tags: ['photosynthesis', 'sunlight', 'oxygen', 'water', 'chlorophyll', 'large', 'dimer'], color: '#749171', representation: 'cartoon', assembly: '1',
    featureTitle: 'Reveal the light-harvesting pigments', featureDescription: 'Dozens of bound pigments surround the reaction centres. Among the cofactors is the manganese-calcium cluster that supports water oxidation.', featureSelector: 'ligand'
  },
  {
    id: '1UBQ', name: 'Ubiquitin', subtitle: 'A small tag with many cellular messages',
    description: 'Cells attach ubiquitin to other proteins to change their fate or activity. This compact human protein is a reusable molecular tag, including in pathways that send proteins for recycling.',
    category: 'Inside you', tags: ['recycling', 'tag', 'ubiquitin', 'human', 'small', 'compact', 'fold'], color: '#839483', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore a compact fold', featureDescription: 'A short helix packs against a curved beta sheet, leaving a tail available for attachment to another protein. This structure shows free ubiquitin.', featureSelector: 'all'
  },
  {
    id: '1F88', name: 'Rhodopsin', subtitle: 'The molecular beginning of vision',
    description: 'Rhodopsin senses light in the rod cells of the retina. This bovine structure captures its dark state, with a light-sensitive retinal molecule enclosed by seven membrane-spanning helices.',
    category: 'Inside you', tags: ['vision', 'eyes', 'light', 'retina', 'retinal', 'helices', 'membrane'], color: '#9C89AA', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the light sensor', featureDescription: 'Retinal is the small molecule that absorbs a photon and changes shape to initiate signalling. This selected assembly displays two rhodopsin molecules.', featureSelector: 'ligand'
  },
  {
    id: '1TQN', name: 'Cytochrome P450', subtitle: 'An enzyme that processes many medicines',
    description: 'Human CYP3A4 chemically modifies many drugs and other molecules in the body. Its folded protein surrounds a heme group that helps carry out oxidation reactions.',
    category: 'Inside you', tags: ['CYP3A4', 'P450', 'liver', 'medicine', 'metabolism', 'heme', 'pocket'], color: '#A57E80', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the catalytic heme', featureDescription: 'The heme group lies beneath a pocket that can accommodate different substrates. This structure contains the heme, but no bound drug.', featureSelector: 'ligand'
  },
  {
    id: '1HSG', name: 'HIV protease', subtitle: 'A viral enzyme with a drug in its grip',
    description: 'HIV protease cuts viral protein chains into the pieces needed for maturation. In this structure, two matching protein subunits close around the inhibitor indinavir.',
    category: 'Viruses', tags: ['HIV', 'protease', 'indinavir', 'drug', 'inhibitor', 'twofold', 'pocket'], color: '#B1838A', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the bound inhibitor', featureDescription: 'Indinavir occupies the active-site cleft between the two subunits. The flexible flaps above it help enclose the pocket.', featureSelector: 'ligand'
  },
  {
    id: '1CRN', name: 'Crambin', subtitle: 'A remarkably small seed protein',
    description: 'Crambin is a tiny protein isolated from Abyssinian cabbage seeds. Its forty-six amino acids form a compact fold stabilised by three disulfide bonds.',
    category: 'Light & life', tags: ['seeds', 'plants', 'crambin', 'tiny', 'compact', 'helices', 'fold'], color: '#969E79', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore a miniature protein', featureDescription: 'Two short helices and a small beta sheet fit into this compact chain. Crambin is a classic subject for studying protein structure at high resolution.', featureSelector: 'all'
  },
  {
    id: '1DGF', name: 'Catalase', subtitle: 'Turning peroxide into water and oxygen',
    description: 'Catalase protects cells by breaking down hydrogen peroxide. Four copies of the human enzyme assemble together, each carrying a heme group at its catalytic site.',
    category: 'Inside you', tags: ['peroxide', 'oxygen', 'protection', 'enzyme', 'human', 'fourfold', 'heme'], color: '#9E8E68', representation: 'cartoon', assembly: '1',
    featureTitle: 'Reveal the bound cofactors', featureDescription: 'Heme groups support the peroxide-breaking reaction inside the protein. This structure also includes bound NADPH, which helps protect catalase from inactivation.', featureSelector: 'ligand'
  },
  {
    id: '1BEB', name: 'A milk protein', subtitle: 'A folded barrel from whey',
    description: 'Beta-lactoglobulin is a major whey protein in cow\'s milk. Its beta-barrel fold creates an internal pocket capable of binding small hydrophobic molecules.',
    category: 'Light & life', tags: ['milk', 'whey', 'food', 'beta-lactoglobulin', 'barrel', 'pocket', 'nutrition'], color: '#B7A484', representation: 'cartoon', assembly: '1',
    featureTitle: 'Explore the barrel-shaped fold', featureDescription: 'The curved beta sheet encloses a central cavity. This selected assembly shows one protein chain, without a bound nutrient in that pocket.', featureSelector: 'all'
  },
  {
    id: '1ZIK', name: 'Leucine zipper', subtitle: 'Two protein helices paired together',
    description: 'Leucine zippers help some gene-regulating proteins pair with one another. This engineered fragment of the yeast protein GCN4 shows two helices winding together as a coiled coil.',
    category: 'DNA & RNA', tags: ['GCN4', 'genes', 'leucine zipper', 'coiled coil', 'rope', 'two helices', 'long'], color: '#8A9B91', representation: 'cartoon', assembly: '1',
    featureTitle: 'Follow one half of the zipper', featureDescription: 'The two helices pack along a shared seam. Only the pairing region is present here; the fragment does not include GCN4\'s DNA-binding region or DNA.', featureSelector: 'chain'
  },
  {
    id: '2HYY', name: 'A kinase and its medicine', subtitle: 'Imatinib fitting into a protein pocket',
    description: 'The human Abl kinase helps pass signals within cells. This isolated kinase domain holds imatinib in a pocket that stabilises an inactive arrangement of the enzyme.',
    category: 'Inside you', tags: ['Abl', 'kinase', 'imatinib', 'medicine', 'drug', 'signals', 'pocket'], color: '#A78C9F', representation: 'cartoon', assembly: '1',
    featureTitle: 'Find the imatinib molecule', featureDescription: 'The drug follows an extended pocket inside the kinase domain. Its fit illustrates how a small molecule can block the activity of a much larger protein.', featureSelector: 'ligand'
  },
  {
    id: '2TMV', name: 'Tobacco mosaic virus', subtitle: 'A repeating helix around RNA',
    description: 'Tobacco mosaic virus forms a long rod from repeating coat proteins arranged around RNA. This assembly shows a short helical segment of that rod, including associated RNA fragments.',
    category: 'Viruses', tags: ['TMV', 'tobacco', 'virus', 'RNA', 'rod', 'tube', 'helix', 'repeating'], color: '#A18A99', representation: 'cartoon', assembly: '1',
    featureTitle: 'Trace the RNA inside the helix', featureDescription: 'Short RNA segments lie between neighbouring coat proteins around the inner part of the helix. The displayed segment contains forty-nine coat-protein copies, not the entire viral rod.', featureSelector: 'nucleic'
  }
];

const additionalVisualRecords = [
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
    color:'#CF9EAC', representation:'atoms', colorMode:'chain-id', assembly:'1'
  }
];
const openingScenes = [
  { id:'1CWP', representation:'atoms', colorMode:'chain-id' }, // faceted viral sphere
  { id:'1BNA', representation:'ball-and-stick', colorMode:'element-symbol' }, // chemical double helix
  { id:'7AHL', representation:'surface', colorMode:'chain-id' }, // broad cap, long pore
  { id:'5T4O', representation:'cartoon', colorMode:'chain-id' }, // head, shaft and rotor
  { id:'1SHS', representation:'surface', colorMode:'uniform' }, // windows in a hollow cage
  { id:'1IGT', representation:'cartoon', colorMode:'chain-id' }, // open asymmetric Y
  { id:'1AOI', representation:'cartoon', colorMode:'chain-id' }, // DNA around a spool
  { id:'1BRF', representation:'ball-and-stick', colorMode:'element-symbol' }, // tiny atomic iron protein
  { id:'2TMV', representation:'atoms', colorMode:'chain-id' }, // helical viral tube
  { id:'4V9D', representation:'surface', colorMode:'chain-id' }, // irregular RNA/protein machine
  { id:'1YCE', representation:'cartoon', colorMode:'chain-id' }, // eleven-fold ring
  { id:'1CAG', representation:'ball-and-stick', colorMode:'element-symbol' }, // slender three-strand rope
  { id:'1PRC', representation:'cartoon', colorMode:'chain-id' }, // protein plus pigment chemistry
  { id:'1AON', representation:'surface', colorMode:'chain-id' }, // capped double barrel
  { id:'7RSA', representation:'surface', colorMode:'uniform' }, // compact cleft, searchable ribonuclease
  { id:'4HHB', representation:'cartoon', colorMode:'chain-id' }, // familiar four-lobed reference
];
const all=[...originalCatalog,...additionalVisualRecords];
const curatedOrder=['7AHL','1CWP','1BNA','1SHS','5T4O','1IGT','1AOI','1BRF','2TMV','4V9D','1YCE','1CAG','1PRC','1AON','7RSA','4HHB'];
export const catalog=[...curatedOrder.map(id=>({...all.find(m=>m.id===id),...openingScenes.find(m=>m.id===id)})),...all.filter(m=>!curatedOrder.includes(m.id))];
