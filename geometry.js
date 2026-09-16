/* Pure geometry shared by the browser and the Node test suite. */
(function (root) {
  'use strict';
  const shapes = ['Heart', 'Circle', 'Star', 'Flower', 'Hexagon', 'Diamond'];
  function points(shape, count = 240) {
    if (!shapes.includes(shape)) throw new Error('Unknown shape: ' + shape);
    if (shape === 'Hexagon' || shape === 'Diamond' || shape === 'Star') {
      const n = shape === 'Hexagon' ? 6 : shape === 'Diamond' ? 4 : 10;
      return Array.from({length:n}, (_,i) => {
        const t = i * Math.PI * 2 / n - Math.PI / 2;
        const r = shape === 'Star' && i % 2 ? .46 : 1;
        return [Math.cos(t) * r, Math.sin(t) * r];
      });
    }
    return Array.from({length:count}, (_,i) => {
      const t = i * Math.PI * 2 / count;
      if (shape === 'Heart') return [Math.sin(t) ** 3, -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)+2.5)/16];
      const r = shape === 'Flower' ? .78 + .22 * Math.cos(6*t) : 1;
      return [Math.cos(t)*r, Math.sin(t)*r];
    });
  }
  function path(shape) { return points(shape).map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(5)).join(' ')).join(' ')+' Z'; }
  function radius(size, spacing, layer) { return size + spacing * layer; }
  function color(stops, t) {
    const p = Math.max(0,Math.min(1,t))*(stops.length-1), i=Math.min(Math.floor(p),stops.length-1), j=Math.min(i+1,stops.length-1);
    const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16));
    const a=rgb(stops[i]), b=rgb(stops[j]);
    return '#'+a.map((v,k)=>Math.round(v+(b[k]-v)*(p-i)).toString(16).padStart(2,'0')).join('');
  }
  const api = {shapes, points, path, radius, color};
  if (typeof module !== 'undefined') module.exports=api; else root.TraceGeometry=api;
})(typeof window !== 'undefined' ? window : globalThis);
