/* Paws Run — scenes-first.js
   Background helpers (sky, stars, hills, craters...) and BG: the painter for the first scene of each world, plus Earth's three. */
'use strict';

/* ---------- Earth tour and solar-system backgrounds ---------- */
function skyFill(stops) { c.fillStyle = lin(c, 0, 0, 0, VH, stops); c.fillRect(0, 0, VW, VH); }
function stars(n, a) {
  for (let i = 0; i < n; i++) {
    const x = ((i * 137.5 - camX * 0.03) % VW + VW) % VW, y = (i * 71.3) % 400;
    c.globalAlpha = (a || 1) * (0.3 + 0.7 * Math.abs(Math.sin(tick * 0.02 + i))); c.fillStyle = i % 7 ? '#fff' : (i % 2 ? '#ffe9a8' : '#a8d8ff'); dot(c, x, y, i % 11 ? 0.9 : 1.7);
  }
  c.globalAlpha = 1;
}
function orb(x, y, r, core, edge, glow, ga, gr) {
  if (glow) { c.fillStyle = rad(c, x, y, r * 0.6, x, y, gr, [[0, `rgba(${glow},${ga})`], [1, `rgba(${glow},0)`]]); dot(c, x, y, gr); }
  c.fillStyle = rad(c, x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r, [[0, core], [1, edge]]); dot(c, x, y, r);
}
function hillLayer(top, bot, par, base, amp, f) {
  c.fillStyle = lin(c, 0, base - amp * 1.4, 0, VH, [[0, top], [1, bot]]); c.beginPath(); c.moveTo(0, VH);
  for (let x = 0; x <= VW; x += 12) { const wx = x + camX * par; c.lineTo(x, base + Math.sin(wx * f) * amp + Math.sin(wx * f * 2.7 + 1) * amp * 0.35); }
  c.lineTo(VW, VH); c.fill();
}
function ridge(top, bot, par, base, amp, w, seed) {
  const off = camX * par, i0 = Math.floor(off / w) - 1;
  c.fillStyle = lin(c, 0, base - amp, 0, VH, [[0, top], [1, bot]]); c.beginPath(); c.moveTo(-40, VH);
  for (let i = i0; i < i0 + VW / w + 3; i++) c.lineTo(i * w - off, base - hash(i + seed) * amp);
  c.lineTo(VW + 40, VH); c.fill();
}
function puffs(par, y0, spread, n, k, top, bot, speed) {
  const P = VW + 400;
  for (let i = 0; i < n; i++) {
    const x = ((i * (P / n) + hash(i + n) * 80 - camX * par + tick * (speed || 0)) % P + P) % P - 200, y = y0 + hash(i + 5) * spread, s = k * (0.7 + hash(i + 9) * 0.6);
    c.fillStyle = lin(c, 0, y - 38 * s, 0, y + 24 * s, [[0, top], [1, bot]]);
    c.beginPath(); c.arc(x, y, 22 * s, 0, 7); c.arc(x + 26 * s, y - 10 * s, 28 * s, 0, 7); c.arc(x + 56 * s, y, 22 * s, 0, 7); c.arc(x + 28 * s, y + 6 * s, 24 * s, 0, 7); c.fill();
  }
}
function craters(par, y0, spread, n, rim, dark) {
  const P = VW + 300;
  for (let i = 0; i < n; i++) {
    const x = ((i * (P / n) + hash(i + n) * 60 - camX * par) % P + P) % P - 150, y = y0 + hash(i + 3) * spread, r = 10 + hash(i + 7) * 26;
    c.fillStyle = rim; ell(c, x, y, r, r * 0.3); c.fillStyle = dark; ell(c, x + 1, y + 1.5, r * 0.82, r * 0.22);
  }
}
function lightning(period, len, col, veil) {
  if (tick % period >= len) return;
  const seed = Math.floor(tick / period);
  c.fillStyle = veil; c.fillRect(0, 0, VW, VH);
  let x = 100 + hash(seed) * (VW - 200), y = 0; c.strokeStyle = col; c.lineWidth = 2.5; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x, y);
  for (let k = 0; k < 8; k++) { x += (hash(seed + k * 3) - 0.5) * 70; y += 28 + hash(seed + k) * 24; c.lineTo(x, y); }
  c.stroke();
}
function tree(x, y, k) {
  c.save(); c.translate(x, y); c.scale(k, k);
  shadow(c, 6, 10, 46, 0.18);
  c.fillStyle = lin(c, -7, 0, 7, 0, [[0, '#5c3b20'], [0.45, '#96683e'], [1, '#553518']]); c.beginPath(); c.moveTo(-9, 10); c.quadraticCurveTo(-5, -30, -6, -72); c.lineTo(6, -72); c.quadraticCurveTo(5, -30, 10, 10); c.fill();
  for (const [dx, dy, r] of [[-30, -74, 28], [30, -74, 28], [0, -98, 40], [-16, -112, 24], [20, -108, 26]]) { c.fillStyle = rad(c, dx - r * 0.35, dy - r * 0.4, r * 0.1, dx, dy, r, [[0, '#9be886'], [0.55, '#4fb558'], [1, '#2a7a3c']]); dot(c, dx, dy, r); }
  c.restore();
}
function palm(x, y, k) {
  c.save(); c.translate(x, y); c.scale(k, k); c.lineCap = 'round';
  c.strokeStyle = '#5e3d1e'; c.lineWidth = 12; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(6, -60, 26, -110); c.stroke();
  c.strokeStyle = '#a57645'; c.lineWidth = 7; c.beginPath(); c.moveTo(-1, 0); c.quadraticCurveTo(4, -60, 25, -110); c.stroke();
  for (const [dx, dy] of [[-48, 10], [-36, -26], [0, -40], [38, -24], [50, 12]]) {
    c.strokeStyle = '#2a7a3c'; c.lineWidth = 10; c.beginPath(); c.moveTo(26, -110); c.quadraticCurveTo(26 + dx * 0.6, -110 + dy - 16, 26 + dx, -110 + dy); c.stroke();
    c.strokeStyle = '#63c463'; c.lineWidth = 4; c.beginPath(); c.moveTo(26, -112); c.quadraticCurveTo(26 + dx * 0.6, -112 + dy - 16, 26 + dx * 0.95, -112 + dy); c.stroke();
  }
  c.restore(); c.lineCap = 'butt';
}
function birds(n, y0, par, col) {
  c.strokeStyle = col; c.lineWidth = 1.6; c.lineCap = 'round'; c.beginPath();
  for (let i = 0; i < n; i++) {
    const x = ((i * 190 + tick * (0.5 + (i % 3) * 0.2) - camX * par) % (VW + 100) + VW + 100) % (VW + 100) - 50, y = y0 + (i * 47) % 90 + Math.sin(tick * 0.03 + i) * 6, f = Math.sin(tick * 0.2 + i) * 3;
    c.moveTo(x - 7, y - 2 + f); c.quadraticCurveTo(x - 3, y - 4, x, y); c.quadraticCurveTo(x + 3, y - 4, x + 7, y - 2 + f);
  }
  c.stroke(); c.lineCap = 'butt';
}
const haze = (y0, y1, col) => { c.fillStyle = lin(c, 0, y0, 0, y1, [[0, `rgba(${col},0)`], [1, `rgba(${col},.32)`]]); c.fillRect(0, y0, VW, y1 - y0); };

