/* Paws Run — game.js
   Game state and rules: starting a round, movement and jumping, the rocket, enemies, treats and traps, losing a heart, finishing a round. */
'use strict';

/* ---------- state ---------- */
let state = 'menu', levelIdx = 0, L = null, P = null, lives = 3, gemCount = 0, checked = false;
let holdT = 0, holdOK = true, rocketT = 0;
let camX = 0, camY = 0, tick = 0, parts = [], flash = 0, toast = null, happyT = 0;
const keys = { left:false, right:false, jump:false };
let jumpBuf = 0;

function startLevel(i) {
  levelIdx = i; setEnv(i); L = LEVELS[i](); lives = 3; gemCount = 0; checked = false; parts = []; toast = FACT1[envName] ? { text: FACT1[envName], life: 330 } : null;
  spawn(); state = 'play'; audio(); mStep = 0;
  $('menu').classList.remove('on'); $('msg').classList.remove('on');
}
function spawn() {
  const sx = checked ? L.check : 2;
  P = { x:sx * T, y:GROUND * T - PH, w:PW, h:PH, vx:0, vy:0, ground:false, face:1, coyote:0, run:0, rider:null, inv:60, squash:0 };
  holdT = 0; rocketT = 0;
  camX = Math.max(0, Math.min(P.x - VW * 0.4, L.w * T - VW)); camY = 0;
}

const solid = (tx, ty) => tx < 0 || tx >= L.w ? true : (ty < 0 || ty >= ROWS ? false : (L.grid[tx][ty] === 1 || L.grid[tx][ty] === 2));
const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function burst(x, y, col, n) {
  for (let i = 0; i < n; i++) parts.push({ x, y, vx:(Math.random() - .5) * 6, vy:-Math.random() * 5 - 1, life:30 + Math.random() * 15, col });
}

function die(why) {
  if (P.inv > 0) return;
  burst(P.x + P.w / 2, P.y + P.h / 2, pet.fur, 16); flash = 12; lives--;
  if (lives <= 0) sfx.over(); else if (why) sfx.yuck(); else sfx.hurt();
  if (why) toast = { text: why, life: 130 };
  if (lives <= 0) {
    state = 'msg';
    showMsg('Out of hearts', why ? why + ' Round ' + L.name + ' wins this time.' : `Round ${L.name} wins this time.`, 'Try again', () => startLevel(levelIdx));
  } else spawn();
}

