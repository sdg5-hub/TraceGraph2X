// Local-only static preview. No dependencies required.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const allowed=new Set(['index.html','style.css','geometry.js','app.js']);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
  if(!allowed.has(name)){res.writeHead(404);res.end('Not found');return;}
  fs.readFile(path.join(root,name),(err,data)=>{if(err){res.writeHead(500);res.end('Unable to read file');return;}res.writeHead(200,{'Content-Type':types[path.extname(name)],'Cache-Control':'no-store'});res.end(data);});
}).listen(4173,'127.0.0.1',()=>console.log('TraceGraph2X: http://127.0.0.1:4173'));
