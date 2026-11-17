/* Paws Run — meteors.js
   Meteor showers that cross the sky from time to time. */
'use strict';

/* ---------- meteor showers ---------- */
let meteors = [], showerT = 0, nextShower = 420 + Math.random() * 500;
function spawnMeteor() {
  meteors.push({ x: 80 + Math.random() * VW * 1.25, y: -20, vx: -(5 + Math.random() * 4), vy: 4 + Math.random() * 3, len: 9 + Math.random() * 10, life: 110, w: 1.5 + Math.random() * 2.2, col: ['255,255,255', '255,233,168', '168,224,255'][Math.floor(Math.random() * 3)] });
}
function meteorTick() {
  if (showerT > 0) { showerT--; if (showerT % 6 === 0) { spawnMeteor(); if (Math.random() < 0.35) sfx.meteor(); } }
  else if (--nextShower <= 0) { showerT = 430; nextShower = 1300 + Math.random() * 1500; if (state === 'play') toast = { text: 'Meteor shower!', life: 160 }; sfx.shower(); }
  else if (Math.random() < 0.0015) spawnMeteor();
  for (const m of meteors) { m.x += m.vx; m.y += m.vy; m.life--; }
  meteors = meteors.filter(m => m.life > 0 && m.y < 400);
}
function drawMeteors() {
  c.lineCap = 'round';
  for (const m of meteors) {
    const a = Math.min(1, m.life / 30, (400 - m.y) / 120), tx = m.x - m.vx * m.len, ty = m.y - m.vy * m.len;
    c.strokeStyle = lin(c, m.x, m.y, tx, ty, [[0, `rgba(${m.col},${a})`], [1, `rgba(${m.col},0)`]]); c.lineWidth = m.w; c.beginPath(); c.moveTo(m.x, m.y); c.lineTo(tx, ty); c.stroke();
    c.fillStyle = rad(c, m.x, m.y, 0.5, m.x, m.y, m.w * 5, [[0, `rgba(255,255,255,${a})`], [1, `rgba(${m.col},0)`]]); dot(c, m.x, m.y, m.w * 5);
  }
  c.lineCap = 'butt';
}
