/* Paws Run — render.js
   Draws one frame: background, drifting particles, level tiles, enemies, the pet, labels and the heads-up display. */
'use strict';

function drawBackground() {
  BG[envName]();
  drawMeteors();
}

/* drifting particles in front of the scene */
function drawFx() {
  const f = theme().fx; if (!f) return;
  const [kind, col, n] = f; c.fillStyle = col; c.strokeStyle = col;
  for (let i = 0; i < n; i++) {
    if (kind === 'fall') { const x = ((i * 97 + Math.sin(tick * 0.01 + i) * 30 - camX * (0.2 + (i % 3) * 0.2)) % VW + VW) % VW, y = (i * 53 + tick * (0.8 + (i % 5) * 0.25)) % VH; c.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(tick * 0.06 + i)); dot(c, x, y, 1.2 + (i % 3) * 1.1); }
    else if (kind === 'drift') { const x = ((i * 97 - tick * (1 + (i % 4) * 0.6) - camX * 0.4) % VW + VW) % VW, y = (i * 61) % VH + Math.sin(tick * 0.02 + i) * 12; c.globalAlpha = 0.25 + 0.4 * Math.abs(Math.sin(tick * 0.03 + i)); dot(c, x, y, 1 + (i % 3) * 0.8); }
    else if (kind === 'rise') { const x = ((i * 113 + Math.sin(tick * 0.02 + i) * 24 - camX * 0.5) % VW + VW) % VW, y = VH - (i * 47 + tick * (0.5 + (i % 4) * 0.3)) % VH; c.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(tick * 0.05 + i)); dot(c, x, y, 1.4 + (i % 2)); }
    else { const w = 30 + (i % 5) * 14, x = ((i * 131 - tick * (6 + (i % 5) * 2) - camX * 0.5) % (VW + 200) + VW + 200) % (VW + 200) - 100, y = (i * 37) % VH; c.globalAlpha = 0.12 + (i % 4) * 0.05; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y - 2); c.stroke(); }
  }
  c.globalAlpha = 1;
}

function drawForeground() {
  const th = theme();
  const col = th.fg;
  c.fillStyle = col; c.beginPath(); c.moveTo(0, VH);
  for (let x = 0; x <= VW; x += 12) { const wx = x + camX * 1.35; c.lineTo(x, 522 + Math.sin(wx * 0.012) * 9 + Math.sin(wx * 0.031 + 2) * 5); }
  c.lineTo(VW, VH); c.fill();
  if (envName === 'grass') {
    c.strokeStyle = col; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath();
    const off = (camX * 1.35) % 46;
    for (let i = -1; i < VW / 46 + 2; i++) { const x = i * 46 - off, id = i + Math.floor(camX * 1.35 / 46); for (let k = -1; k <= 1; k++) { c.moveTo(x, 526); c.quadraticCurveTo(x + k * 5, 510, x + k * (9 + hash(id + k) * 5), 498 + hash(id * 2 + k) * 8); } }
    c.stroke(); c.lineCap = 'butt';
  }
}

