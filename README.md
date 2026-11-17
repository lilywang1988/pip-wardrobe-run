# Paws Run

A side-scrolling browser game for children. You play a dog or a cat, dress it up, and run home across the Sun, the Moon and the eight planets. Every world has three rounds (Easy, Medium, Hard), each with its own scenery and short science facts. Finishing all three rounds on a world earns a badge you can download.

Play it: https://lilywang1988.github.io/pip-wardrobe-run/

There is nothing to install or build. The game is plain HTML, CSS and JavaScript with no libraries.

## Running it

- **On your computer:** open `index.html` in a browser. Double-clicking the file is enough.
- **On the web:** GitHub Pages serves the repository as it is. Push to `main` and the site updates.

## What is in the folder

```
index.html        The page: the game canvas, the menu, the badge screen, and the list of scripts
css/style.css     All styling
js/               The game, split into 20 small files (see below)
README.md         This file
```

### The script files

They are listed in the order `index.html` loads them.

| File | What it holds |
|---|---|
| `config.js` | Screen and tile sizes, default physics, the pet options (breeds, fur colours, clothes, hats), and `load()` / `save()` |
| `worlds.js` | `THEMES` (one entry per scene: colours, gravity, sound settings), `WORLDS` (each world and its three scenes), and `setEnv()` |
| `audio.js` | Sound effects, the woof and meow, and the looping tune for each world |
| `levels.js` | The three level layouts |
| `game.js` | The rules: movement, jumping, the rocket, enemies, treats and traps, hearts, finishing a round |
| `draw-utils.js` | Small drawing helpers, plus the bone and fish pictures |
| `pet.js` | `drawPet()`, which draws the dog or cat |
| `tiles.js` | Ground, block and spike tiles, and the dark edge around the screen |
| `scenes-first.js` | Background helpers (sky, stars, hills, craters) and the painter for the first scene of each world, plus Earth's three |
| `facts.js` | Labels pinned to the scenery, the fact lines shown during play, and the menu info cards |
| `scenes-more.js` | The second and third scene of every world |
| `sun.js` | Everything for the Sun in one file |
| `meteors.js` | Meteor showers |
| `render.js` | Draws one frame: background, level, enemies, pet, labels, top bar |
| `badges.js` | Progress, the player's name and email, badge pictures, and saving them |
| `solar-map.js` | The solar-system picker in the menu |
| `menu.js` | Menus, pausing, the message card and the option buttons |
| `input.js` | Keyboard and touch controls |
| `main.js` | The game loop and start-up |
| `debug.js` | A small hook used only by automated tests; safe to delete |

## How the parts work together

### One shared scope, loaded in order

The scripts are ordinary `<script>` files, not ES modules. They all share the page's global scope, so a constant declared in `config.js` (for example `T`, the tile size) is visible in every later file. This keeps the game runnable by double-clicking `index.html`, with no build step or local server.

The cost is that **load order matters**. A file may use anything from the files above it straight away. It may also call functions from files below it, but only from inside its own functions, after everything has loaded. `main.js` goes last because it starts the game.

### The loop

`main.js` runs `frame()` about 60 times a second. Each frame it:

1. calls `step()` in `game.js` to move the game forward by one tick, while a round is being played;
2. calls `render()` in `render.js` to draw the result.

`step()` only changes numbers (positions, hearts, timers). `render()` only draws. Keeping those two apart is the main rule of the code.

### State

A handful of global variables hold the whole game:

| Variable | Meaning |
|---|---|
| `state` | `'menu'`, `'play'`, `'pause'` or `'msg'` (the card shown after a round) |
| `worldName` | The chosen world, such as `'mars'` |
| `envName` | The active scene, such as `'mars2'`. Set by `setEnv()` |
| `levelIdx` | 0, 1 or 2 for Easy, Medium, Hard |
| `L` | The current level: its tile grid, treats, traps, enemies, moving platforms, checkpoint and goal |
| `P` | The player: position, speed, facing, timers |
| `pet` | The chosen look (species, breed, fur, clothes, hat) |
| `prog`, `player` | Rounds finished per world, and the player's name and email |

