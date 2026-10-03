# Handoff: "My Dock" strip for jeanettengo.com (v4 evolving in place)

Paste or save this in the repo (e.g. `HANDOFF.md`) and tell Claude Code:
"Read HANDOFF.md. Start with Step 1 (the dock strip). Work in small steps, explain what you change, and don't touch anything outside the listed files."

## 0. Where things stand (updated 2026-10-03)

Sections 3 and 4 below describe the original plan. What is actually built differs in places:

- **Folders:** root holds pages only. `css/` (tokens, base, layout, components, `pages/`, `features/`), `js/`, `data/` (registries), `img/` (`profile/`, `dock/`), `docs/`.
- **Nav and footer:** edit `data/site.js`; `js/site-shell.js` renders them on every page.
- **Step 1, dock strip: done** (`css/features/dock.css`). Differences from section 3: the tag reads "What's on my Dock"; tiles are 54px (48px on touch, 42px under 420px wide); the band is two layered washi tapes (gingham over angled stripes), not dots; the photo is pinned like the tag; the nav is transparent at the top of the home page.
- **Sixth tile, Make it Pop! (sparkles):** `button[data-action="party"]` fires a sparkle stream (`js/sparkles.js`, `css/features/sparkles.css`). It has no popup.
- **Popup system: done.** One `<dialog id="popup">` in `index.html`. `js/popup.js` opens it from `button[data-popup]` and holds the shared helpers (`popupEl`, `popupReserveShape`, `popupBackTag`, `popupCloseTag`, `popupOnClose`, `popupOnLeftKey`). `css/features/popup.css` is the shell; words are in `data/popups.js`. A popup without its own builder uses the default layout (intro plus headed lists). A builder is `POPUP_RENDERERS['<id>']` in `js/popups/`; its styles go in `css/features/popups/<id>.css`, scoped with `.popup[data-popup='<id>']`. `paper: true` in `data/popups.js` gives the notebook-paper look (`css/features/popups/paper.css`).
- **Popups built:**
  - **Tools** (`js/popups/tools.js`, `css/features/popups/tools.css`): words are `POPUPS.tools`, one pencil per group.
  - **Side Quests** (`js/popups/side-quests.js`, `data/quests.js`, photos and one video in `img/quests/`): checklist; done quests open a memory.
  - **Off the clock** (`js/popups/off-the-clock.js` is the shell; one file per section in `js/popups/off-the-clock/`, each adding itself to `OFF_CLOCK_SECTIONS`; `css/features/popups/off-the-clock.css`). A scrapbook page, no tabs: each section is a clipping (Interests: a pile of the first three prints; Playlist: the first record, which plays; Books: the first book) with a handwritten title, a subtitle made from the data (two lines max) and a red handwritten "+N more" link; clicking the clipping or the link opens its full view (← back). The record's ▶ sticker plays its preview on the page. The page hugs its content; full views get a fixed height. On phones each clipping is a row. A section with `soon: true` is left off the page.
    - **Interests** (`data/interests.js`, photos in `img/gallery/`): polaroids and postcards with a short caption, no stories.
    - **Playlist** (`data/music.js`): record sleeves; a record with a `preview` link plays and pauses on click.
    - **Books** (`data/books.js`): four books with covers in `img/books/`.
    - **Doodles** (`data/doodles.js`, `img/doodles/`): built, currently disabled with `soon: true` in `sketchbook.js`.
    - **Covers:** list songs and books by title, run `node scripts/fetch-covers.mjs` (dry run), then `--yes`. It saves covers to `img/music/` and `img/books/` and fills in `image`, `alt` and `preview` (iTunes Search API for music, Open Library for books; the credited artist always replaces the typed one).
    - It replaced the separate Doodles and Gallery popups; their dock icons (`img/dock/doodles.svg`, `gallery.svg`) are kept unused.
  - **Map** (`js/popups/map.js`, `css/features/popups/map.css`, `data/places.js`): fixed-height (580px on desktop) worn-chart popup with an interactive canvas globe (drag, pinch, trackpad, keys, +/−, auto-spin that resumes after 6s idle) beside a "Based in" banner and passport stamps (six muted inks, latest year only). Choosing a place shows it as a postcard. Places use `lat`/`lng` on the capital, plus optional `when`, `cities`, `note`, `photo`. `img/map/chart.svg` is the faint compass rose; the world outline `data/land.json` and `js/vendor/d3-geo.min.js` load only when the Map opens.
  - **Palette** (`js/popups/palette.js`, `css/features/popups/palette.css`; the chips are `POPUPS.palette.themes`): the card is an open colour-chip book. The right page has a Pantone-style chip per theme; clicking one previews it on the left page (a mini home page, its shades) without changing the site, and Apply switches the theme. The theme in use is circled in red marker. On phones the book is one page.
