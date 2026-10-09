import assert from 'node:assert/strict';
const moduleUrl=new URL('../src/coordinates.js',import.meta.url);
const realFetch=globalThis.fetch;
const binary=new Uint8Array(180);binary[0]=0x83;
const cif='data_3CUP\n_atom_site.id 1\n';
let serial=0;
async function scenario(name,test){const api=await import(moduleUrl+'?case='+serial++);try{await test(api);console.log('PASS '+name);}finally{globalThis.fetch=realFetch;}}
await scenario('CORS/network failure falls back to text CIF and caches success',async api=>{
 const calls=[];globalThis.fetch=async url=>{calls.push(url);if(url.includes('models.'))throw new TypeError('Failed to fetch');return new Response(cif);};
 const messages=[];assert.equal(await api.coordinates({id:'3CUP',remote:true},undefined,t=>messages.push(t)),cif);
 assert.equal(calls.length,2);assert.match(calls[1],/files\.rcsb\.org\/download\/3CUP.cif/);assert(messages.some(t=>t.includes('alternate')));
 await api.coordinates({id:'3CUP',remote:true});assert.equal(calls.length,2);
});
await scenario('HTML error documents cannot poison the coordinate cache',async api=>{
 let calls=0;globalThis.fetch=async()=>++calls===1?new Response('<html>Error</html>',{headers:{'Content-Type':'text/html'}}):new Response(cif);
 assert.equal(await api.coordinates({id:'3BTN',remote:true}),cif);assert.equal(calls,2);
});
await scenario('429 Retry-After cools the host for subsequent structures',async api=>{
 const calls=[];globalThis.fetch=async url=>{calls.push(url);return url.includes('models.')?new Response('busy',{status:429,headers:{'Retry-After':'60'}}):new Response(cif);};
 await api.coordinates({id:'3CUP',remote:true});await api.coordinates({id:'3BTN',remote:true});
 assert.equal(calls.filter(url=>url.includes('models.')).length,1);assert.equal(calls.length,3);
});
await scenario('abort prevents fallback, cache writes and obsolete selection',async api=>{
 const controller=new AbortController();let calls=0;globalThis.fetch=async()=>{calls++;controller.abort();throw new TypeError('aborted');};
 await assert.rejects(api.coordinates({id:'3CUP',remote:true},controller.signal),{name:'AbortError'});assert.equal(calls,1);
 globalThis.fetch=async()=>{calls++;return new Response(binary);};await api.coordinates({id:'3CUP',remote:true});assert.equal(calls,2);
});
await scenario('all-source failure remains retryable; permanent errors are not hammered',async api=>{
 let calls=0;globalThis.fetch=async()=>{calls++;return new Response('not found',{status:404});};
 await assert.rejects(api.coordinates({id:'3CUP',remote:true}));assert.equal(calls,2);
 globalThis.fetch=async()=>{calls++;return new Response(binary);};assert.equal((await api.coordinates({id:'3CUP',remote:true})).length,180);assert.equal(calls,3);
});
await scenario('transient failures recover on a bounded third attempt',async api=>{
 let calls=0;globalThis.fetch=async()=>++calls<3?new Response('gateway',{status:502}):new Response(binary);
 assert.equal((await api.coordinates({id:'3CUP',remote:true})).length,180);assert.equal(calls,3);
});
await scenario('both Retry-After windows fail promptly without more requests',async api=>{
 let calls=0;globalThis.fetch=async()=>{calls++;return new Response('busy',{status:429,headers:{'Retry-After':'60'}});};
 await assert.rejects(api.coordinates({id:'3CUP',remote:true}));assert.equal(calls,2);
 await assert.rejects(api.coordinates({id:'3BTN',remote:true}));assert.equal(calls,2);
});
console.log('All coordinate recovery checks passed.');
