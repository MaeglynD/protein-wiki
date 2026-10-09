import {defineConfig} from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import {catalog} from './src/catalog.js';
export default defineConfig({
 server:{host:'127.0.0.1',port:5187,strictPort:true,forwardConsole:false},
 build:{target:'es2022',chunkSizeWarningLimit:6000},
 plugins:[{name:'local-thumbnail-studio',configureServer(server){
   server.middlewares.use('/__thumb',async(req,res)=>{
     const id=new URL(req.url,'http://localhost').searchParams.get('id');
     if(req.method!=='POST'||!catalog.some(c=>c.id===id)){res.statusCode=400;res.end();return;}
     try{let body='';for await(const chunk of req){body+=chunk;if(body.length>5e6)throw Error('Too large');}if(!body.startsWith('data:image/png;base64,'))throw Error('Invalid image');await fs.mkdir(path.resolve('public/thumbs'),{recursive:true});await fs.writeFile(path.resolve('public/thumbs',id+'.png'),Buffer.from(body.split(',')[1],'base64'));res.end('ok');}catch(e){res.statusCode=500;res.end(e.message);}
   });
 }}]
});