### Worlds and scenes

A **world** is what you click on the map. A **scene** is what one round looks and sounds like. Each world lists three scenes:

```js
WORLDS.mars.levels   // ['mars', 'mars2', 'mars3']
```

Every scene name is a key into several tables. To follow one scene through the code, search for its name:

| Table | File | What it gives the scene |
|---|---|---|
| `THEMES[name]` | `worlds.js`, `scenes-more.js`, `sun.js` | Tile colours, gravity, particles, sound settings, display name |
| `BG[name]` | `scenes-first.js`, `scenes-more.js`, `sun.js` | The function that paints its background |
| `TAGS[name]` | `facts.js`, `scenes-more.js`, `sun.js` | Labels pinned to things in the background |
| `FACT1[name]`, `FACT2[name]` | same | The line shown at the start of the round, and at the checkpoint |

`FACTS[world]` in `facts.js` holds the introduction and "things to look for" shown in the menu.

The level layout is the same on every world. Only the scene around it changes.

### Gravity

Each theme can set `phys: [gravity, jump speed, run speed]`. Earth is `[0.6, -12.6, 4.8]`. Other worlds scale the first number by their real gravity (Mars is 0.38 times Earth, so `0.227`) and keep the same jump speed, which is why jumps go higher there. Jupiter and the Sun are too heavy to play that way, so they also get a stronger jump and a faster run.

### Levels

`levels.js` builds each level from short calls:

```js
a.ground(0, 28);      // floor from column 0 to 28
a.block(10, 10, 3);   // a 3-wide platform at column 10, row 10
a.gems(10, 9, 3);     // three treats above it
a.trap(22, 12);       // the wrong food
a.slime(14, 21);      // a ground enemy patrolling columns 14 to 21
a.check(61); a.goal(105);
```

Columns and rows are counted in tiles of 36 pixels. Row 13 is the floor. In the code, `gems` are treats, `slimes` are the ground enemies and `bats` are the flying ones; the names are left over from an early version.

### Saving

Everything is kept in the browser's `localStorage` under the key `paws-run`: the pet's look, the chosen world, sound settings, rounds finished, and the player's name and email. Nothing is sent anywhere. A different browser or device starts fresh.

## Common changes

- **Change or add a fact:** edit `FACT1`, `FACT2` or `FACTS` in `facts.js` (first scenes), `scenes-more.js` (second and third scenes) or `sun.js`.
- **Recolour a scene:** edit its entry in `THEMES`. `top`, `dirt` and `dirt2` colour the ground, `brick` the platforms, `sky` the gradient behind everything.
- **Tune a world's gravity:** change `phys` in its theme.
- **Edit a level:** change the calls in `levels.js`. Keep gaps to four tiles or fewer and steps to three rows or fewer, or the heavier worlds become impossible.
- **Add a scene to a world:** in `scenes-more.js`, add a `scene('name', 'base', {...})` line, a painter in `BG`, and entries in `TAGS`, `FACT1` and `FACT2`. Then put the name in that world's `levels` list.
- **Add a new breed, colour or hat:** the lists are in `config.js`; the drawing is in `pet.js`.

## Things to know

- **A world's pieces are spread over a few files.** The first scene lives in `worlds.js`, `scenes-first.js` and `facts.js`; the other two live in `scenes-more.js`. Only the Sun has everything in one file. Searching for the scene name finds every piece.
- **Global names.** Because the files share one scope, a new top-level name must not clash with an existing one. Short names such as `T`, `c`, `L` and `P` are already taken.
- **Downloads.** On the GitHub page, badges download directly. Inside Claude, the page asks for confirmation before saving.
- **Testing.** There are no automated tests in this repository. The game was checked during development by a script that drives `window.__game` (from `debug.js`) in a headless browser. Its scripted player clears Easy and Medium reliably but does not always finish Hard, so the Hard rounds, especially on the Moon, Jupiter and the Sun, have not been confirmed beatable on every world.