function drawWorld() {
  const th = theme(), ts = tiles();
  c.save(); c.translate(-Math.round(camX), -Math.round(camY));
  const x0 = Math.max(0, Math.floor(camX / T) - 1), x1 = Math.min(L.w - 1, Math.floor((camX + VW) / T) + 1);
  const cell = (tx, ty) => tx < 0 || tx >= L.w || ty < 0 || ty >= ROWS ? 0 : L.grid[tx][ty];
  /* shadows cast below floating blocks */
  for (let tx = x0; tx <= x1; tx++) for (let ty = 0; ty < ROWS - 1; ty++) {
    if (L.grid[tx][ty] === 2 && L.grid[tx][ty + 1] === 0) { const x = tx * T, y = (ty + 1) * T; c.fillStyle = lin(c, 0, y, 0, y + 14, [[0, 'rgba(0,0,20,.34)'], [1, 'rgba(0,0,20,0)']]); c.fillRect(x + 3, y, T, 14); }
  }
  for (let tx = x0; tx <= x1; tx++) for (let ty = 0; ty < ROWS; ty++) {
    const v = L.grid[tx][ty], x = tx * T, y = ty * T;
    if (v === 1) {
      const topT = ty === 0 || L.grid[tx][ty - 1] !== 1;
      c.drawImage((topT ? ts.top : ts.deep)[(tx + ty) % 2], x, y);
      if (cell(tx - 1, ty) !== 1) { c.fillStyle = lin(c, x, 0, x + 10, 0, [[0, 'rgba(255,255,255,.22)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(x, y + (topT ? 10 : 0), 10, T - (topT ? 10 : 0)); }
      if (cell(tx + 1, ty) !== 1) { c.fillStyle = lin(c, x + T - 12, 0, x + T, 0, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.38)']]); c.fillRect(x + T - 12, y + (topT ? 10 : 0), 12, T - (topT ? 10 : 0)); }
      if (topT && envName === 'grass') { c.fillStyle = shade(th.top, 0.9); for (let k = 0; k < 3; k++) { const gx = x + 4 + k * 12 + hash(tx * 3 + k) * 5, gh = 4 + hash(tx + k * 7) * 5; tri(c, gx - 2, y + 1, gx + hash(tx + k) * 4 - 2, y - gh, gx + 2, y + 1); } if (hash(tx * 13) > 0.72) { const fx = x + 8 + hash(tx) * 20; c.fillStyle = '#3d8a3a'; c.fillRect(fx - 0.6, y - 7, 1.2, 8); c.fillStyle = hash(tx * 5) > 0.5 ? '#ff8fb3' : '#fff2a8'; for (let p = 0; p < 5; p++) dot(c, fx + Math.cos(p * 1.26) * 2.6, y - 8 + Math.sin(p * 1.26) * 2.6, 1.7); c.fillStyle = '#ffb300'; dot(c, fx, y - 8, 1.3); } }
      if (topT && envName === 'ocean' && hash(tx * 17) > 0.8) { const sx = x + 8 + hash(tx) * 18; c.fillStyle = '#ffd9c2'; c.beginPath(); c.arc(sx, y + 1, 5, Math.PI, 0); c.fill(); c.strokeStyle = '#d99a80'; c.lineWidth = 0.7; c.beginPath(); for (let p = 1; p < 5; p++) { c.moveTo(sx, y + 1); c.lineTo(sx + Math.cos(Math.PI + p * 0.63) * 5, y + 1 + Math.sin(Math.PI + p * 0.63) * 5); } c.stroke(); }
    } else if (v === 2) c.drawImage(ts.brick, x, y);
    else if (v === 3) { shadow(c, x + 18, y + T, 17, 0.2); c.drawImage(ts.spike, x, y); }
  }
  for (const m of L.movers) {
    c.fillStyle = lin(c, 0, m.y + m.h, 0, m.y + m.h + 14, [[0, 'rgba(0,0,20,.3)'], [1, 'rgba(0,0,20,0)']]); c.fillRect(m.x + 6, m.y + m.h, m.w - 8, 14);
    c.fillStyle = shade(th.brickLine, 0.7); rr(c, m.x, m.y + 4, m.w, m.h, 7);
    c.fillStyle = lin(c, 0, m.y, 0, m.y + m.h, [[0, tint(th.brick, 0.35)], [0.5, th.brick], [1, shade(th.brick, 0.7)]]); rr(c, m.x, m.y, m.w, m.h - 1, 7);
    c.fillStyle = 'rgba(255,255,255,.45)'; rr(c, m.x + 7, m.y + 2, m.w - 14, 2.6, 1.3);
    c.fillStyle = shade(th.brickLine, 0.8); dot(c, m.x + 9, m.y + 8, 2); dot(c, m.x + m.w - 9, m.y + 8, 2);
  }
  { /* checkpoint lantern */
    const x = L.check * T + 6, y = GROUND * T;
    shadow(c, x + 3, y + 1, 12, 0.22);
    c.fillStyle = lin(c, x, 0, x + 6, 0, [[0, '#8a7258'], [0.5, '#5b4a3a'], [1, '#3a2e24']]); c.fillRect(x, y - 66, 6, 66); rr(c, x - 4, y - 5, 14, 6, 2);
    if (checked) { c.fillStyle = rad(c, x + 3, y - 72, 2, x + 3, y - 72, 44 + Math.sin(tick * 0.1) * 4, [[0, 'rgba(255,220,110,.75)'], [1, 'rgba(255,220,110,0)']]); dot(c, x + 3, y - 72, 48); }
    c.fillStyle = '#3a2e24'; rr(c, x - 8, y - 84, 22, 4, 2); rr(c, x - 7, y - 62, 20, 4, 2);
    c.fillStyle = checked ? lin(c, 0, y - 80, 0, y - 62, [[0, '#fff6c9'], [1, '#ffb93b']]) : lin(c, 0, y - 80, 0, y - 62, [[0, '#b9bfcc'], [1, '#757b8a']]); rr(c, x - 6, y - 80, 18, 18, 3);
    c.fillStyle = 'rgba(255,255,255,.5)'; rr(c, x - 4, y - 78, 3, 14, 1.5);
  }
  { /* home */
    const x = L.goal * T, y = GROUND * T, dog = isDog(), wall = dog ? '#c9713d' : '#8e6fd0', roof = dog ? '#8f3f1f' : '#5c3fa3';
    c.fillStyle = lin(c, x, 0, x + 76, 0, [[0, 'rgba(255,230,140,0)'], [0.5, 'rgba(255,230,140,.22)'], [1, 'rgba(255,230,140,0)']]); c.fillRect(x, y - 3000, 76, 2900);
    shadow(c, x + 44, y + 2, 56, 0.25);
    c.fillStyle = lin(c, x, 0, x + 76, 0, [[0, tint(wall, 0.25)], [0.6, wall], [1, shade(wall, 0.6)]]); c.fillRect(x, y - 58, 76, 58);
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 1; c.beginPath(); for (let i = 1; i < 5; i++) { c.moveTo(x, y - 58 + i * 12); c.lineTo(x + 76, y - 58 + i * 12); } c.stroke();
    c.fillStyle = shade(roof, 0.6); tri(c, x - 12, y - 52, x + 38, y - 104, x + 88, y - 52);
    c.fillStyle = lin(c, x - 10, 0, x + 86, 0, [[0, tint(roof, 0.3)], [0.5, roof], [1, shade(roof, 0.65)]]); tri(c, x - 10, y - 57, x + 38, y - 101, x + 86, y - 57);
    c.strokeStyle = 'rgba(0,0,0,.2)'; c.beginPath(); for (let i = 1; i < 4; i++) { const yy = y - 57 - i * 11, hw = 48 - i * 12; c.moveTo(x + 38 - hw, yy); c.lineTo(x + 38 + hw, yy); } c.stroke();
    c.fillStyle = shade(wall, 0.45); c.beginPath(); c.moveTo(x + 20, y); c.lineTo(x + 20, y - 26); c.arc(x + 38, y - 26, 18, Math.PI, 0); c.lineTo(x + 56, y); c.fill();
    c.fillStyle = rad(c, x + 38, y - 16, 2, x + 38, y - 18, 26, [[0, `rgba(255,225,130,${0.75 + Math.sin(tick * 0.08) * 0.2})`], [1, '#2a1c14']]); c.beginPath(); c.moveTo(x + 22, y); c.lineTo(x + 22, y - 26); c.arc(x + 38, y - 26, 16, Math.PI, 0); c.lineTo(x + 54, y); c.fill();
    c.fillStyle = '#fff8e8'; rr(c, x + 18, y - 76, 40, 15, 4); c.fillStyle = '#3a2a22'; c.font = 'bold 11px sans-serif'; c.textAlign = 'center'; c.fillText('HOME', x + 38, y - 65);
    drawFood(c, treatName(), x + 38, y - 86, 0.8);
  }
  const good = treatName(), bad = trapName();
  for (const g of L.gems) if (!g.got && g.x > camX - 40 && g.x < camX + VW + 40) drawFood(c, good, g.x, g.y + Math.sin(tick * 0.08 + g.x) * 3, 1.15, true);
  for (const t of L.traps) if (t.x > camX - 40 && t.x < camX + VW + 40) drawFood(c, bad, t.x, t.y + Math.sin(tick * 0.08 + t.x) * 3, 1.15, true);

  /* robot vacuums */
  for (const s of L.slimes) {
    if (!s.alive) continue;
    const j = s.stun > 0 ? Math.sin(tick * 1.2) * 1.5 : 0, x = s.x + j, d = s.vx > 0 ? 1 : -1;
    shadow(c, x + 15, s.y + 23, 19, 0.3);
    c.fillStyle = '#1b1e29'; rr(c, x - 2, s.y + 13, 34, 9, 4.5);
    c.fillStyle = lin(c, 0, s.y + 2, 0, s.y + 18, [[0, '#eef1f7'], [0.45, '#a9b1c2'], [1, '#596177']]); c.beginPath(); c.ellipse(x + 15, s.y + 15, 16.5, 12.5, 0, Math.PI, 0); c.fill();
    c.fillStyle = lin(c, 0, s.y + 5, 0, s.y + 13, [[0, '#4b5368'], [1, '#2a2f3f']]); ell(c, x + 15, s.y + 9.5, 9.5, 4.2);
    c.fillStyle = 'rgba(255,255,255,.7)'; ell(c, x + 10, s.y + 6.5, 4.5, 1.3, -0.3);
    const lx = x + 15 + d * 11, on = (tick >> 3) % 2;
    if (on) { c.fillStyle = rad(c, lx, s.y + 13, 0.5, lx, s.y + 13, 9, [[0, 'rgba(255,90,90,.8)'], [1, 'rgba(255,90,90,0)']]); dot(c, lx, s.y + 13, 9); }
    c.fillStyle = on ? '#ff6b6b' : '#7a1f1f'; dot(c, lx, s.y + 13, 2.4);
    c.strokeStyle = '#ffd45e'; c.lineWidth = 1.2; c.beginPath(); for (let k = 0; k < 3; k++) { const a = tick * 0.4 + k * 2.1; c.moveTo(x + 15 + d * 15, s.y + 20); c.lineTo(x + 15 + d * 15 + Math.cos(a) * 5, s.y + 20 + Math.sin(a) * 2.5); } c.stroke();
    if (s.stun > 0) { c.fillStyle = '#fff'; c.font = 'bold 16px sans-serif'; c.textAlign = 'center'; c.fillText('!', x + 15, s.y - 4); }
  }
  /* crows */
  for (const b of L.bats) {
    if (!b.alive) continue;
    const fl = b.stun > 0 ? 0 : Math.sin(tick * 0.4), cx = b.x + 15, cy = b.y + 9, d = b.vx > 0 ? 1 : -1;
    shadow(c, cx, GROUND * T + 1, 12, 0.12);
    c.save(); c.translate(cx, cy); c.scale(d, 1);
    c.fillStyle = '#15161f'; tri(c, -8, 0, -19, -3, -17, 5);
    c.fillStyle = lin(c, 0, -16, 0, 6, [[0, '#4a4f6e'], [1, '#1a1c28']]);
    c.beginPath(); c.moveTo(-3, -2); c.quadraticCurveTo(-8, -10 - fl * 10, -20, -6 - fl * 12); c.quadraticCurveTo(-12, -2 - fl * 3, -8, 3); c.closePath(); c.fill();
    c.fillStyle = rad(c, -2, -3, 1, 0, 0, 12, [[0, '#5a6088'], [0.6, '#2b2e3d'], [1, '#15161f']]); ell(c, 0, 0, 10.5, 7.2);
    c.fillStyle = rad(c, 6, -5, 0.5, 7, -3.5, 6, [[0, '#5a6088'], [1, '#20222e']]); dot(c, 7, -3.5, 5.4);
    c.fillStyle = lin(c, 0, -14, 0, 4, [[0, '#6a7098'], [1, '#232532']]);
    c.beginPath(); c.moveTo(3, -1); c.quadraticCurveTo(0, -9 - fl * 9, -12, -5 - fl * 12); c.quadraticCurveTo(-5, 0 - fl * 3, -3, 4); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 0.7; c.beginPath(); for (let k = 0; k < 3; k++) { c.moveTo(0 - k * 2, -1); c.lineTo(-4 - k * 3, -4 - fl * (6 + k * 2)); } c.stroke();
    c.fillStyle = lin(c, 0, -5, 0, 0, [[0, '#ffc95e'], [1, '#d97f1e']]); tri(c, 11, -5, 19, -2.4, 11, -0.6);
    c.fillStyle = '#fff'; dot(c, 8.6, -4.6, 2); c.fillStyle = '#111'; dot(c, 9.1, -4.6, 1.05); c.fillStyle = '#fff'; dot(c, 8.8, -5.1, 0.4);
    c.strokeStyle = '#111'; c.lineWidth = 1; c.beginPath(); c.moveTo(6.6, -7.2); c.lineTo(10.6, -6); c.stroke();
    c.restore();
    if (b.stun > 0) { c.fillStyle = '#fff'; c.font = 'bold 16px sans-serif'; c.textAlign = 'center'; c.fillText('!', cx, cy - 16); }
  }
  /* pet */
  let near = false;
  for (const e of L.slimes) if (e.alive && Math.abs(e.x - P.x) < 95 && Math.abs(e.y - P.y) < 70) near = true;
  for (const e of L.bats) if (e.alive && Math.abs(e.x - P.x) < 95 && Math.abs(e.y - P.y) < 70) near = true;
  if (P.ground) shadow(c, P.x + P.w / 2 + P.face * 3, P.y + P.h + 1, 24, 0.28);
  if (!(P.inv > 0 && (tick >> 2) % 2)) {
    const ex = { mood: happyT > 0 ? 'happy' : (near || P.inv > 0) ? 'scared' : 'normal', blink: tick % 170 < 7, talk: talkT > 30,
                 pant: isDog() && P.ground && Math.abs(P.vx) > 3, squash: P.squash || 0, earBack: !P.ground };
    if (rocketT > 0 && (rocketT > 90 || (tick >> 3) % 2)) {
      c.save(); c.translate(P.x + P.w / 2 - P.face * 13, P.y + P.h - 30); c.scale(P.face, 1); c.rotate(-0.25);
      if (keys.jump) { c.fillStyle = rad(c, 0, 20, 1, 0, 22, 14, [[0, 'rgba(255,240,170,.95)'], [0.5, 'rgba(255,140,40,.8)'], [1, 'rgba(255,80,20,0)']]); ell(c, 0, 24 + Math.random() * 3, 6, 13); }
      c.fillStyle = '#c0392b'; tri(c, -9, 14, -4, 4, -4, 14); tri(c, 9, 14, 4, 4, 4, 14);
      c.fillStyle = lin(c, -6, 0, 6, 0, [[0, '#ffffff'], [0.5, '#d7dbe6'], [1, '#8a90a0']]); rr(c, -6, -8, 12, 24, 5);
      c.fillStyle = '#e5484d'; c.beginPath(); c.moveTo(-6, -6); c.quadraticCurveTo(0, -22, 6, -6); c.fill();
      c.fillStyle = '#5db8ff'; dot(c, 0, 2, 3); c.fillStyle = 'rgba(255,255,255,.8)'; dot(c, -1, 1, 1);
      c.restore();
    }
    drawPet(c, P.x + P.w / 2, P.y + P.h, 1.5, P.face, P.run, !P.ground, pet, ex);
  }
  if (talkT > 0) {
    const bx = P.x + P.w / 2 + P.face * 44, by = P.y - 34, txt = isDog() ? 'Woof!' : 'Meow!';
    c.globalAlpha = Math.min(1, talkT / 15);
    c.fillStyle = 'rgba(0,0,0,.2)'; rr(c, bx - 30, by - 11, 62, 25, 11);
    c.fillStyle = '#fff'; rr(c, bx - 31, by - 14, 62, 25, 11); tri(c, bx - P.face * 14, by + 9, bx - P.face * 4, by + 9, bx - P.face * 22, by + 20);
    c.fillStyle = '#23232b'; c.font = 'bold 14px ui-rounded, "Trebuchet MS", sans-serif'; c.textAlign = 'center'; c.fillText(txt, bx, by + 3);
    c.globalAlpha = 1;
  }
  for (const p of parts) {
    c.globalAlpha = Math.min(1, p.life / 20); c.fillStyle = p.col; const r = 2 + (p.life % 7) * 0.3;
    c.beginPath(); c.moveTo(p.x, p.y - r * 2); c.quadraticCurveTo(p.x, p.y, p.x + r * 2, p.y); c.quadraticCurveTo(p.x, p.y, p.x, p.y + r * 2); c.quadraticCurveTo(p.x, p.y, p.x - r * 2, p.y); c.quadraticCurveTo(p.x, p.y, p.x, p.y - r * 2); c.fill();
  }
  c.globalAlpha = 1;
  c.restore();

  drawForeground();
  drawFx();
  drawVignette();
}

function drawHUD() {
  c.font = 'bold 16px ui-rounded, "Trebuchet MS", sans-serif';
  const lbl = `Round ${levelIdx + 1}/3 · ${L.name} · ${theme().label}`;
  c.fillStyle = 'rgba(0,0,0,.4)'; rr(c, 12, 12, 222 + c.measureText(lbl).width, 36, 18);
  for (let i = 0; i < 3; i++) {
    const x = 34 + i * 26, y = 30;
    c.fillStyle = i < lives ? '#ff5d73' : 'rgba(255,255,255,.25)';
    c.beginPath(); c.moveTo(x, y + 8); c.bezierCurveTo(x - 14, y - 2, x - 6, y - 12, x, y - 4); c.bezierCurveTo(x + 6, y - 12, x + 14, y - 2, x, y + 8); c.fill();
  }
  drawFood(c, treatName(), 122, 30, 0.85);
  c.fillStyle = '#fff'; c.font = 'bold 16px ui-rounded, "Trebuchet MS", sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle';
  c.fillText(`${gemCount} / ${L.gems.length}`, 142, 31);
  c.fillText(lbl, 212, 31);
  if (rocketT > 0 || holdT > 40) {
    const k = rocketT > 0 ? rocketT / 480 : holdT / 300, label = rocketT > 0 ? 'Rocket' : 'Hold for rocket';
    c.fillStyle = 'rgba(0,0,0,.4)'; rr(c, 12, 56, 190, 24, 12);
    c.fillStyle = 'rgba(255,255,255,.2)'; rr(c, 110, 63, 82, 10, 5);
    c.fillStyle = rocketT > 0 ? '#ff8a3d' : '#ffd45e'; rr(c, 110, 63, Math.max(6, 82 * k), 10, 5);
    c.fillStyle = '#fff'; c.font = 'bold 12px ui-rounded, "Trebuchet MS", sans-serif'; c.textAlign = 'left'; c.fillText(label, 22, 69);
    c.font = 'bold 16px ui-rounded, "Trebuchet MS", sans-serif';
  }
  if (toast) {
    c.globalAlpha = Math.min(1, toast.life / 25); c.textAlign = 'center';
    const w = c.measureText(toast.text).width + 36;
    c.fillStyle = 'rgba(0,0,0,.6)'; rr(c, VW / 2 - w / 2, 496, w, 34, 17);
    c.fillStyle = '#ffd45e'; c.fillText(toast.text, VW / 2, 514); c.globalAlpha = 1;
  }
  c.textBaseline = 'alphabetic';
  if (flash > 0) { c.fillStyle = `rgba(255,80,80,${flash / 30})`; c.fillRect(0, 0, VW, VH); }
}

function render() {
  const lift = L ? -camY * 0.22 : 0;
  if (lift > 0.5) { c.fillStyle = theme().sky[0]; c.fillRect(0, 0, VW, VH); c.save(); c.translate(0, lift); drawBackground(); c.restore(); } else drawBackground();
  if (L) { drawWorld(); if (state === 'play' && TAGS[envName]) { c.save(); c.translate(0, lift); TAGS[envName](); c.restore(); } drawHUD(); }
}
