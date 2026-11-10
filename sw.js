const V='hipro-v2';
const SHELL=['./','index.html','config.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png',
 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'];
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u))))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request, u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.endsWith('supabase.co')||u.hostname.endsWith('supabase.in')) return;
  const fresh=r.mode==='navigate'||(u.origin===location.origin&&/(index\.html|config\.js|\/)$/.test(u.pathname));
  if(fresh){ e.respondWith(fetch(r).then(res=>{ const c=res.clone(); caches.open(V).then(x=>x.put(r,c)); return res; }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))); return; }
  e.respondWith(caches.match(r).then(m=>{ const net=fetch(r).then(res=>{ if(res.ok||res.type==='opaque'){ const c=res.clone(); caches.open(V).then(x=>x.put(r,c)); } return res; }).catch(()=>m); return m||net; }));
});
