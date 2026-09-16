/* Pure parametric geometry shared by the browser and Node tests. */
(function(root){
  'use strict';
  const TAU=Math.PI*2;
  const curves={
    Heart:{label:'Heart curve',parameter:'Shape power',min:2,max:7,value:3,equationX:'x(t) = sign(sin(t)) |sin(t)|ᵖ',equationY:'y(t) = [13cos(t) − 5cos(2t) − 2cos(3t) − cos(4t)] / 17',range:()=>TAU,point:(t,p)=>[Math.sign(Math.sin(t))*Math.abs(Math.sin(t))**p,(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/17]},
    Lissajous:{label:'Lissajous curve',parameter:'y frequency',min:1,max:12,value:3,equationX:'x(t) = sin(2t + π/2)',equationY:'y(t) = sin(bt)',range:()=>TAU,point:(t,b)=>[Math.sin(2*t+Math.PI/2),Math.sin(b*t)]},
    Rose:{label:'Polar rose',parameter:'Petals (k)',min:1,max:12,value:5,equationX:'x(t) = cos(kt) cos(t)',equationY:'y(t) = cos(kt) sin(t)',range:()=>TAU,point:(t,k)=>[Math.cos(k*t)*Math.cos(t),Math.cos(k*t)*Math.sin(t)]},
    Spiral:{label:'Archimedean spiral',parameter:'Turns',min:1,max:10,value:4,equationX:'x(t) = (t/T) cos(t)',equationY:'y(t) = (t/T) sin(t)',range:p=>p*TAU,point:(t,p)=>{const u=t/(p*TAU);return[u*Math.cos(t),u*Math.sin(t)]}},
    Butterfly:{label:'Butterfly curve',parameter:'Lobes',min:2,max:8,value:4,equationX:'x(t) = sin(t) · B(t)',equationY:'y(t) = cos(t) · B(t)',range:()=>12*Math.PI,point:(t,p)=>{const b=(Math.exp(Math.cos(t))-2*Math.cos(p*t)-Math.sin(t/12)**5)/4.8;return[Math.sin(t)*b,Math.cos(t)*b]}},
    Hypotrochoid:{label:'Hypotrochoid',parameter:'Inner radius',min:2,max:8,value:3,equationX:'x(t) = (R−r)cos(t) + d cos((R−r)t/r)',equationY:'y(t) = (R−r)sin(t) − d sin((R−r)t/r)',range:()=>6*TAU,point:(t,r)=>{const R=9,d=5;return[((R-r)*Math.cos(t)+d*Math.cos((R-r)*t/r))/11,((R-r)*Math.sin(t)-d*Math.sin((R-r)*t/r))/11]}}
  };
  function sample(name,parameter,count=1000){const curve=curves[name];if(!curve)throw new Error('Unknown curve: '+name);if(count<2)throw new Error('Sample count must be at least 2');const end=curve.range(parameter);return Array.from({length:count},(_,i)=>{const t=end*i/(count-1),[x,y]=curve.point(t,parameter);return{x,y,t};});}
  function path(points,size=1,x0=0,y0=0,screenScale=1){return points.map((p,i)=>`${i?'L':'M'} ${(x0+p.x*size)*screenScale} ${-(y0+p.y*size)*screenScale}`).join(' ');}
  function at(points,progress){const p=Math.max(0,Math.min(1,progress))*(points.length-1),i=Math.floor(p),j=Math.min(i+1,points.length-1),f=p-i;return{x:points[i].x+(points[j].x-points[i].x)*f,y:points[i].y+(points[j].y-points[i].y)*f,t:points[i].t+(points[j].t-points[i].t)*f};}
  const api={TAU,curves,sample,path,at};
  if(typeof module!=='undefined')module.exports=api;else root.TraceGeometry=api;
})(typeof window!=='undefined'?window:globalThis);
