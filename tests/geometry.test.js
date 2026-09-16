const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('../geometry.js');
test('all parametric presets generate finite coordinates',()=>{
  for(const [name,curve] of Object.entries(G.curves)){const points=G.sample(name,curve.value,500);assert.equal(points.length,500);for(const p of points)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.t),`${name} produced an invalid coordinate`);assert.equal(points[0].t,0);assert.ok(Math.abs(points.at(-1).t-curve.range(curve.value))<1e-10);}
});
test('heart and closed periodic curves return to their starting point',()=>{
  for(const name of ['Heart','Lissajous','Rose']){const c=G.curves[name],p=G.sample(name,c.value,1000);assert.ok(Math.hypot(p[0].x-p.at(-1).x,p[0].y-p.at(-1).y)<1e-9,name);}
});
test('screen path applies origin, amplitude, scale, and y inversion',()=>{const p=[{x:1,y:2,t:0},{x:-1,y:-2,t:1}];assert.equal(G.path(p,3,4,5,10),'M 70 -110 L 10 10');});
test('point interpolation clamps and interpolates trace progress',()=>{const p=[{x:0,y:0,t:0},{x:10,y:20,t:2}];assert.deepEqual(G.at(p,-1),p[0]);assert.deepEqual(G.at(p,1),p[1]);assert.deepEqual(G.at(p,.25),{x:2.5,y:5,t:.5});});
test('invalid curve and resolution fail clearly',()=>{assert.throws(()=>G.sample('nope',1),/Unknown curve/);assert.throws(()=>G.sample('Heart',3,1),/at least 2/);});