function step() {
  tick++;
  if (P.inv > 0) P.inv--;
  if (flash > 0) flash--;
  if (talkT > 0) talkT--;
  if (happyT > 0) happyT--;
  P.squash *= 0.8;
  if (toast && --toast.life <= 0) toast = null;

  for (const m of L.movers) {
    m.t += m.speed;
    const k = (1 - Math.cos(m.t)) / 2;
    const nx = m.x1 + (m.x2 - m.x1) * k, ny = m.y1 + (m.y2 - m.y1) * k;
    m.dx = nx - m.x; m.dy = ny - m.y; m.x = nx; m.y = ny;
  }
  if (P.rider) { P.x += P.rider.dx; P.y += P.rider.dy; }

  const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  if (dir) { P.vx += dir * 0.6; P.face = dir; } else P.vx *= 0.75;
  P.vx = Math.max(-RUN, Math.min(RUN, P.vx));
  if (Math.abs(P.vx) < 0.05) P.vx = 0;
  if (jumpBuf > 0) jumpBuf--;
  if (P.coyote > 0) P.coyote--;
  if (jumpBuf > 0 && P.coyote > 0) { P.vy = JUMP; jumpBuf = 0; P.coyote = 0; P.rider = null; sfx.jump(); P.squash = -0.16; }
  if (!keys.jump && P.vy < -5) P.vy = -5;
  P.vy = Math.min(18, P.vy + GRAV);
  /* holding jump: a higher jump, and after 5 seconds a temporary rocket */
  if (keys.jump) { if (rocketT <= 0 && holdOK) holdT++; } else { holdT = 0; holdOK = true; }
  if (holdT >= 300) { rocketT = 480; holdT = 0; holdOK = false; toast = { text:'Rocket power! Hold jump to fly', life:150 }; sfx.rocketOn(); }
  if (rocketT > 0) {
    rocketT--;
    if (keys.jump && P.y > -420) {
      P.vy = Math.max(-6.5, P.vy - GRAV - 0.55); P.rider = null;
      if (tick % 2 === 0) parts.push({ x: P.x + P.w / 2 - P.face * 16 + (Math.random() - 0.5) * 6, y: P.y + P.h - 4, vx: -P.face * 0.8 + (Math.random() - 0.5), vy: 3 + Math.random() * 2, life: 12 + Math.random() * 8, col: Math.random() < 0.5 ? '#ffb347' : '#ff6b3d' });
      if (tick % 7 === 0) sfx.rocket();
    }
  } else if (keys.jump && P.vy < 0) P.vy -= GRAV * 0.375;

  P.x += P.vx;
  {
    const top = Math.floor(P.y / T), bot = Math.floor((P.y + P.h - 1) / T);
    const rx = Math.floor((P.x + P.w - 1) / T), lx = Math.floor(P.x / T);
    for (let ty = top; ty <= bot; ty++) {
      if (solid(rx, ty)) { P.x = rx * T - P.w; P.vx = Math.min(0, P.vx); }
      if (solid(lx, ty)) { P.x = (lx + 1) * T; P.vx = Math.max(0, P.vx); }
    }
  }

  const prevBottom = P.y + P.h, wasGround = P.ground, fallV = P.vy;
  P.y += P.vy;
  P.ground = false;
  {
    const lx = Math.floor(P.x / T), rx = Math.floor((P.x + P.w - 1) / T);
    if (P.vy >= 0) {
      const ty = Math.floor((P.y + P.h) / T);
      for (let tx = lx; tx <= rx; tx++) if (solid(tx, ty) && prevBottom <= ty * T + 0.01) { P.y = ty * T - P.h; P.vy = 0; P.ground = true; }
    } else {
      const ty = Math.floor(P.y / T);
      for (let tx = lx; tx <= rx; tx++) if (solid(tx, ty)) { P.y = (ty + 1) * T; P.vy = 0; }
    }
  }
  P.rider = null;
  if (P.vy >= 0 && !P.ground) {
    for (const m of L.movers) {
      if (P.x + P.w > m.x && P.x < m.x + m.w && prevBottom <= m.y - m.dy + 8 && P.y + P.h >= m.y) {
        P.y = m.y - P.h; P.vy = 0; P.ground = true; P.rider = m; break;
      }
    }
  }
  if (P.ground) P.coyote = 7;
  if (P.ground && !wasGround && fallV > 3) { sfx.land(); P.squash = 0.2; }
  const stride = Math.floor(P.run / Math.PI);
  P.run += Math.abs(P.vx) * 0.09;
  if (P.ground && Math.floor(P.run / Math.PI) !== stride) sfx.step();

  if (P.y > VH + 80) { P.inv = 0; die(); return; }
  {
    const lx = Math.floor(P.x / T), rx = Math.floor((P.x + P.w - 1) / T), ty = GROUND - 1;
    for (let tx = lx; tx <= rx; tx++) {
      if (tx >= 0 && tx < L.w && L.grid[tx][ty] === 3 &&
          hit(P, { x:tx * T + 5, y:ty * T + T * 0.45, w:T - 10, h:T * 0.55 })) { die(); return; }
    }
  }

  for (const s of L.slimes) {
    if (!s.alive) continue;
    if (s.stun > 0) s.stun--; else {
      s.x += s.vx;
      if (s.x < s.min) { s.x = s.min; s.vx = Math.abs(s.vx); }
      if (s.x > s.max) { s.x = s.max; s.vx = -Math.abs(s.vx); }
    }
    if (enemyTouch(s, '#9aa3b5')) return;
  }
  for (const b of L.bats) {
    if (!b.alive) continue;
    if (b.stun > 0) b.stun--; else {
      b.t += 0.07; b.x += b.vx; b.y = b.base + Math.sin(b.t) * 18;
      if (b.x < b.min) { b.x = b.min; b.vx = Math.abs(b.vx); }
      if (b.x > b.max) { b.x = b.max; b.vx = -Math.abs(b.vx); }
    }
    if (enemyTouch(b, '#3b3f52')) return;
  }

  const cx = P.x + P.w / 2, cy = P.y + P.h / 2;
  for (const g of L.gems) {
    if (!g.got && Math.abs(g.x - cx) < 24 && Math.abs(g.y - cy) < 24) { g.got = true; gemCount++; burst(g.x, g.y, '#ffe27a', 5); sfx.collect(); happyT = 45; }
  }
  if (P.inv === 0) for (const t of L.traps) {
    if (Math.abs(t.x - cx) < 19 && Math.abs(t.y - cy) < 19) {
      die(isDog() ? 'Yuck — fish is for cats!' : 'Yuck — bones are for dogs!'); return;
    }
  }
  if (!checked && P.x > L.check * T) { checked = true; burst(L.check * T + 6, GROUND * T - 60, '#ffd45e', 14); sfx.check(); if (FACT2[envName]) toast = { text: FACT2[envName], life: 300 }; }
  if (hit(P, { x:L.goal * T + 6, y:-6000, w:T * 1.6, h:6000 + GROUND * T })) finish();

  for (const p of parts) { p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life--; }
  parts = parts.filter(p => p.life > 0);

  const target = P.x - VW * 0.4;
  camX += (target - camX) * 0.12;
  camX = Math.max(0, Math.min(camX, L.w * T - VW));
  camY += (Math.min(0, P.y - 150) - camY) * 0.14;
}

function enemyTouch(e, col) {
  if (!hit(P, e)) return false;
  if (P.vy > 1 && P.y + P.h - P.vy <= e.y + 12) {
    e.alive = false; P.vy = keys.jump ? JUMP * 0.9 : -8.5; burst(e.x + 15, e.y + 10, col, 12); sfx.stomp();
    return false;
  }
  if (P.inv > 0) return false;
  die(); return true;
}

function finish() {
  if (state !== 'play') return;
  state = 'msg';
  const total = L.gems.length, word = isDog() ? 'Bones' : 'Fish';
  if (levelIdx < 2) sfx.win(); else sfx.finale();
  const gotBadge = markDone(worldName, levelIdx), wl = WORLDS[worldName].label; save();
  if (levelIdx < 2) {
    showMsg(`${L.name} cleared!`, `${word}: ${gemCount} / ${total}. Next up: ${['Medium','Hard'][levelIdx]}.`, 'Next round', () => startLevel(levelIdx + 1));
  } else if (hasBadge(worldName)) {
    showMsg(`${wl} complete!`, `Your ${pet.species} made it home through all three rounds. ${word} on Hard: ${gemCount} / ${total}. ${gotBadge ? 'You earned the ' + wl + ' Explorer badge!' : 'You already hold this badge.'} Badges so far: ${badgeCount()} of 10.`, 'See my badge', () => openBadges(worldName));
  } else {
    showMsg('Hard cleared!', `${word}: ${gemCount} / ${total}. Finish Easy and Medium on ${wl} too to earn its badge.`, 'Play again', () => startLevel(0));
  }
}
