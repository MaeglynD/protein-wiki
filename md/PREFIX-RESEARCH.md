# RCSB prefix search: verified implementation notes

Verified live on 2026-10-09. This is bounded research; no app files were changed.

## Main finding

The existing `contains_phrase` search is a word/phrase search, not a prefix search. Appending `*` to that operator does not fix it. RCSB's official suggestion endpoint completes molecular names quickly, and its `full_text` service accepts trailing prefix wildcards. Combine these: suggestions improve ranking and give clickable complete terms; the wildcard branch keeps archive-wide recall and pagination.

Do not replace archive search with the 36-item catalog or only the first N suggestions. Also do not use the wildcard query by itself: its hits all scored 1 in the tested cases and broad annotation matches are often unhelpful as the first result.

## Official contracts

- Main API guide: https://search.rcsb.org/
- Official OpenAPI: https://search.rcsb.org/openapi.json
- Suggest request schema: https://search.rcsb.org/schema/suggest/request/json-schema-rcsb_suggest.json
- Basic suggest schema: https://search.rcsb.org/schema/suggest/request/json-schema-rcsb_suggest_basic.json
- Suggest response schema: https://search.rcsb.org/schema/suggest/response/json-schema-rcsb_suggest_results.json
- RCSB's user-facing description of its own autosuggest: https://www.rcsb.org/docs/search-and-browse/basic-search

The reference documents ordinary full-text word and phrase behavior, grouping, score sorting, and start/rows pagination. The trailing `*` behavior below was directly tested; the prose reference does not explicitly promise wildcard support. Keep a regression test for it and retain suggestions as the fallback if that behavior changes.

## Fast completion request

```js
const body = {
  type: 'basic',
  suggest: {
    text: 'Ribo',
    size: 40,
    attributes: ['rcsb_polymer_entity.pdbx_description', 'struct.title']
  },
  highlight: { pre_tag: '', post_tag: '' },
  results_content_type: ['experimental']
};
const response = await fetch(
  'https://search.rcsb.org/rcsbsearch/v2/suggest?json=' +
  encodeURIComponent(JSON.stringify(body)),
  { signal }
);
const data = response.status === 204 ? { suggestions: {} } : await response.json();
// { took, suggestions: { [attribute]: [{ text, score }, ...] } }
```

Use `basic`, not `term`: these tests saw basic requests around 90–100 ms after connection setup, while term completion was 250–950 ms. `rcsb_polymer_entity.pdbx_description` and `struct.title` both work. `rcsb_entity_source_organism.ncbi_scientific_name` is NOT suggestion-indexed and makes the whole request fail with 400. It remains valid for normal text searches.

The request's size is per-field-ish and server deduplication can return fewer values. Case variants appear; dedupe case-insensitively. Explicit empty highlight tags return plain strings, so never inject server suggestion HTML.

At size 8, Ribo name completions can be dominated by riboflavin; size 40 contains Ribonuclease A. For displayed suggestion chips, derive a concise diverse subset from the larger cached response. For example, prefer the shortest complete name within each repeated root/family, plus any names matching already-visible cards. Do not show 40 chips.

## Tested archive query construction

`work/rank-probe.mjs` is executable tested code. The central pattern is:

```js
const text = (attribute, operator, value) => ({
  type: 'terminal', service: 'text', parameters: { attribute, operator, value }
});
const group = (logical_operator, nodes) => nodes.length === 1 ? nodes[0] :
  ({ type: 'group', logical_operator, nodes });
const full = value => ({ type: 'terminal', service: 'full_text', parameters: { value } });

// Cache suggestion expansion for the query and reuse it on every page.
// The last incomplete token receives molecular-name expansions.
const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
const names = [...new Set(suggestionNames.map(s => s.toLowerCase()))];
const fields = [
  'rcsb_polymer_entity.pdbx_description', 'struct.title',
  'struct_keywords.pdbx_keywords',
  'rcsb_entity_source_organism.ncbi_scientific_name',
  'rcsb_entity_source_organism.ncbi_common_names',
  'rcsb_nonpolymer_entity.pdbx_description'
];
const namedMatches = group('and', tokens.map((token, index) => group('or', [
  ...fields.map(field => text(field, 'contains_phrase', token)),
  ...(index === tokens.length - 1 ? names.map(name =>
    text('rcsb_polymer_entity.pdbx_description', 'contains_phrase', name)
  ) : [])
])));
const prefixMatches = full(tokens.map(token => token + '*').join(' + '));
const queryNode = group('or', [namedMatches, prefixMatches]);
const body = {
  query: queryNode,
  return_type: 'entry',
  request_options: {
    paginate: { start: offset, rows: 24 },
    results_content_type: ['experimental'],
    sort: [{ sort_by: 'score', direction: 'desc' }],
    scoring_strategy: 'combined'
  }
};
```

