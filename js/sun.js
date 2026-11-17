/* Paws Run — sun.js
   The Sun: its three scenes, music, labels and facts, all in one place. */
'use strict';

/* ---------- the Sun ---------- */
SONGS.sun = { bpm:160, root:196, wave:'sawtooth', chords:[0, 3, 5, 3],
  mel:[0,_,7,0, 10,7,_,0,  3,_,10,3, 12,10,_,3,  5,_,12,5, 15,12,_,5,  3,_,10,7, 5,3,0,_] };
scene('sun', 'mercury', { label:'Sun · Surface of fire', scene:'Surface of fire', sky:['#3a0a02','#ffb020'], top:'#fff3a0', dirt:'#ff9a2e', dirt2:'#f07a1a', brick:'#6a1c0c', brickLine:'#2e0a04', spike:'#ffffff',
  fg:'rgba(255,140,20,.8)', fx:['rise','#ffe08a',44], phys:[1.8, -20.5, 7.4], audio:{ song:'sun', pitch:0.7, lp:6000, echo:0.3, step:'cloud' } });
scene('sun2', 'sun', { label:'Sun · Flares and loops', scene:'Flares and loops', sky:['#1a0402','#ff8a1a'] });
scene('sun3', 'sun', { label:'Sun · The corona', scene:'The corona', sky:['#020108','#ff7a1a'], top:'#ffe9a8', dirt:'#d9641a', dirt2:'#c2520e' });
WORLDS.sun = { label:'Sun', levels:['sun', 'sun2', 'sun3'], blurb:'Sun — gravity 28× Earth (274 m/s²): far too strong for any jump, so heat-proof power boots do the work, as on Jupiter.' };
function granules(y0, par) {
  for (let r = 0; r < 6; r++) { const y = y0 + r * r * 4.6 + r * 8, rx = 26 + r * 9, ry = 5 + r * 2.4, step = rx * 2.1, off = (camX * (par + r * 0.03) + (r % 2) * rx) % step;
    for (let i = -1; i < VW / step + 2; i++) { const id = i + Math.floor(camX * (par + r * 0.03) / step) + r * 31, x = i * step - off, k = 0.6 + 0.4 * Math.sin(tick * 0.03 + id * 1.7);
      c.fillStyle = `rgba(255,${200 + Math.round(40 * k)},${90 + Math.round(60 * k)},${0.55 + 0.3 * k})`; ell(c, x, y, rx * (0.8 + hash(id) * 0.3), ry * (0.8 + hash(id + 5) * 0.3)); } }
}
function flameRidge(base, amp, par, a, b) {
  c.fillStyle = lin(c, 0, base - amp, 0, base + 30, [[0, a], [1, b]]); c.beginPath(); c.moveTo(0, VH);
  for (let x = 0; x <= VW; x += 8) { const wx = x + camX * par; c.lineTo(x, base - Math.abs(Math.sin(wx * 0.05 + tick * 0.05)) * amp * (0.4 + 0.6 * Math.abs(Math.sin(wx * 0.013))) - Math.abs(Math.sin(wx * 0.17 - tick * 0.08)) * amp * 0.25); }
  c.lineTo(VW, VH); c.fill();
}
const SUNPOS = {
  spot: () => wrap(560, 0.18, 1500),
  loop: i => wrap(260 + i * 520, 0.12, 1560),
  probe: () => [wrap(300 + tick * 0.2, 0.1, 1500), 170 + Math.sin(tick * 0.02) * 8]
};
Object.assign(BG, {
  sun() {
    skyFill([[0, '#3a0a02'], [0.5, '#c9400a'], [1, '#ffb020']]);
    flameRidge(300, 60, 0.06, '#ffd040', '#ff7a10');
    c.fillStyle = lin(c, 0, 296, 0, 470, [[0, '#ff8a14'], [1, '#e85a08']]); c.fillRect(0, 296, VW, 180);
    granules(312, 0.1);
    const x = SUNPOS.spot();
    c.fillStyle = '#a8480c'; ell(c, x, 392, 92, 24); c.fillStyle = '#6a2406'; ell(c, x, 392, 66, 16); c.fillStyle = '#2a0a02'; ell(c, x + 4, 393, 40, 9);
    c.fillStyle = '#8a3608'; ell(c, x + 150, 420, 34, 9); c.fillStyle = '#3a1004'; ell(c, x + 150, 420, 18, 4.5);
    haze(250, 330, '255,220,120');
  },
  sun2() {
    skyFill([[0, '#1a0402'], [0.55, '#a82a06'], [1, '#ff8a1a']]);
    for (let i = 0; i < 3; i++) { const x = SUNPOS.loop(i), h = 190 + (i % 2) * 60, w = 130 + (i % 2) * 40, pul = Math.sin(tick * 0.04 + i) * 4;
      c.lineCap = 'round';
      [['rgba(255,120,20,.25)', 44], ['rgba(255,150,40,.6)', 24], ['#ffd860', 9], ['#fff6c9', 3]].forEach(([col, lw]) => { c.strokeStyle = col; c.lineWidth = lw + pul; c.beginPath(); c.moveTo(x - w, 340); c.bezierCurveTo(x - w * 0.9, 340 - h * 1.3, x + w * 0.9, 340 - h * 1.3, x + w, 340); c.stroke(); });
      c.strokeStyle = 'rgba(255,240,180,.5)'; c.lineWidth = 1.5; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x - w + k * 9, 340); c.bezierCurveTo(x - w * 0.8 + k * 6, 340 - h * (1.3 - k * 0.12), x + w * 0.8 - k * 6, 340 - h * (1.3 - k * 0.12), x + w - k * 9, 340); c.stroke(); }
      c.lineCap = 'butt'; }
    { const x = SUNPOS.loop(0) + 190; orb(x, 250, 4.5, '#8fd8ff', '#1b5fc0'); }
    if (tick % 260 < 40) { const k = (tick % 260) / 40, x = wrap(700, 0.12, 1560); c.fillStyle = rad(c, x, 330, 4, x, 330, 60 + k * 240, [[0, `rgba(255,255,230,${0.9 * (1 - k)})`], [1, 'rgba(255,200,80,0)']]); dot(c, x, 330, 60 + k * 240); }
    flameRidge(340, 46, 0.1, '#ffd040', '#ff7a10');
    c.fillStyle = lin(c, 0, 336, 0, 470, [[0, '#ff8a14'], [1, '#e85a08']]); c.fillRect(0, 336, VW, 140);
    granules(350, 0.12);
  },
  sun3() {
    skyFill([[0, '#020108'], [0.55, '#2a0a14'], [1, '#ff7a1a']]); stars(90, 0.6);
    const cx = VW / 2 - camX * 0.02;
    for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + (i - 7.5) * 0.17 + Math.sin(tick * 0.008 + i) * 0.03, len = 520 + hash(i) * 260, wd = 0.03 + hash(i + 3) * 0.05;
      c.fillStyle = lin(c, cx, 480, cx + Math.cos(a) * len, 480 + Math.sin(a) * len, [[0, 'rgba(255,240,200,.5)'], [1, 'rgba(255,240,200,0)']]);
      c.beginPath(); c.moveTo(cx, 520); c.lineTo(cx + Math.cos(a - wd) * len, 520 + Math.sin(a - wd) * len); c.lineTo(cx + Math.cos(a + wd) * len, 520 + Math.sin(a + wd) * len); c.fill(); }
    c.fillStyle = rad(c, cx, 1180, 700, cx, 1180, 900, [[0, '#fff6c0'], [0.3, 'rgba(255,170,50,.8)'], [1, 'rgba(255,120,20,0)']]); dot(c, cx, 1180, 900);
    c.fillStyle = lin(c, 0, 400, 0, 480, [[0, '#fff3a0'], [1, '#ff9a20']]); dot(c, cx, 1180, 780);
    const [px, py] = SUNPOS.probe();
    c.fillStyle = '#3f6fd8'; rr(c, px - 22, py + 2, 12, 5, 1); rr(c, px + 10, py + 2, 12, 5, 1);
    c.fillStyle = '#c9ced9'; rr(c, px - 6, py - 4, 12, 16, 2); c.fillStyle = lin(c, 0, py + 10, 0, py + 18, [[0, '#f4f4f8'], [1, '#ffb347']]); rr(c, px - 14, py + 11, 28, 6, 2);
    c.strokeStyle = '#c9ced9'; c.lineWidth = 1; c.beginPath(); c.moveTo(px, py - 4); c.lineTo(px, py - 16); c.stroke();
    c.strokeStyle = 'rgba(255,240,200,.35)'; c.lineWidth = 1.5; c.beginPath(); for (let i = 0; i < 30; i++) { const a = -Math.PI / 2 + (hash(i) - 0.5) * 2.4, d = ((tick * (2 + hash(i + 2) * 2) + i * 60) % 520) + 80; c.moveTo(cx + Math.cos(a) * d, 520 + Math.sin(a) * d); c.lineTo(cx + Math.cos(a) * (d + 16), 520 + Math.sin(a) * (d + 16)); } c.stroke();
  }
});
Object.assign(TAGS, {
  sun() { tag(SUNPOS.spot(), 386, 'Sunspot: a cooler patch, often bigger than Earth', -70); tag(240, 330, 'Bubbling cells of gas, each as big as a country', -50); },
  sun2() { tag(SUNPOS.loop(0), 110, 'Prominence: a loop of glowing gas', -26); tag(SUNPOS.loop(0) + 190, 250, 'Earth, to scale', 24); },
  sun3() { const [x, y] = SUNPOS.probe(); tag(x, y + 18, 'Parker Solar Probe flew through the corona', 28); tag(VW / 2 - camX * 0.02 + 150, 260, 'Corona: the Sun’s glowing outer air', -30); }
});
Object.assign(FACT1, { sun:'The Sun is a star: 5,500 °C at its surface', sun2:'Sunlight takes 8 minutes to reach Earth', sun3:'The corona is over a million degrees, hotter than the surface' });
Object.assign(FACT2, { sun:'1.3 million Earths would fit inside the Sun', sun2:'The Sun is about 4.6 billion years old', sun3:'The Sun holds 99.8% of the solar system’s mass' });
FACTS.sun = { intro:'Not a planet but our star: a giant ball of glowing hydrogen and helium with no solid surface. Its light and heat make life on Earth possible.',
  see:['Sunspots: darker, cooler patches, though still about 3,500 °C.', 'Prominences: loops of glowing gas far taller than Earth.', 'The corona, the Sun’s outer air, which is strangely hotter than its surface.'] };
