import {icon} from './icons.js';
import {reduced} from './motion.js';
export {reduced};
const ease='cubic-bezier(.16,1,.3,1)';
const animations=new WeakMap();
export function appear(el,show,{y=8,scale=.98,duration=300}={}){
  if(!el)return;
  animations.get(el)?.cancel();
  if(show){el.hidden=false;el.inert=false;}
  else el.inert=true;
  const frames=[{opacity:0,transform:`translateY(${y}px) scale(${scale})`,filter:'blur(3px)'},{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0px)'}];
  const a=el.animate(show?frames:frames.toReversed(),{duration:reduced()?0:show?duration:170,easing:ease,fill:'both'});
  animations.set(el,a);
  a.finished.then(()=>{if(animations.get(el)!==a)return;el.hidden=!show;a.cancel();animations.delete(el);}).catch(()=>{});
}

export class Layers {
  constructor(){this.current=null;this.menu=null;window.addEventListener('resize',()=>this.position());document.addEventListener('pointerdown',e=>{if(this.menu&&!this.menu.el.contains(e.target)&&!this.menu.anchor.contains(e.target))this.closeMenu();const c=this.current;if(c&&!c.el.contains(e.target)&&!c.anchor.contains(e.target)&&!e.target.closest('.choice-menu'))this.close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(this.menu){this.closeMenu(true);e.stopImmediatePropagation();}else if(this.current){this.close(true);e.stopImmediatePropagation();}}});this.ro=new ResizeObserver(()=>this.position());}
  toggle(el,anchor,side='below'){if(this.current?.el===el){this.close();return;}this.open(el,anchor,side);}
  openAt(el,point){
    const anchor={point,contains:()=>false,setAttribute:()=>{},focus:()=>document.querySelector('#viewer').focus({preventScroll:true}),getBoundingClientRect:()=>({left:point.x,right:point.x,top:point.y,bottom:point.y,width:0,height:0})};
    this.open(el,anchor,'point');
  }
  open(el,anchor,side='below'){this.close();document.querySelector('.world').append(el);this.current={el,anchor,side};anchor.setAttribute('aria-expanded','true');document.querySelector(({filters:'#filters-toggle',inspector:'#parts',details:'#structure-details'})[el.id]||'#no-controller')?.setAttribute('aria-expanded','true');el.setAttribute('role','dialog');el.hidden=false;this.place(this.current);this.ro.observe(el);appear(el,true,{y:side==='above'?10:-8});document.querySelector('.world').classList.add('layer-open');el.setAttribute('aria-label',({filters:'Filter structures',inspector:'Structure controls',details:'Structure information',selection:'Selected atom'})[el.id]||'Options');if(side==='point'){el.tabIndex=-1;el.focus({preventScroll:true});}else(el.querySelector('.choice')||el.querySelector('.selection-actions button')||el.querySelector('button,a'))?.focus({preventScroll:true});}
  close(focus=false){this.closeMenu();if(!this.current)return;const {el,anchor}=this.current;this.current=null;this.ro.unobserve(el);anchor.setAttribute('aria-expanded','false');document.querySelector(({filters:'#filters-toggle',inspector:'#parts',details:'#structure-details'})[el.id]||'#no-controller')?.setAttribute('aria-expanded','false');appear(el,false);document.querySelector('.world').classList.remove('layer-open');if(focus)(document.querySelector(({filters:'#filters-toggle',inspector:'#parts',details:'#structure-details',selection:'#viewer'})[el.id]||'#no-controller')||anchor).focus({preventScroll:true});}
  place({el,anchor,side}){if(side==='point'){this.placePoint(el,anchor.point);return;}const r=anchor.getBoundingClientRect(),margin=16,gap=12;el.style.maxHeight='';const w=Math.min(parseFloat(getComputedStyle(el).width)||320,innerWidth-32);el.style.width=w+'px';let x=side==='above'?r.right-w:r.left;x=Math.min(innerWidth-w-margin,Math.max(margin,x));const availableAbove=r.top-gap-margin,availableBelow=innerHeight-r.bottom-gap-margin;let above=side==='above';if(above&&availableAbove<180&&availableBelow>availableAbove)above=false;if(!above&&availableBelow<180&&availableAbove>availableBelow)above=true;el.style.maxHeight=Math.max(110,above?availableAbove:availableBelow)+'px';const height=Math.min(el.scrollHeight,parseFloat(el.style.maxHeight));const y=above?r.top-height-gap:r.bottom+gap;Object.assign(el.style,{position:'fixed',left:x+'px',top:Math.max(margin,y)+'px',right:'auto',bottom:'auto',transformOrigin:`${Math.min(w-20,Math.max(20,r.left+r.width/2-x))}px ${above?'bottom':'top'}`});}
  placePoint(el,point){
    const world=document.querySelector('.world'),mobile=innerWidth<=680,immersive=world.classList.contains('immersive');
    const rail=document.querySelector('.discovery').getBoundingClientRect();
    const title=document.querySelector('.structure-label').getBoundingClientRect();
    const dock=document.querySelector('.control-dock').getBoundingClientRect();
    const left=mobile||immersive?16:rail.right+28,right=innerWidth-16;
    const top=Math.min(title.bottom+18,innerHeight*.36),bottom=dock.top-14;
    const width=Math.min(278,right-left);
    el.style.width=width+'px';el.style.maxHeight=Math.max(100,bottom-top)+'px';
    const height=Math.min(el.scrollHeight,parseFloat(el.style.maxHeight));
    let x=point.x+18;
    if(x+width>right)x=point.x-width-18;
    x=Math.max(left,Math.min(right-width,x));
    let y=point.y-height-14;
    if(y<top)y=point.y+18;
    y=Math.max(top,Math.min(bottom-height,y));
    Object.assign(el.style,{position:'fixed',left:x+'px',top:y+'px',right:'auto',bottom:'auto',transformOrigin:(point.x<x?'left':'right')+' '+(point.y<y?'top':'bottom')});
  }
  position(){if(this.current)this.place(this.current);if(this.menu)this.place(this.menu);}
  closeMenu(focus=false){if(!this.menu)return;const {el,anchor}=this.menu;this.menu=null;anchor.setAttribute('aria-expanded','false');appear(el,false);setTimeout(()=>el.remove(),200);if(focus)(document.querySelector(({filters:'#filters-toggle',inspector:'#parts',details:'#structure-details',selection:'#viewer'})[el.id]||'#no-controller')||anchor).focus({preventScroll:true});}
  enhance(root=document){root.querySelectorAll('select:not([data-enhanced])').forEach(select=>{
    select.dataset.enhanced='true';select.hidden=true;select.tabIndex=-1;const label=select.parentElement.childNodes[0]?.textContent?.trim()||select.id;
    const b=document.createElement('button');b.type='button';b.className='choice';b.id=select.id+'-choice';b.setAttribute('role','combobox');b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label',label);select.after(b);
    const sync=()=>{b.innerHTML=`<span>${select.selectedOptions[0]?.textContent||''}</span>${icon('chevron')}`;};sync();select.addEventListener('change',sync);select.syncChoice=sync;
    const open=()=>{if(this.menu?.anchor===b){this.closeMenu();return;}this.closeMenu();const menu=document.createElement('div');menu.className='choice-menu glass';menu.id=select.id+'-options';menu.setAttribute('role','listbox');menu.setAttribute('aria-label',label);b.setAttribute('aria-controls',menu.id);b.setAttribute('aria-expanded','true');const options=[...select.options];options.forEach((o,i)=>{const option=document.createElement('button');option.type='button';option.setAttribute('role','option');option.setAttribute('aria-selected',o.selected);option.dataset.index=i;option.textContent=o.textContent;option.tabIndex=o.selected?0:-1;if(o.selected)option.insertAdjacentHTML('beforeend',icon('check'));option.onclick=()=>{select.value=o.value;select.dispatchEvent(new Event('change',{bubbles:true}));this.closeMenu(true);};menu.append(option);});document.querySelector('.world').append(menu);menu.style.width=b.offsetWidth+'px';this.menu={el:menu,anchor:b,side:'below'};this.place(this.menu);appear(menu,true,{y:-5,scale:.985,duration:240});const selected=menu.querySelector('[aria-selected=true]')||menu.firstChild;selected.focus({preventScroll:true});selected.scrollIntoView({block:'nearest'});
      let typed='',timer;menu.addEventListener('keydown',e=>{const opts=[...menu.children],i=opts.indexOf(document.activeElement);let n;if(e.key==='ArrowDown')n=(i+1)%opts.length;if(e.key==='ArrowUp')n=(i-1+opts.length)%opts.length;if(e.key==='Home')n=0;if(e.key==='End')n=opts.length-1;if(e.key==='Tab')this.closeMenu();if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&e.key!==' '){clearTimeout(timer);typed+=e.key.toLowerCase();n=opts.findIndex(o=>o.textContent.toLowerCase().startsWith(typed));timer=setTimeout(()=>typed='',700);}if(n>=0){e.preventDefault();opts[n].focus();}});
    };b.onclick=open;b.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();}};
  });}
}