const BG = {
  grass() {
    skyFill([[0, '#3f9be8'], [0.6, '#9fd6fb'], [1, '#e6f7ff']]);
    orb(770 - camX * 0.02, 90, 36, '#ffffff', '#fff3b0', '255,246,190', 0.8, 200);
    puffs(0.1, 50, 120, 6, 1, '#ffffff', '#c4d9ee', 0.1);
    for (let i = -1; i < 5; i++) { const w = 380, x = i * 300 - (camX * 0.06) % 300, px = x + w / 2, py = 190 + hash(i + Math.floor(camX * 0.06 / 300)) * 0;
      c.fillStyle = '#8fb0d2'; tri(c, x, 470, px, py, x + w, 470); c.fillStyle = '#7697bd'; tri(c, px, py, x + w, 470, px + w * 0.12, 470);
      c.fillStyle = '#fff'; c.beginPath(); c.moveTo(px - 38, py + 56); c.lineTo(px, py); c.lineTo(px + 38, py + 56); c.lineTo(px + 17, py + 45); c.lineTo(px, py + 64); c.lineTo(px - 19, py + 42); c.fill(); }
    hillLayer('#c4ecb4', '#93d58c', 0.1, 345, 34, 0.004); hillLayer('#93da82', '#5cb85a', 0.2, 374, 42, 0.006);
    haze(300, 440, '255,255,255');
    hillLayer('#74d662', '#3f9a45', 0.4, 412, 28, 0.009);
    for (let i = -1; i < 4; i++) tree(i * 520 - (camX * 0.4) % 520 + 200, 426, 0.85);
    const cols = ['#ff8fb3', '#fff2a8', '#ffffff', '#c9a2ff'];
    for (let i = 0; i < 46; i++) { const x = ((i * 53 - camX * 0.4) % VW + VW) % VW, y = 436 + hash(i) * 56; c.fillStyle = cols[i % 4]; dot(c, x, y, 2.2); c.fillStyle = '#ffb300'; dot(c, x, y, 0.8); }
  },
  ocean() {
    skyFill([[0, '#2f8fe0'], [0.55, '#9fdcff'], [0.62, '#e8fbff'], [1, '#e8fbff']]);
    orb(760 - camX * 0.02, 90, 36, '#ffffff', '#fff1b8', '255,246,190', 0.8, 200);
    puffs(0.1, 40, 110, 6, 1, '#ffffff', '#bcd6ee', 0.12);
    c.fillStyle = lin(c, 0, 310, 0, 470, [[0, '#0f5fa8'], [0.5, '#1f9fd0'], [1, '#7fe3ea']]); c.fillRect(0, 310, VW, 170);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(0, 310, VW, 2);
    for (let i = -1; i < 3; i++) { const x = i * 700 - (camX * 0.08) % 700 + 320; c.fillStyle = '#3f9a55'; ell(c, x, 313, 70, 16); c.fillStyle = '#e8d08a'; ell(c, x, 318, 78, 6); palm(x - 20, 312, 0.32); palm(x + 26, 312, 0.26); }
    { const x = ((tick * 0.15 - camX * 0.12) % (VW + 200) + VW + 200) % (VW + 200) - 100, y = 342 + Math.sin(tick * 0.04) * 2; c.fillStyle = '#7a4a2a'; c.beginPath(); c.moveTo(x - 22, y); c.lineTo(x + 24, y); c.lineTo(x + 16, y + 9); c.lineTo(x - 16, y + 9); c.fill(); c.fillStyle = '#fff'; tri(c, x, y - 2, x, y - 44, x + 22, y - 2); c.fillStyle = '#ffd7d7'; tri(c, x - 3, y - 2, x - 3, y - 34, x - 19, y - 2); }
    for (let i = 0; i < 30; i++) { const x = ((i * 83 - camX * 0.1) % VW + VW) % VW, y = 318 + hash(i) * 100; c.globalAlpha = 0.25 + 0.6 * Math.abs(Math.sin(tick * 0.05 + i * 2)); c.fillStyle = '#fff'; rr(c, x, y, 10 + hash(i + 3) * 22, 2, 1); }
    c.globalAlpha = 1;
    birds(5, 120, 0.1, '#ffffff');
    hillLayer('#fbe9b0', '#e0b96a', 0.4, 430, 14, 0.009);
    for (let i = -1; i < 5; i++) { const x = i * 330 - (camX * 0.4) % 330 + 110; shadow(c, x + 30, 444, 40, 0.15); palm(x, 440, 1); }
  },
  sky() {
    skyFill([[0, '#1f6fe0'], [0.5, '#6fb8ff'], [1, '#d8f0ff']]);
    orb(770 - camX * 0.02, 100, 46, '#ffffff', '#fff3b0', '255,250,210', 0.85, 260);
    c.lineWidth = 8; ['#ff6b6b', '#ffb347', '#fff275', '#7be07b', '#6bb8ff', '#b28bff'].forEach((col, i) => { c.strokeStyle = col; c.globalAlpha = 0.38; c.beginPath(); c.arc(300 - camX * 0.03, 560, 400 - i * 8, Math.PI, 0); c.stroke(); }); c.globalAlpha = 1;
    hillLayer('#ffffff', '#cfe4f7', 0.08, 380, 22, 0.006);
    puffs(0.15, 60, 200, 7, 1.3, '#ffffff', '#c4dcf2', 0.15);
    { const x = ((tick * 0.2 - camX * 0.18) % (VW + 300) + VW + 300) % (VW + 300) - 150, y = 170 + Math.sin(tick * 0.02) * 10;
      c.strokeStyle = '#5a4030'; c.lineWidth = 1; c.beginPath(); c.moveTo(x - 14, y + 26); c.lineTo(x - 5, y + 50); c.moveTo(x + 14, y + 26); c.lineTo(x + 5, y + 50); c.stroke();
      c.save(); c.beginPath(); c.ellipse(x, y, 30, 34, 0, 0, 7); c.clip(); ['#ff6b6b', '#fff275', '#6bb8ff', '#ff6b6b', '#fff275'].forEach((col, i) => { c.fillStyle = col; c.fillRect(x - 30 + i * 12, y - 34, 12, 68); });
      c.fillStyle = rad(c, x - 10, y - 12, 2, x, y, 36, [[0, 'rgba(255,255,255,.45)'], [1, 'rgba(0,0,40,.25)']]); c.fillRect(x - 30, y - 34, 60, 68); c.restore();
      c.fillStyle = '#8a5e36'; rr(c, x - 7, y + 50, 14, 10, 2); }
    birds(7, 90, 0.2, '#ffffff');
    hillLayer('#f6fbff', '#bcd6ee', 0.25, 420, 26, 0.008);
    puffs(0.32, 300, 110, 5, 1.6, '#ffffff', '#b8d2ea', 0.2);
    hillLayer('#ffffff', '#d4e6f6', 0.4, 446, 18, 0.011);
  },
  moon() {
    skyFill([[0, '#000005'], [1, '#12121e']]); stars(150);
    { const x = 720 - camX * 0.015, y = 115, r = 50;
      c.fillStyle = rad(c, x, y, r * 0.8, x, y, r * 1.5, [[0, 'rgba(120,190,255,.45)'], [1, 'rgba(120,190,255,0)']]); dot(c, x, y, r * 1.5);
      c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip();
      c.fillStyle = rad(c, x - 15, y - 15, 5, x, y, r, [[0, '#8fd8ff'], [1, '#1b5fc0']]); c.fillRect(x - r, y - r, r * 2, r * 2);
      c.fillStyle = '#4fb86a'; ell(c, x - 18, y - 8, 16, 22, 0.4); ell(c, x + 14, y + 16, 18, 11, -0.3); ell(c, x + 20, y - 24, 10, 7, 0.2);
      c.fillStyle = 'rgba(255,255,255,.8)'; ell(c, x - 6, y - 30, 24, 5, 0.2); ell(c, x + 6, y + 2, 28, 4, -0.2); ell(c, x - 14, y + 28, 20, 5, 0.1);
      c.fillStyle = rad(c, x - 22, y - 12, r * 0.9, x - 22, y - 12, r * 1.9, [[0, 'rgba(0,0,10,0)'], [1, 'rgba(0,0,10,.9)']]); c.fillRect(x - r, y - r, r * 2, r * 2); c.restore(); }
    ridge('#8a8a94', '#55555e', 0.1, 405, 70, 70, 3);
    craters(0.2, 425, 22, 7, '#a2a2ac', '#4a4a54');
    hillLayer('#80808a', '#44444c', 0.4, 438, 12, 0.01);
    craters(0.4, 462, 44, 6, '#9a9aa4', '#3c3c44');
  },
  mercury() {
    skyFill([[0, '#050203'], [0.7, '#1a0d08'], [1, '#5a2a10']]); stars(70, 0.6);
    orb(830 - camX * 0.01, 50, 125, '#ffffff', '#ffd070', '255,170,60', 0.7, 430);
    for (let i = 0; i < 10; i++) { const a = i * 0.63 + tick * 0.002; c.strokeStyle = 'rgba(255,210,120,.12)'; c.lineWidth = 10; c.beginPath(); c.moveTo(830 - camX * 0.01 + Math.cos(a) * 130, 50 + Math.sin(a) * 130); c.lineTo(830 - camX * 0.01 + Math.cos(a) * 330, 50 + Math.sin(a) * 330); c.stroke(); }
    ridge('#7a6454', '#3a2c24', 0.1, 400, 80, 60, 11);
    haze(320, 470, '255,120,30');
    craters(0.22, 428, 20, 7, '#927866', '#3e2e26');
    hillLayer('#64503f', '#2c201a', 0.4, 438, 12, 0.011);
    craters(0.4, 462, 44, 6, '#8a7260', '#30241c');
  },
  venus() {
    skyFill([[0, '#5a2a0a'], [0.5, '#c9781e'], [1, '#f2c14e']]);
    orb(640 - camX * 0.02, 110, 30, '#fff4c9', '#f2c060', '255,240,180', 0.5, 220);
    puffs(0.08, 10, 90, 8, 2.2, '#e8a84a', '#a8601e', 0.25);
    puffs(0.14, 110, 80, 6, 1.8, '#f2c060', '#b8702a', 0.4);
    lightning(260, 8, '#fff6c9', 'rgba(255,240,200,.18)');
    for (let i = -1; i < 4; i++) { const id = i + Math.floor(camX * 0.2 / 460), x = i * 460 - (camX * 0.2) % 460 + 140, h = 150 + hash(id) * 70, w = 170 + hash(id + 5) * 60;
      c.fillStyle = lin(c, x - w, 0, x + w, 0, [[0, '#7a3a18'], [0.5, '#5a2410'], [1, '#34120a']]); c.beginPath(); c.moveTo(x - w, 470); c.lineTo(x - 26, 470 - h); c.lineTo(x + 26, 470 - h); c.lineTo(x + w, 470); c.fill();
      c.fillStyle = rad(c, x, 470 - h, 4, x, 470 - h, 70 + Math.sin(tick * 0.05 + i) * 10, [[0, 'rgba(255,150,40,.85)'], [1, 'rgba(255,150,40,0)']]); dot(c, x, 470 - h, 80);
      c.strokeStyle = '#ff9a2e'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 6, 470 - h + 2); c.quadraticCurveTo(x - 30, 470 - h * 0.6, x - 44, 470 - h * 0.3); c.stroke();
      c.strokeStyle = '#ffe08a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 6, 470 - h + 2); c.quadraticCurveTo(x - 30, 470 - h * 0.6, x - 44, 470 - h * 0.3); c.stroke(); c.lineCap = 'butt'; }
    haze(300, 470, '255,190,90');
    hillLayer('#b85e22', '#5a220c', 0.4, 425, 22, 0.01);
  },
  mars() {
    skyFill([[0, '#b9794e'], [0.6, '#e8b98c'], [1, '#f6dcc0']]);
    orb(700 - camX * 0.02, 120, 14, '#ffffff', '#eaf4ff', '170,200,255', 0.55, 95);
    c.fillStyle = '#d9c8b8'; dot(c, 200 - camX * 0.01, 80, 3.2); dot(c, 330 - camX * 0.01, 58, 2);
    hillLayer('#cf9166', '#b06a44', 0.05, 352, 52, 0.0022);
    for (let i = -1; i < 5; i++) { const id = i + Math.floor(camX * 0.2 / 380), x = i * 380 - (camX * 0.2) % 380 + 60, w = 120 + hash(id) * 80, h = 60 + hash(id + 3) * 55;
      c.fillStyle = lin(c, x, 0, x + w, 0, [[0, '#c9643a'], [0.6, '#a8482a'], [1, '#742a16']]); c.beginPath(); c.moveTo(x - 24, 470); c.lineTo(x + 6, 470 - h); c.lineTo(x + w - 6, 470 - h); c.lineTo(x + w + 24, 470); c.fill();
      c.strokeStyle = 'rgba(60,15,5,.3)'; c.lineWidth = 2; c.beginPath(); for (let k = 1; k < 4; k++) { c.moveTo(x - 2, 470 - h + k * 14); c.lineTo(x + w + 2, 470 - h + k * 14); } c.stroke(); }
    haze(310, 460, '246,210,170');
    hillLayer('#d0603a', '#8a2e16', 0.4, 425, 20, 0.01);
    { const x = ((tick * 0.6 - camX * 0.3) % (VW + 300) + VW + 300) % (VW + 300) - 150; c.fillStyle = 'rgba(240,200,160,.14)'; for (let k = 0; k < 12; k++) ell(c, x + Math.sin(tick * 0.2 + k) * k, 432 - k * 13, 5 + k * 1.9, 6); }
  },
  jupiter() {
    const cols = ['#c9a27a', '#e8d2b0', '#b5744a', '#f2e3c8', '#d19a6a', '#a85e3a', '#ead0a8', '#c98f60', '#f0dcb8'];
    c.fillStyle = cols[0]; c.fillRect(0, 0, VW, VH);
    for (let b = 1; b < 9; b++) { const y0 = b * 56 - 20, d = b % 2 ? 1 : -1; c.fillStyle = cols[b]; c.beginPath(); c.moveTo(0, VH);
      for (let x = 0; x <= VW; x += 14) c.lineTo(x, y0 + Math.sin((x + camX * 0.05 * d + tick * 0.3 * d) * 0.012 + b) * 8 + Math.sin((x + tick * 0.5 * d) * 0.031 + b * 2) * 3);
      c.lineTo(VW, VH); c.fill(); }
    { const x = ((640 - camX * 0.06 + tick * 0.05) % (VW + 400) + VW + 400) % (VW + 400) - 200, y = 262;
      [['#b8492c', 96, 40], ['#cf6038', 76, 30], ['#e2845a', 52, 19], ['#f0a67c', 26, 9]].forEach(([col, rx, ry], i) => { c.fillStyle = col; ell(c, x, y, rx, ry, Math.sin(tick * 0.01 + i) * 0.05); }); }
    orb(150 - camX * 0.01, 70, 9, '#fff6b0', '#d9b84a'); orb(262 - camX * 0.01, 112, 6, '#ffffff', '#b9c4d6'); orb(420 - camX * 0.01, 54, 4, '#e8d8c8', '#9a8a7a');
    lightning(340, 6, '#cfe4ff', 'rgba(200,220,255,.12)');
    haze(310, 470, '255,236,205');
    hillLayer('#fff2d8', '#e0b98a', 0.4, 425, 20, 0.008);
  },
  saturn() {
    skyFill([[0, '#2a2140'], [0.5, '#a88a6a'], [1, '#f2deb0']]); stars(60, 0.5);
    c.save(); c.translate(VW * 0.55 - camX * 0.02, 600); c.rotate(-0.18);
    const rings = [['#f6e7c0', 16, 0.75], ['#d9be88', 9, 0.6], ['#b89a68', 5, 0.5], ['#f2deb0', 20, 0.7], ['#7a6648', 4, 0.5], ['#e8d2a0', 12, 0.6], ['#c9ae7a', 6, 0.45], ['#fff4d6', 4, 0.5]];
    let rx = 520; for (const [col, w, a] of rings) { c.strokeStyle = col; c.globalAlpha = a; c.lineWidth = w; c.beginPath(); c.ellipse(0, 0, rx, rx * 0.62, 0, 0, 7); c.stroke(); rx += w + 12; }
    c.restore(); c.globalAlpha = 1;
    orb(160 - camX * 0.02, 90, 9, '#ffffff', '#fff3c9', '255,246,210', 0.5, 60);
    orb(360 - camX * 0.012, 150, 11, '#f6c070', '#b8702a');
    hillLayer('#f2e2b8', '#d9be88', 0.12, 388, 26, 0.005);
    haze(320, 470, '255,244,214');
    hillLayer('#fbf0d0', '#e0c890', 0.4, 425, 20, 0.008);
  },
  uranus() {
    skyFill([[0, '#0a4a5e'], [0.5, '#3fb0b8'], [1, '#c9f7f0']]); stars(50, 0.45);
    c.save(); c.translate(250 - camX * 0.02, 150); c.rotate(1.25); c.strokeStyle = '#ffffff';
    [[150, 0.5, 3], [164, 0.3, 1.5], [136, 0.3, 1.5], [178, 0.2, 5]].forEach(([r, a, w]) => { c.globalAlpha = a; c.lineWidth = w; c.beginPath(); c.ellipse(0, 0, r, r * 0.24, 0, 0, 7); c.stroke(); });
    c.restore(); c.globalAlpha = 1;
    orb(700 - camX * 0.02, 80, 7, '#ffffff', '#eafcff', '220,255,250', 0.5, 50);
    orb(560 - camX * 0.012, 140, 6, '#e8f4f4', '#9ab8b8'); orb(820 - camX * 0.012, 170, 4, '#d8e8e8', '#8aa8a8');
    ridge('#d9fffa', '#6fc8cf', 0.12, 420, 150, 46, 21);
    ridge('#bff3ef', '#4fb0bd', 0.2, 430, 100, 38, 57);
    haze(300, 460, '220,255,250');
    hillLayer('#e6fffb', '#8fd8d8', 0.4, 428, 16, 0.01);
  },
  neptune() {
    skyFill([[0, '#030a2e'], [0.5, '#1740b0'], [1, '#4f8ff0']]); stars(80, 0.7);
    { const x = 640 - camX * 0.05, y = 200; c.fillStyle = 'rgba(5,10,60,.5)'; ell(c, x, y, 130, 55, -0.1); c.fillStyle = 'rgba(3,6,40,.5)'; ell(c, x + 8, y + 4, 90, 34, -0.1);
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.arc(x - 20, y + 20, 130, 4.1, 4.9); c.stroke(); c.beginPath(); c.arc(x + 40, y + 150, 120, 4.5, 5.1); c.stroke(); c.lineCap = 'butt'; }
    orb(170 - camX * 0.012, 90, 16, '#f6e2da', '#b89a9a');
    for (let i = 0; i < 10; i++) { const w = 120 + hash(i) * 150, x = ((i * 210 - tick * (1.2 + (i % 3) * 0.6) - camX * 0.1) % (VW + 400) + VW + 400) % (VW + 400) - 200; c.fillStyle = `rgba(255,255,255,${0.1 + hash(i + 4) * 0.16})`; rr(c, x, 40 + hash(i + 2) * 300, w, 3 + hash(i + 8) * 3, 3); }
    ridge('#4f7fe8', '#14258a', 0.15, 415, 90, 60, 31);
    haze(310, 460, '120,170,255');
    hillLayer('#76a2f8', '#22389a', 0.4, 428, 16, 0.01);
  }
};
