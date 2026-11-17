/* Paws Run — scenes-more.js
   The second and third scene of every world: their themes, background painters, labels and facts. */
'use strict';

/* ---------- two more scenes for every world, so each round teaches something new ---------- */
const wrap = (x0, par, P) => ((x0 - camX * par) % P + P) % P - (P - VW) / 2;
function scene(key, base, o) { const b = THEMES[base]; THEMES[key] = Object.assign({}, b, o, { audio: Object.assign({}, b.audio, o.audio || {}) }); }
Object.entries({ grass:'Grassland', ocean:'Ocean', sky:'Blue sky', moon:'Crater highlands', mercury:'Sunlit plains', venus:'Volcano plains', mars:'Dunes and mesas',
  jupiter:'Great Red Spot', saturn:'Under the rings', uranus:'Ice spires', neptune:'Great dark storm' }).forEach(([k, v]) => { THEMES[k].scene = v; if (!THEMES[k].label.includes('·')) THEMES[k].label += ' · ' + v; });
scene('moon2', 'moon', { label:'Moon · Sea of Tranquility', scene:'Sea of Tranquility', top:'#8d8f9a', dirt:'#5f616c', dirt2:'#52545e', brick:'#b9a96a', brickLine:'#7a6c3a' });
scene('moon3', 'moon', { label:'Moon · Far side', scene:'Far side', top:'#b4b0aa', dirt:'#77736e', dirt2:'#66625e', brick:'#8a8fa8', brickLine:'#565a70' });
scene('mercury2', 'mercury', { label:'Mercury · Caloris Basin', scene:'Caloris Basin', top:'#c9ae8a', dirt:'#8a7258', dirt2:'#77614a' });
scene('mercury3', 'mercury', { label:'Mercury · Polar night', scene:'Polar night', sky:['#000003','#1a1410'], top:'#8a90a0', dirt:'#4a4e5c', dirt2:'#3e4250', brick:'#7f8aa0', brickLine:'#4a5468', fx:null });
scene('venus2', 'venus', { label:'Venus · Above the clouds', scene:'Above the clouds', sky:['#d9a03a','#fff6dc'], top:'#fff6dc', dirt:'#f0d08a', dirt2:'#e3bd70', brick:'#e09a4a', brickLine:'#a8621e', fg:'rgba(255,244,210,.85)', fx:['drift','#fff6dc',24], audio:{ step:'cloud', lp:5000 } });
scene('venus3', 'venus', { label:'Venus · Maxwell Montes', scene:'Maxwell Montes', sky:['#2a1206','#e0a23a'], top:'#c9c4b8', dirt:'#6a4a34', dirt2:'#5a3c2a', brick:'#8a5a3a', brickLine:'#4a2a18' });
scene('mars2', 'mars', { label:'Mars · Valles Marineris', scene:'Valles Marineris', top:'#c9603a', dirt:'#8f3a20', dirt2:'#7a2e18', brick:'#d9a070', brickLine:'#96623c' });
scene('mars3', 'mars', { label:'Mars · Olympus Mons', scene:'Olympus Mons at sunset', sky:['#2a2840','#c9a58a'], top:'#a8503a', dirt:'#6a2e22', dirt2:'#5a241a', brick:'#9a6a5a', brickLine:'#5e3a30' });
scene('jupiter2', 'jupiter', { label:'Jupiter · Polar auroras', scene:'Polar auroras', sky:['#0c0a2a','#b9c6d9'], top:'#eef3fa', dirt:'#9fb2c9', dirt2:'#8a9eb8', brick:'#6a78b0', brickLine:'#3e4a80', fg:'rgba(225,235,250,.8)', fx:['streak','#e6eeff',14] });
scene('jupiter3', 'jupiter', { label:'Jupiter · Night side', scene:'Night side and moons', sky:['#05040c','#3a2a30'], top:'#b9a58f', dirt:'#6f5a4a', dirt2:'#5e4a3c', brick:'#8a4a3a', brickLine:'#522820', fg:'rgba(60,45,45,.85)', fx:null });
scene('saturn2', 'saturn', { label:'Saturn · North pole hexagon', scene:'North pole hexagon', sky:['#1c2440','#e8dcc0'], top:'#f4f2e6', dirt:'#b9c0b0', dirt2:'#a6ae9e', brick:'#7f93b0', brickLine:'#4e6080' });
scene('saturn3', 'saturn', { label:'Saturn · Inside the rings', scene:'Inside the rings', sky:['#03040c','#141a2c'], top:'#f3fbff', dirt:'#a9c6dc', dirt2:'#93b4cc', brick:'#7fa6c9', brickLine:'#4a7298', fg:'rgba(200,225,245,.75)', fx:['drift','#ffffff',40], audio:{ step:'ice' } });
scene('uranus2', 'uranus', { label:'Uranus · Endless summer day', scene:'Endless summer day', sky:['#5fc8d6','#f2fffd'], top:'#ffffff', dirt:'#a8e6e4', dirt2:'#93d8d6', brick:'#6fc0cc', brickLine:'#3f8f9c' });
scene('uranus3', 'uranus', { label:'Uranus · Winter night', scene:'Winter night and moons', sky:['#01141c','#1a6a72'], top:'#bfeeee', dirt:'#3f8f9a', dirt2:'#347c86', brick:'#4f8fb0', brickLine:'#2a5a78', fg:'rgba(8,40,50,.85)' });
scene('neptune2', 'neptune', { label:'Neptune · Methane clouds', scene:'Methane clouds', sky:['#0a1f7a','#8fc4ff'], top:'#eaf4ff', dirt:'#5f8fe0', dirt2:'#4f7fd0', brick:'#5a6ad0', brickLine:'#343f98' });
scene('neptune3', 'neptune', { label:'Neptune · Rings and Triton', scene:'Rings and Triton', sky:['#01030f','#1a3aa0'], top:'#9fc0f0', dirt:'#24409a', dirt2:'#1c3484', brick:'#4a4aa8', brickLine:'#2a2a70', fg:'rgba(4,10,50,.88)' });
for (const k of ['moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']) WORLDS[k].levels = [k, k + '2', k + '3'];

