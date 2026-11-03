# ISIDRIS — editable browser-game starter

A simple, offline-friendly, Kingdom-of-Loathing-style browser RPG **shell** for your own art and writing. No account, server, build tools or coding packages required.

## Start the game

1. Unzip the project folder.
2. Open **`index.html`** in Chrome, Safari, Firefox, or Edge.
3. Explore the three sample locations. Your progress is saved automatically in your browser's local storage.

**Important:** Keep the folder structure intact. The HTML file loads the other files by relative paths. You can later upload the same files to a static host, such as GitHub Pages or Netlify.

## Which file do I edit?

| File | What it controls |
| --- | --- |
| `js/game-data.js` | **Story text, rooms, choices, items, lore, quests, character name**. Start here! |
| `css/style.css` | Colors, fonts, column widths, image height, overall appearance. |
| `index.html` | Page structure: the main scene, record tabs, headers. |
| `js/game.js` | Engine: buttons, moving around, quest triggers, equipment, saving. Leave it alone unless customizing behavior. |
| `assets/scenes/` | Three original SVG sample images. Replace with your own drawings, JPGs, PNGs, etc. |

## The five-minute editing tour

### 1. Change text in a scene

Open `js/game-data.js` in any text editor. Find the location called `"salt-steps"` and change its `title`, `region`, and `description` array. **Keep the quotation marks, commas and square brackets.** Example:

```js
"salt-steps": {
  title: "A New Location Name",
  region: "Western Coast",
  chapter: "Chapter I · Arrival",
  image: "assets/scenes/my-own-harbor.jpg",
  imageAlt: "A hand-drawn coastal settlement",
  description: [
    "This is my first paragraph.",
    "This is a second paragraph."
  ],
  choices: [ /* your choices go here */ ]
}
```

### 2. Use your own image

Copy `my-own-harbor.jpg` into `assets/scenes/`, then set that location's `image` to `"assets/scenes/my-own-harbor.jpg"`. The scene box crops pictures to fit; to change how tall it is, edit the `.scene-visual` rule in `css/style.css`.

### 3. Add another location

Copy an entire location block inside `locations` (including its `choices` list), paste it below an existing one, and assign a **new unique ID** such as `"temple-ruins"`. Then give another location a travel choice:

```js
{
  id: "harbor-to-temple",
  label: "Visit the temple ruins",
  hint: "Follow the overgrown track.",
  goTo: "temple-ruins",
  result: "You arrive at the forgotten ruins."
}
```

`goTo` must match the new location's ID exactly. The new location will automatically become available on the **Map** tab once visited. Travel choices are repeatable unless you add `once: true`.

### 4. Add a choice that reveals lore or gives an item

Create the item in `items`, or lore page in `lore`, and reference its ID in a choice:

```js
{
  id: "find-ancient-coin", // Must be unique across the game.
  label: "Search beneath the fallen column",
  hint: "There might be something in the dust.",
  once: true,
  result: "You found an ancient coin!",
  effects: {
    itemsAdd: ["ancient-coin"],
    loreDiscover: ["forgotten-temple"],
    silver: 2,
    renown: 1
  }
}
```

**Supported choice effects** (all optional):

- `itemsAdd: ["item-id"]` / `itemsRemove: ["item-id"]`
- `loreDiscover: ["lore-id"]`
- `questsStart: ["quest-id"]` / `questsComplete: ["quest-id"]`
- `silver: 5` / `silver: -5` / `renown: 1`
- `flags: ["secret-door-open"]` (sets a custom boolean flag)

**Supported `requires` conditions** (all optional; combined conditions must all be true):

```js
requires: {
  hasItem: "merchant-seal",
  questActive: "last-manifest"
}
```

You may use `hasItem`, `notItem`, `flag`, `notFlag`, `questActive`, and `questComplete`. If no `requires` exists, the choice is always available (unless consumed with `once: true`).

### 5. Add equipment

In `items`, use `slot: "head"`, `"body"`, `"hand"`, or `"relic"`. Then the inventory will show an **Equip** button automatically. To make an item non-equippable, set `slot: null`.

### 6. Customize the look

At the very top of `css/style.css`, change the color variables `--sea`, `--paper`, `--gold`, etc. To adjust the left/right column widths, edit:

```css
.game-layout { grid-template-columns: minmax(0, 1.88fr) minmax(330px, .9fr); }
```

Try changing `1.88fr` to `2.2fr` to give the main console more room.

## Saving and testing

The game saves after actions in the browser's `localStorage`. If you change starting money, starting items, or first location in the data file, press **New game** to see the updated starting state (this discards your previous save). Your save stays on that browser/device; it does *not* sync between devices.

## What the shell does NOT include yet

This is a starter for a *narrative game*: it has navigation, narrative choices, equipment, lore, quests, a discovered-location map, a journal, and local saving. It does **not** yet have combat, multiplayer, a login, an actual mapped world with coordinates, procedural content, or a backend. Those features can be added later.

The demo names, characters, and mini-quest are merely examples. Replace them freely with your own Isidris setting.