- **Colour themes:** Salmon (default), Sage, Lavender, Sky, Butter. `js/theme.js` is loaded in every page's `<head>` before the stylesheets: it puts the saved theme (`localStorage.theme`) on `<html data-theme>` so there's no flash, and defines `setTheme(id)`. `css/themes.css` (after `tokens.css` on every page) re-points the accent ramp and the pale salmon-tinted surfaces per theme. The nav logo is painted in `--accent-400` through a mask, so it follows too. To add a theme: a Layer 1 ramp in `tokens.css`, a block in `themes.css`, a line in `POPUPS.palette.themes`. Keep each theme's 400/500 at least as readable as Salmon's.
- **Tidy pass: done** (2026-10-01): `js/dock.js` renamed `js/popup.js`; comments across the code cut to short, necessary ones (only write comments that explain how something works, not small tweaks); `.DS_Store` untracked; `.prettierrc` has a narrow print width for `data/places.js` only. Don't run Prettier on `js/render-projects.js` or `data/doodles.js`.
- **Next:** real photos for Interests; a one-line take for each book; real doodles, then remove `soon: true`; push and tag `v4.1.0`. Real dock icons still to be exported from Figma into `img/dock/` (same file names).

## 1. About me and how to work with me

- Jeanette, UI/UX designer in Singapore. Little coding knowledge, so explain changes plainly and keep steps small.
- Preferences: surgical, scoped CSS (no broad overrides), no CSS duplication (reuse classes, add variants only when needed), centralised data registries with thin HTML shells, accessibility and mobile-friendliness, fast pages, relative paths (never leading-slash paths).
- Light colour themes only (picked in the Palette popup). Do NOT add dark mode yet.
- Tools: VS Code (Live Server on port 5500), GitHub Desktop on a Mac, Prettier. Commit in small, separate commits ("Refactor css", "Stop tracking .DS_Store", etc.).

## 2. The site

- Static HTML/CSS/JS, no framework. Hosted on GitHub Pages, custom domain jeanettengo.com (`CNAME`). Older v3 lives at jeanettengo.github.io. v4 is being evolved in place (the "desk" site idea is parked).
- Repo root: `index.html`, `projects.html`, `about.html`, `favicon.ico`, `CNAME`, `README.md`, `LICENSE`, `.gitattributes`, `.gitignore`, `.prettierrc`, `.prettierignore`, `.vscode/settings.json`. Folders: `css/`, `js/`, `data/`, `img/`, `scripts/` (`fetch-covers.mjs`), `docs/` (this file), `projects/` (one folder per project with its `img/`; `apa`, `asua`, `ata`, `univus` also have a case study `index.html`).
- Fonts: Nunito (primary), Lexend (secondary) and Gloria Hallelujah (handwriting, for notes), loaded from Google Fonts in `<head>`.
- Pages: `<body data-page="home|projects|about">`. `js/site-shell.js` renders the nav and footer from `data/site.js`. Project cards are rendered by `js/render-projects.js` from `data/projects.js` (home: "Selected Works"; Projects page: a timeline by year).
- Home page (`index.html`): `nav#site-nav`, then `.home-top` holding the sparkle layer, `header.home-page-header` (pinned photo `img/profile/dp_2.jpeg`, "Hi! I am Jeanette.", "I dabble in design") and `section.dock-strip` (the six dock buttons). Below it `main.featured-projects`, then `footer#site-footer`, then the popup `<dialog>` and the scripts. The old fact list (`div.about`) moved into the popups.
- CSS: one file per concern. `css/tokens.css` holds the tokens, `base.css`, `layout.css` (nav, footer), `components.css` (project card, paper tag), `pages/` (`home`, `projects`, `about`, `case-study`), `features/` (`dock`, `sparkles`, `popup`, `popups/<name>`).
  - Layer 1 palette: `--neutral-*`, plus a 25–500 ramp and `-rgb` per theme (`--salmon-*`, `--sage-*`, `--lavender-*`, `--sky-*`, `--butter-*`). Layer 2 roles (components use only these): `--accent-*`, `--accent-a8…a50` (translucent tints), `--text-*`, `--surface-*`, `--shadow-*`, fonts, and the dock, paper, ink, pencil, map and sparkle groups. Legacy aliases are kept at the bottom.
  - Rule: no raw hex/rgb outside `:root`. New colours become new role tokens.
