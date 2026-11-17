/* Paws Run — worlds.js
   THEMES: one entry per scene (colours, gravity, sound settings). WORLDS: each world and its three scenes. setEnv() switches the active scene. */
'use strict';

/* ---------- environments ---------- */
const THEMES = {
  /* Earth tour */
  grass:   { label:'Earth · Grassland', sky:['#3f9be8','#d6f3ff'], top:'#58c24a', dirt:'#8a5a35', dirt2:'#774a2a', brick:'#d39a55', brickLine:'#a06a30', spike:'#e8e8ee',
             fg:'rgba(24,80,40,.8)', audio:{ song:'grass', pitch:1, step:'grass' } },
  ocean:   { label:'Earth · Ocean', sky:['#2f8fe0','#e8fbff'], top:'#f6dc94', dirt:'#d8ad62', dirt2:'#c99b50', brick:'#c7774a', brickLine:'#96502a', spike:'#fff7e0',
             fg:'rgba(196,150,80,.8)', audio:{ song:'ocean', pitch:1, step:'sand' } },
  sky:     { label:'Earth · Blue sky', sky:['#1f6fe0','#d8f0ff'], top:'#ffffff', dirt:'#dcefff', dirt2:'#c4e0f7', brick:'#f4b860', brickLine:'#c98a3a', spike:'#e8f6ff',
             fg:'rgba(255,255,255,.85)', fx:['drift','#ffffff',26], audio:{ song:'sky', pitch:1.1, echo:0.12, step:'cloud' } },
  /* Moon and planets: phys = [gravity, jump speed, run speed] */
  moon:    { label:'Moon', sky:['#000005','#12121e'], top:'#c9c9cf', dirt:'#8d8d96', dirt2:'#7b7b85', brick:'#a9adb8', brickLine:'#6f7380', spike:'#e6e6f0',
             fg:'rgba(40,40,48,.9)', phys:[0.099, -12.6, 4.8], audio:{ song:'moon', pitch:0.9, lp:700, echo:0.3, step:'rock' } },
  mercury: { label:'Mercury', sky:['#050203','#5a2a10'], top:'#b59a84', dirt:'#7a6455', dirt2:'#69554a', brick:'#9a7a5c', brickLine:'#5e4633', spike:'#f0d8c0',
             fg:'rgba(40,28,22,.9)', fx:['rise','#ffb060',16], phys:[0.227, -12.6, 4.8], audio:{ song:'mercury', pitch:1, lp:1100, echo:0.15, step:'rock' } },
  venus:   { label:'Venus', sky:['#5a2a0a','#f2c14e'], top:'#e8b04a', dirt:'#a8622a', dirt2:'#8f4f20', brick:'#c7542a', brickLine:'#7a2a12', spike:'#ffe9b0',
             fg:'rgba(70,28,10,.85)', fx:['rise','#ffc060',26], phys:[0.542, -12.6, 4.8], audio:{ song:'venus', pitch:0.78, lp:2600, echo:0.2, step:'rock' } },
  mars:    { label:'Mars', sky:['#b9794e','#f6dcc0'], top:'#d9683a', dirt:'#a8452a', dirt2:'#8f3820', brick:'#c98a5e', brickLine:'#8a5232', spike:'#f2d8c4',
             fg:'rgba(90,32,18,.85)', fx:['drift','#f6d2b0',40], phys:[0.227, -12.6, 4.8], audio:{ song:'mars', pitch:1.18, echo:0.1, step:'rock' } },
  jupiter: { label:'Jupiter', sky:['#c9a27a','#f2e3c8'], top:'#f6e3c2', dirt:'#d9a878', dirt2:'#c48f62', brick:'#b5653a', brickLine:'#7d3f1f', spike:'#fff3dc',
             fg:'rgba(255,240,215,.8)', fx:['streak','#fff0d8',16], phys:[1.518, -18.8, 7], audio:{ song:'jupiter', pitch:0.72, echo:0.25, step:'cloud' } },
  saturn:  { label:'Saturn', sky:['#2a2140','#f2deb0'], top:'#f7ecc8', dirt:'#e0c68a', dirt2:'#cdb074', brick:'#b8925a', brickLine:'#80623a', spike:'#fff6dc',
             fg:'rgba(250,240,205,.8)', fx:['drift','#fff4d6',24], phys:[0.638, -12.6, 4.8], audio:{ song:'saturn', pitch:0.9, echo:0.3, step:'cloud' } },
  uranus:  { label:'Uranus', sky:['#0a4a5e','#c9f7f0'], top:'#e8fffb', dirt:'#7fcfd0', dirt2:'#66b9bd', brick:'#4f9fb0', brickLine:'#2f7385', spike:'#f0ffff',
             fg:'rgba(225,255,250,.8)', fx:['fall','#ffffff',46], phys:[0.532, -12.6, 4.8], audio:{ song:'uranus', pitch:1.25, echo:0.4, step:'ice' } },
  neptune: { label:'Neptune', sky:['#030a2e','#4f8ff0'], top:'#cfe2ff', dirt:'#3f63c9', dirt2:'#3454b0', brick:'#2a3f9a', brickLine:'#182766', spike:'#e0ecff',
             fg:'rgba(16,28,90,.85)', fx:['streak','#cfe2ff',22], phys:[0.684, -12.6, 4.8], audio:{ song:'neptune', pitch:0.85, echo:0.45, step:'ice' } }
};
const WORLDS = {
  earth:   { label:'Earth',   levels:['grass', 'ocean', 'sky'], blurb:'Earth — gravity 1× (9.8 m/s²). Easy crosses the grassland, Medium follows the ocean shore, and Hard climbs into the blue sky.' },
  moon:    { label:'Moon',    blurb:'Moon — gravity 0.17× Earth (1.6 m/s²). A full jump goes about six times higher and floats for seconds; tap for a small hop. No air, so sounds are muffled.' },
  mercury: { label:'Mercury', blurb:'Mercury — gravity 0.38× Earth (3.7 m/s²): jumps go about 2.6 times higher. A scorched, cratered rock under a giant Sun.' },
  venus:   { label:'Venus',   blurb:'Venus — gravity 0.90× Earth (8.9 m/s²): jumps are a touch higher. Volcanoes, lightning and a thick orange sky.' },
  mars:    { label:'Mars',    blurb:'Mars — gravity 0.38× Earth (3.7 m/s²): jumps go about 2.6 times higher. Red dunes, mesas and dust devils.' },
  jupiter: { label:'Jupiter', blurb:'Jupiter — gravity 2.53× Earth (24.8 m/s²). You fall fast, so power boots give short, snappy jumps and a quicker run across the cloud tops.' },
  saturn:  { label:'Saturn',  blurb:'Saturn — gravity 1.06× Earth (10.4 m/s²): almost like home. Golden cloud tops beneath the rings.' },
  uranus:  { label:'Uranus',  blurb:'Uranus — gravity 0.89× Earth (8.7 m/s²): jumps are a touch higher. Ice spires and falling diamonds under a tilted ring.' },
  neptune: { label:'Neptune', blurb:'Neptune — gravity 1.14× Earth (11.2 m/s²): jumps are a little lower. Deep blue, racing winds and a dark storm.' }
};
for (const k in WORLDS) if (!WORLDS[k].levels) WORLDS[k].levels = [k, k, k];
function setEnv(idx) {
  envName = WORLDS[worldName].levels[idx || 0];
  [GRAV, JUMP, RUN] = THEMES[envName].phys || [0.6, -12.6, 4.8];
  applyVol();
}
const theme = () => THEMES[envName];
