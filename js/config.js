/* Paws Run — config.js
   Canvas, sizes and physics defaults, the pet options (breeds, colours, clothes) and loading/saving to the browser. */
'use strict';

const T = 36, ROWS = 15, VW = 960, VH = 540, GROUND = 13;
let GRAV = 0.6, JUMP = -12.6, RUN = 4.8;
const PW = 34, PH = 32;
const cv = document.getElementById('game'), c = cv.getContext('2d');
const $ = id => document.getElementById(id);

/* ---------- pet options ---------- */
const BREEDS = {
  dog: {
    lab:     { label:'Labrador', leg:9,  bl:22, bh:12, ear:'flop',  tail:'long',  mark:'none' },
    corgi:   { label:'Corgi',    leg:5,  bl:24, bh:12, ear:'big',   tail:'stub',  mark:'chest' },
    husky:   { label:'Husky',    leg:9,  bl:22, bh:12, ear:'point', tail:'curl',  mark:'mask' },
    poodle:  { label:'Poodle',   leg:10, bl:20, bh:11, ear:'pom',   tail:'pom',   mark:'none', fluff:true }
  },
  cat: {
    tabby:   { label:'Tabby',    leg:7,  bl:20, bh:10, ear:'cat',   tail:'cat',   mark:'stripes' },
    siamese: { label:'Siamese',  leg:8,  bl:20, bh:9,  ear:'cat',   tail:'cat',   mark:'points' },
    persian: { label:'Persian',  leg:6,  bl:21, bh:12, ear:'cat',   tail:'bushy', mark:'none', fluff:true },
    tuxedo:  { label:'Tuxedo',   leg:7,  bl:20, bh:10, ear:'cat',   tail:'cat',   mark:'chest' }
  }
};
const FURS = ['#f2e3c6','#e0a45a','#e8873a','#b5651d','#6b4226','#2f2a28','#9aa0a8','#f5f5f5'];
const COLORS = ['#e5484d','#f76b15','#ffc53d','#46a758','#12a594','#3e63dd','#8e4ec6','#e93d82','#f5f5f5','#30343b'];
const CLOTHES = { none:'None', bandana:'Bandana', sweater:'Sweater', cape:'Cape' };
const HATS = { none:'None', cap:'Cap', party:'Party hat', crown:'Crown' };
let pet = { species:'dog', breed:'lab', gender:'girl', fur:'#e0a45a', clothes:'bandana', clothesCol:'#e5484d', hat:'none', hatCol:'#3e63dd' };
let envName = 'grass', worldName = 'earth';

const isDog = () => pet.species === 'dog';
const treatName = () => isDog() ? 'bone' : 'fish';
const trapName = () => isDog() ? 'fish' : 'bone';

function load() {
  try {
    const s = JSON.parse(localStorage.getItem('paws-run') || 'null');
    if (s) { Object.assign(pet, s.pet || {}); if (s.opts) { opts.music = s.opts.music !== false; opts.sound = s.opts.sound !== false; } if (WORLDS[s.world]) worldName = s.world; if (s.prog && typeof s.prog === 'object') prog = s.prog; if (s.player) { player.name = String(s.player.name || ''); player.email = String(s.player.email || ''); } }
  } catch (e) {}
  setEnv(0);
  if (!BREEDS[pet.species]) pet.species = 'dog';
  if (!BREEDS[pet.species][pet.breed]) pet.breed = Object.keys(BREEDS[pet.species])[0];
}
function save() { try { localStorage.setItem('paws-run', JSON.stringify({ pet, world: worldName, opts, prog, player })); } catch (e) {} }
