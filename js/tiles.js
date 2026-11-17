/* Paws Run — tiles.js
   Ground, block and spike tiles (drawn once per scene and cached) and the dark vignette around the screen. */
'use strict';

/* ---------- world art ---------- */
const tileCache = {};
function tiles() {
  if (tileCache[envName]) return tileCache[envName];
  const th = theme();
  const mk = fn => { const cc = document.createElement('canvas'); cc.width = T; cc.height = T; fn(cc.getContext('2d')); return cc; };
  const soil = (g, seed, a, b2) => {
    g.fillStyle = lin(g, 0, 0, 0, T, [[0, a], [1, b2]]); g.fillRect(0, 0, T, T);
    for (let i = 0; i < 9; i++) { g.fillStyle = hash(seed + i) > 0.5 ? 'rgba(0,0,0,.14)' : 'rgba(255,255,255,.12)'; ell(g, hash(seed + i * 3) * T, 12 + hash(seed + i * 5) * (T - 14), 1.5 + hash(seed + i * 7) * 2.6, 1.2 + hash(seed + i) * 1.4); }
  };
  const cap = g => {
    g.fillStyle = shade(th.top, 0.62); g.beginPath(); g.moveTo(0, 0); g.lineTo(T, 0); g.lineTo(T, 11);
    for (let i = 3; i >= 0; i--) g.quadraticCurveTo(i * 9 + 4.5, 17 + (i % 2) * 2, i * 9, 11); g.closePath(); g.fill();
    g.fillStyle = lin(g, 0, 0, 0, 13, [[0, tint(th.top, 0.4)], [0.35, th.top], [1, shade(th.top, 0.82)]]);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(T, 0); g.lineTo(T, 9); for (let i = 3; i >= 0; i--) g.quadraticCurveTo(i * 9 + 4.5, 15 + (i % 2) * 2, i * 9, 9); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(0, 0, T, 1.6);
  };
  const set = {
    top: [0, 1].map(k => mk(g => { soil(g, 11 + k * 40, k ? th.dirt : th.dirt2, shade(th.dirt2, 0.82)); cap(g); })),
    deep: [0, 1].map(k => mk(g => soil(g, 90 + k * 40, shade(k ? th.dirt : th.dirt2, 0.82), shade(th.dirt2, 0.5)))),
    brick: mk(g => {
      g.fillStyle = lin(g, 0, 0, T, T, [[0, tint(th.brick, 0.18)], [1, shade(th.brick, 0.8)]]); g.fillRect(0, 0, T, T);
      g.strokeStyle = th.brickLine; g.lineWidth = 1.6; g.beginPath(); g.moveTo(0, T / 2); g.lineTo(T, T / 2); g.moveTo(T / 2, 0); g.lineTo(T / 2, T / 2); g.moveTo(T / 4, T / 2); g.lineTo(T / 4, T); g.moveTo(T * 0.75, T / 2); g.lineTo(T * 0.75, T); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.38)'; g.fillRect(0, 0, T, 3); g.fillRect(0, 0, 3, T);
      g.fillStyle = 'rgba(0,0,0,.32)'; g.fillRect(0, T - 4, T, 4); g.fillRect(T - 3, 0, 3, T);
      g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(3, T / 2 + 1.5, T - 6, 1.5);
    }),
    spike: mk(g => {
      for (let i = 0; i < 2; i++) { const x = i * 18;
        g.fillStyle = tint(th.spike, 0.5); tri(g, x, T, x + 9, 8, x + 9, T);
        g.fillStyle = '#7d8496'; tri(g, x + 9, T, x + 9, 8, x + 18, T);
        g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(x, T); g.lineTo(x + 9, 8); g.lineTo(x + 18, T); g.stroke();
        g.fillStyle = '#fff'; dot(g, x + 8.4, 11, 1); }
    })
  };
  return tileCache[envName] = set;
}
let vignette = null;
function drawVignette() {
  if (!vignette) { vignette = document.createElement('canvas'); vignette.width = VW; vignette.height = VH; const g = vignette.getContext('2d');
    g.fillStyle = rad(g, VW / 2, VH * 0.45, VH * 0.45, VW / 2, VH * 0.5, VW * 0.72, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(8,10,30,.42)']]); g.fillRect(0, 0, VW, VH); }
  c.drawImage(vignette, 0, 0);
}
