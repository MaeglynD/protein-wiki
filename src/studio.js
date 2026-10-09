import {catalog} from './catalog.js';
import {MolecularStage,pause} from './molecule.js';
const stage=new MolecularStage(document.querySelector('#viewer'));
await stage.init();
async function generate(missing){
 document.querySelectorAll('button').forEach(b=>b.disabled=true);let ok=0,failed=[];
 for(const [i,item] of catalog.entries()){
  if(missing){const r=await fetch(`/thumbs/${item.id}.png`,{method:'HEAD'});if(r.headers.get('content-type')?.includes('image')){ok++;continue;}}
  document.querySelector('#status').textContent=`Rendering ${i+1}/${catalog.length}: ${item.id} · ${item.name}`;
  try{await stage.load(item,item.representation,item.colorMode||'chain-id');await pause(350);const uri=await stage.screenshot(true);const r=await fetch('/__thumb?id='+item.id,{method:'POST',body:uri});if(!r.ok)throw Error(await r.text());const img=document.createElement('img');img.src=uri;img.width=160;img.alt=item.name;document.querySelector('#results').append(img);ok++;}catch(e){console.error(item.id,e);failed.push(`${item.id}: ${e.message}`);}
 }
 document.querySelector('#status').textContent=`Complete: ${ok}/${catalog.length} thumbnails. ${failed.length?'Failed: '+failed.join('; '):'All rendered successfully.'}`;
 document.querySelectorAll('button').forEach(b=>b.disabled=false);
}
document.querySelector('#generate').onclick=()=>generate(false);document.querySelector('#missing').onclick=()=>generate(true);
