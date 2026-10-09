import { PluginContext } from 'molstar/lib/mol-plugin/context.js';
import { DefaultPluginSpec } from 'molstar/lib/mol-plugin/spec.js';
import { PluginConfig } from 'molstar/lib/mol-plugin/config.js';
import { Color } from 'molstar/lib/mol-util/color/index.js';
import { Structure, StructureElement, StructureProperties } from 'molstar/lib/mol-model/structure.js';
import { Loci } from 'molstar/lib/mol-model/loci.js';
import { lociLabel } from 'molstar/lib/mol-theme/label.js';
import { stripTags } from 'molstar/lib/mol-util/string.js';
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder.js';
import { OrderedSet } from 'molstar/lib/mol-data/int.js';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition.js';
import { SsaoParams } from 'molstar/lib/mol-canvas3d/passes/ssao.js';
import { SmaaParams } from 'molstar/lib/mol-canvas3d/passes/smaa.js';
import { changeCameraRotation, structureLayingTransform } from 'molstar/lib/mol-plugin-state/manager/focus-camera/orient-axes.js';
import { Vec3 } from 'molstar/lib/mol-math/linear-algebra.js';

export const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
import {reduced} from './motion.js';
const residueNames={ALA:'Alanine',ARG:'Arginine',ASN:'Asparagine',ASP:'Aspartate',CYS:'Cysteine',GLN:'Glutamine',GLU:'Glutamate',GLY:'Glycine',HIS:'Histidine',ILE:'Isoleucine',LEU:'Leucine',LYS:'Lysine',MET:'Methionine',PHE:'Phenylalanine',PRO:'Proline',SER:'Serine',THR:'Threonine',TRP:'Tryptophan',TYR:'Tyrosine',VAL:'Valine',DA:'Adenine (DNA)',DT:'Thymine (DNA)',DG:'Guanine (DNA)',DC:'Cytosine (DNA)',A:'Adenine (RNA)',U:'Uracil (RNA)',G:'Guanine (RNA)',C:'Cytosine (RNA)',HEM:'Heme group',ATP:'ATP',ADP:'ADP'};
const elements={C:'carbon',N:'nitrogen',O:'oxygen',S:'sulfur',P:'phosphorus',FE:'iron',MG:'magnesium',CA:'calcium',ZN:'zinc',H:'hydrogen'};
function describe(loci){
  if(!StructureElement.Loci.is(loci)||!loci.elements.length)return stripTags(lociLabel(loci,{hidePrefix:true,htmlStyling:false})||'');
  const e=loci.elements[0];const index=OrderedSet.getAt(e.indices,0);const l=StructureElement.Location.create(loci.structure,e.unit,e.unit.elements[index]);
  const code=StructureProperties.atom.label_comp_id(l);const chain=StructureProperties.chain.auth_asym_id(l);const seq=StructureProperties.residue.auth_seq_id(l);const atom=StructureProperties.atom.label_atom_id(l);const element=StructureProperties.atom.type_symbol(l);
  return `${residueNames[code]||code} ${seq} · Chain ${chain}\n${elements[element.toUpperCase()]||element} atom ${atom}`;
}
export class MolecularStage {
  constructor(el,{onHover=()=>{},onSelect=()=>{},onMessage=()=>{},onProgress=()=>{}}={}) {this.el=el;this.onHover=onHover;this.onSelect=onSelect;this.onMessage=onMessage;this.onProgress=onProgress;this.reps=[];this.chains=[];this.queue=Promise.resolve();this.busy=false;this.measurements=[];}
  async init(){
    const spec=DefaultPluginSpec();
    spec.config=[[PluginConfig.VolumeStreaming.Enabled,false]];
    spec.behaviors=spec.behaviors.filter(b=>!b.transformer.id.includes('focus-loci')&&!b.transformer.id.includes('structure-focus-representation'));
    this.plugin=new PluginContext(spec);
    await this.plugin.init();
    const ok=await this.plugin.mountAsync(this.el);
    if(!ok)throw new Error('WebGL is unavailable. Please enable graphics acceleration in your browser.');
    this.plugin.canvas3d.setProps({
      transparentBackground:true,
      camera:{mode:'orthographic',manualReset:true,helper:{axes:{name:'off',params:{}}}},
      cameraFog:{name:'off',params:{}},
      renderer:{backgroundColor:Color(0x10161d),ambientIntensity:.55,light:[{inclination:140,azimuth:40,color:Color(0xe6f4ff),intensity:.85},{inclination:65,azimuth:210,color:Color(0xa1c8dc),intensity:.35}],selectColor:Color(0xffd394),highlightColor:Color(0xe7d2a0)},
      marking:{highlightEdgeColor:Color(0xdac692),selectEdgeColor:Color(0xe4c499),edgeScale:1,highlightEdgeStrength:.55,selectEdgeStrength:.75},
      postprocessing:{occlusion:{name:'on',params:{...PD.getDefaultValues(SsaoParams),samples:32,radius:5,bias:.8}},outline:{name:'off',params:{}},antialiasing:{name:'smaa',params:PD.getDefaultValues(SmaaParams)},shadow:{name:'off',params:{}}},
      trackball:{animate:{name:'off',params:{}},rotateSpeed:1.65,zoomSpeed:2.6,staticMoving:false,dynamicDampingFactor:.22},
      helper:{axes:{name:'off',params:{}}}
    });
    this.plugin.managers.interactivity.setProps({granularity:'residue'});
    this.plugin.behaviors.interaction.hover.subscribe(e=>this.onHover(Loci.isEmpty(e.current.loci)?'':describe(e.current.loci)));
    this.plugin.behaviors.interaction.click.subscribe(e=>{
      const loci=e.current.loci;
      if(this.busy||!StructureElement.Loci.is(loci)||Loci.isEmpty(loci))return;
      this.selected=loci;
      if(this.measuring){this.measurePoint(loci);return;}
      this.plugin.managers.interactivity.lociSelects.selectOnly({loci});
      this.onSelect({label:describe(loci),loci});
    });
    this.plugin.canvas3d.camera.changed.subscribe(()=>{const camera=this.plugin.canvas3d.camera;const initial=this.initialCamera;const zoom=initial?Vec3.distance(initial.position,initial.target)/Math.max(.01,Vec3.distance(camera.position,camera.target)):1;this.el.dataset.zoom=zoom.toFixed(2);this.el.dataset.cameraMoving=String(camera.transition.inTransition);if(camera.transition.inTransition){this.el.dataset.motionFrames=String(1+Number(this.el.dataset.motionFrames||0));this.el.dataset.motionDuration=String(camera.transition.durationMs);}this.el.closest('.world')?.style.setProperty('--zoom-protection',Math.min(1,Math.max(0,(zoom-1)/1.5)).toFixed(3));});
    this.resizeObserver=new ResizeObserver(()=>this.plugin.handleResize());
    this.resizeObserver.observe(this.el);
    return this;
  }
  applyTheme(theme){
    this.plugin.canvas3d.setProps({renderer:{backgroundColor:Color(theme.background)}});
    this.plugin.canvas3d.requestDraw();
  }
  serialize(fn){const run=this.queue.then(fn,fn);this.queue=run.catch(()=>{});return run;}
  async load(item,representation=item.representation||'cartoon',colorMode=item.colorMode||'chain-id',buffer){
    return this.serialize(async()=>{
      this.busy=true;
      try{
        this.fadeToken=(this.fadeToken||0)+1;this.dimmed=false;this.contextAlpha=1;this.spin(false);this.selected=null;this.stopMeasurement();this.distanceRefs=[];this.feature=null;this.isolated=null;this.reps=[];this.onHover('');
        await this.plugin.clear();this.item=item;this.colorMode=colorMode;this.representation=representation;
        this.onProgress('Reading coordinates',1);
        const data=buffer?await this.plugin.builders.data.rawData({data:buffer,label:item.id},{state:{isGhost:true}}):await this.plugin.builders.data.download({url:item.remote?`https://models.rcsb.org/${item.id.toLowerCase()}.bcif`:`/structures/${item.id}.bcif`,isBinary:true},{state:{isGhost:true}});
        const trajectory=await this.plugin.builders.structure.parseTrajectory(data,'mmcif');
        const model=await this.plugin.builders.structure.createModel(trajectory);
        this.structure=await this.plugin.builders.structure.createStructure(model,{name:'assembly',params:{id:item.assembly||'1'}});
        this.polymer=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'polymer');
        this.ligand=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'ligand');
        this.ions=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'ion');
        this.branches=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'branched');
        this.onProgress('Building geometry',2);
        await this.render();
        const s=this.structure.obj.data;
        this.readChains(s);
        const sphere=s.boundary.sphere;
        const focus=this.plugin.canvas3d.camera.getFocus(sphere.center,sphere.radius*(innerWidth<=680?1.12:1.4));
        focus.radiusMax=sphere.radius*2;
        const {rotation}=structureLayingTransform([s]);
        const oriented=changeCameraRotation(focus,rotation);if(item.id==='7AHL'){const dir=Vec3.sub(Vec3(),oriented.target,oriented.position);oriented.up=Vec3.normalize(Vec3(),Vec3.cross(Vec3(),dir,oriented.up));}this.plugin.managers.camera.setSnapshot(oriented,0);
        await pause(120);
        this.initialCamera=this.plugin.canvas3d.camera.getSnapshot();
        return {atoms:s.elementCount,chains:this.chains,ligands:this.readLigands(),polymerUnits:s.units.filter(u=>u.polymerElements?.length).length};
      }finally{this.busy=false;}
    });
  }
  palette(){
    const base=Color.fromHexStyle(this.item.color||'#799988');
    if(this.item.id==='4HHB')return [Color(0x79b7c0),Color(0xe3b789),Color(0x93cdd1),Color(0xf2d2a4)];
    const companions=[0xdcb590,0x98bcd1,0xaec89c,0xc8a5b4,0xb8b0d8];
    return [Color.interpolate(base,Color(0xc5e0e5),.32),...companions.map(Color)];
  }
  colorProps(){return this.colorMode==='chain-id'?{color:'chain-id',colorParams:{asymId:'auth',palette:{name:'colors',params:{list:{kind:'set',colors:this.palette()}}}}}:this.colorMode==='uniform'?{color:'uniform',colorParams:{value:Color.fromHexStyle(this.item.color||'#799988')}}:{color:this.colorMode};}
  async render(){
    const update=this.plugin.build();for(const r of this.reps)update.delete(r.ref);await update.commit();this.reps=[];
    const s=this.structure.obj.data;const huge=s.elementCount>100000;
    const type=this.representation==='surface'?'gaussian-surface':this.representation==='atoms'?'spacefill':this.representation;
    const base={...this.colorProps(),type,typeParams:{quality:huge?'medium':'high',alpha:1,ignoreHydrogens:true,material:{metalness:.06,roughness:.42,bumpiness:0},sizeFactor:type==='cartoon'?.28:type==='ball-and-stick'?.24:1,resolution:huge?1.5:.8,smoothness:1,radiusOffset:1.2}};
    if(this.polymer)this.reps.push(await this.plugin.builders.structure.representation.addRepresentation(this.polymer,base));
    for(const c of [this.ligand,this.ions,this.branches].filter(Boolean))this.reps.push(await this.plugin.builders.structure.representation.addRepresentation(c,{type:this.representation==='atoms'?'spacefill':'ball-and-stick',typeParams:{sizeFactor:.24,quality:'medium'},color:'element-symbol',colorParams:{carbonColor:{name:'uniform',params:{value:Color(0xb69262)}}}}));
  }
  changeRepresentation(type){return this.serialize(async()=>{this.busy=true;try{await this.clearFeature();this.representation=type;await this.render();}finally{this.busy=false;}});}
  changeColor(mode){return this.serialize(async()=>{this.busy=true;try{await this.clearFeature();this.colorMode=mode;await this.render();}finally{this.busy=false;}});}
  readChains(s){
    const seen=new Set();this.chains=[];
    const colourOrder=[...new Set([...s.models[0].properties.structAsymMap.values()].map(v=>v.auth_id))];
    for(const unit of s.units){if(unit.kind!==0||!unit.polymerElements.length)continue;const l=StructureElement.Location.create(s,unit,unit.polymerElements[0]);const id=StructureProperties.chain.auth_asym_id(l);if(seen.has(id))continue;seen.add(id);this.chains.push({id,color:this.palette()[Math.max(0,colourOrder.indexOf(id))%this.palette().length]});}
    this.chains.sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
  }
  reset(){this.plugin.managers.interactivity.lociSelects.deselectAll();this.selected=null;this.flyTo(this.initialCamera,850);}
  spin(on){this.spinning=on;this.plugin?.canvas3d?.setProps({trackball:{animate:on?{name:'spin',params:{speed:.025,axis:[0,1,0]}}:{name:'off',params:{}}}});}
  flyTo(snapshot,duration=950){this.plugin.canvas3d.commit(true);this.plugin.canvas3d.camera.setState(snapshot,reduced()?0:duration,{easing:'cubic-in-out'});this.plugin.canvas3d.requestDraw();}
  focusLoci(loci){const target=this.plugin.managers.camera.getFocusLociBase(loci,{minRadius:7,extraRadius:5});if(target)this.flyTo(target);}
  focusSelected(){if(this.selected)this.focusLoci(this.selected);}
  clearSelection(){this.selected=null;this.plugin.managers.interactivity.lociSelects.deselectAll();}
  readLigands(){const out=new Map();for(const comp of [this.ligand,this.ions].filter(Boolean)){const s=comp.obj.data;for(const u of s.units){if(u.kind!==0)continue;for(const atom of u.elements){const l=StructureElement.Location.create(s,u,atom);const code=StructureProperties.atom.label_comp_id(l);if(!out.has(code))out.set(code,{id:code,name:s.models[0].properties.chemicalComponentMap.get(code)?.name||residueNames[code]||code});}}}return [...out.values()];}
  async isolate(selector,value){return this.serialize(async()=>{await this.clearFeature();let expr;if(selector==='chain')expr=MS.struct.generator.atomGroups({'chain-test':MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_asym_id(),value])});else expr=MS.struct.generator.atomGroups({'residue-test':MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_comp_id(),value])});this.feature=await this.plugin.builders.structure.tryCreateComponentFromExpression(this.structure,expr,'isolated-component',{label:value});if(!this.feature)return;const type=selector==='chain'?this.representation==='surface'?'gaussian-surface':this.representation==='atoms'?'spacefill':this.representation:'ball-and-stick';await this.plugin.builders.structure.representation.addRepresentation(this.feature,{type,...(selector==='chain'?this.colorProps():{color:'element-symbol'}),typeParams:{sizeFactor:type==='cartoon'?.28:type==='ball-and-stick'?.3:1,smoothness:1,radiusOffset:1.2,resolution:.8,quality:'high',material:{roughness:.42,metalness:.06}}});this.isolated={kind:selector,id:value};this.dimmed=true;this.fadeContext(.09);this.focusLoci(Structure.toStructureElementLoci(this.feature.obj.data));});}
  async isolateSelected(){if(!this.selected)return;const e=this.selected.elements[0];const l=StructureElement.Location.create(this.selected.structure,e.unit,e.unit.elements[OrderedSet.getAt(e.indices,0)]);await this.isolate('chain',StructureProperties.chain.auth_asym_id(l));}
  async fadeContext(target){
    const token=this.fadeToken=(this.fadeToken||0)+1;const start=performance.now(),from=this.contextAlpha??1,duration=reduced()?0:450;
    await new Promise(resolve=>{const tick=now=>{if(token!==this.fadeToken){resolve();return;}const t=duration?Math.min(1,(now-start)/duration):1;const alpha=from+(target-from)*(1-Math.pow(1-t,3));this.contextAlpha=alpha;for(const r of this.reps){const repr=r.obj?.data?.repr;if(repr){repr.setState({alphaFactor:alpha});this.plugin.canvas3d.update(repr);}}this.plugin.canvas3d.requestDraw();if(t<1)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
  }
  async clearFeature(){
    this.isolated=null;
    if(this.dimmed){await this.fadeContext(1);this.dimmed=false;}
    if(this.feature){await this.plugin.build().delete(this.feature.ref).commit();this.feature=null;}
  }
  async reveal(selector,chainId){
    return this.serialize(async()=>{
      await this.clearFeature();this.spin(false);
      let targets=[];
      if(selector==='chain'){
        const id=chainId||this.chains[0]?.id;
        this.feature=await this.plugin.builders.structure.tryCreateComponentFromExpression(this.structure,MS.struct.generator.atomGroups({'chain-test':MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_asym_id(),id])}),'feature-chain',{label:`Chain ${id}`});
      }else if(selector==='nucleic')this.feature=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'nucleic');
      if(this.feature){targets=[Structure.toStructureElementLoci(this.feature.obj.data)];await this.plugin.builders.structure.representation.addRepresentation(this.feature,{type:'cartoon',...this.colorProps(),typeParams:{sizeFactor:.32,quality:'high'}});}
      else if(selector==='ligand')targets=[this.ligand,this.ions].filter(Boolean).map(c=>Structure.toStructureElementLoci(c.obj.data));
      if(targets.length){
        const u=this.plugin.build();if(this.reps[0])u.to(this.reps[0]).update(p=>{p.type.params.alpha=.17;});await u.commit();this.dimmed=true;
        this.plugin.managers.camera.focusLoci(targets,{durationMs:reduced()?0:750,minRadius:7,extraRadius:6});
      }else{this.plugin.managers.camera.focusSphere(this.structure.obj.data.boundary.sphere,{durationMs:reduced()?0:650,extraRadius:0});}
    });
  }
  startMeasurement(){this.measuring=!this.measuring;this.measurements=[];this.plugin.managers.interactivity.setProps({granularity:this.measuring?'element':'residue'});return this.measuring;}
  stopMeasurement(){this.measuring=false;this.measurements=[];this.plugin.managers.interactivity.setProps({granularity:'residue'});}
  async measurePoint(loci){
    // A picked atom may be represented by a larger residue locus. Keep one exact atom.
    const e=loci.elements[0];const atomLoci=StructureElement.Loci(loci.structure,[{unit:e.unit,indices:OrderedSet.ofSingleton(OrderedSet.getAt(e.indices,0))}]);
    this.measurements.push(atomLoci);this.plugin.managers.interactivity.lociSelects.select({loci:atomLoci});
    if(this.measurements.length===1){this.onMessage('First atom selected. Click a second atom.');return;}
    let distance;
    try{const result=await this.plugin.managers.structure.measurement.addDistance(this.measurements[0],this.measurements[1]);if(result?.selection)this.distanceRefs.push(result.selection.ref);
      const points=this.measurements.map(loc=>{const el=loc.elements[0];return el.unit.conformation.position(el.unit.elements[OrderedSet.getAt(el.indices,0)],Vec3());});
      distance=Vec3.distance(points[0],points[1]);this.onMessage(`Distance: ${distance.toFixed(2)} Å.`);
    }catch{this.onMessage('Could not measure these atoms. Try again.');}
    this.measuring=false;this.measurements=[];this.plugin.managers.interactivity.setProps({granularity:'residue'});this.onSelect({measurement:true,distance});
  }
  async clearMeasurements(){
    const update=this.plugin.build();for(const ref of this.distanceRefs||[])update.delete(ref);await update.commit();this.distanceRefs=[];this.plugin.managers.interactivity.lociSelects.deselectAll();
  }
  async screenshot(thumbnail=false){
    const helper=this.plugin.helpers.viewportScreenshot;
    helper.values;helper.behaviors.values.next({...helper.values,resolution:{name:'custom',params:{width:thumbnail?440:1800,height:thumbnail?340:1350}},transparent:thumbnail,format:{name:'png',params:{}}});
    return helper.getImageDataUri();
  }
  async downloadImage(){const uri=await this.screenshot(false);const a=document.createElement('a');a.href=uri;a.download=`protein-wiki-${this.item.id.toLowerCase()}.png`;a.click();}
  dispose(){this.resizeObserver?.disconnect();this.plugin?.dispose();}
}






