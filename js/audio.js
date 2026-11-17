/* Paws Run — audio.js
   All sound, made with the Web Audio API: sound effects, woof/meow, and the looping tune for each world. */
'use strict';

/* ---------- sound ---------- */
let AC = null, SFX = null, MUS = null, FILT = null, ESEND = null, MSEND = null, noiseBuf = null;
const opts = { music:true, sound:true };
function applyVol() {
  if (!AC) return;
  const a = theme().audio || {};
  SFX.gain.value = opts.sound ? 1 : 0; MUS.gain.value = opts.music ? 0.6 : 0;
  FILT.frequency.value = a.lp || 20000; ESEND.gain.value = a.echo || 0; MSEND.gain.value = (a.echo || 0) * 0.8;
}
const sp = () => (theme().audio || {}).pitch || 1;
function audio() {
  try {
    if (!AC) {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      SFX = AC.createGain(); MUS = AC.createGain(); FILT = AC.createBiquadFilter(); FILT.type = 'lowpass'; FILT.frequency.value = 20000;
      ESEND = AC.createGain(); MSEND = AC.createGain(); const dl = AC.createDelay(1), fb = AC.createGain(); dl.delayTime.value = 0.3; fb.gain.value = 0.38;
      SFX.connect(FILT); FILT.connect(AC.destination); MUS.connect(AC.destination);
      FILT.connect(ESEND); MUS.connect(MSEND); ESEND.connect(dl); MSEND.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(AC.destination);
      noiseBuf = AC.createBuffer(1, Math.floor(AC.sampleRate * 0.3), AC.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      applyVol();
    }
    if (AC.state === 'suspended') AC.resume();
  } catch (e) { AC = null; }
  return AC;
}
function toneAt(t, f0, f1, dur, type, vol, dest) {
  if (!AC) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest || SFX); o.start(t); o.stop(t + dur + 0.03);
}
function noiseAt(t, dur, freq, vol, type, dest) {
  if (!AC) return;
  const n = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  n.buffer = noiseBuf; f.type = type || 'bandpass'; f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  n.connect(f); f.connect(g); g.connect(dest || SFX); n.start(t); n.stop(t + dur + 0.02);
}
const tone = (f0, f1, dur, type, vol, delay = 0) => { if (AC) toneAt(AC.currentTime + delay, f0 * sp(), f1 * sp(), dur, type, vol); };
const noise = (dur, freq, vol, delay = 0) => { if (AC) noiseAt(AC.currentTime + delay, dur, freq, vol); };
const seq = (notes, gap, dur, type, vol) => notes.forEach((f, i) => tone(f, f, dur, type, vol, i * gap));
const sfx = {
  jump() { const p = isDog() ? 1 : 1.35, d = 0.16 * Math.max(0.8, Math.min(2.2, 0.6 / GRAV)); tone(280 * p, 560 * p, d, 'square', 0.1); },
  land() { tone(150, 60, 0.09, 'sine', 0.3); noise(0.05, 400, 0.1); },
  step() { const k = (theme().audio || {}).step; if (k === 'sand') noise(0.05, 420, 0.04); else if (k === 'cloud') noise(0.06, 240, 0.03); else if (k === 'rock') noise(0.02, 2200, 0.05); else if (k === 'ice') tone(2300, 1900, 0.03, 'sine', 0.035); else noise(0.03, isDog() ? 700 : 1500, 0.045); },
  rocket() { noise(0.14, 260, 0.1); },
  rocketOn() { tone(180, 900, 0.5, 'sawtooth', 0.1); },
  meteor() { const f = 1500 + Math.random() * 1200; if (AC) toneAt(AC.currentTime, f, f * 0.3, 0.5, 'sine', 0.03); },
  shower() { seq([1568, 1319, 1047, 1319, 1568, 2093], 0.09, 0.3, 'sine', 0.06); },
  collect() { tone(988, 988, 0.07, 'square', 0.09); tone(1319, 1319, 0.12, 'square', 0.09, 0.07); },
  stomp() { tone(220, 70, 0.16, 'square', 0.16); noise(0.1, 900, 0.2); },
  hurt() { tone(420, 90, 0.35, 'sawtooth', 0.18); },
  yuck() { tone(300, 140, 0.2, 'sawtooth', 0.18); tone(220, 90, 0.3, 'sawtooth', 0.18, 0.18); },
  check() { seq([523, 659, 784], 0.09, 0.12, 'triangle', 0.2); },
  win() { seq([523, 659, 784, 1047], 0.13, 0.18, 'square', 0.1); tone(1319, 1319, 0.5, 'square', 0.1, 0.52); },
  finale() { seq([523, 659, 784, 1047, 784, 1047, 1319, 1568], 0.14, 0.22, 'square', 0.1); },
  over() { seq([392, 330, 262, 196], 0.2, 0.25, 'triangle', 0.2); }
};