- Known contrast issues (left as-is on purpose): headings salmon-400 on pale pink about 2.5:1 (large text needs 3:1); inactive nav links about 1.7:1; white on salmon-400 (tags, CTA) about 2.7:1. Fix later via `--text-accent`/`--text-heading` pointing at `--accent-500` (about 3.1:1) plus a darker shade for small text.
- Known bug: `gap: -20px` in `.timeline-group` (`css/pages/projects.css`) is invalid.
- Tooling: Prettier (`.prettierrc`: printWidth 100, tabWidth 2, singleQuote, semi, trailingComma es5, endOfLine lf), applied on save via `.vscode/settings.json`. `.prettierignore` skips `img/`, `backup/`, `node_modules/` and minified files. `.DS_Store` is gitignored.

## 3. Design decisions (final for the strip)

Replace the `div.about` fact list with a compact, full-width patterned band called **My Dock**, containing six app-style icons. The facts move into the popups.

- Tagline stays "I dabble in design" for now (worth reconsidering: "dabble" can undersell). Caption "A little about me. Poke around." is removed.
- Band: dotted pattern using `--accent-a20` dots on `--surface-band`, full bleed, about 100px tall.
- "My Dock" label: small paper tag pinned at the band's top-left (overlaps the band's top edge, slight rotation, pin dot).
- Five popup icons, in this order: **Tools, Off the clock, Map, Side Quests, Palette** (plus the Make it Pop! action tile). (Removed: Playground, since all projects incl. personal ones live on the Projects page.)
- Icons look like app icons: rounded-square tile (about 64px, radius 22%) with alternating tints, outlined artwork inside.
- Labels hidden by default; on hover/focus: white outline appears around the icon, the icon scales up and tilts partly out of the square, and the label floats up (fades in from 8px below).
- Touch screens (`hover: none`): 52px tiles with small always-visible labels; six tiles fit in 390px. Reduced-motion users get no transforms.

### Step 1a: HTML (after `</header>`, and delete the old `div.about` block)

```html
<section class="dock-strip" aria-labelledby="dock-title">
  <div class="dock-inner">
    <h2 class="dock-tag" id="dock-title">My Dock</h2>
    <ul class="dock-list">
      <li class="dock-item">
        <button class="dock-btn" type="button" data-popup="tools">
          <span class="dock-tile"><img class="dock-icon" src="img/dock/tools.svg" alt=""></span>
          <span class="dock-label">Tools</span>
        </button>
      </li>
      <!-- same pattern for: off-the-clock, map, side-quests (label "Side Quests"), palette -->
    </ul>
  </div>
</section>
```

### Step 1b: new role tokens (add to the roles layer of `:root`)

```css
--dock-tile-a: var(--accent-50);
--dock-tile-b: #FFF3D6;
--dock-outline: var(--neutral-0);
```

### Step 1c: CSS (append to `styles.css`; later move into `css/features.css`)

