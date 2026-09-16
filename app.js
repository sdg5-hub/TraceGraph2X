/* No dependencies or build step. Open index.html to begin. */
'use strict';
const $ = id => document.getElementById(id);
const G = window.TraceGeometry;
const NS='http://www.w3.org/2000/svg';
const palettes={Aurora:['#8fe3d0','#74a9eb','#b184ee','#f296bd'],Sunset:['#ffcb77','#ff956c','#ed658a','#aa72dc'],Ocean:['#c5f4e0','#5edfd2','#4daae5','#7772e9'],Candy:['#ffe49e','#f4a5d5','#b59af7','#87d9f0']};
const defaults={shape:'Heart',palette:'Aurora',layers:22,size:20,spacing:9,thickness:1.5,rotation:0,x:0,y:0,color:'#ac83ff',speed:1};
let state={...defaults}, playing=false, progress=1, previous=0, frame=0, zoom=1;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reducedMotion) $('loop').checked=false;
function svgElement(name,attrs){const el=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;}
G.shapes.forEach(shape=>{
  const button=document.createElement('button');button.className='shape-button';button.dataset.shape=shape;button.setAttribute('aria-label',shape);button.setAttribute('aria-pressed',shape===state.shape);
  const icon=svgElement('svg',{viewBox:'-1.3 -1.3 2.6 2.6','aria-hidden':'true'});icon.append(svgElement('path',{d:G.path(shape),'stroke-width':.12}));button.append(icon,document.createTextNode(shape));
  button.onclick=()=>{state.shape=shape;render();};$('shapes').append(button);
});
Object.entries(palettes).forEach(([name,colors])=>{const button=document.createElement('button');button.className='palette';button.dataset.palette=name;button.title=name;button.setAttribute('aria-label',name+' palette');const strip=document.createElement('span');strip.style.background=`linear-gradient(110deg,${colors.join(',')})`;button.append(strip);button.onclick=()=>{state.palette=name;render();};$('palettes').append(button);});
for(let n=-450;n<=450;n+=100){if(n===0)continue;const t=svgElement('text',{x:n+4,y:15,fill:'#536077','font-size':9,'font-family':'monospace'});t.textContent=n;$('ticks').append(t);}
for(let n=-300;n<=300;n+=100){if(n===0)continue;const t=svgElement('text',{x:7,y:-n-7,fill:'#536077','font-size':9,'font-family':'monospace'});t.textContent=n;$('ticks').append(t);}
const units={layers:'',size:' u',spacing:' u',thickness:' px',rotation:'°'};
Object.keys(units).forEach(key=>{$(key).oninput=()=>{state[key]=Number($(key).value);render();};});
['x','y'].forEach(key=>{$(key).oninput=()=>{if($(key).value===''||!Number.isFinite($(key).valueAsNumber))return;state[key]=Math.max(-500,Math.min(500,$(key).valueAsNumber));render();};$(key).onchange=()=>{$(key).value=state[key];};});
$('color').oninput=()=>{state.color=$('color').value;state.palette='Custom';render();};
$('speed').oninput=()=>{state.speed=Number($('speed').value);$('speedValue').textContent=state.speed+'×';};
function render(){
  Object.entries(units).forEach(([key,unit])=>{$(key+'Value').textContent=state[key]+unit;});
  document.querySelectorAll('[data-shape]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.shape===state.shape));
  document.querySelectorAll('[data-palette]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.palette===state.palette));
  $('shapeTag').textContent=state.shape.toUpperCase();$('canvasTitle').textContent=`${state.layers} nested ${state.shape.toLowerCase()} shapes`;
  $('summary').textContent=`${state.layers} ${state.layers===1?'layer':'layers'} · ${state.shape} · ${state.palette}`;
  const d=G.path(state.shape), stops=state.palette==='Custom'?[state.color]:palettes[state.palette];
  const fragment=document.createDocumentFragment();
  for(let i=0;i<state.layers;i++){
    const reveal=Math.max(0,Math.min(1,progress*state.layers-i));if(reveal===0)continue;
    const r=G.radius(state.size,state.spacing,i)*(1-(1-reveal)**3);
    fragment.append(svgElement('path',{d,transform:`translate(${state.x} ${-state.y}) rotate(${-state.rotation}) scale(${r})`,fill:'none',stroke:G.color(stops,i/Math.max(1,state.layers-1)),'stroke-width':state.thickness,'vector-effect':'non-scaling-stroke','stroke-linejoin':'round',opacity:Math.min(1,reveal*2)}));
  }
  $('art').replaceChildren(fragment);$('origin').setAttribute('transform',`translate(${state.x} ${-state.y})`);
}
function setZoom(value){zoom=Math.max(.15,Math.min(4,value));const w=1000/zoom,h=800/zoom;$('canvas').setAttribute('viewBox',`${-w/2} ${-h/2} ${w} ${h}`);$('background').setAttribute('x',-w/2);$('background').setAttribute('y',-h/2);$('background').setAttribute('width',w);$('background').setAttribute('height',h);const gridRect=$('gridGroup').querySelector('rect');['x','y','width','height'].forEach(k=>gridRect.setAttribute(k,$('background').getAttribute(k)));$('zoomValue').textContent=Math.round(zoom*100)+'%';}
$('zoomIn').onclick=()=>setZoom(zoom*1.25);$('zoomOut').onclick=()=>setZoom(zoom/1.25);
$('fit').onclick=()=>{const r=G.radius(state.size,state.spacing,state.layers-1);setZoom(Math.min(1000/(2*(Math.abs(state.x)+r+35)),800/(2*(Math.abs(state.y)+r+35))));};
$('canvas').onclick=event=>{const matrix=$('canvas').getScreenCTM();if(!matrix)return;const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());state.x=Math.max(-500,Math.min(500,Math.round(point.x)));state.y=Math.max(-500,Math.min(500,-Math.round(point.y)));syncOrigin();};
function syncOrigin(){$('x').value=state.x;$('y').value=state.y;render();}
$('center').onclick=()=>{state.x=state.y=0;syncOrigin();};
$('gridToggle').onchange=()=>{$('gridGroup').style.display=$('gridToggle').checked?'':'none';};
function updatePlay(){$('play').textContent=playing?'Ⅱ Pause':progress<1?'▶ Resume':'▶ Animate';$('play').setAttribute('aria-pressed',playing);}
function tick(time){if(!playing)return;const dt=previous?Math.min(time-previous,80):0;previous=time;progress+=dt/6000*state.speed;
  if(progress>=1.15){if($('loop').checked)progress=0;else{progress=1;playing=false;}}
  render();updatePlay();if(playing)frame=requestAnimationFrame(tick);
}
function start(){if(progress>=1)progress=0;playing=true;previous=0;updatePlay();frame=requestAnimationFrame(tick);}
$('play').onclick=()=>{if(playing){playing=false;cancelAnimationFrame(frame);updatePlay();}else start();};
$('restart').onclick=()=>{cancelAnimationFrame(frame);progress=0;playing=false;start();};
$('reset').onclick=()=>{playing=false;cancelAnimationFrame(frame);progress=1;state={...defaults};Object.keys(defaults).forEach(k=>{if($(k))$(k).value=defaults[k];});$('speedValue').textContent='1×';$('loop').checked=!reducedMotion;$('gridToggle').checked=true;$('gridGroup').style.display='';setZoom(1);updatePlay();render();};
$('export').onclick=()=>{
  const copy=$('canvas').cloneNode(true);copy.removeAttribute('id');copy.setAttribute('width','1000');copy.setAttribute('height','800');copy.querySelector('#origin').remove();
  const blob=new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`tracegraph2x-${state.shape.toLowerCase()}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='Your SVG has been exported.';
};
render();updatePlay();
