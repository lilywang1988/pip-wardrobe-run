/* Paws Run — draw-utils.js
   Small drawing helpers shared by everything (colours, shapes, gradients) plus the bone and fish pictures. */
'use strict';

/* ---------- drawing helpers ---------- */
function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function shade(hex, f) { const [r, g, b] = rgb(hex); const k = v => Math.max(0, Math.min(255, Math.round(v * f))); return `rgb(${k(r)},${k(g)},${k(b)})`; }
function tint(hex, f) { const [r, g, b] = rgb(hex); const k = v => Math.round(v + (255 - v) * f); return `rgb(${k(r)},${k(g)},${k(b)})`; }
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); }
function dot(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
function ell(g, x, y, rx, ry, rot) { g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, 7); g.fill(); }
function tri(g, x1, y1, x2, y2, x3, y3) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineTo(x3, y3); g.closePath(); g.fill(); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); for (const [o, col] of stops) gr.addColorStop(o, col); return gr; }
function rad(g, x0, y0, r0, x1, y1, r1, stops) { const gr = g.createRadialGradient(x0, y0, r0, x1, y1, r1); for (const [o, col] of stops) gr.addColorStop(o, col); return gr; }
function hash(n) { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
function shadow(g, x, y, rx, a) { g.fillStyle = `rgba(0,0,0,${a || 0.25})`; ell(g, x, y, rx, rx * 0.22); }

function drawBone(g, x, y, s, glow) {
  g.save(); g.translate(x, y);
  if (glow) { g.fillStyle = rad(g, 0, 0, 2, 0, 0, 24, [[0, 'rgba(255,240,170,.55)'], [1, 'rgba(255,240,170,0)']]); dot(g, 0, 0, 24); }
  g.rotate(-0.5); g.scale(s, s);
  const knobs = [[-8, -3], [-8, 3], [8, -3], [8, 3]];
  g.fillStyle = '#7d6a48'; rr(g, -8, -3.6, 16, 7.2, 2); for (const [dx, dy] of knobs) dot(g, dx, dy, 4.7);
  g.fillStyle = lin(g, 0, -8, 0, 8, [[0, '#ffffff'], [0.55, '#f6ead0'], [1, '#c9b48a']]);
  rr(g, -8, -2.6, 16, 5.2, 2); for (const [dx, dy] of knobs) dot(g, dx, dy, 3.7);
  g.fillStyle = 'rgba(255,255,255,.9)'; rr(g, -6, -2, 12, 1.3, 0.6); dot(g, -9, -4.2, 1.1); dot(g, 7, -4.2, 1.1);
  g.restore();
}
function drawFish(g, x, y, s, glow) {
  g.save(); g.translate(x, y);
  if (glow) { g.fillStyle = rad(g, 0, 0, 2, 0, 0, 24, [[0, 'rgba(150,225,255,.55)'], [1, 'rgba(150,225,255,0)']]); dot(g, 0, 0, 24); }
  g.scale(s, s); g.lineJoin = 'round';
  const body = lin(g, 0, -6, 0, 6, [[0, '#2f86c9'], [0.45, '#5cc3f2'], [1, '#eafaff']]);
  g.strokeStyle = '#1c5d8c'; g.lineWidth = 1.1;
  g.fillStyle = lin(g, -14, 0, -6, 0, [[0, '#2a7fc0'], [1, '#63c6f3']]);
  g.beginPath(); g.moveTo(-6, 0); g.quadraticCurveTo(-11, -3, -14, -7); g.quadraticCurveTo(-11.5, 0, -14, 7); g.quadraticCurveTo(-11, 3, -6, 0); g.fill(); g.stroke();
  g.fillStyle = '#2f86c9'; g.beginPath(); g.moveTo(-3, -5); g.quadraticCurveTo(0, -10, 4, -5); g.fill(); g.stroke();
  g.fillStyle = body; g.beginPath(); g.ellipse(0, 0, 9.5, 5.8, 0, 0, 7); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 0.7;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { g.beginPath(); g.arc(-5 + i * 3.4 + j * 1.6, -1.2 + j * 2.6, 1.7, -1.1, 1.1); g.stroke(); }
  g.strokeStyle = '#1c5d8c'; g.lineWidth = 0.8; g.beginPath(); g.arc(3.2, 0, 3.4, -1, 1); g.stroke();
  g.fillStyle = '#fff'; dot(g, 5.6, -1.4, 2.1); g.fillStyle = '#0d2233'; dot(g, 6, -1.4, 1.1); g.fillStyle = '#fff'; dot(g, 5.6, -1.9, 0.45);
  g.fillStyle = 'rgba(255,255,255,.75)'; rr(g, -4, -4.3, 7, 1.1, 0.5);
  g.restore();
}
const drawFood = (g, kind, x, y, s, glow) => kind === 'bone' ? drawBone(g, x, y, s, glow) : drawFish(g, x, y, s, glow);
