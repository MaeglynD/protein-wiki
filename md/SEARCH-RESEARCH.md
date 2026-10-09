# protein.wiki archive search — verified 9 October 2026

Recommendation: search the live PDB archive on every submitted/debounced query. The 36 local entries are a visually diverse starting arrangement, not the database. The live count query returned **261,031 experimental entries**. Say “structures” or “PDB entries”; entries are not distinct molecules.

## Verified implementation

POST JSON to `https://search.rcsb.org/rcsbsearch/v2/query`:

```js
const text = (attribute, operator, value) => ({
  type: 'terminal', service: 'text',
  parameters: { attribute, operator, value }
});
const group = (logical_operator, nodes) => nodes.length === 1 ? nodes[0] : ({
  type: 'group', logical_operator, nodes
});
const fields = [
  'rcsb_polymer_entity.pdbx_description',
  'struct.title',
  'struct_keywords.pdbx_keywords',
  'rcsb_entity_source_organism.ncbi_scientific_name',
  'rcsb_entity_source_organism.ncbi_common_names',
  'rcsb_nonpolymer_entity.pdbx_description'
];
const nameQuery = q => group('and', q.trim().split(/\s+/).slice(0, 10).map(token =>
  group('or', fields.map(field => text(field, 'contains_phrase', token)))
));
const payload = {
  query: nameQuery('human insulin'),
  return_type: 'entry',
  request_options: {
    paginate: { start: 0, rows: 24 },
    results_content_type: ['experimental'],
    sort: [{ sort_by: 'score', direction: 'desc' }]
  }
};
```

Why: live `full_text('insulin')` returned 12,802 entries and included unrelated citation/annotation matches very high. `full_text('human insulin')` and explicit full_text-token AND returned 10,247, with relaxin first. The direct-name fields above returned 623 human-insulin hits, headed by real insulin, and 776 insulin hits. GFP returned 913 with 1GFL first. Actin returned 1,112 with real actin complexes first. Whole-name matches can be promoted after hydrating the first batch; preserve later-page order so loading more does not reshuffle existing cards.

Recognize a PDB ID first: `text('rcsb_id','exact_match','4HHB')` returned exactly one. Strip a leading `PDB` or pasted RCSB structure URL before testing an ID. For zero direct-name results, retry a `full_text` terminal and mark the search as broader matching. Do not broaden a successful query silently.

Everyday language: map a small explicit synonym set to scientific terms, with a short visible “Searching for …” hint. Examples: glowing protein → green fluorescent protein; DNA scissors → Cas9; double helix → DNA; haemoglobin → hemoglobin. Avoid promising arbitrary natural-language interpretation. Functional queries like “blood” can cover multiple proteins; they do not describe one molecule.

## Filters — tested against live service

Append filters using an AND group around the name query.

| Control | Attribute | Operator | Value |
|---|---|---|---|
| Contains protein | `rcsb_entry_info.polymer_entity_count_protein` | `greater` | `0` |
| Contains DNA | `rcsb_entry_info.polymer_entity_count_DNA` | `greater` | `0` |
| Contains RNA | `rcsb_entry_info.polymer_entity_count_RNA` | `greater` | `0` |
| Human source | `rcsb_entity_source_organism.taxonomy_lineage.id` | `exact_match` | string `"9606"` |
| Bacterial source | same | `exact_match` | string `"2"` |
| Viral source | same | `exact_match` | string `"10239"` |
| Specific source | `rcsb_entity_source_organism.ncbi_scientific_name` | `exact_match` | e.g. `"Homo sapiens"` |
| Method | `exptl.method` | `exact_match` | `"X-RAY DIFFRACTION"`, `"ELECTRON MICROSCOPY"`, `"SOLUTION NMR"` |
| Resolution ≤ 2 Å | `rcsb_entry_info.resolution_combined` | `less_or_equal` | `2` |

Protein/DNA/RNA categories overlap. A viral-source protein need not be an entire virus particle. Source organism refers to the molecule’s origin, not its laboratory expression host. Resolution filters exclude entries with absent resolution (often NMR); use a precise numeric label rather than “best quality.”

CRITICAL: `rcsb_entity_source_organism.ncbi_taxonomy_id` exists in returned metadata but is **not searchable**, returning HTTP 400. Use taxonomy_lineage.id above.

