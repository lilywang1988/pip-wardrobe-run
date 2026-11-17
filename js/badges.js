/* Paws Run — badges.js
   Progress per world, the player's name and email, badge and certificate pictures, and saving them as files. */
'use strict';

/* ---------- player, progress and badges ---------- */
const WORLD_ORDER = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
let prog = {}, player = { name:'', email:'' };
const done = (w, i) => !!(prog[w] && prog[w].r && prog[w].r[i]);
const hasBadge = w => [0, 1, 2].every(i => done(w, i));
const unl = w => done(w, 0) ? (done(w, 1) ? 2 : 1) : 0;
const badgeCount = () => WORLD_ORDER.filter(hasBadge).length;
function markDone(w, i) {
  if (!prog[w]) prog[w] = { r:[0, 0, 0] };
  const had = hasBadge(w); prog[w].r[i] = 1;
  if (!had && hasBadge(w)) { prog[w].date = new Date().toISOString().slice(0, 10); return true; }
  return false;
}
function niceDate(d) { try { return new Date(d + 'T12:00:00').toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' }); } catch (e) { return d || ''; } }
function fitText(g, text, maxW, size, weight) {
  let s = size; do { g.font = `${weight || 'bold'} ${s}px ui-rounded, "Trebuchet MS", "Segoe UI", sans-serif`; s -= 1; } while (g.measureText(text).width > maxW && s > 8);
}
function drawAvatar(g, x, y, r) {
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
  g.fillStyle = lin(g, 0, y - r, 0, y + r, [[0, '#3a4a8a'], [1, '#1d2233']]); g.fillRect(x - r, y - r, r * 2, r * 2);
  drawPet(g, x - r * 0.12, y + r * 0.72, r / 24, 1, 0.6, false, pet, { mood:'happy' });
  g.restore();
  g.strokeStyle = '#ffd45e'; g.lineWidth = Math.max(2, r * 0.09); g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
}
function star5(g, x, y, r) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.closePath(); g.fill(); }
/* one badge, drawn into a square of side S at (0,0) */
function drawBadge(g, w, S, earned, identity) {
  const cx = S / 2, cy = S * 0.46, R = S * 0.36, label = WORLDS[w].label;
  g.save();
  g.fillStyle = lin(g, 0, 0, S, S, [[0, '#141a3c'], [1, '#05071a']]); rr(g, 0, 0, S, S, S * 0.06);
  for (let i = 0; i < 70; i++) { g.globalAlpha = 0.3 + hash(i * 3.1) * 0.6; g.fillStyle = '#fff'; dot(g, hash(i + w.length) * S, hash(i * 2.3 + 7) * S, S * 0.0018 * (1 + (i % 3))); }
  g.globalAlpha = earned ? 1 : 0.32;
  /* ribbons */
  g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(cx - R * 0.55, cy + R * 0.6); g.lineTo(cx - R * 0.85, cy + R * 1.5); g.lineTo(cx - R * 0.5, cy + R * 1.34); g.lineTo(cx - R * 0.22, cy + R * 1.52); g.lineTo(cx - R * 0.05, cy + R * 0.7); g.fill();
  g.fillStyle = '#e5484d'; g.beginPath(); g.moveTo(cx + R * 0.55, cy + R * 0.6); g.lineTo(cx + R * 0.85, cy + R * 1.5); g.lineTo(cx + R * 0.5, cy + R * 1.34); g.lineTo(cx + R * 0.22, cy + R * 1.52); g.lineTo(cx + R * 0.05, cy + R * 0.7); g.fill();
  /* medal */
  g.fillStyle = '#8a5a12'; g.beginPath(); for (let i = 0; i < 48; i++) { const a = i * Math.PI / 24, rr2 = R * (i % 2 ? 1.06 : 1); g.lineTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2); } g.fill();
  g.fillStyle = rad(g, cx - R * 0.4, cy - R * 0.5, R * 0.1, cx, cy, R, [[0, '#fff6c9'], [0.5, '#ffc53d'], [1, '#b9791a']]); dot(g, cx, cy, R * 0.98);
  g.fillStyle = rad(g, cx, cy - R * 0.2, R * 0.1, cx, cy, R * 0.84, [[0, '#27306a'], [1, '#0b0f2c']]); dot(g, cx, cy, R * 0.84);
  g.strokeStyle = 'rgba(255,220,120,.6)'; g.lineWidth = S * 0.004; g.beginPath(); g.arc(cx, cy, R * 0.78, 0, 7); g.stroke();
  /* the world */
  const py = cy - R * 0.2, pr = R * (w === 'saturn' ? 0.22 : w === 'sun' ? 0.3 : 0.3);
  if (w === 'sun') { g.fillStyle = rad(g, cx, py, pr * 0.5, cx, py, pr * 1.7, [[0, 'rgba(255,220,120,.8)'], [1, 'rgba(255,180,60,0)']]); dot(g, cx, py, pr * 1.7); g.fillStyle = rad(g, cx - pr * 0.3, py - pr * 0.3, pr * 0.1, cx, py, pr, [[0, '#fffbe0'], [0.7, '#ffcc4d'], [1, '#ff9a2e']]); dot(g, cx, py, pr); }
  else drawPlanet(g, w, cx, py, pr);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#ffd45e'; fitText(g, 'PAWS RUN', R * 0.9, S * 0.034); g.fillText('PAWS RUN', cx, cy - R * 0.64);
  g.fillStyle = '#fff'; fitText(g, label + ' Explorer', R * 1.3, S * 0.058); g.fillText(label + ' Explorer', cx, cy + R * 0.27);
  g.fillStyle = '#ffd45e'; for (let i = -1; i <= 1; i++) star5(g, cx + i * R * 0.24, cy + R * 0.52 - Math.abs(i) * R * 0.03, R * 0.09);
  g.globalAlpha = 1;
  if (!earned) { g.fillStyle = 'rgba(230,235,255,.9)'; fitText(g, 'Not earned yet', S * 0.7, S * 0.05); g.fillText('Not earned yet', cx, S * 0.9); }
  else if (identity) {
    const name = player.name.trim() || 'Space explorer', by = S * 0.875;
    g.fillStyle = 'rgba(8,10,30,.7)'; rr(g, S * 0.07, by - S * 0.075, S * 0.86, S * 0.15, S * 0.04);
    drawAvatar(g, S * 0.16, by, S * 0.062);
    g.textAlign = 'left';
    g.fillStyle = '#fff'; fitText(g, name, S * 0.66, S * 0.046); g.fillText(name, S * 0.245, by - S * 0.028);
    const sub = 'All three rounds completed · ' + niceDate(prog[w] && prog[w].date);
    g.fillStyle = 'rgba(230,235,255,.85)'; fitText(g, sub, S * 0.66, S * 0.026, 'normal'); g.fillText(sub, S * 0.245, by + S * 0.012);
    if (player.email.trim()) { g.fillStyle = 'rgba(200,210,255,.8)'; fitText(g, player.email.trim(), S * 0.66, S * 0.023, 'normal'); g.fillText(player.email.trim(), S * 0.245, by + S * 0.044); }
  }
  g.textBaseline = 'alphabetic'; g.restore();
}
function badgeCanvas(w) { const cv2 = document.createElement('canvas'); cv2.width = cv2.height = 900; drawBadge(cv2.getContext('2d'), w, 900, true, true); return cv2; }
function certificateCanvas() {
  const W = 1600, H = 1180, cv2 = document.createElement('canvas'); cv2.width = W; cv2.height = H; const g = cv2.getContext('2d'), n = badgeCount();
  g.fillStyle = lin(g, 0, 0, W, H, [[0, '#141a3c'], [1, '#05071a']]); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) { g.globalAlpha = 0.25 + hash(i * 3.1) * 0.6; g.fillStyle = '#fff'; dot(g, hash(i) * W, hash(i * 2.3 + 7) * H, 1 + (i % 3) * 0.7); }
  g.globalAlpha = 1; g.strokeStyle = '#ffc53d'; g.lineWidth = 6; g.beginPath(); g.roundRect(24, 24, W - 48, H - 48, 36); g.stroke();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#ffc53d'; fitText(g, 'Paws Run · Solar System Explorer', W - 200, 64); g.fillText('Paws Run · Solar System Explorer', W / 2, 96);
  drawAvatar(g, 150, 232, 70);
  g.textAlign = 'left'; const name = player.name.trim() || 'Space explorer';
  g.fillStyle = '#fff'; fitText(g, name, 900, 56); g.fillText(name, 250, 204);
  g.fillStyle = 'rgba(230,235,255,.85)'; g.font = '28px ui-rounded, "Trebuchet MS", sans-serif';
  g.fillText(`${n} of 10 badges earned · ${niceDate(new Date().toISOString().slice(0, 10))}`, 250, 254);
  if (player.email.trim()) { g.fillStyle = 'rgba(200,210,255,.8)'; fitText(g, player.email.trim(), 900, 26, 'normal'); g.fillText(player.email.trim(), 250, 292); }
  const tmp = document.createElement('canvas'); tmp.width = tmp.height = 400; const tg = tmp.getContext('2d');
  WORLD_ORDER.forEach((w, i) => { tg.clearRect(0, 0, 400, 400); drawBadge(tg, w, 400, hasBadge(w), false); const x = 70 + (i % 5) * 296, y = 340 + Math.floor(i / 5) * 400; g.drawImage(tmp, x, y, 276, 276);
    g.textAlign = 'center'; g.fillStyle = hasBadge(w) ? '#ffd45e' : 'rgba(230,235,255,.5)'; g.font = '22px ui-rounded, "Trebuchet MS", sans-serif'; g.fillText(hasBadge(w) ? niceDate(prog[w].date) : 'Not earned yet', x + 138, y + 306); });
  g.textBaseline = 'alphabetic'; return cv2;
}
/* saving a picture: the Claude page asks before saving; elsewhere the browser downloads it */
let dlCap;
async function savePicture(cv2, filename) {
  $('saveImg').src = cv2.toDataURL('image/png'); $('saveNote').textContent = 'Preparing your picture…'; $('saveBox').style.display = '';
  const blob = await new Promise(r => cv2.toBlob(r, 'image/png'));
  try {
    if (window.claude && window.claude.use) {
      if (dlCap === undefined) dlCap = await window.claude.use('downloads');
      if (dlCap) { await dlCap.save({ filename, data: blob }); $('saveNote').textContent = 'Saved as ' + filename + '.'; return; }
    } else {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      $('saveNote').textContent = 'Downloading ' + filename + '. If nothing happens, right-click (or press and hold) the picture and choose “Save image”.'; return;
    }
  } catch (e) { if (e && e.code === 'declined') { $('saveNote').textContent = 'Save cancelled. You can also right-click (or press and hold) the picture to save it.'; return; } }
  $('saveNote').textContent = 'To keep it, right-click (or press and hold) the picture and choose “Save image”.';
}
const slug = s => (s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function openBadges(focus) {
  const grid = $('badgeGrid'); grid.innerHTML = ''; $('saveBox').style.display = 'none';
  $('badgeTitle').textContent = `My badges · ${badgeCount()} of 10`;
  WORLD_ORDER.forEach(w => {
    const cell = document.createElement('div'); cell.className = 'bcell' + (w === focus ? ' new' : '');
    const cv2 = document.createElement('canvas'); cv2.width = cv2.height = 300; drawBadge(cv2.getContext('2d'), w, 300, hasBadge(w), false);
    cv2.setAttribute('role', 'img'); cv2.setAttribute('aria-label', WORLDS[w].label + (hasBadge(w) ? ' badge, earned' : ' badge, not earned yet'));
    const st = document.createElement('small'); st.textContent = hasBadge(w) ? 'Earned ' + niceDate(prog[w].date) : `${[0, 1, 2].filter(i => done(w, i)).length} of 3 rounds done`;
    const b = document.createElement('button'); b.className = 'chip'; b.textContent = 'Download'; b.disabled = !hasBadge(w);
    b.onclick = () => savePicture(badgeCanvas(w), `paws-run-${w}-badge${player.name.trim() ? '-' + slug(player.name) : ''}.png`);
    cell.append(cv2, st, b); grid.appendChild(cell);
  });
  $('certBtn').disabled = badgeCount() === 0;
  $('menu').classList.remove('on'); $('msg').classList.remove('on'); $('badges').classList.add('on');
  if (focus && hasBadge(focus)) { $('saveImg').src = badgeCanvas(focus).toDataURL('image/png'); $('saveNote').textContent = `You earned the ${WORLDS[focus].label} Explorer badge! Use Download to keep it.`; $('saveBox').style.display = ''; }
}
$('certBtn').onclick = () => savePicture(certificateCanvas(), `paws-run-badges${player.name.trim() ? '-' + slug(player.name) : ''}.png`);
$('badgesClose').onclick = () => { $('badges').classList.remove('on'); if (state === 'pause') openMenu(true); else { state = 'menu'; L = null; openMenu(false); } };
$('badgesBtn').onclick = () => openBadges();
$('pName').addEventListener('input', e => { player.name = e.target.value.slice(0, 28); save(); });
$('pEmail').addEventListener('input', e => { player.email = e.target.value.slice(0, 60); save(); });
for (const id of ['pName', 'pEmail']) $(id).addEventListener('keydown', e => e.stopPropagation());