This example assumes tokens have already been normalized/escaped for full_text syntax. Do not blindly allow arbitrary input to create boolean or wildcard syntax: preserve intended quoted phrases and append a wildcard only to literal word tokens of sensible length (e.g. at least 3 characters). Exact PDB IDs bypass suggestions and use `text('rcsb_id', 'exact_match', q.toUpperCase())`. Apply user's kind/organism/method filters in an AND around the complete queryNode. A filter must affect both namedMatches and prefixMatches.

An alternative narrower version boosts only completed molecular names plus the full wildcard query, without the original multi-field text branch. It put Ribonuclease A in Ribo's first page more readily, but it ranked human insulin poorly. The multi-field token-AND version handled mixed organism + molecule terms better.

## Verified results

| Input | Raw exact behavior | Prefix/combined result |
|---|---|---|
| Ribo | full_text Ribo finds 852 entries; it means the word Ribo and misses expected name prefixes | Ribo* finds 125,498 broad annotation entries; suggestions include Ribonuclease A, ribokinase, riboflavin families; combined top hits have actual Ribo… molecular names |
| Rubre | full_text returns 204 | Rubre* finds 8,542 broad annotation entries; combined first hits are Rubrerythrin / Rubredoxin entries |
| ribonuclease | ordinary full_text returns 19,441 | Prefix variant returns 19,514; combined top hits are actual ribonuclease complexes |
| 4HHB | full_text finds 3 (including annotation references) | Exact rcsb_id query returns exactly 4HHB |
| human insulin | full_text AND returns 10,247 broad annotations | Combined token-AND query's first hits include human Insulin A/B chains 7JP3, 8PI4, 8PI5, 3I3Z |

`Rubre` is a valid prefix, not a spelling error: it matches **rubredoxin** and **rubrerythrin**. Don't autocorrect it to RuBisCO.

The broad totals include annotation-only matches and should not be labeled as exact molecular-name match counts. First show useful molecule-name matches; a quiet label such as “PDB matches” is more honest than “X ribonucleases”. Query results and ranking should be stable across pages by reusing exactly the same suggestion expansion plan.

## Continuity and ranking quality

API relevance is not the same as visual/user relevance. When a user has just seen a Ribonuclease A card and types Ribo, that card should remain findable immediately. Match the typed prefix against names/IDs/aliases of the catalog AND already fetched entryCache, place a small deduped prefix-matching subset ahead of remote hits, then stream the complete archive results below. Preserve the remote pagination cursor based on the raw API hits; deduping visible pinned cards must not skip archive offsets or inflate total counts. This is enhancement, not a local-catalog fallback.

For full exact words, consider retaining the original strict name/metadata ranking and use completions more lightly. Expanding “ribonuclease” into dozens of subclasses can favor multi-entity complexes over a simple Ribonuclease A because several branches match. Minimal representatives/previously viewed exact matches can correct the first screen. Full archive recall still comes from the wildcard branch.

Use AbortController and a 180–250 ms debounce. Cancel both the suggestion request and the archive request on newer input. Cache each query plan (including exact completion values) and response pages; no repeated suggestion lookup for scrolling. Avoid clearing existing visible cards while typing. Indicate refreshing discretely, then crossfade to the new result set.

## Edge cases tested

- `contains_words: 'Ribo*'` → 204, no prefix behavior.
- `contains_phrase: 'Ribo*'` → 204.
- `starts_with` operator → 400 schema failure; regex is not a supported attribute-search operator.
- Sorting by both score and rcsb_id → 400 (“Sorting by both score and attribute simultaneously is not supported”). Use score alone for relevance.
- `start: 10000, rows: 3` for Ribo* → 200, total125498, three real hits. The 10,000 API limit is not an absolute offset ceiling in this live version. Ordinary 24-item pagination can continue; no need to fetch all IDs upfront.
- `start:24, rows:3` for Rubre* → 200 with the next entries.

Raw reproduction files are `work/prefix-probe-results.json`, `work/suggest-probe-results.json`, `work/combined-probe-results.json`, `work/rank-probe-results.json`, plus `work/edge-probe.mjs`.