```css
/* ── My Dock strip ── */
.dock-strip {
  margin: 40px 0 64px;
  padding: 16px 20px;
  background:
    radial-gradient(var(--accent-a20) 1.2px, transparent 1.8px) 0 0 / 10px 10px,
    var(--surface-band);
  border-block: 1px solid var(--accent-a8);
}
.dock-inner { position: relative; max-width: 1040px; margin: 0 auto; }

.dock-tag {
  position: absolute; top: -34px; left: 0; z-index: 2; margin: 0;
  padding: 5px 14px 5px 24px;
  font: 600 13px var(--font-secondary); color: var(--text-strong);
  background: var(--surface-faint); border-radius: 4px;
  box-shadow: 0 2px 0 var(--accent-a14), 0 4px 10px var(--accent-a14);
  transform: rotate(-3deg);
}
.dock-tag::before {
  content: ""; position: absolute; left: 9px; top: 50%;
  width: 8px; height: 8px; margin-top: -4px; border-radius: 50%;
  background: var(--accent);
}

.dock-list {
  display: flex; justify-content: center; gap: clamp(14px, 3vw, 28px);
  margin: 0; padding: 0; list-style: none;
}
.dock-item { position: relative; }
.dock-item:hover, .dock-item:focus-within { z-index: 3; }

.dock-btn {
  display: block; width: var(--dock-size, 64px);
  padding: 0; border: 0; background: none;
  font: inherit; color: inherit; cursor: pointer; position: relative;
}
.dock-tile {
  display: block; position: relative; width: 100%; aspect-ratio: 1;
  border-radius: 22%; background: var(--dock-tile-a);
  box-shadow: inset 0 0 0 2px rgb(255 255 255 / 70%),
              0 2px 0 var(--accent-a14), 0 6px 12px var(--accent-a14);
  transition: transform .2s ease;
}
.dock-item:nth-child(even) .dock-tile { background: var(--dock-tile-b); }

.dock-icon {
  position: absolute; left: 14%; top: 14%; width: 72%; height: 72%;
  transform-origin: 50% 90%;
  transition: transform .28s cubic-bezier(.3, 1.5, .5, 1), filter .2s ease;
  filter: drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent)
          drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent)
          drop-shadow(0 0 0 transparent);
}
.dock-btn:is(:hover, :focus-visible) .dock-tile { transform: translateY(-2px); }
.dock-btn:is(:hover, :focus-visible) .dock-icon {
  transform: translateY(-14%) rotate(-9deg) scale(1.3);
  filter: drop-shadow(2px 0 0 var(--dock-outline)) drop-shadow(-2px 0 0 var(--dock-outline))
          drop-shadow(0 2px 0 var(--dock-outline)) drop-shadow(0 -2px 0 var(--dock-outline))
          drop-shadow(0 5px 4px rgb(var(--shadow-rgb) / 30%));
}

.dock-label {
  position: absolute; left: 50%; top: calc(100% + 10px); z-index: 4;
  padding: 4px 10px; border-radius: 10px; white-space: nowrap;
  font: 700 12px var(--font-primary);
  background: var(--text-strong); color: var(--surface);
  opacity: 0; pointer-events: none; transform: translate(-50%, 8px);
  transition: opacity .18s ease, transform .25s cubic-bezier(.2, .9, .3, 1.3);
}
.dock-btn:is(:hover, :focus-visible) .dock-label { opacity: 1; transform: translate(-50%, 0); }
.dock-btn:focus-visible { outline: 3px solid var(--accent-500); outline-offset: 6px; border-radius: 16px; }

@media (hover: none) {
  .dock-btn { --dock-size: 52px; }
  .dock-list { gap: 10px; }
  .dock-label {
    position: static; opacity: 1; transform: none; background: none; color: var(--text-body);
    padding: 6px 0 0; max-width: 64px; margin-left: -6px; text-align: center;
    white-space: normal; font-size: 11px; line-height: 1.2;
  }
}
@media (prefers-reduced-motion: reduce) {
  .dock-icon, .dock-label, .dock-tile { transition: none; }
  .dock-btn:is(:hover, :focus-visible) .dock-icon { transform: none; }
}
```

Notes: never put `overflow: hidden` on an ancestor of `.dock-strip` (it would clip the pop-out); the idle and hover `filter` lists must keep the same five `drop-shadow()` functions so the outline animates; relative image paths only.

### Step 1d: icons (Jeanette exports from Figma; use placeholders until then)

SVGs in `img/dock/`: `tools.svg`, `off-the-clock.svg` (record and book), `map.svg`, `side-quests.svg`, `palette.svg`, plus unused `doodles.svg` and `gallery.svg`. Icon artwork only (no tile), transparent square canvas with about 10% padding, same outline weight (about 3px dark brown outline), limited palette, consistent light direction. Concepts: Tools = stitched pen pouch/holder with pencils; Doodles = spiral pad with a smiley; Gallery = photo frame; Map = folded map with pin; Side Quests = sticky note checklist; Palette = fanned paint-chip cards.

