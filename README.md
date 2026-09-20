# bite-gpui.github.io

The marketing site for **bite-gpui** — a modular re-architecture of GPUI, told
through a burger metaphor. The framework is deconstructed into an acyclic stack of
five crates, and the page walks you down it tier by tier: the top bun is the
runtime harness, the patty is the authoring DSL, and the plate is the OS SPI that
links nothing.

This repository is the **website**, not the framework. It is a static Astro build
with no client-side framework, no Tailwind, and no runtime dependencies — HTML,
CSS and a few hundred lines of vanilla JS, under 40 KB gzipped in total.

## Quick start

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve dist/ locally
```

Node 22.12+ (see `engines` in `package.json`).

When running the dev server from an agent or script, use background mode so it
does not hold the terminal:

```sh
astro dev --background   # then: astro dev status | logs | stop
```

## The crate stack

The whole page is an argument for this table. Every section, colour and
illustration is keyed to it.

| Crate | Tier | Role |
| --- | --- | --- |
| `crates/gpui` | The facade | Re-exports the three below, so `use gpui::*` compiles unchanged. |
| `gpui_runtime` | Top bun | Application, event loop, `FramePipeline`. |
| `gpui_authoring` | Patty | Reactive store, `div`, bifurcated `Window`. |
| `gpui_types` | Leaf | `Pixels`, `Bounds`, `Rgba`, `Point`. Zero dependencies. |
| `gpui_engine` | Bottom bun | Scene IR, `LayoutEngine`, `SceneRenderer`. |
| `gpui_platform` | Plate | Acyclic root. Trait-only OS SPI; links zero drivers. |

## Page structure

`src/pages/index.astro` composes the sections in order. Each component is
self-contained: markup, scoped-by-convention styles (all CSS lives in
`src/styles/global.css`) and its own `<script>`.

| Component | Section | What it does |
| --- | --- | --- |
| `Nav.astro` | Header | Sticky nav. Wordmark plus links and the install CTA on wide screens; a hamburger with a drop-down sheet below 820px. |
| `Journey.astro` | `#journey` | Acts I–II. The scroll-linked hero: the burger unstacking layer by layer, with click-to-inspect panels and in-place captions. |
| `ComboStudio.astro` | `#capabilities` | Act III. Two-stage stepper (condiments → beverages) driving a dual-file terminal. |
| `Benchmarks.astro` | `#benchmarks` | Act IV. Animated frame-time bars and the diner receipt. |
| `Quickstart.astro` | `#quickstart` | Tabbed code snippets: install, hello-window, Parley, headless test. |
| `Footer.astro` | Footer | Links and licensing. |

Note that `Journey.astro` is by far the largest component and carries most of the
project's complexity: the burger is five absolutely-positioned `<svg>` layers whose
offsets are interpolated from a single `--explode` custom property set by a scroll
handler.

## Design system

Theme: **Variant 2B — Smoked Malt & Muted Herb Sage**.
Full guide: [`design/DESIGN-SYSTEM.md`](design/DESIGN-SYSTEM.md).

Three rules matter most day to day:

- **`src/styles/global.css` `:root` is the source of truth.** Change a token there
  *before* updating any documentation.
- **Style with `var(--token)`, not hex.** There is no Tailwind in the build. The
  one deliberate exception is the burger artwork, which uses literal fills.
- **Two hues are load-bearing:** `--brand` (`#8FA89B`, every interactive
  affordance) and `--malt` (`#D5B895`, the logo mark and headline ramp only). No
  neon greens, saturated blues or magentas.
- **Responsive rules live in one place,** the media queries at the tail of
  `global.css`. The mobile hero is *re-composed* rather than reflowed; the
  breakpoints and the reasoning are in `DESIGN-SYSTEM.md` §6.1.

## Scripts

`scripts/` holds two one-off generators, both kept because they cannot be
reproduced by hand:

```sh
sh scripts/build-logo.sh                       # regenerate favicon + icon kit from public/logo.svg
python3 scripts/render-burger.py out.png 1360  # compose the five burger layers to a PNG
python3 scripts/render-burger.py out.png 1360 --explode 1            # the unstacked state
python3 scripts/render-burger.py out.png 1360 --explode 1 --spread 63 # as it lands on a 900px-tall window
```

`render-burger.py` exists because the burger's five layers are separate `<svg>`
elements positioned by CSS, so they are never rendered together outside a browser.
It reads `--base`, `--base-ex`, `--w` and `--drift` straight out of
`global.css`, mirrors the two CSS `drop-shadow`s as SVG primitives (Inkscape has
no `feDropShadow`), and shells out to Inkscape. Review its output at ≥1360px and
crop — reviewing at 620px repeatedly hid real defects. Requires `inkscape` and
ImageMagick on `PATH`.

Design source artwork lives in `design/`: `logo-source.jpeg` is the original
potrace input, and `DESIGN-SYSTEM.md` §2.7 records the illustration palette and
the findings behind the burger's shading.

## Deployment

`npm run build` emits `dist/`; `dist/` is gitignored. There is **no** deploy
workflow in this repository, and `astro.config.mjs` is intentionally empty: the
repo is named `bite-gpui.github.io`, so it is served from the org's root and needs
no `site` or `base`. Publishing is a separate step — either point GitHub Pages at a
branch containing the build output, or add a workflow that runs `npm run build` and
uploads `dist/`.
