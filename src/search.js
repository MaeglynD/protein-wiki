import {catalog} from './catalog.js';
const SEARCH='https://search.rcsb.org/rcsbsearch/v2/query',DATA='https://data.rcsb.org/graphql';
const known=new Map(catalog.map(m=>[m.id,m])),entryCache=new Map(),pageCache=new Map();
const aliases={'haemoglobin':'hemoglobin','glowing protein':'green fluorescent protein','glow':'green fluorescent protein','dna scissors':'Cas9','double helix':'DNA','oxygen carrier':'hemoglobin','blood oxygen':'hemoglobin','covid':'SARS-CoV-2','coronavirus spike':'SARS-CoV-2 spike','energy production':'ATP synthase','protein folding':'chaperonin','antibodies':'antibody'};
const species={'Homo sapiens':'Human','Mus musculus':'Mouse','Escherichia coli':'E. coli','Saccharomyces cerevisiae':'Yeast','Aequorea victoria':'Jellyfish'};
const fields=['rcsb_polymer_entity.pdbx_description','struct.title','struct_keywords.pdbx_keywords','rcsb_entity_source_organism.ncbi_scientific_name','rcsb_entity_source_organism.ncbi_common_names','rcsb_nonpolymer_entity.pdbx_description'];
const text=(attribute,operator,value)=>({type:'terminal',service:'text',parameters:{attribute,operator,value}});
const group=(logical_operator,nodes)=>nodes.length===1?nodes[0]:{type:'group',logical_operator,nodes};
const graph=`query ($ids: [String!]!) { entries(entry_ids: $ids) { rcsb_id struct { title } struct_keywords { pdbx_keywords } rcsb_entry_info { resolution_combined deposited_atom_count selected_polymer_entity_types } rcsb_accession_info { initial_release_date } exptl { method } rcsb_entry_container_identifiers { assembly_ids } polymer_entities { rcsb_polymer_entity { pdbx_description } rcsb_entity_source_organism { ncbi_scientific_name } } } }`;
export function normalizeQuery(input){let q=input.trim().replace(/^https?:\/\/(?:www\.)?rcsb.org\/structure\//i,'').replace(/^PDB\s+/i,'').replace(/\/+$/,'');return {query:aliases[q.toLowerCase()]||q,alias:aliases[q.toLowerCase()]};}
const suggestionCache=new Map();
const idQuery=q=>/^(?:[0-9][a-z0-9]{3}|pdb_[a-z0-9]{8})$/i.test(q);
async function completions(query,signal){
 const q=normalizeQuery(query).query;if(!q||idQuery(q)||q.includes('"'))return [];const token=q.split(/\s+/).at(-1);if(token.length<3)return [];const key=token.toLowerCase();if(suggestionCache.has(key))return suggestionCache.get(key);
 try{const body={type:'basic',suggest:{text:token,size:40,attributes:['rcsb_polymer_entity.pdbx_description','struct.title']},highlight:{pre_tag:'',post_tag:''},results_content_type:['experimental']};const r=await fetch('https://search.rcsb.org/rcsbsearch/v2/suggest?json='+encodeURIComponent(JSON.stringify(body)),{signal:signal?AbortSignal.any([signal,AbortSignal.timeout(5000)]):AbortSignal.timeout(5000)});if(!r.ok)return [];const data=r.status===204?{}:await r.json();const names=[...new Set((data.suggestions?.['rcsb_polymer_entity.pdbx_description']||[]).map(v=>v.text.toLowerCase()))].slice(0,40);suggestionCache.set(key,names);if(suggestionCache.size>60)suggestionCache.delete(suggestionCache.keys().next().value);return names;}catch(e){if(signal?.aborted)throw e;return [];}
}
export function localMatches(options){
 if(options.kind||options.organism||options.method||options.sort!=='relevance')return [];
 const q=normalizeQuery(options.query||'').query.toLowerCase();if(!q)return [...catalog];const tokens=q.match(/[\p{L}\p{N}-]+/gu)||[];if(!tokens.length)return [];
 const pool=new Map([...entryCache.values(),...catalog].map(m=>[m.id,m]));return [...pool.values()].map(m=>{const name=m.name.toLowerCase(),words=(name+' '+m.id+' '+(m.tags||[]).join(' ')).toLowerCase().split(/[^\p{L}\p{N}-]+/u);const match=tokens.every(t=>words.some(w=>w.startsWith(t)));return {m,score:!match?0:name===q||m.id.toLowerCase()===q?100:name.startsWith(q)?50:tokens.every(t=>name.split(/\s+/).some(w=>w.startsWith(t)))?30:10};}).filter(v=>v.score).sort((a,b)=>b.score-a.score).slice(0,12).map(v=>v.m);
}
export function buildQuery({query='',kind='',organism='',method='',sort='relevance',offset=0,names=[]},broad=false){
 const q=normalizeQuery(query).query,nodes=[];
 if(q){if(idQuery(q))nodes.push(text('rcsb_id','exact_match',q.toUpperCase()));else{
 const tokens=(q.match(/"[^"]+"|[\p{L}\p{N}_-]+/gu)||[]).slice(0,12),clean=tokens.map(t=>t.replace(/^"|"$/g,''));
 const named=group('and',clean.map((t,i)=>group('or',[...fields.map(f=>text(f,'contains_phrase',t)),...(i===clean.length-1?names.map(n=>text('rcsb_polymer_entity.pdbx_description','contains_phrase',n)):[])])));
 const prefix=tokens.map(t=>t.startsWith('"')?t:t.length>=3?t+'*':t).join(' + ');if(tokens.length)nodes.push(broad?{type:'terminal',service:'full_text',parameters:{value:prefix}}:named);
 }}
 if(kind)nodes.push(text('rcsb_entry_info.polymer_entity_count_'+kind,'greater',0));if(organism)nodes.push(text('rcsb_entity_source_organism.taxonomy_lineage.id','exact_match',organism));if(method)nodes.push(text('exptl.method','exact_match',method));
 const ordering=sort==='resolution'?{sort_by:'rcsb_entry_info.resolution_combined',direction:'asc'}:sort==='newest'||!q?{sort_by:'rcsb_accession_info.initial_release_date',direction:'desc'}:{sort_by:'score',direction:'desc'};
 return {query:nodes.length?group('and',nodes):{type:'terminal',service:'text'},return_type:'entry',request_options:{paginate:{start:offset,rows:24},results_content_type:['experimental'],scoring_strategy:'combined',sort:[ordering]}};
}
async function request(url,body,signal){const timeout=AbortSignal.timeout(30000);const combined=signal?AbortSignal.any([signal,timeout]):timeout;const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:combined});if(r.status===204)return {total_count:0,result_set:[]};if(!r.ok)throw Error(`Archive request failed (${r.status})`);return r.json();}
function titleCase(s){if(s.length>6&&s===s.toUpperCase()&&!/^DNA|^RNA/.test(s))return s.charAt(0)+s.slice(1).toLowerCase();return s;}
function entryItem(e){const id=e.rcsb_id,local=known.get(id);const entities=e.polymer_entities||[];const names=[...new Set(entities.map(p=>p.rcsb_polymer_entity?.pdbx_description).filter(Boolean))];const organisms=[...new Set(entities.flatMap(p=>(p.rcsb_entity_source_organism||[]).map(o=>o.ncbi_scientific_name)).filter(Boolean))];const title=e.struct?.title||id;let name=names.length===1?names[0]:names.length===2&&names.join(' / ').length<80?names.join(' / '):title;name=titleCase(name);const assemblyIds=e.rcsb_entry_container_identifiers?.assembly_ids||['1'];return {...local,id,name:local?.name||name,title,description:local?.description||title,organism:organisms.map(o=>species[o]||o).join(' / '),method:e.exptl?.[0]?.method||'',resolution:e.rcsb_entry_info?.resolution_combined?.[0],release:e.rcsb_accession_info?.initial_release_date,assembly:assemblyIds.includes('1')?'1':assemblyIds[0],remote:!local,color:local?.color||'#80b3c0',representation:local?.representation||'cartoon'};}
export async function fetchEntries(ids,signal){const missing=ids.filter(id=>!entryCache.has(id));if(missing.length){const data=await request(DATA,{query:graph,variables:{ids:missing}},signal);if(data.errors&&!data.data?.entries)throw Error('Structure details could not be read');for(const e of data.data?.entries||[]){if(e)entryCache.set(e.rcsb_id,entryItem(e));}while(entryCache.size>1000)entryCache.delete(entryCache.keys().next().value);}return ids.map(id=>entryCache.get(id)).filter(Boolean);}
export async function searchStructures(options){
 const {signal}=options,key=JSON.stringify(['query','kind','organism','method','sort','offset','broad'].map(k=>options[k]||''));if(pageCache.has(key))return pageCache.get(key);
 const normalized=normalizeQuery(options.query||'');if(normalized.query&&!/[\p{L}\p{N}]/u.test(normalized.query))return {items:[],total:0,next:0,hasMore:false,hint:''};
 const names=await completions(options.query||'',signal);options={...options,names};let broad=!!options.broad,raw=await request(SEARCH,buildQuery(options,broad),signal);
 if(!raw.total_count&&normalized.query&&!idQuery(normalized.query)&&!broad){raw=await request(SEARCH,buildQuery({...options,offset:0},true),signal);broad=true;}
 const hits=raw.result_set||[],items=await fetchEntries(hits.map(h=>h.identifier),signal),next=(options.offset||0)+hits.length,total=raw.total_count||0,more=next<total;
 const expand=!broad&&!!normalized.query&&!idQuery(normalized.query)&&!more&&total>0;
 const result={items,total,next:expand?0:next,nextBroad:broad||expand,hasMore:more||expand,hint:broad?'Broader matches across PDB annotations':normalized.alias?'Searching for “'+normalized.query+'”':''};
 if(!signal?.aborted){pageCache.set(key,result);while(pageCache.size>40)pageCache.delete(pageCache.keys().next().value);}return result;
}
export function thumbnail(item){return item.remote?`https://cdn.rcsb.org/images/structures/${item.id.toLowerCase()}_assembly-${item.assembly||'1'}.jpeg`:`/thumbs/${item.id}.png`;}
export {coordinates,forgetCoordinates} from './coordinates.js';
