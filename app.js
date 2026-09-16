'use strict';
const $=id=>document.getElementById(id),G=window.TraceGeometry,NS='http://www.w3.org/2000/svg';
const defaults={curve:'Heart',size:12,parameter:3,resolution:1000,thickness:2,x:0,y:0,speed:1};
let state={...defaults},points=[],progress=1,playing=false,lastTime=0,frame=0;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function svg(name,attrs={}){const el=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;}
Object.entries(G.curves).forEach(([name,curve])=>{
  const button=document.createElement('button');button.className='curve-button';button.dataset.curve=name;button.setAttribute('aria-pressed',name===state.curve);button.innerHTML=`<span>${curve.label}</span><small>${curve.equationX.replace('x(t) = ','')}</small>`;
  button.onclick=()=>selectCurve(name);$('curves').append(button);
});
function selectCurve(name){state.curve=name;const c=G.curves[name];state.parameter=c.value;$('parameter').min=c.min;$('parameter').max=c.max;$('parameter').value=c.value;progress=1;stop();render();}
function rebuildAxes(){const group=$('ticks'),frag=document.createDocumentFragment(),step=50;
  for(let x=-450;x<=450;x+=step){if(!x)continue;frag.append(svg('line',{x1:x,y1:-4,x2:x,y2:4,stroke:'#fff','stroke-opacity':'.55'}));const t=svg('text',{x:x+4,y:16,fill:'#fff','fill-opacity':'.7','font-size':9});t.textContent=(x/25).toFixed(0);frag.append(t);}
  for(let y=-300;y<=300;y+=step){if(!y)continue;frag.append(svg('line',{x1:-4,y1:y,x2:4,y2:y,stroke:'#fff','stroke-opacity':'.55'}));const t=svg('text',{x:7,y:y-6,fill:'#fff','fill-opacity':'.7','font-size':9});t.textContent=(-y/25).toFixed(0);frag.append(t);}group.replaceChildren(frag);}
function render(){const c=G.curves[state.curve];points=G.sample(state.curve,state.parameter,state.resolution);const d=G.path(points,state.size,state.x,state.y,25);
  $('guide').setAttribute('d',d);$('trace').setAttribute('d',d);$('trace').setAttribute('stroke-width',state.thickness);$('trace').style.strokeDasharray='1';$('trace').style.strokeDashoffset=String(1-progress);
  const p=G.at(points,progress),px=(state.x+p.x*state.size)*25,py=-(state.y+p.y*state.size)*25;$('pen').setAttribute('transform',`translate(${px} ${py})`);$('pen').style.display=progress===0?'none':'';
  const showEquation=text=>text.replaceAll('ᵖ',superscript(state.parameter)).replaceAll('b',state.parameter).replaceAll('k',state.parameter).replaceAll('T',`${state.parameter}·2π`);$('equationX').textContent=showEquation(c.equationX);$('equationY').textContent=showEquation(c.equationY);$('domain').textContent=`0 ≤ t ≤ ${formatT(c.range(state.parameter))}`;
  $('curveName').textContent=c.label.toUpperCase();$('parameterLabel').textContent=c.parameter;$('parameterValue').textContent=state.parameter;$('sizeValue').textContent=state.size+' units';$('resolutionValue').textContent=state.resolution+' pts';$('thicknessValue').textContent=state.thickness+' px';
  $('tReadout').textContent='t = '+formatT(p.t);$('xyReadout').textContent=`x = ${(state.x+p.x*state.size).toFixed(2)}  y = ${(state.y+p.y*state.size).toFixed(2)}`;$('progressText').textContent=`${playing?'TRACING':'TRACE '+(progress>=1?'COMPLETE':'PAUSED')} — ${Math.round(progress*100)}%`;
  document.querySelectorAll('[data-curve]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.curve===state.curve));$('canvasTitle').textContent=c.label+' traced on Cartesian axes';}
function formatT(t){const n=t/Math.PI;if(Math.abs(n)<.005)return'0';if(Math.abs(n-Math.round(n))<.005)return(n===1?'':Math.round(n))+'π';return t.toFixed(2);}
function superscript(value){return String(value).replace(/[0-9-]/g,d=>({'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'})[d]);}
function updatePlay(){$('play').textContent=playing?'Ⅱ PAUSE':progress>0&&progress<1?'▶ RESUME':'▶ TRACE';}
function stop(){playing=false;cancelAnimationFrame(frame);updatePlay();}
function tick(now){if(!playing)return;const dt=lastTime?Math.min(now-lastTime,80):0;lastTime=now;progress+=dt/6500*state.speed;if(progress>=1){if($('loop').checked)progress=0;else{progress=1;stop();}}render();if(playing)frame=requestAnimationFrame(tick);}
function start(){if(progress>=1)progress=0;playing=true;lastTime=0;updatePlay();frame=requestAnimationFrame(tick);}
['size','parameter','resolution','thickness'].forEach(key=>{$(key).oninput=()=>{state[key]=Number($(key).value);progress=1;render();};});
['x','y'].forEach(key=>{$(key).oninput=()=>{if(Number.isFinite($(key).valueAsNumber)){state[key]=$(key).valueAsNumber;progress=1;render();}};});
$('speed').oninput=()=>{state.speed=Number($('speed').value);$('speedValue').textContent=state.speed+'×';};
$('play').onclick=()=>playing?stop():start();$('restart').onclick=()=>{progress=0;stop();start();};
$('center').onclick=()=>{state.x=state.y=0;$('x').value=$('y').value=0;progress=1;render();};
$('gridToggle').onchange=()=>{$('gridGroup').classList.toggle('no-grid',!$('gridToggle').checked);};$('guideToggle').onchange=()=>{$('guide').style.display=$('guideToggle').checked?'':'none';};
$('canvas').onclick=e=>{const m=$('canvas').getScreenCTM();if(!m)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());state.x=Math.max(-20,Math.min(20,Math.round(p.x/12.5)/2));state.y=Math.max(-20,Math.min(20,Math.round(-p.y/12.5)/2));$('x').value=state.x;$('y').value=state.y;progress=1;render();};
$('reset').onclick=()=>{stop();state={...defaults};progress=1;Object.entries(defaults).forEach(([k,v])=>{if($(k))$(k).value=v;});$('loop').checked=false;$('gridToggle').checked=$('guideToggle').checked=true;$('gridGroup').classList.remove('no-grid');$('guide').style.display='';selectCurve('Heart');};
$('export').onclick=()=>{const copy=$('canvas').cloneNode(true);copy.removeAttribute('id');copy.setAttribute('width',1000);copy.setAttribute('height',720);copy.querySelector('#pen').remove();const blob=new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`tracegraph2x-${state.curve.toLowerCase()}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='SVG exported';};
if(reducedMotion)$('loop').disabled=true;rebuildAxes();render();updatePlay();
