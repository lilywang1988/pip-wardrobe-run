/* Paws Run — menu.js
   Menus: opening and pausing, the message card, the pet preview and all the option buttons. */
'use strict';

/* ---------- menus ---------- */
function openMenu(paused) {
  $('menuLevels').style.display = paused ? 'none' : '';
  $('pauseBtns').style.display = paused ? '' : 'none';
  buildMenu();
  $('msg').classList.remove('on'); $('menu').classList.add('on');
}
function togglePause() {
  if (state === 'play') { state = 'pause'; openMenu(true); }
  else if (state === 'pause') { state = 'play'; $('menu').classList.remove('on'); }
}
function showMsg(title, text, aLabel, aFn) {
  $('msgTitle').textContent = title; $('msgText').textContent = text;
  $('msgA').textContent = aLabel; $('msgA').onclick = aFn;
  $('msg').classList.add('on');
}
const toMenu = () => { state = 'menu'; L = null; openMenu(false); };
$('msgB').onclick = toMenu; $('quitBtn').onclick = toMenu;
$('pauseBtn').onclick = () => { $('pauseBtn').blur(); togglePause(); };
$('resumeBtn').onclick = togglePause;

function drawPreview() {
  const pv = $('preview').getContext('2d');
  pv.clearRect(0, 0, 170, 140);
  pv.fillStyle = 'rgba(0,0,0,.25)'; pv.beginPath(); pv.ellipse(80, 120, 50, 8, 0, 0, 7); pv.fill();
  drawPet(pv, 74, 118, 3, 1, tick * 0.12, false, pet, { mood: tick % 420 > 360 ? 'happy' : 'normal', blink: tick % 170 < 7, talk: talkT > 30, pant: false });
}
function chips(id, map, key, after) {
  const box = $(id); box.innerHTML = '';
  Object.entries(map).forEach(([k, label]) => {
    const b = document.createElement('button'); b.className = 'chip' + (pet[key] === k ? ' sel' : ''); b.textContent = label;
    b.onclick = () => { pet[key] = k; if (after) after(); save(); buildMenu(); }; box.appendChild(b);
  });
}
function swatches(id, list, key, hidden) {
  const box = $(id); box.innerHTML = ''; box.parentElement.style.display = hidden ? 'none' : '';
  list.forEach(col => {
    const b = document.createElement('button'); b.className = 'sw' + (pet[key] === col ? ' sel' : ''); b.style.background = col;
    b.setAttribute('aria-label', key + ' ' + col);
    b.onclick = () => { pet[key] = col; save(); buildMenu(); }; box.appendChild(b);
  });
}
function buildMenu() {
  if (document.activeElement !== $('pName')) $('pName').value = player.name; if (document.activeElement !== $('pEmail')) $('pEmail').value = player.email;
  $('badgesBtn').textContent = `My badges (${badgeCount()}/10)`;
  const paused = state === 'pause', dog = isDog();
  chips('oSpecies', { dog:'Dog', cat:'Cat' }, 'species', () => { if (!BREEDS[pet.species][pet.breed]) pet.breed = Object.keys(BREEDS[pet.species])[0]; });
  const bm = {}; Object.entries(BREEDS[pet.species]).forEach(([k, v]) => bm[k] = v.label);
  chips('oBreed', bm, 'breed');
  chips('oGender', { girl:'Girl', boy:'Boy' }, 'gender');
  swatches('oFur', FURS, 'fur');
  chips('oClothes', CLOTHES, 'clothes'); swatches('oClothesCol', COLORS, 'clothesCol', pet.clothes === 'none');
  chips('oHat', HATS, 'hat'); swatches('oHatCol', COLORS, 'hatCol', pet.hat === 'none');
  const au = $('oAudio'); au.innerHTML = '';
  [['music', 'Music'], ['sound', 'Sound effects']].forEach(([k, label]) => {
    const b = document.createElement('button'); b.className = 'chip' + (opts[k] ? ' sel' : ''); b.textContent = `${label}: ${opts[k] ? 'on' : 'off'}`;
    b.onclick = () => { opts[k] = !opts[k]; audio(); applyVol(); save(); buildMenu(); }; au.appendChild(b);
  });
  { const w = WORLDS[worldName], f = FACTS[worldName];
    $('worldInfo').innerHTML = f ? `<h3>${w.label}</h3><p>${f.intro}</p><p class="g">${w.blurb.replace(/^[^—]*— /, '').replace(/^./, m => m.toUpperCase())}</p><p class="g">${['Easy', 'Medium', 'Hard'].map((n, i) => n + ': ' + (THEMES[w.levels[i]].scene || w.label)).join(' · ')}</p><p class="g">${hasBadge(worldName) ? '★ Badge earned ' + niceDate(prog[worldName].date) : 'Rounds finished here: ' + [0, 1, 2].filter(i => done(worldName, i)).length + ' of 3. Finish all three to earn the badge.'}</p><b>Special things to look for</b><ul>${f.see.map(t => `<li>${t}</li>`).join('')}</ul>`
                                 : `<h3>${w.label}</h3><p>${w.blurb}</p>`; }
  const box = $('levelBtns'); box.innerHTML = '';
  [['Easy', 'Round 1'], ['Medium', 'Round 2'], ['Hard', 'Round 3 · final']].forEach(([n, s], i) => {
    const b = document.createElement('button'); b.className = 'big'; b.disabled = i > unl(worldName);
    b.innerHTML = `${n}<small>${i > unl(worldName) ? 'Locked — clear ' + ['', 'Easy', 'Medium'][i] + ' here' : (done(worldName, i) ? '✓ ' : '') + (THEMES[WORLDS[worldName].levels[i]].scene || s)}</small>`;
    b.onclick = () => startLevel(i); box.appendChild(b);
  });
  const say = dog ? 'Woof' : 'Meow';
  $('hearBtn').textContent = say + '!'; $('touchSpeak').textContent = say;
  $('menuSub').textContent = paused ? 'Change your look or the scenery, then jump back in.'
    : `Run home through three rounds. ${dog ? 'Dogs eat bones — fish will cost you a heart.' : 'Cats eat fish — bones will cost you a heart.'}`;
  $('helpText').innerHTML = `Move: &larr; &rarr; or A / D &nbsp;·&nbsp; Jump: Space, &uarr; or W (hold longer to jump higher; hold 5 seconds for a rocket) &nbsp;·&nbsp; ${say}: B &nbsp;·&nbsp; Pause: P or Esc.<br>` +
    `Collect ${dog ? 'bones' : 'fish'} and never touch ${dog ? 'fish' : 'bones'}. Jump on robot vacuums and crows to knock them out; a ${say.toLowerCase()} startles the ones nearby for a moment. Avoid spikes and pits.`;
}