## Browse, sort, counts, facets

No-query live browse: `query:{type:'terminal',service:'text'}` with experimental content and `sort:[{sort_by:'rcsb_accession_info.initial_release_date',direction:'desc'}]`. Verified: 261,031 total with 7 October 2026 releases first. Another useful explicit sort is `rcsb_entry_info.resolution_combined` ascending. Do not combine score with a field sort: full_text returns400 for this combination.

Initial display may retain the diverse 36 featured entries and append live recent entries. Dedupe by PDB ID, but advance the server offset by the raw hits consumed. Any query/filter immediately switches to live results. A queryless source/filter must sort by date or another meaningful field; score-only filtering degenerates to alphanumeric IDs.

Count payload:

```json
{"return_type":"entry","request_options":{"return_counts":true,"results_content_type":["experimental"]}}
```

Verified `request_options.facets`:

```json
[
  {"name":"method","aggregation_type":"terms","attribute":"exptl.method","max_num_intervals":10},
  {"name":"polymer","aggregation_type":"terms","attribute":"rcsb_entry_info.selected_polymer_entity_types","max_num_intervals":10},
  {"name":"organism","aggregation_type":"terms","attribute":"rcsb_entity_source_organism.ncbi_scientific_name","max_num_intervals":8}
]
```

Response facets have `name` and `buckets:[{label,population}]`. Counts apply to the current query, and multi-source structures can enter several buckets. Pagination uses `start` and `rows`;24–36 per fetch is appropriate for this app. Do not request the entire database. Deduplication of the same molecular identity is scientifically complex; avoid a misleading “unique molecule” total or entity-grouping in this release.

## One metadata request per page

POST to `https://data.rcsb.org/graphql` with `{query,variables:{ids:[...]}}`:

```graphql
query ($ids: [String!]!) {
  entries(entry_ids: $ids) {
    rcsb_id
    struct { title }
    struct_keywords { pdbx_keywords }
    rcsb_entry_info {
      resolution_combined
      deposited_atom_count
      deposited_polymer_entity_instance_count
      selected_polymer_entity_types
    }
    rcsb_accession_info { initial_release_date }
    exptl { method }
    rcsb_entry_container_identifiers { assembly_ids }
    polymer_entities {
      rcsb_polymer_entity { pdbx_description }
      rcsb_entity_source_organism {
        ncbi_scientific_name
        ncbi_taxonomy_id
      }
    }
  }
}
```

This exact query was tested. GraphQL **reorders** entries: map by rcsb_id and restore search-hit order. Some properties/whole objects are null. Check `errors` even after HTTP200. A title can be long or all caps; use a concise entity name on cards and keep the full deposition title available. Multiple polymer names can describe a complex; do not label a large complex as the first arbitrary subunit. `deposited_atom_count` is the deposited model count, not necessarily the displayed biological assembly count.

## Interaction and loading requirements

Debounce ~300ms; abort prior search and hydration together. A monotonically increasing request generation protects against stale responses. Cache metadata and first result pages by normalized query/filter/sort. Render skeleton cards with the same bounds as populated cards. Treat204 as a valid empty result. Preserve the current molecule while search updates. Preserve its displayed stage until a newly selected structure has fully loaded; commit stage/title/control changes together. Infinite loading needs an explicit keyboard-accessible “Load more” equivalent. Display real remote thumbnails with graceful unavailable state, never substitute a different molecule’s thumbnail.

The API docs allow GET/POST and describe result pagination, facets, and metadata separation. For this multi-field query prefer POST to avoid URL length problems. Broader chemistry can later use RCSB molecular-definition/chemical services and PubChem, but those require distinct labels, metadata, coordinates, and search interpretation. PDB scope is a substantial practical first release, not a universal molecular inventory.

## Evidence

- [RCSB Search API documentation](https://search.rcsb.org/)
- [Searchable schema](https://search.rcsb.org/rcsbsearch/v2/metadata/schema)
- [RCSB Data API documentation](https://data.rcsb.org/)
- Local reproducible probes: `test-search-v2.mjs`, `test-search-v2b.mjs`, `test-search-v2c.mjs`, `test-search-v2d.mjs`; raw responses are in adjacent `search-v2*-test-results.json` files.

The queries and numerical observations above come from direct live API tests. Counts will change as the archive updates.
