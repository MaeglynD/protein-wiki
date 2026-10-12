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
import { Binding } from 'molstar/lib/mol-util/binding.js';
import { DefaultTrackballBindings } from 'molstar/lib/mol-canvas3d/controls/trackball.js';
import { ButtonsType } from 'molstar/lib/mol-util/input/input-observer.js';
import { stageFrame,fitRadius } from './camera-frame.js';

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
  constructor(el,{onHover=()=>{},onSelect=()=>{},onMessage=()=>{},onProgress=()=>{}}={}) {this.el=el;this.onHover=onHover;this.onSelect=onSelect;this.onMessage=onMessage;this.onProgress=onProgress;this.reps=[];this.chains=[];this.queue=Promise.resolve();this.busy=false;this.measurements=[];this.isolationVersion=0;}
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
      trackball:{animate:{name:'off',params:{}},rotateSpeed:1.35,zoomSpeed:2.1,staticMoving:false,dynamicDampingFactor:.22},
      helper:{axes:{name:'off',params:{}}}
    });
    // R and F belong to the app: do not also pan the molecular camera.
    this.plugin.canvas3d.setAttribs({trackball:{bindings:{...DefaultTrackballBindings,keyMoveUp:Binding.Empty,keyMoveDown:Binding.Empty}}});
    this.plugin.managers.interactivity.setProps({granularity:'residue'});
    this.plugin.behaviors.interaction.hover.subscribe(e=>this.onHover(Loci.isEmpty(e.current.loci)?'':describe(e.current.loci)));
    this.plugin.behaviors.interaction.click.subscribe(e=>{
      const loci=e.current.loci;
      if(this.busy||this.measurementPending||e.button!==ButtonsType.Flag.Primary||Object.values(e.modifiers||{}).some(Boolean))return;
      if(Loci.isEmpty(loci)){if(!this.measuring){this.clearSelection();this.onSelect(null);}return;}
      if(!StructureElement.Loci.is(loci))return;
      this.selected=loci;
      if(this.measuring){this.measurePoint(loci);return;}
      this.plugin.managers.interactivity.lociSelects.selectOnly({loci});
      this.onSelect({label:describe(loci),loci});
    });
    this.plugin.canvas3d.camera.changed.subscribe(()=>{const camera=this.plugin.canvas3d.camera;const initial=this.initialCamera;const zoom=initial?Vec3.distance(initial.position,initial.target)/Math.max(.01,Vec3.distance(camera.position,camera.target)):1;this.el.dataset.zoom=zoom.toFixed(2);this.el.dataset.cameraMoving=String(camera.transition.inTransition);if(camera.transition.inTransition){this.el.dataset.motionFrames=String(1+Number(this.el.dataset.motionFrames||0));this.el.dataset.motionDuration=String(camera.transition.durationMs);}this.el.closest('.world')?.style.setProperty('--zoom-protection',Math.min(1,Math.max(0,(zoom-1)/1.5)).toFixed(3));});
    const interruptFlight=()=>{const camera=this.plugin.canvas3d.camera;if(camera.transition.inTransition)camera.transition.finish(camera.getSnapshot());};
    this.gestureSubscriptions=['drag','pinch','wheel'].map(name=>this.plugin.canvas3d.input[name].subscribe(interruptFlight));
    this.resizeObserver=new ResizeObserver(()=>this.reframe());
    this.resizeObserver.observe(this.el);
    for(const selector of ['.structure-label','.control-dock']){const target=document.querySelector(selector);if(target)this.resizeObserver.observe(target);}
    this.reframe();
    return this;
  }
  frame(){
    const world=this.el.closest('.world'),title=document.querySelector('.structure-label').getBoundingClientRect(),dock=document.querySelector('.control-dock').getBoundingClientRect();
    const mobile=innerWidth<=680,immersive=world.classList.contains('immersive');
    const left=mobile||immersive?0:document.querySelector('.discovery').getBoundingClientRect().right+24;
    const dockStyle=getComputedStyle(document.querySelector('.scene-bottom'));
    const safeBottom=parseFloat(getComputedStyle(world).getPropertyValue('--safe-bottom'))||0;
    // Read the destination inset, not an intermediate frame of the dock's animation.
    const dockTop=mobile?world.clientHeight-parseFloat(dockStyle.getPropertyValue('--dock-bottom'))-safeBottom-dock.height:dock.top;
    const panelTop=mobile&&immersive&&world.classList.contains('inspector-open')?parseFloat(document.querySelector('#inspector').style.top)-12:dockTop;
    const frame=stageFrame({width:world.clientWidth,height:world.clientHeight,left,top:title.bottom+20,bottom:Math.min(dockTop,panelTop)-20});
    world.style.setProperty('--stage-offset',frame.offset+'px');
    return frame;
  }
  reframe(){
    cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame=requestAnimationFrame(()=>{
      this.plugin.handleResize();this.plugin.canvas3d.handleResize();
      const frame=this.frame();
      if(!this.structure?.obj||!this.initialCamera||this.busy)return;
      const camera=this.plugin.canvas3d.camera,sphere=this.structure.obj.data.boundary.sphere;
      const radius=fitRadius(sphere.radius,this.el.clientWidth,this.el.clientHeight,frame.diameter);
      const distance=camera.getTargetDistance(radius),ratio=distance/(this.fitDistance||distance);
      if(Math.abs(ratio-1)<.001)return;
      const snapshot=camera.transition.inTransition?structuredClone(camera.transition.target):camera.getSnapshot();
      snapshot.position=Vec3.scaleAndAdd(Vec3(),snapshot.target,Vec3.sub(Vec3(),snapshot.position,snapshot.target),ratio);
      this.initialCamera.position=Vec3.scaleAndAdd(Vec3(),this.initialCamera.target,Vec3.sub(Vec3(),this.initialCamera.position,this.initialCamera.target),ratio);
      this.initialCamera.radius=radius;this.fitDistance=distance;
      this.flyTo(snapshot,450);
    });
  }
  applyTheme(theme){
    this.plugin.canvas3d.setProps({renderer:{backgroundColor:Color(theme.background)}});
    this.plugin.canvas3d.requestDraw();
  }
  serialize(fn){const run=this.queue.then(fn,fn);this.queue=run.catch(()=>{});return run;}
  async load(item,representation=item.representation||'cartoon',colorMode=item.colorMode||'chain-id',buffer,signal){
    this.isolationVersion++;
    const assertCurrent=()=>{if(signal?.aborted)throw new DOMException('Structure changed','AbortError');};
    return this.serialize(async()=>{
      assertCurrent();this.busy=true;
      try{
        this.fadeToken=(this.fadeToken||0)+1;this.dimmed=false;this.contextAlpha=1;this.spin(false);this.selected=null;this.stopMeasurement();this.distanceRefs=[];this.feature=null;this.isolated=null;this.reps=[];this.onHover('');
        await this.plugin.clear();assertCurrent();this.item=item;this.colorMode=colorMode;this.representation=representation;
        assertCurrent();this.onProgress('Reading coordinates',1);
        const data=buffer?await this.plugin.builders.data.rawData({data:buffer,label:item.id},{state:{isGhost:true}}):await this.plugin.builders.data.download({url:item.remote?`https://models.rcsb.org/${item.id.toLowerCase()}.bcif`:`/structures/${item.id}.bcif`,isBinary:true},{state:{isGhost:true}});
        assertCurrent();const trajectory=await this.plugin.builders.structure.parseTrajectory(data,'mmcif');
        assertCurrent();const model=await this.plugin.builders.structure.createModel(trajectory);
        assertCurrent();this.structure=await this.plugin.builders.structure.createStructure(model,{name:'assembly',params:{id:item.assembly||'1'}});
        assertCurrent();this.polymer=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'polymer');
        assertCurrent();this.ligand=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'ligand');
        assertCurrent();this.ions=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'ion');
        assertCurrent();this.branches=await this.plugin.builders.structure.tryCreateComponentStatic(this.structure,'branched');
        assertCurrent();this.onProgress('Building geometry',2);
        await this.render(assertCurrent);assertCurrent();
        const s=this.structure.obj.data;
        this.readChains(s);
        const sphere=s.boundary.sphere;
        this.plugin.handleResize();this.plugin.canvas3d.handleResize();
        const frame=this.frame();
        const focus=this.plugin.canvas3d.camera.getFocus(sphere.center,fitRadius(sphere.radius,this.el.clientWidth,this.el.clientHeight,frame.diameter));
        focus.radiusMax=sphere.radius*2;
        const {rotation}=structureLayingTransform([s]);
        const oriented=changeCameraRotation(focus,rotation);if(item.id==='7AHL'){const dir=Vec3.sub(Vec3(),oriented.target,oriented.position);oriented.up=Vec3.normalize(Vec3(),Vec3.cross(Vec3(),dir,oriented.up));}this.plugin.managers.camera.setSnapshot(oriented,0);
        await pause(120);
        this.initialCamera=this.plugin.canvas3d.camera.getSnapshot();this.fitDistance=Vec3.distance(this.initialCamera.position,this.initialCamera.target);
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
  async render(assertCurrent=()=>{}){
    assertCurrent();
    const update=this.plugin.build();for(const r of this.reps)update.delete(r.ref);await update.commit();assertCurrent();this.reps=[];
    const s=this.structure.obj.data;const huge=s.elementCount>100000;
    const type=this.representation==='surface'?'gaussian-surface':this.representation==='atoms'?'spacefill':this.representation;
    const base={...this.colorProps(),type,typeParams:{quality:huge?'medium':'high',alpha:1,ignoreHydrogens:true,material:{metalness:.06,roughness:.42,bumpiness:0},sizeFactor:type==='cartoon'?.28:type==='ball-and-stick'?.24:1,resolution:huge?1.5:.8,smoothness:1,radiusOffset:1.2}};
    if(this.polymer)this.reps.push(await this.plugin.builders.structure.representation.addRepresentation(this.polymer,base));
    for(const c of [this.ligand,this.ions,this.branches].filter(Boolean)){assertCurrent();this.reps.push(await this.plugin.builders.structure.representation.addRepresentation(c,{type:this.representation==='atoms'?'spacefill':'ball-and-stick',typeParams:{sizeFactor:.24,quality:'medium'},color:'element-symbol',colorParams:{carbonColor:{name:'uniform',params:{value:Color(0xb69262)}}}}));}
  }
  changeAppearance(property,value){return this.serialize(async()=>{
    this.busy=true;
    try{
      const isolated=this.isolated;await this.clearFeature(false);this[property]=value;await this.render();
      if(isolated)await this.applyIsolation(isolated.kind,isolated.id,{focus:false,animate:false});
    }finally{this.busy=false;}
  });}
  changeRepresentation(type){return this.changeAppearance('representation',type);}
  changeColor(mode){return this.changeAppearance('colorMode',mode);}
  readChains(s){
    const seen=new Set();this.chains=[];
    const colourOrder=[...new Set([...s.models[0].properties.structAsymMap.values()].map(v=>v.auth_id))];
    for(const unit of s.units){if(unit.kind!==0||!unit.polymerElements.length)continue;const l=StructureElement.Location.create(s,unit,unit.polymerElements[0]);const id=StructureProperties.chain.auth_asym_id(l);if(seen.has(id))continue;seen.add(id);this.chains.push({id,color:this.palette()[Math.max(0,colourOrder.indexOf(id))%this.palette().length]});}
    this.chains.sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
  }
  restore(){this.isolationVersion++;return this.serialize(async()=>{this.busy=true;try{await this.clearFeature();this.reset();}finally{this.busy=false;}});}
  reset(){this.plugin.managers.interactivity.lociSelects.deselectAll();this.selected=null;this.flyTo(this.initialCamera,850);}
  spin(on){this.spinning=on;this.plugin?.canvas3d?.setProps({trackball:{animate:on?{name:'spin',params:{speed:.025,axis:[0,1,0]}}:{name:'off',params:{}}}});}
  flyTo(snapshot,duration=950){this.plugin.canvas3d.commit(true);this.plugin.canvas3d.camera.setState(snapshot,reduced()?0:duration,{easing:'cubic-in-out'});this.plugin.canvas3d.requestDraw();}
  focusLoci(loci){
    const camera=this.plugin.canvas3d.camera,target=this.plugin.managers.camera.getFocusLociBase(loci,{minRadius:7,extraRadius:5});
    if(target){const frame=this.frame();const radius=fitRadius(target.radius,this.el.clientWidth,this.el.clientHeight,frame.diameter);this.flyTo(camera.getFocus(target.target,radius));}
  }
  focusSelected(){if(this.selected)this.focusLoci(this.selected);}
  clearSelection(){this.selected=null;this.plugin.managers.interactivity.lociSelects.deselectAll();}
  readLigands(){const out=new Map();for(const comp of [this.ligand,this.ions].filter(Boolean)){const s=comp.obj.data;for(const u of s.units){if(u.kind!==0)continue;for(const atom of u.elements){const l=StructureElement.Location.create(s,u,atom);const code=StructureProperties.atom.label_comp_id(l);if(!out.has(code))out.set(code,{id:code,name:s.models[0].properties.chemicalComponentMap.get(code)?.name||residueNames[code]||code});}}}return [...out.values()];}
  async applyIsolation(selector,value,{focus=true,animate=true}={}){
    const expr=selector==='chain'?MS.struct.generator.atomGroups({'chain-test':MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_asym_id(),value])}):MS.struct.generator.atomGroups({'residue-test':MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_comp_id(),value])});
    this.feature=await this.plugin.builders.structure.tryCreateComponentFromExpression(this.structure,expr,'isolated-component',{label:value});
    if(!this.feature)return false;
    const type=selector==='chain'?this.representation==='surface'?'gaussian-surface':this.representation==='atoms'?'spacefill':this.representation:'ball-and-stick';
    const huge=this.feature.obj.data.elementCount>100000;
    await this.plugin.builders.structure.representation.addRepresentation(this.feature,{type,...(selector==='chain'?this.colorProps():{color:'element-symbol'}),typeParams:{sizeFactor:type==='cartoon'?.28:type==='ball-and-stick'?.3:1,smoothness:1,radiusOffset:1.2,resolution:huge?1.5:.8,quality:huge?'medium':'high',material:{roughness:.42,metalness:.06}}});
    this.isolated={kind:selector,id:value};this.dimmed=true;
    await this.fadeContext(.09,animate?350:0);
    if(focus)this.focusLoci(Structure.toStructureElementLoci(this.feature.obj.data));
    return true;
  }
  isolate(selector,value){
    const version=++this.isolationVersion,structure=this.structure;
    return this.serialize(async()=>{
      if(version!==this.isolationVersion||structure!==this.structure)return false;
      this.busy=true;
      try{
        this.clearSelection();this.stopMeasurement();await this.clearFeature();
        if(version!==this.isolationVersion)return false;
        const applied=await this.applyIsolation(selector,value);
        return applied&&version===this.isolationVersion;
      }finally{this.busy=false;}
    });
  }
  async isolateSelected(){if(!this.selected)return;const e=this.selected.elements[0];const l=StructureElement.Location.create(this.selected.structure,e.unit,e.unit.elements[OrderedSet.getAt(e.indices,0)]);return this.isolate('chain',StructureProperties.chain.auth_asym_id(l));}
  async fadeContext(target,duration=450){
    const token=this.fadeToken=(this.fadeToken||0)+1;const start=performance.now(),from=this.contextAlpha??1;if(reduced())duration=0;
    await new Promise(resolve=>{const tick=now=>{if(token!==this.fadeToken){resolve();return;}const t=duration?Math.min(1,(now-start)/duration):1;const alpha=from+(target-from)*(1-Math.pow(1-t,3));this.contextAlpha=alpha;for(const r of this.reps){const repr=r.obj?.data?.repr;if(repr){repr.setState({alphaFactor:alpha});this.plugin.canvas3d.update(repr);}}this.plugin.canvas3d.requestDraw();if(t<1)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
  }
  async clearFeature(animate=true){
    this.isolated=null;
    if(this.dimmed){await this.fadeContext(1,animate?300:0);this.dimmed=false;}
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
  startMeasurement(){this.measurementVersion=(this.measurementVersion||0)+1;this.clearSelection();this.measuring=!this.measuring;this.measurements=[];this.plugin.managers.interactivity.setProps({granularity:this.measuring?'element':'residue'});return this.measuring;}
  stopMeasurement(){this.measurementVersion=(this.measurementVersion||0)+1;this.measuring=false;this.measurements=[];this.plugin.managers.interactivity.setProps({granularity:'residue'});}
  async measurePoint(loci){
    // A picked atom may be represented by a larger residue locus. Keep one exact atom.
    const e=loci.elements[0];const atomLoci=StructureElement.Loci(loci.structure,[{unit:e.unit,indices:OrderedSet.ofSingleton(OrderedSet.getAt(e.indices,0))}]);
    this.measurements.push(atomLoci);this.plugin.managers.interactivity.lociSelects.select({loci:atomLoci});
    if(this.measurements.length===1){this.onMessage('First atom selected. Select a second atom.');return;}
    const points=[...this.measurements],version=this.measurementVersion;
    this.measurementPending=true;
    return this.serialize(async()=>{
      if(version!==this.measurementVersion){this.measurementPending=false;return;}
      let distance;
      try{
        const result=await this.plugin.managers.structure.measurement.addDistance(points[0],points[1]);
        if(result?.selection)this.distanceRefs.push(result.selection.ref);
        const positions=points.map(loc=>{const el=loc.elements[0];return el.unit.conformation.position(el.unit.elements[OrderedSet.getAt(el.indices,0)],Vec3());});
        distance=Vec3.distance(positions[0],positions[1]);
      }catch{this.onMessage('Could not measure these atoms. Try again.');}
      finally{this.measurementPending=false;this.stopMeasurement();}
      this.onSelect({measurement:true,distance});
    });
  }
  clearMeasurements(){
    this.stopMeasurement();
    return this.serialize(async()=>{const update=this.plugin.build();for(const ref of this.distanceRefs||[])update.delete(ref);await update.commit();this.distanceRefs=[];this.clearSelection();});
  }
  async screenshot(thumbnail=false){
    const helper=this.plugin.helpers.viewportScreenshot;
    helper.values;helper.behaviors.values.next({...helper.values,resolution:{name:'custom',params:{width:thumbnail?440:1800,height:thumbnail?340:1350}},transparent:thumbnail,format:{name:'png',params:{}}});
    return helper.getImageDataUri();
  }
  async downloadImage(){const uri=await this.screenshot(false);const a=document.createElement('a');a.href=uri;a.download=`protein-wiki-${this.item.id.toLowerCase()}.png`;a.click();}
  dispose(){this.gestureSubscriptions?.forEach(s=>s.unsubscribe());cancelAnimationFrame(this.resizeFrame);this.resizeObserver?.disconnect();this.plugin?.dispose();}
}






