const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('../geometry.js');
test('every shape is finite, centered within unit bounds, and closed',()=>{
  for(const shape of G.shapes){const p=G.points(shape);assert.ok(p.length>=4);for(const [x,y] of p){assert.ok(Number.isFinite(x)&&Number.isFinite(y));assert.ok(Math.abs(x)<=1.001&&Math.abs(y)<=1.001);}assert.ok(G.path(shape).endsWith(' Z'));assert.ok(!G.path(shape).includes('NaN'));}
});
test('layer radii expand by exactly the chosen spacing',()=>{assert.equal(G.radius(20,9,0),20);assert.equal(G.radius(20,9,21),209);assert.equal(G.radius(5,.5,2),6);});
test('palette interpolation preserves endpoints and handles single color',()=>{assert.equal(G.color(['#000000','#ffffff'],0),'#000000');assert.equal(G.color(['#000000','#ffffff'],1),'#ffffff');assert.equal(G.color(['#000000','#ffffff'],.5),'#808080');assert.equal(G.color(['#ac83ff'],.6),'#ac83ff');assert.equal(G.color(['#000000','#ffffff'],2),'#ffffff');});
test('unsupported shapes fail explicitly',()=>assert.throws(()=>G.path('Unknown'),/Unknown shape/));
