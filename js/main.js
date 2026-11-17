/* Paws Run — main.js
   The game loop and start-up. Loaded last. */
'use strict';

/* ---------- loop ---------- */
let last = 0, acc = 0;
function frame(t) {
  const dt = Math.min(0.1, (t - last) / 1000 || 0); last = t;
  if (state === 'play') { acc += dt; while (acc >= 1 / 60 && state === 'play') { step(); acc -= 1 / 60; } if (state === 'play') musicTick(); }
  else { acc = 0; tick++; if (talkT > 0) talkT--; if (state === 'menu' || state === 'pause') { drawPreview(); drawSolar(); } }
  meteorTick();
  render();
  requestAnimationFrame(frame);
}

load(); buildMenu();
requestAnimationFrame(frame);
