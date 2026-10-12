import assert from 'node:assert/strict';
import {stageFrame,fitRadius} from '../src/camera-frame.js';
import {catalog} from '../src/catalog.js';
import {existsSync} from 'node:fs';
for(const [width,height,left,top,bottom] of [[320,568,0,144,344],[390,844,0,162,546],[430,932,0,162,634],[844,390,206,90,300],[1440,900,344,158,800]]){
 const frame=stageFrame({width,height,left,top,bottom});
 const center=height/2+frame.offset;
 assert(center-frame.diameter/2>=top,'molecule clears title');
 assert(center+frame.diameter/2<=bottom,'molecule clears dock');
 assert(frame.diameter<=width-left-48,'molecule clears catalogue and viewport edges');
 const radius=fitRadius(45,width+left,height,frame.diameter);
 assert(Math.abs(45/radius*Math.min(width+left,height)-frame.diameter)<1e-8,'camera projection fits the usable diameter');
}
const malformed=stageFrame({width:320,height:240,top:190,bottom:100});
assert(Number.isFinite(malformed.offset)&&malformed.diameter>0);
assert.equal(new Set(catalog.map(m=>m.id)).size,catalog.length);
for(const m of catalog){
 assert(existsSync(new URL('../public/structures/'+m.id+'.bcif',import.meta.url)),'missing coordinates '+m.id);
 assert(existsSync(new URL('../public/thumbs/'+m.id+'.png',import.meta.url)),'missing preview '+m.id);
}
assert(new Set(catalog.slice(0,10).map(m=>m.representation)).size>=3,'opening collection offers different representations');
assert(new Set(catalog.slice(0,10).map(m=>m.category)).size>=4,'opening collection covers different molecular types');
console.log('PASS responsive camera framing and curated asset integrity');
