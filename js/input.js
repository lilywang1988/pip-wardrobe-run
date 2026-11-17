/* Paws Run — input.js
   Keyboard and touch controls. */
'use strict';

/* ---------- input ---------- */
const KEYMAP = { ArrowLeft:'left', KeyA:'left', ArrowRight:'right', KeyD:'right', ArrowUp:'jump', KeyW:'jump', Space:'jump' };
function press(k, down) { if (down) audio(); if (k === 'jump' && down && !keys.jump) jumpBuf = 8; keys[k] = down; }
addEventListener('keydown', e => {
  if (e.code === 'KeyP' || e.code === 'Escape') { togglePause(); e.preventDefault(); return; }
  if ((e.code === 'KeyB' || e.code === 'KeyM' || e.code === 'KeyX') && !e.repeat) { speak(); return; }
  const k = KEYMAP[e.code]; if (!k) return;
  if (state === 'play') e.preventDefault();
  if (!e.repeat) press(k, true);
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) press(k, false); });
addEventListener('blur', () => { keys.left = keys.right = keys.jump = false; });
document.querySelectorAll('#touch button[data-k]').forEach(b => {
  const k = b.dataset.k;
  b.addEventListener('pointerdown', e => { e.preventDefault(); press(k, true); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) b.addEventListener(ev, () => press(k, false));
  b.addEventListener('contextmenu', e => e.preventDefault());
});
$('touchSpeak').addEventListener('pointerdown', e => { e.preventDefault(); speak(); });
$('hearBtn').onclick = speak;
