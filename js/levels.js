/* Paws Run — levels.js
   The three level layouts (Easy, Medium, Hard), built from small helper calls such as ground(), block(), slime() and trap(). */
'use strict';

/* ---------- levels ---------- */
function build(name, w, slimeSpeed, fn) {
  const grid = []; for (let x = 0; x < w; x++) grid.push(new Uint8Array(ROWS));
  const L = { name, w, grid, gems:[], traps:[], slimes:[], bats:[], movers:[], check:0, goal:0 };
  let flip = 1;
  const api = {
    ground(a, b) { for (let x = a; x < b; x++) { grid[x][GROUND] = 1; grid[x][GROUND + 1] = 1; } },
    block(x, y, bw, bh = 1) { for (let i = 0; i < bw; i++) for (let j = 0; j < bh; j++) grid[x + i][y + j] = 2; },
    stairs(x, n) { for (let i = 0; i < n; i++) api.block(x + i, GROUND - 1 - i, 1, i + 1); },
    spikes(a, b) { for (let x = a; x < b; x++) grid[x][GROUND - 1] = 3; },
    gem(x, y) { L.gems.push({ x:(x + .5) * T, y:(y + .5) * T, got:false }); },
    gems(x, y, n) { for (let i = 0; i < n; i++) api.gem(x + i, y); },
    arc(x, y, n) { for (let i = 0; i < n; i++) api.gem(x + i, y - Math.sin((i + .5) / n * Math.PI) * 1.6); },
    trap(x, y) { L.traps.push({ x:(x + .5) * T, y:(y + .5) * T }); },
    slime(a, b) { flip = -flip; L.slimes.push({ x:(a + b) / 2 * T, y:GROUND * T - 22, w:30, h:22, min:a * T, max:b * T - 30, vx:slimeSpeed * flip, alive:true, stun:0 }); },
    bat(a, b, row) { L.bats.push({ x:a * T, y:row * T, base:row * T, w:30, h:18, min:a * T, max:b * T - 30, vx:1.7, t:Math.random() * 6, alive:true, stun:0 }); },
    mover(x1, y1, x2, y2, bw, speed) { L.movers.push({ x:x1 * T, y:y1 * T, w:bw * T, h:14, x1:x1 * T, y1:y1 * T, x2:x2 * T, y2:y2 * T, t:0, speed, dx:0, dy:0 }); },
    check(x) { L.check = x; }, goal(x) { L.goal = x; }
  };
  fn(api);
  return L;
}

const LEVELS = [
  () => build('Easy', 110, 1.0, a => {
    a.ground(0, 28); a.ground(30, 58); a.ground(60, 110);
    a.block(10, 10, 3); a.block(16, 8, 3); a.block(36, 10, 4); a.block(44, 8, 3);
    a.block(66, 10, 3); a.block(72, 7, 3); a.block(84, 10, 5);
    a.stairs(96, 4);
    a.gems(10, 9, 3); a.gems(16, 7, 3); a.arc(27, 11, 4); a.gems(36, 9, 4); a.gems(44, 7, 3);
    a.arc(57, 11, 4); a.gems(66, 9, 3); a.gems(72, 6, 3); a.gems(84, 9, 5); a.gems(5, 12, 3); a.gems(100, 12, 3);
    a.trap(22, 12); a.trap(52, 12); a.trap(78, 12); a.trap(86, 7.4);
    a.slime(14, 21); a.slime(32, 44); a.slime(62, 76); a.slime(82, 94);
    a.check(61); a.goal(105);
  }),
  () => build('Medium', 150, 1.4, a => {
    a.ground(0, 20); a.ground(23, 40); a.ground(43, 55); a.ground(65, 90); a.ground(93, 110); a.ground(118, 150);
    a.mover(56, 12, 62, 12, 3, 0.018);
    a.block(112, 11, 2); a.block(115, 10, 2);
    a.spikes(30, 32); a.spikes(70, 72); a.spikes(100, 101); a.spikes(128, 130);
    a.block(8, 10, 3); a.block(26, 10, 3); a.block(33, 9, 3); a.block(75, 10, 3); a.block(80, 8, 3); a.block(124, 10, 3); a.block(132, 9, 3);
    a.gems(8, 9, 3); a.arc(20, 11, 3); a.gems(26, 9, 3); a.gems(33, 8, 3); a.arc(40, 11, 3); a.gems(57, 10, 6);
    a.gems(75, 9, 3); a.gems(80, 7, 3); a.arc(90, 11, 3); a.gems(112, 10, 2); a.gems(115, 9, 2); a.gems(124, 9, 3); a.gems(132, 8, 3);
    a.trap(15, 12); a.trap(52, 12); a.trap(86, 12); a.trap(140, 12); a.trap(76, 7.4); a.trap(133, 6.4);
    a.slime(5, 13); a.slime(32, 39); a.slime(72, 80); a.slime(101, 109); a.slime(130, 138);
    a.bat(44, 50, 10.4); a.bat(119, 127, 8);
    a.check(66); a.goal(145);
  }),
  () => build('Hard', 190, 2.0, a => {
    a.ground(0, 14); a.ground(18, 30); a.ground(34, 42); a.ground(56, 80); a.ground(84, 96);
    a.ground(116, 140); a.ground(144, 152); a.ground(156, 160); a.ground(164, 190);
    a.spikes(23, 25); a.spikes(62, 64); a.spikes(70, 72); a.spikes(120, 122); a.spikes(126, 128); a.spikes(132, 134); a.spikes(168, 170);
    a.mover(44, 12, 44, 8, 3, 0.016); a.block(50, 8, 3);
    a.mover(97, 12, 103, 12, 3, 0.02); a.block(106, 10, 2); a.mover(108, 12, 113, 12, 3, 0.024);
    a.block(119, 10, 3); a.block(125, 9, 3); a.block(131, 10, 3);
    a.stairs(174, 4);
    a.arc(14, 11, 4); a.gems(20, 12, 2); a.arc(30, 11, 4); a.gems(45, 6, 2); a.gems(50, 7, 3);
    a.gems(66, 12, 3); a.arc(80, 11, 4); a.gems(98, 10, 4); a.gems(106, 9, 2); a.gems(110, 10, 4);
    a.gems(119, 9, 3); a.gems(125, 8, 3); a.gems(131, 9, 3); a.arc(140, 11, 4); a.arc(152, 11, 4); a.arc(160, 11, 4); a.gems(179, 12, 3);
    a.trap(8, 12); a.trap(75, 12); a.trap(91, 12); a.trap(137, 12); a.trap(52, 5.4); a.trap(101, 8.6); a.trap(126, 6.4);
    a.slime(19, 23); a.slime(36, 42); a.slime(64, 70); a.slime(86, 90);
    a.slime(122, 126); a.slime(128, 132); a.slime(146, 152); a.slime(179, 184);
    a.bat(58, 70, 9.6); a.bat(97, 105, 10.4); a.bat(134, 140, 10.6); a.bat(164, 173, 10.2);
    a.check(85); a.goal(185);
  })
];
