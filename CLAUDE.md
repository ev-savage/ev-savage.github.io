# Savage Zone — Everett's Website

## About this project
This is Everett Savage's personal website, hosted on GitHub Pages at **ev-savage.github.io**.
It's a small static site split across a few files: `index.html`, `css/styles.css`, `js/main.js`, `js/games.js`.
Photos go in the `photos/` folder.

## IMPORTANT: Always commit AND push after every change

After making any change to this site, **always commit and push to `main` without asking**.
Pushing to main is what makes the site go live on the internet — Everett can refresh his browser and see the results immediately.

Do this after every successful edit:

```bash
git add -A
git commit -m "<short description of what changed>"
git push origin main
```

Do NOT wait for Everett to ask. Do NOT ask for permission first. Just do it.
The whole point is that he can see his site update in seconds — that's what makes coding exciting for him.

## Site structure

- `index.html` — HTML only (structure & content)
- `css/styles.css` — all CSS (dark/light theme, layout, animations, responsive)
- `js/main.js` — typewriter, theme toggle, nav, facts, scroll reveal, gallery, Artemis countdown, footer year
- `js/games.js` — all 4 arcade games (Hunt, Snake, Tetris, Clicks) + tab switcher
- `photos/` — images for the hunting & fishing gallery
- `favicon.svg` — the browser tab icon

## Design system

| Token | Value | Used for |
|---|---|---|
| `--accent-green` | `#00ff88` | Primary neon accent |
| `--accent-blue` | `#00d4ff` | Electric blue accent, also used for Artemis section |
| `--bg-primary` | `#0a0a0a` | Page background (dark mode) |
| `--bg-card` | `#111827` | Card backgrounds |
| Font: Orbitron | Google Fonts | Headings, titles, labels |
| Font: Rajdhani | Google Fonts | Body text |

## Sections

1. **Hero** — animated title + typewriter effect
2. **Interests** — 4 cards: Roblox, Hunting & Fishing, Baseball, Coding
3. **Games** — tabbed: Savage Hunt (whack-a-mole), Snake, Tetris, Clicks
4. **Artemis II** — live mission tracker with JPL HORIZONS data + NASA images
5. **Facts** — random facts about Everett

## Adding content

- New interests card: copy an existing `.card` block in `index.html`, change the emoji, title, and `--c-accent` color
- New game: add a tab button + tab panel in `index.html`, add logic in `js/games.js`
- New gallery photos: add `<div class="gallery-item">` blocks inside `.gallery-grid` in `index.html`
- New facts: add to the `facts` array in `js/main.js`
