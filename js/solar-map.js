/* Paws Run — solar-map.js
   The solar-system picker in the menu: positions, planet pictures, hover and click. */
'use strict';

/* solar-system picker */
const SOLAR = [['mercury', 92, -0.55, 8], ['venus', 140, 0.5, 11], ['earth', 198, -0.32, 13], ['mars', 262, 0.42, 10], ['jupiter', 352, -0.2, 26], ['saturn', 470, 0.22, 20], ['uranus', 584, -0.26, 15], ['neptune', 690, 0.03, 15]];
let solarHover = null;
function pickWorld(k) { worldName = k; setEnv(state === 'pause' ? levelIdx : 0); save(); buildMenu(); }
function solarBodies() {
  const out = [{ k:'sun', x:24, y:118, r:46 }];
  SOLAR.forEach(([k, r, a, size], i) => {
    const aa = a + Math.sin(tick * 0.004 + i) * 0.03, x = 24 + r * Math.cos(aa), y = 118 + r * 0.62 * Math.sin(aa);
    out.push({ k, x, y, r: size });
    if (k === 'earth') out.push({ k:'moon', x: x + 27, y: y - 22 + Math.sin(tick * 0.02) * 2, r: 6.5 });
  });
  return out;
}
function drawPlanet(g, k, x, y, r) {
  if (k === 'sun') return;
  if (k === 'saturn') { g.strokeStyle = 'rgba(225,205,150,.9)'; g.lineWidth = r * 0.28; g.beginPath(); g.ellipse(x, y, r * 2, r * 0.55, -0.3, Math.PI, Math.PI * 2); g.stroke(); }
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
  const base = { mercury:['#cfc6bb', '#7d7268'], venus:['#ffe6a0', '#d98a2a'], earth:['#7fd0ff', '#1f6fd0'], moon:['#f1f2f6', '#9a9eab'], mars:['#f0a070', '#b5461f'], jupiter:['#f3dfbd', '#c9854e'], saturn:['#f3e3b0', '#c9aa68'], uranus:['#dffdfa', '#6fcfd0'], neptune:['#7fa6ff', '#2238b0'] }[k];
  g.fillStyle = lin(g, 0, y - r, 0, y + r, [[0, base[0]], [1, base[1]]]); g.fillRect(x - r, y - r, r * 2, r * 2);
  if (k === 'jupiter' || k === 'saturn') { const cols = k === 'jupiter' ? ['#b9713e', '#e6c79a', '#a8643a', '#ecd3aa', '#c9854e'] : ['#d9bf80', '#efdca6', '#c9aa68', '#f3e3b0', '#bfa46a']; cols.forEach((col, i) => { g.fillStyle = col; g.fillRect(x - r, y - r + r * 0.2 + i * r * 0.36, r * 2, r * 0.17); }); if (k === 'jupiter') { g.fillStyle = '#c94f2c'; ell(g, x + r * 0.3, y + r * 0.28, r * 0.3, r * 0.17); } }
  if (k === 'earth') { g.fillStyle = '#4fbf5a'; ell(g, x - r * 0.3, y - r * 0.2, r * 0.42, r * 0.34, 0.5); ell(g, x + r * 0.4, y + r * 0.35, r * 0.36, r * 0.44, 0.3); g.fillStyle = 'rgba(255,255,255,.85)'; rr(g, x - r * 0.9, y - r * 0.62, r * 1.1, r * 0.16, r * 0.08); rr(g, x - r * 0.2, y + r * 0.02, r * 1.1, r * 0.15, r * 0.08); }
  if (k === 'moon' || k === 'mercury') { g.fillStyle = 'rgba(0,0,0,.2)'; dot(g, x + r * 0.3, y + r * 0.25, r * 0.26); dot(g, x - r * 0.35, y - r * 0.05, r * 0.2); dot(g, x + r * 0.05, y - r * 0.5, r * 0.15); }
  if (k === 'mars') { g.fillStyle = '#fff'; ell(g, x, y - r * 0.95, r * 0.5, r * 0.22); g.fillStyle = 'rgba(110,40,20,.35)'; ell(g, x - r * 0.2, y + r * 0.2, r * 0.5, r * 0.24, 0.3); }
  if (k === 'venus') { g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = r * 0.14; g.beginPath(); g.arc(x - r, y - r * 1.4, r * 1.6, 0.5, 1.6); g.stroke(); g.beginPath(); g.arc(x - r * 0.4, y - r * 0.9, r * 1.6, 0.6, 1.7); g.stroke(); }
  if (k === 'neptune') { g.fillStyle = 'rgba(10,20,90,.6)'; ell(g, x - r * 0.2, y + r * 0.15, r * 0.36, r * 0.2); g.fillStyle = 'rgba(255,255,255,.6)'; rr(g, x - r * 0.1, y - r * 0.4, r * 0.8, r * 0.1, r * 0.05); }
  g.fillStyle = rad(g, x - r * 0.4, y - r * 0.4, r * 0.2, x + r * 0.3, y + r * 0.3, r * 1.25, [[0, 'rgba(255,255,255,.25)'], [0.5, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,20,.6)']]); g.fillRect(x - r, y - r, r * 2, r * 2);
  g.restore();
  if (k === 'saturn') { g.strokeStyle = 'rgba(240,222,170,.95)'; g.lineWidth = r * 0.28; g.beginPath(); g.ellipse(x, y, r * 2, r * 0.55, -0.3, 0, Math.PI); g.stroke(); }
  if (k === 'uranus') { g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y, r * 0.45, r * 1.7, 0.25, 0, 7); g.stroke(); }
}
function drawSolar() {
  const g = $('solar').getContext('2d'), W = 760, H = 236;
  g.fillStyle = lin(g, 0, 0, W, H, [[0, '#0a0c26'], [1, '#04050f']]); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { g.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(tick * 0.02 + i)); g.fillStyle = '#fff'; dot(g, hash(i) * W, hash(i * 2.3) * H, i % 8 ? 0.8 : 1.5); }
  g.globalAlpha = 1;
  { const p = (tick % 240) / 40; if (p < 1) { const mx = 700 - p * 260, my = 10 + p * 110; g.strokeStyle = lin(g, mx, my, mx + 60, my - 26, [[0, 'rgba(255,255,255,.9)'], [1, 'rgba(255,255,255,0)']]); g.lineWidth = 1.6; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + 60, my - 26); g.stroke(); } }
  g.strokeStyle = 'rgba(160,175,255,.2)'; g.lineWidth = 1;
  for (const [, r] of SOLAR) { g.beginPath(); g.ellipse(24, 118, r, r * 0.62, 0, 0, 7); g.stroke(); }
  g.fillStyle = rad(g, 24, 118, 10, 24, 118, 110, [[0, 'rgba(255,220,120,.8)'], [1, 'rgba(255,180,60,0)']]); dot(g, 24, 118, 110);
  g.fillStyle = rad(g, 14, 108, 4, 24, 118, 46, [[0, '#fffbe0'], [0.7, '#ffcc4d'], [1, '#ff9a2e']]); dot(g, 24, 118, 46);
  g.textAlign = 'center';
  for (const b of solarBodies()) {
    const sel = b.k === worldName, hov = b.k === solarHover;
    if (sel || hov) {
      g.fillStyle = rad(g, b.x, b.y, b.r, b.x, b.y, b.r + 16, [[0, sel ? 'rgba(255,197,61,.55)' : 'rgba(255,255,255,.35)'], [1, 'rgba(255,197,61,0)']]); dot(g, b.x, b.y, b.r + 16);
      g.strokeStyle = sel ? '#ffc53d' : 'rgba(255,255,255,.8)'; g.lineWidth = 2; g.setLineDash([5, 4]); g.lineDashOffset = -tick * 0.3; g.beginPath(); g.arc(b.x, b.y, b.r + (b.k === 'saturn' ? 22 : 7), 0, 7); g.stroke(); g.setLineDash([]);
    }
    drawPlanet(g, b.k, b.x, b.y, b.r * (hov ? 1.12 : 1));
    g.font = (sel ? 'bold 13px ' : '12px ') + 'ui-rounded, "Trebuchet MS", sans-serif'; g.fillStyle = sel ? '#ffc53d' : 'rgba(230,235,255,.85)';
    if (b.k === 'moon') g.fillText(WORLDS.moon.label, b.x + 8, b.y - 13); else g.fillText(WORLDS[b.k].label, b.x, b.y + b.r + (b.k === 'saturn' ? 24 : 18));
    { const px = b.k === 'moon' ? b.x + 8 : b.x, py = b.k === 'moon' ? b.y - 27 : b.y + b.r + (b.k === 'saturn' ? 34 : 28);
      if (hasBadge(b.k)) { g.fillStyle = '#ffd45e'; star5(g, px, py, 6); } else for (let i = 0; i < 3; i++) { g.fillStyle = done(b.k, i) ? '#ffd45e' : 'rgba(255,255,255,.25)'; dot(g, px - 7 + i * 7, py, 2.2); } }
  }
  g.fillStyle = 'rgba(230,235,255,.6)'; g.font = '11px ui-rounded, "Trebuchet MS", sans-serif'; g.textAlign = 'right'; g.fillText('Click the Sun, a planet or the Moon to run there', W - 12, H - 10);
}
function solarPick(ev) {
  const r = $('solar').getBoundingClientRect(), x = (ev.clientX - r.left) * 760 / r.width, y = (ev.clientY - r.top) * 236 / r.height;
  let best = null, bd = 1e9;
  for (const b of solarBodies()) { const d = Math.hypot(b.x - x, b.y - y) - b.r; if (d < 14 && d < bd) { bd = d; best = b.k; } }
  return best;
}
$('solar').addEventListener('pointermove', ev => { solarHover = solarPick(ev); });
$('solar').addEventListener('pointerleave', () => { solarHover = null; });
$('solar').addEventListener('click', ev => { const k = solarPick(ev); if (k) pickWorld(k); });