export function watchImages(root){root.querySelectorAll('.thumbnail img:not([data-watched])').forEach(img=>{img.dataset.watched='true';const box=img.closest('.thumbnail');const ready=async()=>{try{await img.decode();}catch{}if(img.naturalWidth)box.classList.add('ready');else box.classList.add('failed');};img.addEventListener('load',ready,{once:true});img.addEventListener('error',()=>box.classList.add('failed'),{once:true});if(img.complete)ready();});}

export function tooltips(){const el=document.createElement('div');el.className='ui-tooltip glass';el.hidden=true;el.setAttribute('role','tooltip');document.querySelector('.world').append(el);let timer,target;const hide=()=>{clearTimeout(timer);target=null;appear(el,false,{y:3});};document.addEventListener('pointerover',e=>{const b=e.target.closest('[data-tip]');if(b===target)return;hide();if(!b)return;target=b;timer=setTimeout(()=>{el.textContent=b.dataset.tip;el.hidden=false;const r=b.getBoundingClientRect(),w=el.offsetWidth;el.style.left=Math.min(innerWidth-w-12,Math.max(12,r.left+r.width/2-w/2))+'px';el.style.top=(r.top>90?r.top-el.offsetHeight-9:r.bottom+9)+'px';appear(el,true,{y:3,duration:220});},500);});document.addEventListener('pointerdown',hide);document.addEventListener('scroll',hide,true);}