## 4. Later steps (original plan; see section 0 for what was built)

1. **Popup system.** One `<dialog id="popup">` in `index.html` plus one script (e.g. `js/popup.js`) that opens a template based on `button[data-popup]`; focus trap and Esc come free with `<dialog>`; return focus to the button on close. Data lives in registry files like `projects-registry.js` (e.g. `data/quests.js`, `data/interests.js`, `data/doodles.js`, `data/places.js`). Reorganise into `css/`, `js/`, `data/` folders in its own commit first.
2. **The six popups** (each styled differently):
   - **Tools:** simple paper note listing categories (Design: Figma, design systems, tokens. AI workflow: Claude, Claude Code, Figma MCP. Build: HTML, CSS, JavaScript, VS Code. Versioning: Git, GitHub Desktop) beside a pen holder whose pencils are labelled per tool. Text in code, pencil-holder art exported.
   - **Doodles** (renamed from Sketchbook): app-style window with All / Drawings / Animated filters and a responsive grid (3 columns, then 2, then 1) of amateur artwork and animated sketches, with handwritten captions and an "animated" badge; lazy-load images.
   - **Gallery** (photo frame icon, personal pictures): polaroids and postcards with captions; click to enlarge with the story behind it.
   - **Map:** where she is based (Singapore), places been (solid pins/chips), next stops (dashed pins/chips); an illustrated map, not literal geography; keep location at city level.
   - **Side Quests:** side quests checklist on textured notebook paper, text and boxes built in code. Done items show a red tick and strikethrough; clicking a done item shows a memory card (date, title, description, optional photo); clicking an unchecked item jiggles it and shows a random line ("Alright! Alright!", "I'll get to it!"). Buttons are real `<button>`s (state comes from data, not from visitors). "pin it back up" closes. Starter quests: Hike Mt. Fuji (done), Learn guitar, get confident on inline skates.
   - **Palette:** an open swatch book of colour families with shades; click a shade, then Preview or Apply to change the theme. Do not build until the theme system exists.
3. **Themes later.** Override only the roles layer on `<html data-mode>` / `<html data-theme>`; set them in a tiny inline `<head>` script before the CSS to avoid a flash; store the choice in `localStorage`. Legibility rules: body text always `--text-body` on surface; accent only for large text/icons/borders and a darker `--text-accent` for small text; pair every fill with its `--on-…` text token; paper items keep light paper and dark ink in every theme; consider OKLCH for hue swaps; build a hidden `theme-test.html` grid and check WCAG AA (4.5:1 body, 3:1 large text/UI).
4. **Performance and accessibility.** Keep total first-load small, SVG/WebP only, lazy-load popup images, load any Spotify embed only on click, respect `prefers-reduced-motion`, every control is a real button with text, keep a plain-text fallback of the facts.
5. **Hosting.** Keep v3 and v4 reachable: tag the current v4 state (`v4`), and if archiving is wanted, copy it to a separate repo (e.g. `portfolio-v4`) with GitHub Pages on (relative paths only). GitHub Pages has no branch previews; use a staging repo or Netlify/Cloudflare Pages for previews.

## 5. Reference mockups

Design artifact with all boards (dock, popups, strip options, hero variants): https://claude.ai/artifact/RjcYgTHRjpbjuS558WpUMf. The most relevant board is "Dock v2 + six popups". Icons in the mockups are placeholder shapes, and captions/places/dates are placeholders ("[Caption]", "[Place]", "[DATE]"). The mockup pre-dates the final "rounded-square tile + hover pop-out" treatment described above.

## 6. Open items

- Confirm `styles.css` refactor is committed and the site looks unchanged.
- Implement Step 1 (HTML, tokens, CSS, placeholder icons), test hover, keyboard focus, and touch emulation in Chrome DevTools, then commit.
- Export the six real icons from Figma.
- Decide whether to reword the tagline.
- Then popup system and registries (Step 4.1 and 4.2).
