/* The James NZ — small service worker so the site can be added to the home
   screen. It never stores the big site files: pages always load fresh from
   the internet, with a friendly message if you're offline. */
var OFFLINE = 'jnz-offline-v1';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(OFFLINE).then(function (c) { return c.put('./offline.html', new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The James NZ</title><body style="font-family:system-ui,sans-serif;background:#fffaf2;color:#14243a;display:grid;place-items:center;min-height:90vh;text-align:center;padding:24px"><div><div style="font-size:56px">☀️</div><h1>You’re offline</h1><p>The James NZ needs the internet. Check your connection and try again.</p><button onclick="location.reload()" style="font-size:18px;padding:10px 22px;border-radius:999px;border:0;background:#163d6b;color:#fff">Try again</button></div>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } })); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(function () { return caches.match('./offline.html'); }));
});
