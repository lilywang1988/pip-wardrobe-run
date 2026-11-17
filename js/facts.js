/* Paws Run — facts.js
   Teaching content: tag() labels pinned to scenery (TAGS), the two fact lines per scene (FACT1, FACT2) and the menu cards (FACTS). */
'use strict';

/* ---------- brief fact labels pinned to the scenery ---------- */
function tag(x, y, text, dy) {
  if (x < 30 || x > VW - 30) return;
  c.font = 'bold 12px ui-rounded, "Trebuchet MS", sans-serif';
  const w = c.measureText(text).width + 18, lx = Math.max(w / 2 + 6, Math.min(VW - w / 2 - 6, x)), ly = y + (dy || -24);
  c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(lx, ly); c.stroke();
  c.fillStyle = '#fff'; dot(c, x, y, 2.4);
  c.fillStyle = 'rgba(8,10,30,.62)'; rr(c, lx - w / 2, ly - 10, w, 20, 10);
  c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, lx, ly + 1); c.textBaseline = 'alphabetic';
}
const TAGS = {
  moon() { tag(720 - camX * 0.015, 168, 'Earth, 384,000 km away', 26); },
  mercury() { tag(760 - camX * 0.01, 150, 'The Sun looks 3× wider here', 44); },
  venus() { const id = 1 + Math.floor(camX * 0.2 / 460), x = 460 - (camX * 0.2) % 460 + 140, h = 150 + hash(id) * 70; tag(x, 470 - h - 6, 'Volcano: Venus has the most', -30); },
  mars() {
    tag(200 - camX * 0.01, 80, 'Phobos', 22); tag(330 - camX * 0.01, 58, 'Deimos', 22);
    const id = 1 + Math.floor(camX * 0.2 / 380), x0 = 380 - (camX * 0.2) % 380 + 60, w = 120 + hash(id) * 80, h = 60 + hash(id + 3) * 55; tag(x0 + w / 2, 470 - h, 'Mesa', -22);
    tag(((tick * 0.6 - camX * 0.3) % (VW + 300) + VW + 300) % (VW + 300) - 150, 286, 'Dust devil', -22);
  },
  jupiter() {
    tag(((640 - camX * 0.06 + tick * 0.05) % (VW + 400) + VW + 400) % (VW + 400) - 200, 300, 'Great Red Spot: a storm wider than Earth', 30);
    tag(262 - camX * 0.01, 112, 'Moons', 24);
  },
  saturn() { tag(VW * 0.55 - camX * 0.02 - 60, 262, 'Rings of ice and rock', -30); tag(360 - camX * 0.012, 150, 'Titan, its giant moon', 28); },
  uranus() { tag(285 - camX * 0.02, 254, 'Sideways rings: Uranus is tipped over', 28); },
  neptune() { tag(640 - camX * 0.05, 150, 'Great dark storm', -26); tag(170 - camX * 0.012, 106, 'Triton orbits backwards', 26); }
};
const FACT1 = { grass:'Earth: the only world known to have life', ocean:'Earth: 71% of the surface is ocean', sky:'Earth: air scatters sunlight, so the sky is blue',
  moon:'Moon: no air, so the sky is black even by day', mercury:'Mercury: 430 °C by day, −180 °C at night', venus:'Venus: the hottest planet, about 465 °C',
  mars:'Mars: red from rusty iron dust', jupiter:'Jupiter: 1,300 Earths would fit inside', saturn:'Saturn: light enough to float in water',
  uranus:'Uranus: it may rain diamonds here', neptune:'Neptune: winds reach 2,000 km/h' };
const FACT2 = { grass:'Grasslands grow on every continent but Antarctica', ocean:'The ocean holds 97% of Earth\u2019s water', sky:'Clouds are tiny drops of water and ice',
  moon:'Footprints here can last millions of years', mercury:'A year here is only 88 Earth days', venus:'A day on Venus is longer than its year',
  mars:'A Mars day is 24 hours 37 minutes', jupiter:'A day here lasts under 10 hours', saturn:'Saturn has the most known moons',
  uranus:'Uranus is the coldest planet: −224 °C', neptune:'A year here is 165 Earth years' };

/* short introductions and things to observe on each world */
const FACTS = {
  mercury: { intro:'The smallest planet and the closest to the Sun. A year lasts only 88 Earth days, and it has almost no air and no moons.',
    see:['The Sun looks about three times wider than it does from Earth.', 'Craters everywhere: with no air or weather, nothing wears them away.', 'Extreme temperatures, from about 430 °C by day to −180 °C at night.'] },
  venus: { intro:'Earth\u2019s neighbour and near-twin in size, wrapped in a thick carbon-dioxide atmosphere that makes it the hottest planet, around 465 °C.',
    see:['Volcanoes: Venus has more of them than any other planet.', 'Yellow clouds of sulfuric acid, with lightning flashing inside them.', 'It spins backwards, and one day there lasts longer than its year.'] },
  earth: { intro:'Our home, and the only world known to have life. About 71% of its surface is ocean, and its air makes the sky blue.',
    see:['Green grassland with trees and flowers in the Easy round.', 'The open ocean in the Medium round.', 'Clouds and blue sky high above the ground in the Hard round.'] },
  moon: { intro:'Earth\u2019s only natural satellite, about 384,000 km away. It always shows us the same face, and twelve people have walked on it.',
    see:['Earth hanging in a black sky: with no air, the sky is dark even in daytime.', 'Craters and grey dust, where footprints can last for millions of years.', 'One-sixth gravity, so every jump is huge and slow.'] },
  mars: { intro:'The Red Planet, coloured by rusty iron dust. A day is 24 hours 37 minutes, and it has two tiny moons, Phobos and Deimos.',
    see:['Olympus Mons, the tallest volcano in the solar system, about 22 km high.', 'Flat-topped mesas and swirling dust devils.', 'A butterscotch-coloured sky, with polar ice caps at the ends of the planet.'] },
  jupiter: { intro:'The largest planet: more than 1,300 Earths would fit inside. It is a gas giant with no solid ground, and it spins once in under 10 hours.',
    see:['The Great Red Spot, a storm wider than Earth that has raged for centuries.', 'Striped cloud bands racing in opposite directions.', 'Lightning in the clouds, and dozens of moons, four of them found by Galileo.'] },
  saturn: { intro:'The ringed planet. Its rings are billions of pieces of ice and rock, and Saturn is so light for its size that it would float in water.',
    see:['The great rings arching across the sky.', 'Golden cloud tops and drifting ice sparkles.', 'It has the most known moons of any planet, including giant Titan.'] },
  uranus: { intro:'An ice giant that rolls around the Sun on its side, tilted about 98 degrees. Methane in its air gives it a blue-green colour.',
    see:['Its thin rings standing almost upright because of the sideways tilt.', 'Diamond rain: scientists think diamonds may form deep inside.', 'The coldest atmosphere of any planet, about −224 °C.'] },
  neptune: { intro:'The farthest planet, found in 1846 by mathematics before anyone saw it. One trip around the Sun takes 165 Earth years.',
    see:['The fastest winds in the solar system, up to about 2,000 km/h.', 'A great dark storm drifting through deep blue clouds.', 'Triton, a large moon that orbits backwards.'] }
};