/* background music: a short looping tune per environment */
const _ = null;
const SONGS = {
  grass: { bpm:132, root:261.63, wave:'square',   chords:[0, 7, 9, 5],
           mel:[4,7,12,7, 4,7,12,_,  2,7,11,7, 2,7,11,_,  0,4,9,4, 0,4,9,12,  0,5,9,5, 7,5,4,2] },
  ocean: { bpm:116, root:349.23, wave:'triangle', chords:[0, 7, 9, 5],
           mel:[12,_,9,7, _,9,_,7,  11,_,7,5, _,7,_,2,  9,_,12,9, _,7,_,4,  5,_,9,12, 11,9,7,_] },
};
Object.assign(SONGS, {
  sky:     { bpm:120, root:392,    wave:'triangle', chords:[0, 7, 9, 5],
             mel:[12,_,7,_, 4,_,7,_,  11,_,7,_, 2,_,7,_,  9,_,4,_, 0,_,4,_,  5,_,9,_, 12,_,14,_] },
  moon:    { bpm:84,  root:220,    wave:'sine', chords:[0, 3, 5, 7], drums:false,
             mel:[0,_,7,_, 12,_,7,_,  3,_,10,_, 15,_,10,_,  5,_,12,_, 8,_,12,_,  7,_,10,_, 14,_,_,_] },
  mercury: { bpm:150, root:246.94, wave:'square', chords:[0, 8, 3, 10],
             mel:[0,3,7,3, 12,_,7,_,  0,3,8,3, 12,_,8,_,  3,7,10,7, 15,_,10,_,  2,5,10,5, 14,12,10,_] },
  venus:   { bpm:92,  root:185,    wave:'sawtooth', chords:[0, 1, 5, 0],
             mel:[0,_,_,1, 0,_,_,_,  7,_,_,8, 7,_,_,_,  5,_,3,_, 1,_,0,_,  0,_,_,_, _,_,_,_] },
  mars:    { bpm:112, root:196,    wave:'square', chords:[0, 3, 5, 7],
             mel:[0,_,0,3, 7,_,7,_,  3,_,3,7, 10,_,10,_,  5,_,5,8, 12,_,12,_,  7,7,10,_, 14,_,12,10] },
  jupiter: { bpm:100, root:130.81, wave:'sawtooth', chords:[0, 5, 7, 0],
             mel:[0,_,4,_, 7,_,12,_,  5,_,9,_, 12,_,17,_,  7,_,11,_, 14,_,11,_,  12,_,7,_, 4,_,0,_] },
  saturn:  { bpm:108, root:329.63, wave:'triangle', chords:[0, 9, 5, 7],
             mel:[4,_,_,7, 12,_,_,_,  4,_,_,9, 12,_,_,_,  5,_,_,9, 12,_,_,_,  7,_,_,11, 14,_,12,_] },
  uranus:  { bpm:96,  root:523.25, wave:'sine', chords:[0, 2, 4, 2], drums:false,
             mel:[0,4,8,_, 12,_,8,_,  2,6,10,_, 14,_,10,_,  4,8,12,_, 16,_,12,_,  2,6,10,_, 8,_,_,_] },
  neptune: { bpm:88,  root:174.61, wave:'triangle', chords:[0, 8, 5, 7], drums:false,
             mel:[12,_,_,7, _,_,3,_,  12,_,_,8, _,_,3,_,  12,_,_,8, _,_,5,_,  14,_,_,10, _,_,7,_] }
});
let mStep = 0, mNext = 0;
function musicTick() {
  if (!AC || !opts.music) return;
  const s = SONGS[(theme().audio || {}).song || envName], dur = 60 / s.bpm / 2;
  if (mNext < AC.currentTime) mNext = AC.currentTime + 0.05;
  while (mNext < AC.currentTime + 0.2) {
    const i = mStep % 32, k = i & 7, ch = s.chords[i >> 3], n = s.mel[i];
    if (n != null) { const f = s.root * Math.pow(2, n / 12); toneAt(mNext, f, f, dur * 0.9, s.wave, s.wave === 'square' ? 0.05 : s.wave === 'sawtooth' ? 0.04 : 0.09, MUS); }
    if (k % 2 === 0) { let b = k % 4 === 0 ? ch : ch + 7; if (b >= 8) b -= 12; const f = s.root / 2 * Math.pow(2, b / 12); toneAt(mNext, f, f, dur * 1.7, 'triangle', 0.16, MUS); }
    if (s.drums !== false && k % 4 === 0) toneAt(mNext, 120, 45, 0.1, 'sine', 0.22, MUS);
    if (s.drums !== false && k % 2 === 1) noiseAt(mNext, 0.03, 7000, 0.035, 'highpass', MUS);
    mNext += dur; mStep++;
  }
}
function woof(t0, p) {
  const o = AC.createOscillator(), g = AC.createGain(), f = AC.createBiquadFilter();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(330 * p, t0); o.frequency.exponentialRampToValueAtTime(105 * p, t0 + 0.17);
  f.type = 'lowpass'; f.frequency.setValueAtTime(1500, t0); f.frequency.exponentialRampToValueAtTime(450, t0 + 0.17);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
  o.connect(f); f.connect(g); g.connect(SFX); o.start(t0); o.stop(t0 + 0.22);
  const n = AC.createBufferSource(), buf = AC.createBuffer(1, Math.floor(AC.sampleRate * 0.12), AC.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const ng = AC.createGain(), nf = AC.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 900; ng.gain.value = 0.18;
  n.buffer = buf; n.connect(nf); nf.connect(ng); ng.connect(SFX); n.start(t0);
}
function meow(t0, p) {
  const o = AC.createOscillator(), g = AC.createGain(), f = AC.createBiquadFilter(), lfo = AC.createOscillator(), lg = AC.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(520 * p, t0); o.frequency.linearRampToValueAtTime(830 * p, t0 + 0.13); o.frequency.linearRampToValueAtTime(470 * p, t0 + 0.42);
  f.type = 'bandpass'; f.Q.value = 2.5;
  f.frequency.setValueAtTime(1300, t0); f.frequency.linearRampToValueAtTime(2500, t0 + 0.15); f.frequency.linearRampToValueAtTime(1100, t0 + 0.42);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.05); g.gain.setValueAtTime(0.5, t0 + 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45);
  lfo.frequency.value = 7; lg.gain.value = 14; lfo.connect(lg); lg.connect(o.frequency);
  o.connect(f); f.connect(g); g.connect(SFX); o.start(t0); o.stop(t0 + 0.47); lfo.start(t0); lfo.stop(t0 + 0.47);
}
let talkT = 0;
function speak() {
  if (talkT > 20) return;
  talkT = 60;
  if (audio()) {
    const p = (pet.gender === 'girl' ? 1.2 : 0.88) * sp(), t = AC.currentTime + 0.01;
    try { if (isDog()) { woof(t, p); woof(t + 0.26, p * 0.96); } else { meow(t, p); meow(t + 0.5, p * 1.05); } } catch (e) {}
  }
  if (state === 'play' && L) {
    for (const e of [...L.slimes, ...L.bats]) if (e.alive && Math.abs(e.x - P.x) < 230 && Math.abs(e.y - P.y) < 160) e.stun = 80;
  }
}
