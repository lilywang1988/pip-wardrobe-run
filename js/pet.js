/* Paws Run — pet.js
   drawPet(): draws the dog or cat with its breed, fur, clothes, hat and expression. */
'use strict';

/* pet: origin at feet centre, facing right. ex = { mood, blink, talk, pant, squash, earBack } */
function drawPet(g, x, y, s, face, run, air, o, ex) {
  ex = ex || {};
  const b = BREEDS[o.species][o.breed], cat = o.species === 'cat';
  const fur = o.fur, dk = shade(fur, 0.58), md = shade(fur, 0.8), lt = tint(fur, 0.32), vlt = tint(fur, 0.62);
  const white = '#fbf7ef', point = '#3a2a22';
  const bob = air ? 0 : Math.abs(Math.sin(run)) * 0.9;
  const top = -(b.leg + b.bh) - bob, hx = b.bl / 2 + 2.5, hy = top - 3.2, hr = cat ? 8 : 8.6;
  const sw = air ? 0.95 : Math.sin(run) * 0.8, wag = Math.sin(tick * 0.3) * 3, sq = ex.squash || 0;
  const pts = b.mark === 'points', socks = b.mark === 'chest' || b.mark === 'mask';
  const mood = ex.mood || 'normal';
  const strokes = (n, col, lw, fn) => { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); for (let i = 0; i < n; i++) fn(i); g.stroke(); };
  g.save(); g.translate(x, y); g.scale(s * face * (1 + sq), s * (1 - sq)); g.lineCap = 'round'; g.lineJoin = 'round';

  /* cape, behind everything */
  if (o.clothes === 'cape') {
    const cx0 = b.bl / 2 - 3, cx1 = -b.bl / 2 - 10;
    g.fillStyle = lin(g, cx0, top, cx1, top + 8, [[0, tint(o.clothesCol, 0.2)], [0.5, o.clothesCol], [1, shade(o.clothesCol, 0.6)]]);
    g.beginPath(); g.moveTo(cx0, top - 1.5); g.quadraticCurveTo(-2, top - 5 + wag * 0.3, cx1, top - 3 + wag * 0.7);
    g.quadraticCurveTo(cx1 + 3, top + 5, cx1 + 2, top + 11 + wag * 0.5); g.quadraticCurveTo(-2, top + 6, cx0 - 3, top + 6); g.closePath(); g.fill();
    g.strokeStyle = shade(o.clothesCol, 0.5); g.lineWidth = 0.6; g.beginPath(); g.moveTo(cx0 - 4, top + 1); g.quadraticCurveTo(-4, top + 1, cx1 + 2, top + 4 + wag * 0.5); g.stroke();
  }

  /* tail */
  const tx = -b.bl / 2 + 1.5, ty = top + 4, tcol = pts ? point : fur;
  const tailStroke = (w, path) => {
    g.strokeStyle = pts ? '#1d1410' : dk; g.lineWidth = w + 1.3; g.beginPath(); path(); g.stroke();
    g.strokeStyle = tcol; g.lineWidth = w; g.beginPath(); path(); g.stroke();
    g.save(); g.translate(0.4, -w * 0.22); g.strokeStyle = pts ? '#5a4438' : lt; g.lineWidth = w * 0.3; g.beginPath(); path(); g.stroke(); g.restore();
  };
  if (b.tail === 'long') tailStroke(4.2, () => { g.moveTo(tx, ty); g.quadraticCurveTo(tx - 8, ty - 1, tx - 11, ty - 11 + wag); });
  else if (b.tail === 'curl') { tailStroke(5, () => g.arc(tx - 3, ty - 6.5, 5, 0.7, 5.3)); strokes(5, vlt, 0.7, i => { const a = 1.4 + i * 0.8; g.moveTo(tx - 3 + Math.cos(a) * 5, ty - 6.5 + Math.sin(a) * 5); g.lineTo(tx - 3 + Math.cos(a) * 8, ty - 6.5 + Math.sin(a) * 8); }); }
  else if (b.tail === 'stub') { g.fillStyle = dk; dot(g, tx - 1.5, ty - 0.5, 3.9); g.fillStyle = rad(g, tx - 2.5, ty - 2, 0.5, tx - 1.5, ty - 0.5, 3.6, [[0, lt], [1, fur]]); dot(g, tx - 1.5, ty - 0.5, 3.2); }
  else if (b.tail === 'pom') {
    tailStroke(2.4, () => { g.moveTo(tx, ty); g.lineTo(tx - 6, ty - 8 + wag * 0.5); });
    const px = tx - 7.5, py = ty - 10.5 + wag * 0.5;
    g.fillStyle = dk; dot(g, px, py, 5); g.fillStyle = rad(g, px - 1.5, py - 1.5, 0.5, px, py, 4.6, [[0, vlt], [0.6, fur], [1, md]]);
    for (let i = 0; i < 6; i++) dot(g, px + Math.cos(i * 1.05) * 2.2, py + Math.sin(i * 1.05) * 2.2, 2.6);
  } else {
    const path = () => { g.moveTo(tx, ty); g.bezierCurveTo(tx - 11, ty + 3, tx - 13, ty - 9, tx - 7 + wag * 0.6, ty - 18); };
    if (b.tail === 'bushy') {
      tailStroke(8, path);
      strokes(9, md, 0.8, i => { const t = i / 8, px = tx - 11 * t * (1 - t) * 3.2 - 7 * t * t, py = ty - 18 * t * t - 2 * t; g.moveTo(px, py); g.lineTo(px - 4.6 + hash(i) * 1.5, py - 2 - hash(i + 4) * 2); });
    } else {
      tailStroke(3.6, path);
      if (b.mark === 'stripes') strokes(4, dk, 1.3, i => { const t = 0.3 + i * 0.2, px = tx - 11 * t * (1 - t) * 3.2 - 7 * t * t, py = ty - 18 * t * t - 2 * t; g.moveTo(px - 1.6, py - 0.6); g.lineTo(px + 1.6, py + 0.6); });
    }
  }

  /* legs */
  const leg = (lx, a, near) => {
    const Ln = b.leg + 1.5 + bob;
    g.save(); g.translate(lx, -Ln); g.rotate(a);
    g.fillStyle = near ? lin(g, -2.6, 0, 2.6, 0, [[0, md], [0.4, lt], [1, md]]) : dk; rr(g, -2.5, 0, 5, Ln, 2.4);
    if (pts) { g.fillStyle = near ? point : '#241812'; rr(g, -2.5, Ln * 0.45, 5, Ln * 0.55, 2.4); }
    if (near && !b.fluff) strokes(3, md, 0.6, i => { g.moveTo(-1.6 + i * 1.5, 1.5 + i); g.lineTo(-2 + i * 1.5, 3.4 + i); });
    if (b.fluff && !cat) { g.fillStyle = near ? rad(g, -1, Ln - 5.5, 0.5, 0, Ln - 4.5, 3.8, [[0, vlt], [1, md]]) : dk; dot(g, 0, Ln - 4.5, 3.7); }
    g.fillStyle = pts ? (near ? point : '#241812') : socks ? (near ? white : '#d6cfc0') : (near ? lt : md);
    ell(g, 0.9, Ln - 1.3, 3.5, 2.2);
    if (near) { g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 0.5; g.beginPath(); g.moveTo(0.9, Ln - 2.2); g.lineTo(0.9, Ln + 0.5); g.moveTo(2.5, Ln - 2); g.lineTo(2.6, Ln + 0.2); g.stroke(); }
    g.restore();
  };
  const backX = -b.bl / 2 + 4, frontX = b.bl / 2 - 4;
  leg(backX + 2.4, -sw, false); leg(frontX + 2.4, sw, false);

  /* body */
  const bx = -b.bl / 2, bw = b.bl, bh = b.bh;
  g.fillStyle = dk; rr(g, bx - 0.6, top - 0.6, bw + 1.2, bh + 1.2, bh / 2 + 0.6);
  g.fillStyle = rad(g, bx + bw * 0.4, top + 1.5, 1, bx + bw * 0.5, top + bh * 0.55, bw * 0.72, [[0, lt], [0.5, fur], [1, dk]]);
  rr(g, bx, top, bw, bh, bh / 2);
  if (b.mark === 'mask') { g.fillStyle = shade(fur, 0.7); g.globalAlpha = 0.55; rr(g, bx + 2, top, bw - 5, bh * 0.45, bh / 2); g.globalAlpha = 1; }
  g.fillStyle = socks ? white : vlt; g.globalAlpha = socks ? 0.95 : 0.4; ell(g, bx + bw * 0.55, top + bh - 2, bw * 0.34, 2.6); g.globalAlpha = 1;
  if (socks) { g.fillStyle = white; ell(g, bx + bw - 5, top + bh - 4, 5.6, 4.6, -0.4); }
  if (b.fluff) {
    for (let i = 0; i < 6; i++) { const px = bx + 2.5 + i * (bw - 5) / 5, py = top + 1 + hash(i) * 1.2; g.fillStyle = dk; dot(g, px, py, 4.1); g.fillStyle = rad(g, px - 1, py - 1.5, 0.5, px, py, 3.8, [[0, vlt], [0.7, fur], [1, md]]); dot(g, px, py, 3.6); }
    for (let i = 0; i < 4; i++) { const px = bx + 4 + i * (bw - 8) / 3, py = top + bh - 0.5; g.fillStyle = md; dot(g, px, py, 3.2); }
    strokes(7, dk, 0.55, i => { const px = bx + 3 + i * (bw - 6) / 6, py = top + 4 + hash(i + 3) * 4; g.moveTo(px, py); g.arc(px - 1, py, 1.1, 0, 2.6); });
  } else {
    strokes(9, md, 0.6, i => { const px = bx + 4 + i * (bw - 7) / 8, py = top + 0.5; g.moveTo(px, py + 1); g.lineTo(px - 1.7 - hash(i) * 0.6, py - 0.7 - hash(i + 7) * 0.6); });
    g.globalAlpha = 0.55; strokes(7, md, 0.5, i => { const px = bx + 4 + hash(i * 3 + 1) * (bw - 8), py = top + 3 + hash(i * 5 + 2) * (bh - 6); g.moveTo(px, py); g.lineTo(px - 1.8, py + 0.5); }); g.globalAlpha = 1;
    g.globalAlpha = 0.7; strokes(5, vlt, 0.5, i => { const px = bx + 5 + hash(i * 7 + 5) * (bw - 10), py = top + 1.8 + hash(i * 2 + 9) * 2.5; g.moveTo(px, py); g.lineTo(px - 1.6, py + 0.3); }); g.globalAlpha = 1;
    strokes(4, socks ? '#e2dccf' : md, 0.7, i => { const px = bx + bw - 3.5 - i * 1.5, py = top + bh - 2.2 + i * 0.3; g.moveTo(px, py); g.lineTo(px - 0.6, py + 2.6); });
  }
  if (b.mark === 'stripes') {
    g.strokeStyle = dk; g.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) { const sx = bx + 4.5 + i * 3.4; g.beginPath(); g.moveTo(sx, top + 0.3); g.quadraticCurveTo(sx - 1.6, top + 3, sx - 0.6, top + 5.8); g.stroke(); }
  }

  /* sweater */
  if (o.clothes === 'sweater') {
    const sx = bx + 3.5, sw2 = bw - 6.5, col = o.clothesCol;
    g.fillStyle = shade(col, 0.55); rr(g, sx - 0.5, top - 1.4, sw2 + 1, bh + 2.4, 4.5);
    g.fillStyle = lin(g, 0, top - 1, 0, top + bh + 1, [[0, tint(col, 0.3)], [0.45, col], [1, shade(col, 0.62)]]); rr(g, sx, top - 0.9, sw2, bh + 1.4, 4);
    g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 0.5; g.beginPath(); for (let i = 1; i < sw2 / 1.7; i++) { g.moveTo(sx + i * 1.7, top - 0.4); g.lineTo(sx + i * 1.7, top + bh); } g.stroke();
    g.fillStyle = tint(col, 0.55); g.fillRect(sx, top + bh / 2 - 1.3, sw2, 2.6);
    g.fillStyle = shade(col, 0.72); rr(g, sx + sw2 - 3, top - 1.6, 3.4, bh + 2.8, 1.6); rr(g, sx - 0.4, top - 1.2, 2.6, bh + 2, 1.3);
  }

  leg(backX, sw, true); leg(frontX, -sw, true);

  /* neck */
  g.fillStyle = rad(g, hx - 5, top - 1, 1, hx - 4, top + 2, 7, [[0, lt], [1, fur]]); ell(g, hx - 4.5, top + 1.5, 5.2, 5.6, 0.5);
  if (socks) { g.fillStyle = white; ell(g, hx - 2.2, top + 3.6, 3.6, 4.2, 0.3); }
  if (!b.fluff) strokes(4, md, 0.6, i => { g.moveTo(hx - 6.5 + i * 1.3, top - 1 + i * 0.8); g.lineTo(hx - 7.8 + i * 1.3, top + 1 + i * 0.8); });

  /* ears (far ear first) */
  const earRot = ex.earBack ? -0.35 : Math.sin(run * 0.5) * 0.04;
  const catEar = (ox, near) => {
    g.save(); g.translate(hx + ox, hy - 5.2); g.rotate(earRot * (near ? 1 : 0.7));
    g.fillStyle = pts ? (near ? point : '#1d1410') : (near ? md : dk);
    g.beginPath(); g.moveTo(-3.6, 1.5); g.quadraticCurveTo(-2.6, -6, -0.4, -9.2); g.quadraticCurveTo(2.8, -5, 3.8, 1.8); g.closePath(); g.fill();
    if (near) { g.fillStyle = lin(g, 0, -7, 0, 1, [[0, '#f9c3cf'], [1, '#e08ea4']]); g.beginPath(); g.moveTo(-1.6, 0.6); g.quadraticCurveTo(-1.2, -4.4, -0.1, -6.6); g.quadraticCurveTo(1.8, -3.6, 2.2, 0.8); g.closePath(); g.fill();
      strokes(3, vlt, 0.5, i => { g.moveTo(-1.6 + i * 0.9, 0.8); g.lineTo(-0.9 + i * 0.8, -2.2 + i * 0.4); }); }
    g.restore();
  };
  const dogEar = near => {
    if (b.ear === 'flop') {
      g.save(); g.translate(hx - 4.6 + (near ? 0 : 5), hy - 5.4); g.rotate(0.28 + (ex.earBack ? 0.7 : 0) + sw * 0.08);
      g.fillStyle = shade(fur, 0.45); ell(g, 0, 5.4, 4.3, 7.9);
      g.fillStyle = near ? lin(g, -4, 0, 4, 0, [[0, shade(fur, 0.52)], [0.5, shade(fur, 0.72)], [1, shade(fur, 0.55)]]) : shade(fur, 0.5); ell(g, 0, 5.4, 3.7, 7.3);
      if (near) strokes(4, shade(fur, 0.45), 0.55, i => { g.moveTo(-1.8 + i * 1.2, 4 + i); g.lineTo(-2 + i * 1.2, 7.5 + i * 0.8); });
      g.restore();
    } else if (b.ear === 'pom') {
      const px = hx - 7.6 + (near ? 0 : 5), py = hy + 3;
      g.fillStyle = dk; ell(g, px, py, 4.6, 6.2); g.fillStyle = near ? rad(g, px - 1.5, py - 2.5, 0.5, px, py, 6, [[0, vlt], [0.6, fur], [1, md]]) : md;
      for (let i = 0; i < 6; i++) dot(g, px + Math.cos(i * 1.05) * 1.7, py + Math.sin(i * 1.05) * 3.2, 2.6);
    } else {
      const big = b.ear === 'big', hgt = big ? 12.5 : 10, wd = big ? 4.6 : 3.6;
      g.save(); g.translate(hx - 3.4 + (near ? 0 : 5.2), hy - 5.6); g.rotate(earRot - (near ? 0.12 : -0.1));
      g.fillStyle = near ? md : dk; g.beginPath(); g.moveTo(-wd, 2); g.quadraticCurveTo(-wd * 0.6, -hgt * 0.6, 0, -hgt); g.quadraticCurveTo(wd * 0.9, -hgt * 0.5, wd, 2.4); g.closePath(); g.fill();
      if (near) { g.fillStyle = lin(g, 0, -hgt, 0, 2, [[0, '#f6bac6'], [1, '#d98b9c']]); g.beginPath(); g.moveTo(-wd * 0.5, 1); g.quadraticCurveTo(-wd * 0.3, -hgt * 0.5, 0.1, -hgt * 0.76); g.quadraticCurveTo(wd * 0.5, -hgt * 0.4, wd * 0.55, 1.2); g.closePath(); g.fill(); }
      g.restore();
    }
  };
  if (cat) catEar(4.6, false); else dogEar(false);

  /* head */
  g.fillStyle = dk; dot(g, hx, hy, hr + 0.6);
  if (cat) { g.fillStyle = dk; tri(g, hx - hr - 2.6, hy + 3.6, hx - hr + 2, hy - 0.5, hx - hr + 3.4, hy + 5.6); }
  g.fillStyle = rad(g, hx - 2.6, hy - 3.4, 1, hx, hy, hr * 1.15, [[0, vlt], [0.35, lt], [0.7, fur], [1, md]]); dot(g, hx, hy, hr);
  if (cat) { g.fillStyle = fur; tri(g, hx - hr - 1.8, hy + 3.4, hx - hr + 2, hy, hx - hr + 3.2, hy + 5); tri(g, hx - hr - 0.6, hy + 5.6, hx - hr + 2.4, hy + 2.4, hx - hr + 4.4, hy + 6.6); }
  if (b.fluff && !cat) { for (const [dx, dy, r] of [[-3.5, -7, 4], [0.5, -8.6, 4.6], [4.2, -6.8, 3.6]]) { g.fillStyle = dk; dot(g, hx + dx, hy + dy, r + 0.5); g.fillStyle = rad(g, hx + dx - 1, hy + dy - 1.5, 0.5, hx + dx, hy + dy, r, [[0, vlt], [0.7, fur], [1, md]]); dot(g, hx + dx, hy + dy, r); } }
  if (b.fluff && cat) { for (const [dx, dy, r] of [[-6.5, 3.5, 3.6], [-4, 6.2, 3.4], [0, 7.4, 3.2], [4, 6.6, 2.8]]) { g.fillStyle = rad(g, hx + dx - 1, hy + dy - 1, 0.5, hx + dx, hy + dy, r, [[0, vlt], [1, fur]]); dot(g, hx + dx, hy + dy, r); } }
  if (b.mark === 'mask') {
    g.fillStyle = shade(fur, 0.68); g.beginPath(); g.arc(hx, hy, hr, Math.PI * 1.02, Math.PI * 1.98); g.quadraticCurveTo(hx + 3.4, hy - 4.6, hx + 2.6, hy - 0.6); g.quadraticCurveTo(hx, hy - 4.2, hx - 2.6, hy - 2.2); g.quadraticCurveTo(hx - 5, hy - 3.6, hx - hr, hy - 0.4); g.fill();
    g.fillStyle = white; ell(g, hx + 2, hy + 3.2, 6.6, 4.6, 0.1); dot(g, hx - 0.4, hy - 4.8, 1.1); dot(g, hx + 5.2, hy - 4.8, 0.9);
  }
  if (pts) { g.fillStyle = rad(g, hx + 4, hy + 1.6, 0.5, hx + 3.4, hy + 1.4, 7.6, [[0, '#2a1c16'], [0.55, 'rgba(58,42,34,.85)'], [1, 'rgba(58,42,34,0)']]); dot(g, hx, hy, hr); }
  if (b.mark === 'chest') { g.fillStyle = white; if (cat) { ell(g, hx + 4.4, hy + 3.6, 4.4, 3.6); tri(g, hx + 2.6, hy + 1, hx + 3.6, hy - 5.4, hx + 5, hy + 1); } else { g.beginPath(); g.moveTo(hx + 1.6, hy + 2); g.quadraticCurveTo(hx + 2.4, hy - 4, hx + 3.4, hy - 8); g.quadraticCurveTo(hx + 4.6, hy - 3, hx + 5.6, hy + 2); g.fill(); } }
  if (b.mark === 'stripes') { g.strokeStyle = dk; g.lineWidth = 1.1; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(hx - 1.6 + i * 2.2, hy - 7.6); g.lineTo(hx - 1.2 + i * 2, hy - 4.8); g.stroke(); } g.beginPath(); g.moveTo(hx - 7, hy + 0.6); g.lineTo(hx - 3.8, hy + 1.2); g.moveTo(hx - 6.6, hy + 3); g.lineTo(hx - 3.8, hy + 3); g.stroke(); }
  if (!b.fluff && !pts) { strokes(5, md, 0.55, i => { g.moveTo(hx - 6 + i * 1.3, hy - 5.4 + hash(i) * 1.2); g.lineTo(hx - 7.2 + i * 1.3, hy - 3.6 + hash(i) * 1.2); }); strokes(4, vlt, 0.5, i => { g.moveTo(hx - 3.2 + i * 1.5, hy - 6.6); g.lineTo(hx - 4 + i * 1.5, hy - 5.2); }); }

  /* muzzle and mouth */
  const openMouth = ex.talk || ex.pant || mood === 'scared', smile = mood === 'happy';
  if (cat) {
    const mc = (b.mark === 'chest') ? white : pts ? '#4a362c' : vlt;
    if (openMouth) { g.fillStyle = '#6e1f30'; ell(g, hx + 6, hy + 5.4, ex.talk ? 2.4 : 1.7, ex.talk ? 2.9 : 1.9); g.fillStyle = '#f28aa2'; ell(g, hx + 6, hy + 6.6, 1.4, 1); g.fillStyle = '#fff'; tri(g, hx + 4.6, hy + 3.8, hx + 5.4, hy + 3.8, hx + 5, hy + 5.2); tri(g, hx + 6.8, hy + 3.8, hx + 7.6, hy + 3.8, hx + 7.2, hy + 5.2); }
    g.fillStyle = mc; dot(g, hx + 4.3, hy + 3.2, 2.5); dot(g, hx + 7.6, hy + 3.1, 2.3);
    g.fillStyle = lin(g, 0, hy + 0.6, 0, hy + 2.6, [[0, '#f59ab0'], [1, '#d4607c']]); g.beginPath(); g.moveTo(hx + 4.8, hy + 0.9); g.lineTo(hx + 7.4, hy + 0.9); g.quadraticCurveTo(hx + 6.3, hy + 3, hx + 6.1, hy + 2.7); g.closePath(); g.fill();
    g.strokeStyle = pts ? '#c9b8a8' : '#5a3a34'; g.lineWidth = 0.6; g.beginPath();
    if (!openMouth) { g.moveTo(hx + 6.1, hy + 2.6); g.lineTo(hx + 6.1, hy + 3.6); g.quadraticCurveTo(hx + 4.8, hy + (smile ? 5.6 : 4.8), hx + 3.4, hy + (smile ? 3.8 : 4.2)); g.moveTo(hx + 6.1, hy + 3.6); g.quadraticCurveTo(hx + 7.6, hy + (smile ? 5.6 : 4.8), hx + 8.8, hy + (smile ? 3.8 : 4.2)); }
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 0.45; g.beginPath();
    for (let i = 0; i < 3; i++) { g.moveTo(hx + 8.6, hy + 2.6 + i * 0.8); g.lineTo(hx + 15, hy + 0.6 + i * 2.2); g.moveTo(hx + 3.4, hy + 2.8 + i * 0.8); g.lineTo(hx - 2.4, hy + 2 + i * 2); }
    g.stroke();
  } else {
    const mc = socks ? white : vlt;
    if (openMouth) {
      g.fillStyle = '#6e1f30'; g.beginPath(); g.moveTo(hx + 3, hy + 4.6); g.quadraticCurveTo(hx + 7, hy + (ex.talk ? 11.5 : 9.5), hx + 11, hy + 5); g.closePath(); g.fill();
      g.fillStyle = lin(g, 0, hy + 5, 0, hy + 11, [[0, '#ff9db2'], [1, '#e8607e']]);
      if (ex.pant && !ex.talk) { rr(g, hx + 6.2, hy + 5.6, 3.6, 6 + Math.sin(tick * 0.5) * 0.8, 1.8); g.strokeStyle = '#c94a68'; g.lineWidth = 0.4; g.beginPath(); g.moveTo(hx + 8, hy + 6.4); g.lineTo(hx + 8, hy + 10); g.stroke(); }
      else ell(g, hx + 7.2, hy + 7.6, 2.4, 1.5);
    }
    g.fillStyle = shade(fur, 0.6); ell(g, hx + 6.8, hy + 2.9, 6.6, 4.7);
    g.fillStyle = lin(g, 0, hy - 1.5, 0, hy + 7, [[0, '#ffffff'], [0.35, mc], [1, socks ? '#d9d2c2' : lt]]); ell(g, hx + 6.8, hy + 2.6, 6.1, 4.2);
    strokes(4, 'rgba(0,0,0,.18)', 0.5, i => { g.moveTo(hx + 4.4 + (i % 2) * 2, hy + 3 + (i >> 1) * 1.4); g.lineTo(hx + 4.5 + (i % 2) * 2, hy + 3.1 + (i >> 1) * 1.4); });
    g.fillStyle = '#17171d'; g.beginPath(); g.moveTo(hx + 9.6, hy - 0.4); g.quadraticCurveTo(hx + 13.8, hy - 1, hx + 13.4, hy + 1.6); g.quadraticCurveTo(hx + 11.6, hy + 3.4, hx + 9.9, hy + 1.6); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.8)'; ell(g, hx + 11.6, hy + 0.2, 1.1, 0.5, -0.2);
    g.strokeStyle = '#3a2620'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(hx + 11.3, hy + 2.8); g.lineTo(hx + 11.1, hy + 4.4);
    if (!openMouth) g.quadraticCurveTo(hx + 7.4, hy + (smile ? 8.2 : 6.4), hx + 3.2, hy + (smile ? 4.2 : 5)); g.stroke();
  }

  /* eyes */
  const iris = cat ? (pts ? '#4fb4f2' : b.fluff ? '#f2b63a' : b.mark === 'chest' ? '#c8dc4a' : '#8fd14f') : '#6b3d1c';
  const eye = (ex0, ey0, k) => {
    g.save(); g.translate(ex0, ey0); g.scale(k, 1);
    if (mood === 'happy') { g.strokeStyle = '#1b1410'; g.lineWidth = 1.2; g.beginPath(); g.arc(0, 1.2, 2.3, Math.PI * 1.12, Math.PI * 1.88); g.stroke(); }
    else if (ex.blink) { g.strokeStyle = '#1b1410'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(-2.2, 0.4); g.quadraticCurveTo(0, 1.4, 2.2, 0.4); g.stroke(); }
    else {
      const wide = mood === 'scared', ry = wide ? 3.3 : 2.8;
      g.fillStyle = '#1b1410'; ell(g, 0, 0, 2.7, ry + 0.3);
      if (cat) {
        g.fillStyle = rad(g, 0, 0.6, 0.3, 0, 0, 2.6, [[0, tint(iris, 0.45)], [0.7, iris], [1, shade(iris, 0.55)]]); ell(g, 0, 0, 2.3, ry - 0.1);
        g.fillStyle = '#0b0b10'; ell(g, 0, 0, wide ? 0.55 : air ? 1.5 : 0.85, wide ? 1.3 : ry - 0.6);
      } else if (wide) { g.fillStyle = '#fff'; ell(g, 0, 0, 2.3, ry - 0.1); g.fillStyle = '#0b0806'; dot(g, 0.3, 0.2, 1.1); }
      else {
        g.fillStyle = '#fff'; ell(g, 0, 0, 2.3, ry - 0.1);
        g.fillStyle = rad(g, 0.3, 0.8, 0.3, 0.3, 0.2, 2.3, [[0, tint(iris, 0.3)], [0.8, iris], [1, shade(iris, 0.5)]]); ell(g, 0.3, 0.2, 2, 2.4);
        g.fillStyle = '#0b0806'; dot(g, 0.4, 0.2, 1.25);
      }
      g.fillStyle = '#fff'; dot(g, -0.7, -1.1, 0.85); dot(g, 0.9, 1, 0.4);
    }
    g.restore();
  };
  const e1x = hx + 0.4, e2x = hx + 6, ey = hy - 1.6;
  eye(e1x, ey, 1); eye(e2x, ey - 0.2, 0.72);
  g.strokeStyle = '#1b1410';
  if (o.gender === 'girl') {
    g.lineWidth = 0.7; g.beginPath();
    for (const [ex0, k] of [[e1x, 1], [e2x, 0.72]]) for (let i = 0; i < 3; i++) { g.moveTo(ex0 - (2.4 - i * 0.9) * k, ey - 2.2 - i * 0.5); g.lineTo(ex0 - (3.6 - i * 0.8) * k, ey - 3.8 - i * 0.7); }
    g.stroke();
    g.fillStyle = 'rgba(255,110,150,.5)'; ell(g, hx - 3, hy + 3, 2.2, 1.4);
  } else {
    g.lineWidth = 1.5; g.beginPath();
    const up = mood === 'scared' ? -1.4 : 0;
    g.moveTo(e1x - 2.4, ey - 4 + up * 0.3); g.lineTo(e1x + 2, ey - 4.6 + up); g.moveTo(e2x - 1.4, ey - 4.7 + up); g.lineTo(e2x + 1.6, ey - 4.3 + up * 0.3); g.stroke();
  }
  if (mood === 'happy') { g.fillStyle = 'rgba(255,110,150,.45)'; ell(g, hx - 2.6, hy + 3, 2.4, 1.5); }
  if (mood === 'scared') { g.fillStyle = 'rgba(140,210,255,.9)'; g.beginPath(); g.moveTo(hx - 5, hy - 7); g.quadraticCurveTo(hx - 7.4, hy - 3.6, hx - 5, hy - 3); g.quadraticCurveTo(hx - 2.8, hy - 3.6, hx - 5, hy - 7); g.fill(); }

  if (cat) catEar(-2.6, true); else dogEar(true);

  /* girl's bow */
  if (o.gender === 'girl' && o.hat === 'none') {
    const bx0 = hx - 1.5, by0 = hy - hr + 0.6;
    g.fillStyle = lin(g, 0, by0 - 4, 0, by0 + 4, [[0, '#ff9cc2'], [1, '#e2408a']]);
    g.beginPath(); g.moveTo(bx0, by0); g.quadraticCurveTo(bx0 - 6, by0 - 6, bx0 - 6.4, by0); g.quadraticCurveTo(bx0 - 6, by0 + 5, bx0, by0); g.quadraticCurveTo(bx0 + 6, by0 - 6, bx0 + 6.4, by0); g.quadraticCurveTo(bx0 + 6, by0 + 5, bx0, by0); g.fill();
    g.fillStyle = '#c22f76'; dot(g, bx0, by0, 1.7); g.fillStyle = 'rgba(255,255,255,.6)'; dot(g, bx0 - 3.6, by0 - 1.4, 0.8);
  }
  /* bandana / cape clasp */
  if (o.clothes === 'bandana') {
    const col = o.clothesCol, nx = hx - 4.5, ny = top + 2;
    g.fillStyle = lin(g, nx - 3, ny, nx + 6, ny + 9, [[0, tint(col, 0.3)], [0.5, col], [1, shade(col, 0.6)]]);
    g.beginPath(); g.moveTo(nx - 3.4, ny - 0.5); g.lineTo(nx + 6.6, ny + 2.6); g.quadraticCurveTo(nx + 3.4, ny + 6, nx + 1, ny + 10.4); g.quadraticCurveTo(nx - 1.6, ny + 5, nx - 3.4, ny - 0.5); g.fill();
    g.fillStyle = 'rgba(255,255,255,.75)'; dot(g, nx + 0.6, ny + 3.4, 0.7); dot(g, nx + 3.2, ny + 4, 0.7); dot(g, nx + 1.4, ny + 6.6, 0.7);
    g.fillStyle = shade(col, 0.7); g.save(); g.translate(nx + 1.4, ny + 0.8); g.rotate(0.32); rr(g, -5.4, -1.5, 10.8, 3, 1.5); g.restore();
  }
  if (o.clothes === 'cape') { g.fillStyle = shade(o.clothesCol, 0.7); g.save(); g.translate(hx - 3.2, top + 2.6); g.rotate(0.32); rr(g, -5, -1.5, 10, 3, 1.5); g.restore(); g.fillStyle = '#ffd45e'; dot(g, hx - 0.6, top + 3.6, 1.6); g.fillStyle = '#fff6c9'; dot(g, hx - 1, top + 3.2, 0.6); }
  if (o.clothes === 'sweater') { g.fillStyle = shade(o.clothesCol, 0.72); g.save(); g.translate(hx - 3.6, top + 2.6); g.rotate(0.32); rr(g, -5, -1.6, 10, 3.2, 1.6); g.restore(); }

  /* hat */
  const ht = hy - hr + 1.2, hc = o.hatCol;
  if (o.hat === 'cap') {
    g.fillStyle = shade(hc, 0.5); g.beginPath(); g.arc(hx - 0.5, ht + 3.4, 7.8, Math.PI, 0); g.fill();
    g.fillStyle = rad(g, hx - 3, ht - 2, 1, hx - 0.5, ht + 3, 8, [[0, tint(hc, 0.45)], [0.6, hc], [1, shade(hc, 0.65)]]); g.beginPath(); g.arc(hx - 0.5, ht + 3.4, 7.2, Math.PI, 0); g.fill();
    g.fillStyle = lin(g, 0, ht + 1, 0, ht + 5, [[0, shade(hc, 0.85)], [1, shade(hc, 0.5)]]); g.beginPath(); g.moveTo(hx + 1, ht + 1.4); g.quadraticCurveTo(hx + 9, ht + 0.6, hx + 13, ht + 3.6); g.quadraticCurveTo(hx + 8, ht + 4, hx + 1, ht + 4); g.fill();
    g.fillStyle = tint(hc, 0.6); dot(g, hx - 0.5, ht - 3.6, 1.1);
  } else if (o.hat === 'party') {
    g.fillStyle = lin(g, hx - 5, 0, hx + 5, 0, [[0, tint(hc, 0.35)], [0.5, hc], [1, shade(hc, 0.6)]]); tri(g, hx - 5.6, ht + 3, hx + 5.2, ht + 3, hx - 1, ht - 12.5);
    g.save(); g.beginPath(); g.moveTo(hx - 5.6, ht + 3); g.lineTo(hx + 5.2, ht + 3); g.lineTo(hx - 1, ht - 12.5); g.clip();
    g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.3; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(hx - 8, ht - 1 - i * 4.5); g.lineTo(hx + 7, ht + 2.5 - i * 4.5); g.stroke(); } g.restore();
    g.fillStyle = rad(g, hx - 1.8, ht - 13.8, 0.3, hx - 1, ht - 13, 2.8, [[0, '#fff'], [1, '#d8d8e6']]); dot(g, hx - 1, ht - 13, 2.6);
    g.fillStyle = shade(hc, 0.55); rr(g, hx - 6, ht + 1.8, 11.6, 2, 1);
  } else if (o.hat === 'crown') {
    g.fillStyle = lin(g, hx - 7, 0, hx + 7, 0, [[0, tint(hc, 0.45)], [0.5, hc], [1, shade(hc, 0.55)]]);
    g.beginPath(); g.moveTo(hx - 6.6, ht + 3.4); g.lineTo(hx - 7.2, ht - 6.4); g.lineTo(hx - 3.4, ht - 2); g.lineTo(hx - 0.2, ht - 8); g.lineTo(hx + 3, ht - 2); g.lineTo(hx + 6.8, ht - 6.4); g.lineTo(hx + 6.2, ht + 3.4); g.closePath(); g.fill();
    g.fillStyle = shade(hc, 0.6); rr(g, hx - 6.8, ht + 1.4, 13.2, 2.2, 1);
    g.fillStyle = '#ff5d73'; dot(g, hx - 0.2, ht - 1, 1.5); g.fillStyle = '#5cc3f2'; dot(g, hx - 4, ht + 0.2, 1); dot(g, hx + 3.6, ht + 0.2, 1);
    g.fillStyle = '#fff'; dot(g, hx - 0.6, ht - 1.5, 0.5); dot(g, hx - 7.2, ht - 6.6, 1); dot(g, hx - 0.2, ht - 8.2, 1); dot(g, hx + 6.8, ht - 6.6, 1);
  }
  g.restore();
}