function earthBall(x, y, r) {
  c.fillStyle = rad(c, x, y, r * 0.8, x, y, r * 1.5, [[0, 'rgba(120,190,255,.45)'], [1, 'rgba(120,190,255,0)']]); dot(c, x, y, r * 1.5);
  c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip();
  c.fillStyle = rad(c, x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r, [[0, '#8fd8ff'], [1, '#1b5fc0']]); c.fillRect(x - r, y - r, r * 2, r * 2);
  c.fillStyle = '#4fb86a'; ell(c, x - r * 0.36, y - r * 0.16, r * 0.32, r * 0.44, 0.4); ell(c, x + r * 0.28, y + r * 0.32, r * 0.36, r * 0.22, -0.3);
  c.fillStyle = 'rgba(255,255,255,.8)'; ell(c, x - r * 0.12, y - r * 0.6, r * 0.48, r * 0.1, 0.2); ell(c, x + r * 0.12, y + r * 0.04, r * 0.56, r * 0.08, -0.2);
  c.fillStyle = rad(c, x - r * 0.44, y - r * 0.24, r * 0.9, x - r * 0.44, y - r * 0.24, r * 1.9, [[0, 'rgba(0,0,10,0)'], [1, 'rgba(0,0,10,.9)']]); c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
}
function aurora(y0, h, cols) {
  cols.forEach((col, k) => {
    c.fillStyle = lin(c, 0, y0, 0, y0 + h + 40, [[0, `rgba(${col},0)`], [0.45, `rgba(${col},.34)`], [1, `rgba(${col},0)`]]);
    c.beginPath();
    for (let x = 0; x <= VW; x += 14) { const wx = x + camX * 0.03 + tick * (0.4 + k * 0.2); c.lineTo(x, y0 + k * 22 + Math.sin(wx * 0.01 + k * 2) * 24); }
    for (let x = VW; x >= 0; x -= 14) { const wx = x + camX * 0.03 + tick * (0.4 + k * 0.2); c.lineTo(x, y0 + h + k * 22 + Math.sin(wx * 0.013 + k) * 28); }
    c.fill();
  });
  c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 2; c.beginPath();
  for (let i = 0; i < 40; i++) { const x = ((i * 31 + tick * 0.3) % VW + VW) % VW; c.moveTo(x, y0 + hash(i) * 30); c.lineTo(x, y0 + h * (0.6 + hash(i + 3) * 0.5)); }
  c.stroke();
}
function peakAt(i, par, step, base, hmin, hvar, seed) {
  const id = i + Math.floor(camX * par / step), w = step * 1.3, x0 = i * step - (camX * par) % step, h = hmin + hash(id * 1.3 + seed) * hvar;
  return { x: x0 + w / 2, y: base - h, w, h, x0 };
}
function peaks(par, step, base, hmin, hvar, lit, dark, cap, seed) {
  for (let i = -2; i < VW / step + 1; i++) {
    const p = peakAt(i, par, step, base, hmin, hvar, seed), k = p.h * 0.22;
    c.fillStyle = lit; tri(c, p.x0, base, p.x, p.y, p.x0 + p.w, base);
    c.fillStyle = dark; tri(c, p.x, p.y, p.x0 + p.w, base, p.x + p.w * 0.12, base);
    if (cap) { c.fillStyle = cap; c.beginPath(); c.moveTo(p.x - p.w * 0.11, p.y + k); c.lineTo(p.x, p.y); c.lineTo(p.x + p.w * 0.11, p.y + k); c.lineTo(p.x + p.w * 0.05, p.y + k * 0.8); c.lineTo(p.x, p.y + k * 1.15); c.lineTo(p.x - p.w * 0.055, p.y + k * 0.75); c.fill(); }
  }
}
const JMOONS = [[160, 96, 7, '#f6e27a', '#c9a23a', 'Io'], [330, 66, 6, '#ffffff', '#c9d6e8', 'Europa'], [540, 112, 10, '#cfc2b0', '#7a6a5a', 'Ganymede'], [760, 76, 9, '#8a7f74', '#4a423c', 'Callisto']];
const UMOONS = [[120, 86, 4, 'Miranda'], [250, 132, 5.5, 'Ariel'], [400, 74, 5.5, 'Umbriel'], [540, 124, 7, 'Titania'], [660, 66, 6.5, 'Oberon']];
const POS = {
  lander: () => wrap(560, 0.3, 1500),
  balloon: () => [wrap(400 + tick * 0.25, 0.15, 1400), 200 + Math.sin(tick * 0.02) * 8],
  heli: () => [wrap(300 + tick * 0.4, 0.2, 1500), 236 + Math.sin(tick * 0.05) * 10],
  rover: () => wrap(700, 0.3, 1700),
  olympus: () => wrap(1000, 0.05, 2200),
  probe: () => [wrap(250 + tick * 0.15, 0.1, 1500), 150 + Math.sin(tick * 0.015) * 6],
  chunk: i => [wrap(i * 150 + hash(i + 40) * 100, 0.25, VW + 300), 150 + hash(i + 50) * 250 + Math.sin(tick * 0.01 + i) * 6]
};
Object.assign(BG, {
  moon2() {
    skyFill([[0, '#000005'], [1, '#10101a']]); stars(150);
    orb(800 - camX * 0.01, 70, 16, '#ffffff', '#fff6d0', '255,250,220', 0.6, 90);
    earthBall(170 - camX * 0.015, 110, 38);
    hillLayer('#6c6e7a', '#3c3d46', 0.1, 412, 7, 0.004);
    craters(0.2, 428, 16, 4, '#84868f', '#3a3b44');
    hillLayer('#5c5e6a', '#2e2f38', 0.4, 448, 5, 0.008);
    const x = POS.lander(), y = 446;
    shadow(c, x, y + 4, 44, 0.35);
    c.fillStyle = 'rgba(20,20,26,.5)'; for (let k = 0; k < 9; k++) ell(c, x + 60 + k * 16, y + 4 + (k % 2) * 4, 3, 1.4);
    c.strokeStyle = '#b9bcc8'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 12, y - 20); c.lineTo(x - 28, y + 2); c.moveTo(x + 12, y - 20); c.lineTo(x + 28, y + 2); c.moveTo(x - 32, y + 2); c.lineTo(x - 24, y + 2); c.moveTo(x + 24, y + 2); c.lineTo(x + 32, y + 2); c.stroke();
    c.fillStyle = lin(c, x - 18, 0, x + 18, 0, [[0, '#f6e2a0'], [0.5, '#d9b85a'], [1, '#8f7430']]); rr(c, x - 18, y - 36, 36, 20, 3);
    c.fillStyle = '#3a3b44'; rr(c, x - 6, y - 44, 12, 9, 2);
    c.strokeStyle = '#d0d4de'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + 60, y + 2); c.lineTo(x + 60, y - 40); c.stroke(); c.fillStyle = '#f4f4f8'; c.fillRect(x + 60, y - 40, 20, 12);
  },
  moon3() {
    skyFill([[0, '#000004'], [1, '#0c0c14']]); stars(240);
    orb(90 - camX * 0.01, 372, 26, '#ffffff', '#fff2c0', '255,240,200', 0.7, 240);
    ridge('#9a9aa6', '#33333c', 0.08, 404, 170, 90, 5);
    const x = wrap(520, 0.15, 1400);
    c.fillStyle = '#8f8f9a'; ell(c, x, 432, 250, 30); c.fillStyle = '#26262e'; ell(c, x + 6, 437, 226, 22); c.fillStyle = '#4a4a54'; ell(c, x - 40, 440, 60, 6);
    ridge('#70707c', '#24242c', 0.2, 446, 60, 50, 9);
    craters(0.4, 462, 44, 8, '#9a9aa4', '#2c2c34');
  },
  mercury2() {
    skyFill([[0, '#050203'], [0.7, '#1a0d08'], [1, '#5a2a10']]); stars(70, 0.6);
    orb(170 - camX * 0.01, 80, 95, '#ffffff', '#ffd070', '255,170,60', 0.7, 330);
    ridge('#a08672', '#4a382c', 0.06, 384, 60, 120, 3); haze(300, 470, '255,140,50');
    ridge('#8a705c', '#3e2e24', 0.12, 412, 50, 90, 8); ridge('#7a6250', '#34261e', 0.22, 434, 36, 70, 15);
    hillLayer('#64503f', '#2c201a', 0.4, 448, 6, 0.011);
    const cx = wrap(600, 0.3, 1600); c.strokeStyle = 'rgba(24,14,10,.6)'; c.lineWidth = 2; c.beginPath();
    for (let k = 0; k < 11; k++) { const a = Math.PI + k * Math.PI / 10; c.moveTo(cx + Math.cos(a) * 14, 456 + Math.sin(a) * 3); c.lineTo(cx + Math.cos(a) * 280, 456 + Math.sin(a) * 26); }
    c.stroke(); c.fillStyle = '#2c201a'; ell(c, cx, 456, 16, 4);
  },
  mercury3() {
    skyFill([[0, '#000003'], [0.8, '#06070f'], [1, '#1a1410']]); stars(240);
    orb(300 - camX * 0.01, 90, 3.2, '#ffffff', '#fff2c0', '255,240,190', 0.6, 22);
    orb(520 - camX * 0.01, 60, 2.6, '#eaf4ff', '#9fd0ff', '160,200,255', 0.6, 18);
    haze(390, 470, '255,150,60');
    ridge('#5a5e6c', '#1c1e26', 0.1, 412, 90, 80, 4);
    hillLayer('#4a4e5c', '#15161c', 0.4, 450, 6, 0.01);
    for (let i = 0; i < 3; i++) { const x = wrap(300 + i * 520, 0.25, 1560);
      c.fillStyle = '#7a8090'; ell(c, x, 446, 62, 13); c.fillStyle = '#0c0d14'; ell(c, x + 2, 448, 54, 10);
      c.fillStyle = rad(c, x, 449, 2, x, 449, 44, [[0, 'rgba(230,248,255,.95)'], [1, 'rgba(150,200,240,.25)']]); ell(c, x, 450, 40, 6);
      c.fillStyle = '#fff'; for (let k = 0; k < 4; k++) { c.globalAlpha = Math.abs(Math.sin(tick * 0.06 + k + i)); dot(c, x - 24 + k * 16, 449 + (k % 2) * 2, 1.3); } c.globalAlpha = 1; }
  },
  venus2() {
    skyFill([[0, '#d9a03a'], [0.55, '#f6dc98'], [1, '#fff6dc']]);
    orb(720 - camX * 0.02, 100, 34, '#ffffff', '#fff0b0', '255,246,200', 0.8, 220);
    puffs(0.06, 300, 60, 7, 2.4, '#fff3cf', '#e0b060', 0.15);
    hillLayer('#fbe6b0', '#e3b860', 0.1, 384, 22, 0.005);
    const [bx, by] = POS.balloon();
    c.strokeStyle = 'rgba(90,60,20,.7)'; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 8, by + 18); c.lineTo(bx - 4, by + 44); c.moveTo(bx + 8, by + 18); c.lineTo(bx + 4, by + 44); c.stroke();
    orb(bx, by, 21, '#ffffff', '#b9c0cc'); c.fillStyle = lin(c, bx - 7, 0, bx + 7, 0, [[0, '#e8e8f0'], [1, '#8a90a0']]); rr(c, bx - 7, by + 44, 14, 9, 2);
    puffs(0.25, 404, 36, 6, 2, '#fff8e0', '#ecc878', 0.3);
    hillLayer('#fff3cf', '#ecc878', 0.4, 442, 16, 0.009);
  },
  venus3() {
    skyFill([[0, '#2a1206'], [0.5, '#9a5a18'], [1, '#e0a23a']]);
    puffs(0.08, 10, 80, 8, 2.4, '#a8702a', '#5a300e', 0.3);
    lightning(200, 7, '#fff6c9', 'rgba(255,240,200,.16)');
    peaks(0.1, 300, 470, 230, 110, '#7a5a3e', '#3e2a1a', '#e8e8f2', 3);
    haze(300, 470, '255,180,80');
    peaks(0.22, 220, 470, 110, 70, '#6a4428', '#301a0e', '#d8dce8', 11);
    hillLayer('#a8521e', '#4a1c0a', 0.4, 432, 18, 0.01);
  },
  mars2() {
    skyFill([[0, '#b9794e'], [0.6, '#e8b98c'], [1, '#f6dcc0']]);
    orb(760 - camX * 0.02, 70, 13, '#ffffff', '#eaf4ff', '170,200,255', 0.5, 90);
    ridge('#cf8a60', '#8a4426', 0.06, 214, 36, 160, 5);
    c.fillStyle = 'rgba(90,30,10,.12)'; for (let k = 0; k < 8; k++) c.fillRect(0, 246 + k * 28, VW, 7);
    haze(240, 470, '246,205,165');
    ridge('#b05a34', '#6a2814', 0.15, 340, 50, 130, 12);
    hillLayer('#c9603a', '#7a2a14', 0.4, 440, 10, 0.01);
    const rx = POS.rover(), ry = 440;
    shadow(c, rx, ry + 6, 30, 0.3); c.fillStyle = '#22242e'; for (const w of [-18, 0, 18]) dot(c, rx + w, ry + 2, 6);
    c.fillStyle = lin(c, 0, ry - 16, 0, ry - 2, [[0, '#f4f4f8'], [1, '#9aa0b0']]); rr(c, rx - 24, ry - 16, 48, 12, 3);
    c.strokeStyle = '#9aa0b0'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(rx + 14, ry - 16); c.lineTo(rx + 14, ry - 38); c.stroke(); c.fillStyle = '#e8e8f0'; rr(c, rx + 8, ry - 46, 14, 9, 2); c.fillStyle = '#22242e'; dot(c, rx + 18, ry - 41.5, 2.4);
    const [hx, hy] = POS.heli();
    c.strokeStyle = '#2a2c36'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(hx - 4, hy + 5); c.lineTo(hx - 9, hy + 14); c.moveTo(hx + 4, hy + 5); c.lineTo(hx + 9, hy + 14); c.moveTo(hx, hy - 5); c.lineTo(hx, hy - 12); c.stroke();
    c.fillStyle = '#d9dce6'; rr(c, hx - 6, hy - 5, 12, 10, 2); c.fillStyle = '#3f6fd8'; rr(c, hx - 5, hy - 16, 10, 3, 1);
    const rw = Math.cos(tick * 0.9) * 26; c.strokeStyle = 'rgba(30,30,40,.8)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(hx - rw, hy - 12); c.lineTo(hx + rw, hy - 12); c.moveTo(hx - rw * 0.6, hy - 9); c.lineTo(hx + rw * 0.6, hy - 9); c.stroke();
  },
  mars3() {
    skyFill([[0, '#2a2840'], [0.6, '#7a6a78'], [1, '#c9a58a']]); stars(70, 0.5);
    const sx = 640 - camX * 0.02; orb(sx, 350, 12, '#ffffff', '#dfeeff', '110,170,255', 0.75, 200);
    const x = POS.olympus();
    c.fillStyle = lin(c, 0, 250, 0, 470, [[0, '#8f5e58'], [1, '#5a3230']]); c.beginPath(); c.moveTo(x - 540, 470); c.bezierCurveTo(x - 300, 440, x - 180, 272, x - 74, 262); c.lineTo(x - 44, 274); c.lineTo(x + 44, 274); c.lineTo(x + 74, 262); c.bezierCurveTo(x + 180, 272, x + 300, 440, x + 540, 470); c.fill();
    c.fillStyle = 'rgba(30,10,14,.4)'; ell(c, x, 274, 44, 4);
    haze(320, 470, '200,160,150');
    hillLayer('#8a4a34', '#3a1a14', 0.4, 432, 18, 0.01);
  },
  jupiter2() {
    skyFill([[0, '#0c0a2a'], [0.5, '#3a4a78'], [1, '#b9c6d9']]); stars(70, 0.5);
    aurora(30, 170, ['255,90,200', '120,160,255', '90,255,220']);
    for (let i = 0; i < 5; i++) { const x = wrap(200 + i * 330, 0.1, 1650), y = 300 + (i % 2) * 46;
      ['#8fa2c4', '#6f84ac', '#a9b8d2', '#586c96'].forEach((col, k) => { c.fillStyle = col; ell(c, x, y, 110 - k * 26, 34 - k * 8, Math.sin(tick * 0.01 + i + k) * 0.08); }); }
    hillLayer('#c9d4e4', '#7f93b4', 0.2, 404, 18, 0.007); haze(320, 470, '220,230,250');
    hillLayer('#e6eef6', '#9fb2c9', 0.4, 432, 18, 0.008);
  },
  jupiter3() {
    skyFill([[0, '#05040c'], [0.6, '#1c1420'], [1, '#3a2a30']]); stars(210);
    c.strokeStyle = 'rgba(255,230,200,.4)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(VW / 2 - camX * 0.01, 60, 700, 80, 0, 0.15, Math.PI - 0.15); c.stroke();
    for (const [x, y, r, a, b] of JMOONS) orb(x - camX * 0.01, y, r, a, b);
    const cols = ['#2e2220', '#3a2a24', '#241a1a', '#40302a', '#2a1e1c'];
    for (let b = 0; b < 5; b++) { const y0 = 250 + b * 46, d = b % 2 ? 1 : -1; c.fillStyle = cols[b]; c.beginPath(); c.moveTo(0, VH);
      for (let x = 0; x <= VW; x += 14) c.lineTo(x, y0 + Math.sin((x + camX * 0.05 * d + tick * 0.3 * d) * 0.012 + b) * 8); c.lineTo(VW, VH); c.fill(); }
    if (tick % 70 < 5) { const s = Math.floor(tick / 70), lx = 80 + hash(s) * 800, ly = 290 + hash(s + 4) * 130; c.fillStyle = rad(c, lx, ly, 2, lx, ly, 100, [[0, 'rgba(210,225,255,.85)'], [1, 'rgba(210,225,255,0)']]); dot(c, lx, ly, 100); }
    lightning(190, 6, '#cfe4ff', 'rgba(180,200,255,.12)');
    hillLayer('#6a5a52', '#2a1e1c', 0.4, 432, 18, 0.008);
  },
  saturn2() {
    skyFill([[0, '#1c2440'], [0.45, '#7f93b0'], [1, '#e8dcc0']]); stars(50, 0.4);
    orb(150 - camX * 0.01, 70, 8, '#ffffff', '#fff3c9', '255,246,210', 0.5, 50);
    const cx = VW / 2 - camX * 0.04, cy = 352;
    ['#d9c69a', '#8fa6c4', '#e8dcc0', '#7088ac', '#cdbb92', '#5a7098'].forEach((col, k) => { const R = 470 - k * 72; c.fillStyle = col; c.beginPath();
      for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3 + tick * 0.002; c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.3); } c.closePath(); c.fill(); });
    c.fillStyle = '#34446c'; ell(c, cx, cy, 44, 13); c.fillStyle = '#1c2646'; ell(c, cx, cy, 20, 6);
    haze(340, 470, '240,236,220');
    hillLayer('#f0ecd8', '#b9c0b0', 0.4, 434, 16, 0.008);
  },
  saturn3() {
    skyFill([[0, '#03040c'], [1, '#141a2c']]); stars(200);
    const gx = 140 - camX * 0.01, gy = 250, R = 250;
    c.save(); c.beginPath(); c.arc(gx, gy, R, 0, 7); c.clip();
    ['#e8d6a0', '#d9c088', '#f0e2b8', '#cdb078', '#e3cf98', '#c9aa68', '#ecd9a8', '#d2b880'].forEach((col, i) => { c.fillStyle = col; c.fillRect(gx - R, gy - R + i * R / 4, R * 2, R / 4 + 1); });
    c.fillStyle = 'rgba(20,14,6,.45)'; for (let k = 0; k < 4; k++) c.fillRect(gx - R, gy + 30 + k * 14, R * 2, 6 + (k % 2) * 4);
    c.fillStyle = rad(c, gx - 60, gy - 90, 40, gx + 40, gy + 30, R * 1.3, [[0, 'rgba(255,255,255,.15)'], [0.5, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,10,.8)']]); c.fillRect(gx - R, gy - R, R * 2, R * 2); c.restore();
    c.fillStyle = lin(c, 0, 380, 0, 420, [[0, 'rgba(230,240,255,0)'], [0.5, 'rgba(230,240,255,.35)'], [1, 'rgba(230,240,255,0)']]); c.fillRect(0, 380, VW, 40);
    const rock = (x, y, s, seed, a) => { c.globalAlpha = a; c.fillStyle = lin(c, 0, y - s, 0, y + s, [[0, '#ffffff'], [1, '#8fb4d4']]); c.beginPath(); for (let j = 0; j < 7; j++) { const an = j * 0.9, rr2 = s * (0.65 + hash(seed + j) * 0.45); c.lineTo(x + Math.cos(an) * rr2, y + Math.sin(an) * rr2 * 0.8); } c.closePath(); c.fill(); };
    for (let i = 0; i < 26; i++) rock(wrap(i * 50 + hash(i) * 40, 0.1, VW + 300), 130 + hash(i + 9) * 290, 3 + hash(i + 3) * 5, i, 0.5);
    for (let i = 0; i < 9; i++) { const [x, y] = POS.chunk(i); rock(x, y, 10 + hash(i + 60) * 12, i + 100, 0.9); }
    c.globalAlpha = 1;
  },
  uranus2() {
    skyFill([[0, '#5fc8d6'], [0.6, '#c4f4f0'], [1, '#f2fffd']]);
    const sx = 480 - camX * 0.01; orb(sx, 90, 10, '#ffffff', '#f4ffff', '255,255,255', 0.8, 120);
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.beginPath(); c.arc(sx, 90, 72, 0, 7); c.stroke(); c.fillStyle = 'rgba(255,255,255,.8)'; dot(c, sx - 72, 90, 6); dot(c, sx + 72, 90, 6);
    puffs(0.1, 170, 110, 7, 1.6, '#ffffff', '#bfeeee', 0.1);
    hillLayer('#e6fffb', '#9fe0de', 0.15, 392, 24, 0.005); haze(300, 460, '240,255,252');
    ridge('#f2fffd', '#8fd8d8', 0.25, 432, 60, 50, 7);
    hillLayer('#ffffff', '#a8e6e4', 0.4, 438, 14, 0.01);
  },
  uranus3() {
    skyFill([[0, '#01141c'], [0.6, '#0a3a48'], [1, '#1a6a72']]); stars(200);
    aurora(20, 150, ['90,255,200', '120,200,255']);
    c.save(); c.translate(820 - camX * 0.02, 170); c.rotate(1.25); c.strokeStyle = '#ffffff';
    [[150, 0.35, 2], [166, 0.2, 1.5], [136, 0.2, 1.5]].forEach(([r, a, w]) => { c.globalAlpha = a; c.lineWidth = w; c.beginPath(); c.ellipse(0, 0, r, r * 0.24, 0, 0, 7); c.stroke(); }); c.restore(); c.globalAlpha = 1;
    for (const [x, y, r] of UMOONS) orb(x - camX * 0.01, y, r, '#e8f4f4', '#8aa8a8');
    ridge('#3f8f9a', '#0a2a34', 0.12, 422, 150, 46, 21); ridge('#2f7a86', '#08222a', 0.2, 432, 100, 38, 57);
    hillLayer('#4fa0a8', '#0c2c34', 0.4, 434, 14, 0.01);
  },
  neptune2() {
    skyFill([[0, '#0a1f7a'], [0.5, '#2f6fe0'], [1, '#8fc4ff']]); stars(40, 0.4);
    orb(760 - camX * 0.01, 70, 3, '#ffffff', '#ffffff', '255,255,255', 0.9, 26);
    for (let i = 0; i < 12; i++) { const w = 130 + hash(i) * 170, x = ((i * 190 - tick * (0.8 + (i % 3) * 0.4) - camX * 0.1) % (VW + 400) + VW + 400) % (VW + 400) - 200, y = 110 + hash(i + 2) * 240;
      c.fillStyle = 'rgba(10,30,120,.25)'; rr(c, x + 14, y + 16, w, 8, 4); c.fillStyle = `rgba(255,255,255,${0.45 + hash(i + 4) * 0.4})`; rr(c, x, y, w, 7 + hash(i + 8) * 5, 5); }
    const [px, py] = POS.probe();
    c.strokeStyle = '#c9ced9'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px, py); c.lineTo(px + 34, py + 10); c.moveTo(px, py); c.lineTo(px - 26, py + 16); c.stroke();
    c.fillStyle = '#8a90a0'; rr(c, px - 6, py - 2, 12, 9, 2); c.fillStyle = '#f1f3f8'; c.beginPath(); c.ellipse(px, py - 5, 13, 5, 0, Math.PI, 0); c.fill(); c.fillStyle = '#c9ced9'; ell(c, px, py - 5, 13, 2);
    ridge('#6f9ff8', '#1c3aa8', 0.15, 417, 70, 60, 31); haze(310, 460, '170,210,255');
    hillLayer('#9fc4ff', '#2a4ab8', 0.4, 432, 16, 0.01);
  },
  neptune3() {
    skyFill([[0, '#01030f'], [0.6, '#081a5a'], [1, '#1a3aa0']]); stars(210);
    aurora(40, 110, ['120,160,255']);
    const cx = VW / 2 - camX * 0.01;
    c.strokeStyle = 'rgba(200,220,255,.2)'; c.lineWidth = 2; c.beginPath(); c.ellipse(cx, 20, 640, 150, 0, 0.1, Math.PI - 0.1); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 4; c.lineCap = 'round';
    for (const [a, b] of [[0.9, 1.0], [1.08, 1.15], [1.24, 1.29]]) { c.beginPath(); c.ellipse(cx, 20, 640, 150, 0, a, b); c.stroke(); } c.lineCap = 'butt';
    const tx = 200 - camX * 0.012; orb(tx, 110, 20, '#f6e2da', '#b89a9a', '200,210,255', 0.25, 50);
    c.strokeStyle = 'rgba(40,30,40,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(tx + 6, 96); c.quadraticCurveTo(tx + 8, 78, tx + 22, 72); c.stroke();
    ridge('#2f4fb8', '#081050', 0.15, 417, 90, 60, 31);
    hillLayer('#3f62c8', '#0a1660', 0.4, 432, 16, 0.01);
  }
});
Object.assign(TAGS, {
  moon2() { tag(POS.lander(), 404, 'Apollo 11 landed here in 1969', -34); tag(170 - camX * 0.015, 150, 'Earth', 22); },
  moon3() { tag(wrap(520, 0.15, 1400), 426, 'Giant craters cover the far side', -40); },
  mercury2() { tag(wrap(600, 0.3, 1600), 444, 'Caloris Basin: a crater 1,550 km wide', -46); },
  mercury3() { tag(wrap(300, 0.25, 1560), 440, 'Ice in craters the Sun never reaches', -40); tag(300 - camX * 0.01, 90, 'Venus', 20); tag(520 - camX * 0.01, 60, 'Earth', 20); },
  venus2() { const [x, y] = POS.balloon(); tag(x, y + 54, 'Balloon probes floated here in 1985', 26); },
  venus3() { const p = peakAt(1, 0.1, 300, 470, 230, 110, 3); tag(p.x, p.y + 8, 'Maxwell Montes: 11 km high, capped in metal frost', -30); },
  mars2() { tag(wrap(900, 0.06, 1300), 214, 'Valles Marineris: a canyon 4,000 km long', -28); const [x, y] = POS.heli(); tag(x, y + 14, 'Ingenuity: first flight on another world', 26); tag(POS.rover() + 14, 394, 'Rover', -20); },
  mars3() { tag(POS.olympus(), 264, 'Olympus Mons: 22 km, three times Everest', -30); tag(640 - camX * 0.02, 362, 'Sunsets on Mars are blue', 28); },
  jupiter2() { tag(wrap(530, 0.1, 1650), 372, 'Polar cyclone, as wide as a continent', 34); tag(480, 130, 'Auroras: the strongest in the solar system', -28); },
  jupiter3() { for (const m of JMOONS) tag(m[0] - camX * 0.01, m[1] + m[2], m[5], 20); tag(VW / 2 - camX * 0.01, 140, 'Jupiter has faint rings too', 24); },
  saturn2() { tag(VW / 2 - camX * 0.04, 350, 'The hexagon: a six-sided storm wider than two Earths', -84); },
  saturn3() { const [x, y] = POS.chunk(3); tag(x, y, 'Ring pieces: dust to house-sized ice', -30); tag(190 - camX * 0.01, 330, 'Saturn', 26); },
  uranus2() { tag(480 - camX * 0.01, 102, 'At the pole the Sun stays up for 42 years', 80); },
  uranus3() { for (const m of UMOONS) tag(m[0] - camX * 0.01, m[1] + m[2], m[3], 20); },
  neptune2() { tag(760 - camX * 0.01, 74, 'The Sun: 30 times farther than from Earth', 24); const [x, y] = POS.probe(); tag(x, y + 8, 'Voyager 2 flew past in 1989', 30); },
  neptune3() { tag(VW / 2 - camX * 0.01 + 346, 146, 'Faint rings with bright arcs', 26); tag(200 - camX * 0.012, 132, 'Triton: icy geysers at −235 °C', 26); }
});
Object.assign(FACT1, {
  moon2:'The dark “seas” are plains of old lava', moon3:'Far side: it never faces Earth',
  mercury2:'Caloris Basin was blasted out by a giant asteroid', mercury3:'Ice hides at the poles, even this close to the Sun',
  venus2:'50 km up, the air is as mild as Earth’s', venus3:'Air pressure here is 90 times Earth’s',
  mars2:'This canyon would stretch right across the USA', mars3:'Olympus Mons is the tallest volcano known',
  jupiter2:'Jupiter’s poles are crowded with cyclones', jupiter3:'Lightning here is far stronger than on Earth',
  saturn2:'No other planet has a six-sided storm', saturn3:'The rings: 280,000 km wide, about 10 m thick',
  uranus2:'Each season on Uranus lasts 21 Earth years', uranus3:'Its moons are named after Shakespeare’s characters',
  neptune2:'Sunlight takes 4 hours to reach Neptune', neptune3:'Neptune has rings too'
});
Object.assign(FACT2, {
  moon2:'Twelve people have walked on the Moon', moon3:'A Moon day lasts about two Earth weeks',
  mercury2:'Mercury has no moons at all', mercury3:'Sunrise to sunrise takes 176 Earth days',
  venus2:'These clouds are made of sulfuric acid', venus3:'Venus spins backwards: the Sun rises in the west',
  mars2:'Long ago, rivers and lakes flowed on Mars', mars3:'Mars has ice caps at both poles',
  jupiter2:'Jupiter is mostly hydrogen and helium, like the Sun', jupiter3:'Ganymede is the biggest moon in the solar system',
  saturn2:'A Saturn day is only about 10.7 hours', saturn3:'The rings are almost pure water ice',
  uranus2:'Uranus was the first planet found by telescope, in 1781', uranus3:'Only Voyager 2 has visited, in 1986',
  neptune2:'Methane gas makes Neptune blue', neptune3:'Triton is one of the coldest places known'
});
