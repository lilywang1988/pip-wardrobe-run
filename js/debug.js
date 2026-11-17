/* Paws Run — debug.js
   A small hook (window.__game) used only by automated tests. */
'use strict';

/* test hook */
window.__game = { LEVELS, startLevel, get P() { return P; }, get L() { return L; }, get state() { return state; }, keys, press, step, speak, openBadges, hasBadge, pet, drawPet, BREEDS, WORLDS, forceShower() { nextShower = 0; },
  _lives(n) { lives = n; } };
