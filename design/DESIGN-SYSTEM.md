# bite-gpui — Design System & Theme Guide

**Variant 2C: Smoked Malt & Smoked Olive Sage** (dark, default)
**Variant 2D: Laurel Sage Daylight** (light, opt-in — see §2.8)

This document defines the visual language, design tokens, colour hierarchy, and
component rules for the bite-gpui brand and documentation web surfaces.

> **Source of truth is the code.** Every value below was read out of the shipped
> implementation, with `src/styles/global.css` `:root` as the canonical token
> block. Where this guide and the code ever disagree, the code wins — and the
> divergence should be logged in §9 rather than silently tolerated.
>
> The site is plain CSS using custom properties. **There is no Tailwind in the
> build** (`package.json` ships only `astro`). §7 offers a Tailwind mapping for
> consumers of this palette _outside_ the site; it is not used here.

---

## 1. Palette Philosophy

The Smoked Malt & Smoked Olive Sage palette balances two complementary worlds:

**Culinary Warmth (Malt & Caramel)** — evokes the physical burger metaphor,
craftsmanship, and the approachable "take a bite" attitude. The warm ramp
carries the brand: the logo mark, the display headline, and atmospheric light.

**Quiet Technical Precision (Smoked Olive Sage & Herb Sage)** — grounded in deep
olive-sage surfaces with calm, botanical sage accents rather than loud cyberpunk
neons.
Sage is the colour of the lettuce layer in the burger illustration, so every
interactive affordance on the page ties back to the metaphor. This keeps long
docs and CLI transcripts comfortable to read.

The guiding constraint: **nothing neon, nothing saturated.** Every hue is either
pitched warm (the malt spectrum) or neutralised toward sage (the olive-sage
canvas and the herb accents).

---

## 2. Colour Palette & Token Reference

### 2.1 Primary Canvas & Surfaces

| Token            | Hex       | RGB        | Role                                                                                                                                                                                                                                    |
| ---------------- | --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg`           | `#121813` | 18, 24, 19 | Primary application background (Smoked Olive Sage).                                                                                                                                                                                     |
| `--bg-2`         | `#131B14` | 19, 27, 20 | Elevated chrome: floating CTA bars, toast fill.                                                                                                                                                                                         |
| `--surface`      | `#162018` | 22, 32, 24 | Cards, secondary buttons (Smoked Olive).                                                                                                                                                                                                |
| `--surface-2`    | `#1C2A20` | 28, 42, 32 | Card hover, nested/raised surfaces.                                                                                                                                                                                                     |
| `--inset`        | `#0D120E` | 13, 18, 14 | Inset panels: code blocks, terminals, chips, captions. **Darker than any surface** — depth comes from going down, not up, in both schemes; the light theme keeps `--inset` recessed too, just as a deeper sage instead of black (§2.8). |
| `--border`       | `#253427` | 37, 52, 39 | Structural borders, dividers, subtle separators.                                                                                                                                                                                        |
| `--border-2`     | `#35493B` | 53, 73, 59 | Emphasised borders: code shells, focused surfaces.                                                                                                                                                                                      |
| `--border-hover` | `#4A5F4F` | 74, 95, 79 | Elevated hover border — shared by `.btn`, `.install-cmd`, `.copy-btn`, `.nav-toggle` and the scrollbar thumb.                                                                                                                           |

The canvas is **Smoked Olive Sage**: the neutral ramp tilts green (G highest, B
just over R) instead of warm soot. Against it the malt / brioche spectrum below
gains apparent warmth through simultaneous contrast, and the bun's dark
caramelised undercuts keep their separation instead of dissolving into the
background as they did on the old `#0B0B0A` soot canvas.

`--inset` deliberately sits _below_ `--bg` in luminance. A panel that reads as
recessed is the theme's primary way of signalling "this is a transcript" without
adding chrome.

### 2.2 Warm Culinary Spectrum (Headline & Brand Anchor)

| Token       | Hex       | RGB           | Role                                                                                       |
| ----------- | --------- | ------------- | ------------------------------------------------------------------------------------------ |
| `--text`    | `#FAF6F0` | 250, 246, 240 | Oatmeal White — headings, primary values, H1 gradient start.                               |
| `--malt`    | `#D5B895` | 213, 184, 149 | Malted Wheat — the logo mark, the H1 gradient midpoint, and the `::selection` text colour. |
| `--toasted` | `#A06C38` | 160, 108, 56  | Deep Caramel — H1 gradient terminator, warm ambient light.                                 |

`--malt` is the brand highlight and has exactly three call sites: `.logo-icon`,
the headline ramp, and `::selection`. Treat every additional use as a design
decision, not a convenience.

### 2.3 Botanical Sage Spectrum (Accents & Metadata)

| Token          | Hex / Value                                  | Role                                                                                                                                   |
| -------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `--brand`      | `#8FA89B`                                    | Botanical Herb Sage — the single interactive accent: terminal `$` prompt, active badges, status pills, focus rings, logo version chip. |
| `--sage-light` | `#B8C9BF`                                    | Sage Fog — **defined but currently unused.** Reserved for a second tier of technical metadata; see §9.                                 |
| `--brand-dim`  | `rgba(143, 168, 155, 0.14)`                  | Sage Mist — used in exactly two places: the hero eyebrow pill fill, and the active stepper index chip.                                 |
| _(derived)_    | `color-mix(… var(--brand) 28%, transparent)` | Eyebrow pill border.                                                                                                                   |
| _(derived)_    | `color-mix(… var(--brand) 35%, transparent)` | Copy-toast border; active stepper chip border.                                                                                         |
| _(derived)_    | `color-mix(… var(--brand) 40%, transparent)` | Active stepper index border; the non-zero order badge border.                                                                          |

The three `rgba(143,168,155,…)` literals that used to spell the sage borders out by
hand are now `color-mix()` on `--brand`, so they follow the accent into the light
theme (§2.8). Only the _brand_ is mixed this way; the crate rails keep their own
tokens.

`--brand` is intentionally aliased to two further tokens: `--types` and
`--facade`. The lettuce layer and the recipe book share the sage, because both
represent "the leaf that ties the stack together".

### 2.4 Technical Text & Neutral Scales

| Token                      | Hex                   | Role                                                                                                           |
| -------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `--text`                   | `#FAF6F0`             | H1/H2, subheads, primary values.                                                                               |
| `--text-2`                 | `#A8A29E`             | Body paragraphs, long-form descriptions, nav links.                                                            |
| `--text-3`                 | `#8B8581`             | Labels, unselected links, file paths, scroll hints.                                                            |
| `--code-dim` / `--syn-cmt` | `#6A655F` / `#827E79` | Code line numbers (`--code-dim`, incidental UI) and `.c` comments (`--syn-cmt`, body text). On `--inset` only. |

### 2.5 Kitchen / Architectural Layer Palette

Each crate tier owns a hue so the same crate is recognisable across the burger
illustration, the captions, the recipe book, and the info panel.

| Token         | Hex       | Kitchen role       | Crate                           |
| ------------- | --------- | ------------------ | ------------------------------- |
| `--platform`  | `#A8A29E` | Steel Serving Tray | `gpui_platform` — OS SPI        |
| `--engine`    | `#C6A15B` | Golden Bottom Bun  | `gpui_engine` — Scene IR        |
| `--types`     | `#8FA89B` | Sage Leaf          | `gpui_types` — Scalar Leaf      |
| `--authoring` | `#C77158` | The Patty          | `gpui_authoring` — Reactive DSL |
| `--runtime`   | `#DDB27A` | Top Bun            | `gpui_runtime` — Harness        |
| `--facade`    | `#8FA89B` | The Recipe Book    | `gpui` — Unified Facade         |

### 2.6 Secondary Colours Held as Literals

These carry meaning but, apart from the receipt and the benchmark bar, are now
**tokenised** so the light theme can retint them; the two exceptions stay
literals because they are artwork-like semantics, not surfaces.

| Hex / Token                 | Role                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mint` (`#A9C3B4`)        | **Mint** — command strings in terminals and the recipe book, `.s` string literals, receipt total, and the "after" benchmark bar label. The "success / command" colour.                                                                                                                                                                                |
| `--code-text` (`#CFC9C0`)   | Code body text on `--inset`.                                                                                                                                                                                                                                                                                                                          |
| `--syn-kw` (`#C2A5D9`)      | `.k` syntax keyword — the one cool hue on the site, permitted only inside code blocks.                                                                                                                                                                                                                                                                |
| `--syn-type` (`#E0BE84`)    | `.t` syntax type.                                                                                                                                                                                                                                                                                                                                     |
| `--syn-fn` (`#A3BFC6`)      | `.f` syntax function — the one cool secondary in code.                                                                                                                                                                                                                                                                                                |
| `--syn-cmt` (`#827E79`)     | `.c` syntax comment.                                                                                                                                                                                                                                                                                                                                  |
| `--brand-hover` (`#A3BCAF`) | `.btn-primary` hover.                                                                                                                                                                                                                                                                                                                                 |
| `#F7F3ED` / `#1C1917`       | Receipt paper / receipt ink. The bench receipt is the only light surface on the site, and it is deliberate: a paper ticket on a kitchen pass. Border and shadow are tokens; the paper is not.                                                                                                                                                         |
| `#E0A79C` / `#C2684F`       | The "before" benchmark bar label / its rust gradient source. Benchmarks encode **before → after** as rust → sage: `.bar-fill.before` is `linear-gradient(90deg, rgba(194,104,79,.4), rgba(194,104,79,.85))` and `.bar-fill.after` is `linear-gradient(90deg, rgba(143,168,155,.5), rgba(143,168,155,.95))`. The ramp is left literal in both schemes. |

### 2.7 Illustration Palettes (not UI tokens)

The burger's five layers are inline SVG gradients in
`src/components/Journey.astro`. They are artwork, not theme, and are listed here
only so a future recolour does not mistake them for tokens.

| Layer (crate)              | Kitchen role          | Gradient stops                                                                                                                       | Strokes                                              |
| -------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Tray (`gpui_platform`)     | Steel platter         | `#ADA79E` → `#85807A` → `#37332F`                                                                                                    | rim `#302C2A`, edge `#B5AFA7`, well `#241F1B`        |
| Bottom bun (`gpui_engine`) | Toasted plancha crumb | crumb `#FFF8ED` → `#FCE0BC` → `#E2B175` → `#B47228` → `#7A3E10`; wall/base `#E0A863` → `#C07C36` → `#7A3F12` → `#4A2408` → `#2A1305` | plancha rim `#F5CB8E`                                |
| Lettuce (`gpui_types`)     | Sage leaf             | `#B0CBBB` → `#8AA694` → `#62806D`                                                                                                    | edge `#54705F`, sheen `#A4CBB6`, occlusion `#1A0C04` |
| Patty (`gpui_authoring`)   | Grilled beef          | top `#7A4830` → `#552C1A` → `#331709`; wall/base `#8A5638` → `#6B4029` → `#4E2A18` → `#3A1F11` → `#26120A`                           | sear `#160702`, lip `#8A5638`, juice `#84482B`       |
| Top bun (`gpui_runtime`)   | Egg-washed brioche    | `#FAF6F0` → `#D5B895` → `#A06C38` → `#693B10` → `#351B06`                                                                            | lip `#F5CB8E`, sesame `#FAF6F0`, dimple `#3D1A04`    |

Every layer except the tray also carries a **crevice shape** at its base, filled
`#1A0C04` — the shade it casts on the layer beneath. The tray carries none: its
ground shadow is the `.burger` filter's job, and a second drawn ellipse under the
plate read as a ghost disc drifting out from under it.

Six rules keep the illustration coherent:

1. **The bun's ramp extends the headline ramp.** Its first three stops are
   exactly `--text` → `--malt` → `--toasted`, with two darker stops carrying it into
   the crust. The hero graphic and the hero type therefore share one gradient family.
2. **One isometric model throughout.** Every horizontal face is an ellipse at
   `ry/rx ≈ 0.16–0.18`, and every solid is either a cylinder (equator ellipse +
   vertical wall + bottom arc) or a dome (crown + flared lip). Flat rectangles must
   not span a silhouette — that is what previously read as stitching across the
   bottom bun and as a hard bar across the patty.
3. **One silhouette, one ramp.** A cylinder is a _single_ path carrying the wall
   and its curved heel, filled with a single vertical gradient, with the crumb or top
   face drawn over it. Do not add a separately filled base. Because the layers are
   independent SVGs painted back to front, any shape that overhangs its own
   silhouette — a flat base ellipse, or a contact shade wider than the lip — is
   visible against its neighbour as a floating dark lobe rather than as shadow.
4. **Contact shading is shaped to the silhouette it belongs to.** The top bun's
   shade is a crescent that traces its own underside and tapers to nothing at the
   lip. A generic ellipse will always protrude where the silhouette curves away,
   which is exactly what reads as "ghosting". The same applies to shade a layer
   _receives_: the leaf's occlusion is a radial gradient **clipped to the leaf**
   (`clipPath#letClip`) and sized to the patty's own width, so it darkens the leaf
   under the patty and fades out before the tips. A ramp across the whole silhouette
   tints whatever pokes out from under the patty, and a lower layer tinted dark
   reads as a ghost shadow of the layer above it.
5. **No SVG filter primitives in the layers.** Every specular is a radial or
   linear gradient fading to `stop-opacity: 0`. An `feGaussianBlur` region is
   re-rasterised on every scroll frame, because the layers animate their `bottom`
   offset — and Inkscape cannot render `feDropShadow` at all, which is why
   `render-burger.py` has to spell the shadow out with primitives to preview it.
6. **Elevation comes from CSS, per layer.** `.burger .layer svg` carries one
   `drop-shadow` whose offset, blur and alpha are all driven by `--explode`: while
   the stack is closed it collapses to a hard contact line (no offset, 1.5px blur,
   70% black) that reads as the layers pressing on each other, and as they part it
   lifts into a wide soft shadow. `.burger` itself carries a second, slower
   `drop-shadow` for the _ground_ shadow, also `--explode`-driven — tight and dark
   under the assembled burger, spreading as it opens. This is the reference's
   per-tier `isoDropShadow`, and it is a _CSS_ filter rather than an SVG one on
   purpose: it follows the silhouette's alpha exactly, so it can never protrude the
   way a drawn ellipse can, and it animates through the cascade without re-encoding
   any artwork. The hover glow replaces the layer filter wholesale, so that rule has
   to restate the entire `filter`.

The crevice shapes are the one part of the artwork that is animated. They are
tagged `class="crevice"` and global.css drives their opacity from `--explode`:
fully opaque while the stack is closed, lifting to a faint shade as the layers
part. That is what gives the closed stack its dark contact lines without leaving
dark lobes floating under the layers once they separate.

#### The lettuce is the constrained layer

The leaf is painted _under_ the patty, so most of its shape is dictated from
outside its own viewBox. It is a wide, almost flat lens rather than a round cup,
and the shape is the answer to four findings that are not worth rediscovering:

- **Its upper edge is the patty's base arc.** That arc is an ellipse's lower half,
  so it runs high at its ends (y ≈ 1.3 of the leaf's 320×44 viewBox) and low at its
  centre (y ≈ 11.2). The leaf's upper edge has to track roughly two units above it,
  or a sliver of the dark page shows through the junction.
- **The tips must drop away, and must not flare.** Earlier versions ran the upper
  edge out to a high horizontal corner at each end. That corner is the only part of
  the leaf the patty does not cover, and because the received occlusion is
  (correctly) narrower than the patty, it stays bright — so it read as two green
  wings pinned to the patty's underside. Widening the occlusion to cover them
  instead produced a dark ghost of the same shape. The fix is shape, not shading:
  the tips now fall to y 18, well below the arc, so each end is a short drooping
  lobe.
- **No notches, and no interior folds either.** A notch on the lower edge exposes
  the bottom bun's bright crumb and reads as petals; on the upper edge it exposes
  whatever is behind, because the patty does not cover the leaf's outer thirds. The
  three curled frill lobes that were the previous answer to this were interior, and
  so safe, but at the size the hero renders they read as three leaves of another
  variety lying on top of this one. The silhouette, the silk sheen and the occlusion
  carry the form on their own.
- **No veins.** A lit rib line is the right idea in a 540-unit workbench draft and
  a scratch at 280. They were faint, then fainter, then removed.

Two numbers are worth keeping in step if the leaf is ever retuned again. Its tips
are pinned to the bottom bun's rim (x 19–301 of the 320 viewBox) — any wider and
they float past the bun with background beneath them. And the occlusion is a
radial gradient **clipped to the leaf's silhouette** and sized to the patty's own
width (rx 131), so it darkens the leaf under the patty and fades to nothing before
the tips.

#### Hit-testing follows the silhouette

`.burger .layer svg` is `pointer-events: none`, and only its painted shapes
(`path`, `ellipse`, …) opt back in. That is load-bearing, not tidiness: as a
replaced element the SVG root is clickable over its whole _box_, and the five
boxes overlap heavily while the stack is closed — so the topmost box won every
hit test. Tapping the tray's middle selected the bun instead, and the leaf was
unselectable at its own centre. Test this with `document.elementFromPoint()` in a
real browser; `render-burger.py` cannot see it.

The same trap catches anything that fades: `.hero-copy` is painted _above_ the
stage, and an element at `opacity: 0` still receives pointer events, so the
invisible hero slab was intercepting taps aimed at the tiers beneath it — a tap on
the patty landed on the copy's install command and copied it instead. The fix is
`.journey-sticky.hero-gone .hero-copy { pointer-events: none }`, toggled from
`--move` in JS because `pointer-events` cannot be interpolated from a number.

#### Closed and exploded extents

`.layer-*` carries two offsets per layer and the distance between them is the
entire unstack. Both ends are bounded — do not expect to push them far:

- **Closed** (`--base`) is set so each band is only as tall as its contact spacing
  — about 21 units of tray ring, 45 of bottom bun, 15 of leaf, 33 of patty and 95 of
  crown, or 209 units in total, under a third of the 640 frame.
- **Exploded** (`--base-ex`) is capped at _both_ ends: the crown may not rise
  behind the header — the header bar is the ceiling of the unstack, budgeted in
  `measureLayout` — and the tray may not drop so far that its in-place caption leaves
  the bottom edge. With the frame centred, the crown's artwork rides `CROWN_RIDE`
  (677) units above the frame's floor, and the floor itself sits at
  `50vh + height/2`, so the header budget is `50vh − headerHeight − 14`. That fixes
  the exploded scale; whatever the crown does not need is handed back as extra
  travel. Two consequences worth knowing:

- **The header is a wall, not a clip.** At every viewport height the crown's
  painted top lands exactly 14 units under the header bar — verified at 660, 760,
  860 and 1060px tall, and on mobile at 820px tall (43 units of clearance there,
  since that layout anchors the stage to the foot of the viewport instead of
  centring it).
- **Tall windows buy travel, short ones pay in size.** At 1200×1060 the burger
  keeps `--scale` 1 and earns 90 units of `--spread`; at 1200×860 the spread is gone
  and the exploded scale drops to 0.97; at 760 tall it is 0.83. Crucially the
  exploded scale is interpolated from `--scale` by `--explode` (see `--scale-now`),
  so a short viewport only costs the burger size _as it opens_ — the assembled hero
  is never shrunk to pay for an unstack it has not performed yet.

`--spread` and `--scale-open` are therefore computed in JS, not CSS: both need the
_measured_ header height, which CSS cannot read. They fall back to `0px` and
`--scale`, which is what a no-JS visitor sees anyway, since `--explode` is also 0.
Each layer adds `--spread * --drift` to its travel, weighted `-1` at the tray
through `+1` at the crown so the five tiers stay evenly spaced as they open, and
`render-burger.py --spread N` previews a given value offline.

The intermediary layers are positioned for _even layer centres_, not even art gaps:
the layers differ in height enough that centring on the artwork leaves the crown
crowded and the tray stranded.

The Combo Studio's side/beverage icons keep their **natural** colours (a red
chilli bottle, an amber mustard, a green relish jar, a violet wasm bottle)
rather than theme tokens. This is intentional: an inline `<symbol>` collapses a
multi-colour illustration to one flat `currentColor`, which would destroy the
icons' legibility. The accent _rail_ beside each row — its monospace crate line,
and the tinted code line the same crate maps to — is the one part that is themed,
via the per-item `color` / `colorLight` pair (§2.8).

### 2.8 Light Theme — Variant 2D · Laurel Sage Daylight

A second, opt-in colour scheme living beside the dark one in the same `:root`
architecture. It is **not** a separate stylesheet: `global.css` keeps every
literal that varies between schemes behind a token, so the light theme is the
`:root[data-theme="light"]` override block and nothing else.

**Activation.** `data-theme="light"` is set on `<html>`. `Layout.astro` writes
it _before first paint_ from an inline bootstrap (stored choice → OS
`prefers-color-scheme` → dark fallback), and `.theme-toggle` in the nav flips it
through `window.applyTheme()`, which also persists to `localStorage['bite-theme']`,
syncs `<meta name="theme-color">` and fires a `bite:themechange` event for
JS-rendered surfaces. With no JS the page is simply the dark default.

**The one structural rule.** The dark theme signals depth by going _down_ into
`--inset` (§4.2). Light mode changes the _values_ but keeps the _ordering_:
the page is Laurel Sage paper, `--inset` is still the recessed extreme (a deeper
sage tint here rather than black), and `--surface` / `--surface-2` keep rising
above it toward white. Preserving `inset < bg < surface < surface-2` is what
lets a chip stay recessed inside a card and an active pill stay lifted out of an
inset track without a single light-specific component rule.

| Token                  | Dark (2C)                | Light (2D)              | Role                                                      |
| ---------------------- | ------------------------ | ----------------------- | --------------------------------------------------------- |
| `--bg`                 | `#121813`                | `#E5ECE3`               | Laurel Sage canvas (the 127° midpoint).                   |
| `--bg-2`               | `#131B14`                | `#EDF4EB`               | Bench band, footer (a step _above_ the page).             |
| `--surface`            | `#162018`                | `#F4F9F2`               | Cards.                                                    |
| `--surface-2`          | `#1C2A20`                | `#FBFDFA`               | Card hover / active pill.                                 |
| `--inset`              | `#0D120E`                | `#D6E2D4`               | Transcripts, code, chips — still the recessed extreme.    |
| `--border`             | `#253427`                | `#B2C7B1`               | Structural borders.                                       |
| `--border-2`           | `#35493B`                | `#9BB69C`               | Emphasised borders.                                       |
| `--border-hover`       | `#4A5F4F`                | `#6E8F72`               | Elevated hover border (was a literal).                    |
| `--text`               | `#FAF6F0`                | `#16241A`               | Primary ink.                                              |
| `--text-2`             | `#A8A29E`                | `#3E5647`               | Body copy.                                                |
| `--text-3`             | `#8B8581`                | `#536754`               | Labels / metadata.                                        |
| `--brand`              | `#8FA89B`                | `#2F5A3D`               | The interactive sage, darkened to hold contrast on paper. |
| `--brand-hover`        | `#A3BCAF`                | `#3C6E4C`               | Primary-button hover (was a literal).                     |
| `--brand-dim`          | `rgba(143,168,155,.14)`  | `rgba(47,90,61,.12)`    | Sage Mist fills.                                          |
| `--sage-light`         | `#B8C9BF`                | `#6E8F78`               | Reserved second metadata tier (still unused).             |
| `--malt`               | `#D5B895`                | `#9A6423`               | Logo mark, headline ramp midpoint.                        |
| `--toasted`            | `#A06C38`                | `#6B3A0C`               | Headline ramp terminator.                                 |
| `--platform`           | `#A8A29E`                | `#58665C`               | Steel tray accent.                                        |
| `--engine`             | `#C6A15B`                | `#7A5618`               | Golden bottom bun accent.                                 |
| `--types`              | `#8FA89B`                | `#2F5A3D`               | Sage leaf accent (aliases `--brand`).                     |
| `--authoring`          | `#C77158`                | `#9E4027`               | Patty accent.                                             |
| `--runtime`            | `#DDB27A`                | `#7E591B`               | Top bun accent.                                           |
| `--facade`             | `#8FA89B`                | `#2F5A3D`               | Recipe book accent (aliases `--brand`).                   |
| `--shade`              | `0 0 0`                  | `27 46 33`              | RGB triplet all shadows mix from.                         |
| `--shade-a`            | `1`                      | `.4`                    | Multiplier on the `--explode`-driven burger shadows.      |
| `--shadow-float`       | `.6` alpha               | `.18` alpha             | Floating panels.                                          |
| `--shadow-card`        | `.45` alpha              | `.14` alpha             | Receipt / raised card.                                    |
| `--shadow-lift`        | `.4` alpha               | `.12` alpha             | Subtle lift.                                              |
| `--shadow-pop`         | `.5` alpha               | `.18` alpha             | Order card / editor window.                               |
| `--nav-fill`           | `rgba(18,24,19,.85)`     | `rgba(229,236,227,.86)` | Scrolled nav fill.                                        |
| `--nav-sheet-fill`     | `rgba(18,24,19,.97)`     | `rgba(244,249,242,.97)` | Mobile nav sheet.                                         |
| `--toast-fill`         | `rgba(19,27,20,.95)`     | `rgba(252,254,251,.95)` | Copy toast.                                               |
| `--caption-hover-fill` | `rgba(18,24,19,.92)`     | `rgba(244,249,242,.94)` | Hovered layer caption.                                    |
| `--wash-sage`          | `rgba(143,168,155,.055)` | `rgba(47,90,61,.07)`    | Hero upper wash.                                          |
| `--wash-malt`          | `rgba(213,184,149,.035)` | `rgba(154,100,35,.06)`  | Hero lower wash.                                          |
| `--grid-line`          | `rgba(250,246,240,.026)` | `rgba(22,36,26,.05)`    | Masked technical grid.                                    |
| `--code-text`          | `#CFC9C0`                | `#23352A`               | Terminal / code body.                                     |
| `--code-dim`           | `#6E6963`                | `#698167`               | Line numbers (incidental UI).                             |
| `--mint`               | `#A9C3B4`                | `#2F6B4A`               | Command strings, receipt total.                           |
| `--syn-kw`             | `#C2A5D9`                | `#8C2D5C`               | `.k` keyword.                                             |
| `--syn-fn`             | `#A3BFC6`                | `#1E5D88`               | `.f` function.                                            |
| `--syn-str`            | `#A9C3B4`                | `#2D6A4F`               | `.s` string.                                              |
| `--syn-type`           | `#E0BE84`                | `#8C531F`               | `.t` type.                                                |
| `--syn-cmt`            | `#8A8681`                | `#4F624F`               | `.c` comment.                                             |

Everything the light block does **not** override is shared verbatim: the radii,
the motion curve, the measured hero choreography, and every illustration
palette (§2.7). Those are artwork, not theme. Three further literals stay literal
in both schemes for the same reason and are deliberately _not_ tokenised:

- The **diner receipt** (`#F7F3ED` paper / `#1C1917` ink) — a paper ticket in
  either kitchen, now with a hairline border so it separates from the light canvas.
- The **benchmark bar** fills and their labels — `before → after` is encoded as
  rust → sage, which is a semantic ramp, not a surface. Only the bar _track_ is a
  token (`--inset`).
- The **Combo Studio's option colours** — per-item data, not tokens. Each entry
  carries an extra `colorLight` field tuned for the sage canvas, and `accentOf()`
  selects it; a `bite:themechange` listener re-renders so the dock and code lines
  retint without a reload.

---

## 3. Gradients & Lighting

### 3.1 The "Take a Bite" Headline Gradient

Applied to the `em` in the H1 so the second line lands toasted:

```css
.hero-copy h1 em {
  font-style: normal;
  background: linear-gradient(
    100deg,
    var(--text) 0%,
    var(--malt) 52%,
    var(--toasted) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

The ramp is built from **tokens**, not hex, so retuning `--malt` or `--toasted`
re-pitches the headline automatically.

### 3.2 Ambient Atmosphere

The hero is lit by two wide radial washes plus a masked technical grid, all on
`.journey`. They diffuse the harsh dark contrast without ever sitting behind
body text at a strength that would hurt legibility.

```css
.journey {
  background:
    radial-gradient(
      ellipse 64% 44% at 50% 42%,
      rgba(143, 168, 155, 0.055),
      transparent 70%
    ),
    radial-gradient(
      ellipse 36% 24% at 50% 88%,
      rgba(213, 184, 149, 0.035),
      transparent 72%
    );
}
/* Masked 64px technical grid — fades out before it reaches the copy. */
.journey::before {
  background-image:
    linear-gradient(rgba(250, 246, 240, 0.026) 1px, transparent 1px),
    linear-gradient(90deg, rgba(250, 246, 240, 0.026) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(
    ellipse 66% 48% at 50% 48%,
    #000 12%,
    transparent 68%
  );
}
```

Sage lights the upper field, malt warms the lower — the same two-hue split as
the headline ramp, rotated to vertical.

### 3.3 Botanical Sage Lettuce Gradient (SVG / Illustration)

The `gpui_types` leaf layer. It runs vertically, not diagonally — the leaf is a
wide, shallow lens, so a horizontal ramp would run along its length and never
reach the shading side:

```xml
<linearGradient id="letG" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0"   stop-color="#B0CBBB" />
  <stop offset=".5"  stop-color="#8AA694" />
  <stop offset="1"   stop-color="#62806D" />
</linearGradient>
```

Note that `letG` is _not_ `--types`/`--brand` (`#8FA89B`) repeated: the illustration
sits a half-step lighter and greener so the leaf reads as food under the patty's
shade, while the crate's accent stays the flat token. See §2.7.

Every layer colour in §2.7 is a CSS variable (via `style="--accent:…"`) applied
to the layer's _hit target and caption_, while the artwork itself keeps literal
fills. That split is what lets a layer glow in its crate colour without
flattening its illustration.

---

## 4. Component Token Matrix

| Component               | Background                                                         | Border                                                        | Text / Foreground                                                                                                                        | Accent / Glow                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Top nav (unscrolled)    | transparent                                                        | transparent                                                   | `--text-2` links                                                                                                                         | `--malt` logo mark, `--brand` version chip                                                                                                                                                                                                                                                        |
| Top nav (scrolled)      | `--nav-fill` + `blur(14px) saturate(160%)`                         | `--border`                                                    | `--text` on hover                                                                                                                        | —                                                                                                                                                                                                                                                                                                 |
| Theme toggle            | `--surface`                                                        | `--border-2`                                                  | `--text-2` icon (`--text` on hover)                                                                                                      | sun shown in dark, moon in light — see §2.8                                                                                                                                                                                                                                                       |
| Primary button          | `--brand`                                                          | `--brand`                                                     | `--bg`                                                                                                                                   | hover `--brand-hover`                                                                                                                                                                                                                                                                             |
| Secondary button        | `--surface`                                                        | `--border-2`                                                  | `--text`                                                                                                                                 | hover bg `--surface-2`, border `--border-hover`                                                                                                                                                                                                                                                   |
| Eyebrow badge pill      | `--brand-dim`                                                      | `rgba(143,168,155,.28)`                                       | `--brand`                                                                                                                                | pulsing `--brand` dot                                                                                                                                                                                                                                                                             |
| Terminal install box    | `--inset`                                                          | `--border-2`                                                  | `$` in `--types`, command in `--text`                                                                                                    | hover border `--border-hover`                                                                                                                                                                                                                                                                     |
| Copy toast              | `--toast-fill` + `blur(12px)`                                      | `color-mix(… var(--brand) 35%, transparent)`                  | `--text`                                                                                                                                 | `--brand` dot + `color-mix(… var(--brand) 70%, transparent)` glow                                                                                                                                                                                                                                 |
| Layer caption           | `color-mix(in srgb, var(--inset) 84%, transparent)` + `blur(10px)` | `--border-2`, left border 3px `--accent`                      | `--text-2` desc, `--text-3` role                                                                                                         | crate `--accent`                                                                                                                                                                                                                                                                                  |
| Layer info panel        | `--surface`                                                        | `--border-2` + **left** 4px `--accent`                        | `.li-name` in `--accent`, `.li-desc` in `--text-2`                                                                                       | role/chips/command chips on `--inset`                                                                                                                                                                                                                                                             |
| Recipe book (facade)    | `--surface`                                                        | `--border-2` + **right** 4px `--facade`                       | `--facade` title, `--mint` commands                                                                                                      | `--facade`                                                                                                                                                                                                                                                                                        |
| Studio stepper          | `--inset`                                                          | `--border-2`                                                  | inactive `--text-3`, active `--text` on `--surface-2`                                                                                    | active index chip on `--brand-dim`                                                                                                                                                                                                                                                                |
| Studio cockpit          | grid `5fr / 7fr`, `align-items: stretch`                           | —                                                             | configure dock (left) · code inspector (right), both stretched to a shared height so their footers line up; one switchable column ≤820px | mobile `Configure ⇄ Code` tabs (`.combo-mobile-tab`)                                                                                                                                                                                                                                              |
| Studio header           | transparent (page)                                                 | `--border` bottom divider                                     | `--text` h2, `--text-2` lede, `--brand` kicker dot                                                                                       | two columns — text block left, step switcher right (`nowrap`, so the text column shrinks rather than wrapping the switcher); the control tightens ≤1140px; stacks ≤820px                                                                                                                          |
| Dock row                | `--inset`, active `--surface`                                      | `1.5px --border-2`                                            | `--accent` icon, `--text-2` label, mono `--text-3` crate line, `--text-3` flavour                                                        | active: plain `--surface` fill, `--accent`-tinted border and `--accent` crate text — **no accent wash**, so the switch on the row stays colourless                                                                                                                                                |
| Dock toggle / radio     | off: `--surface-2` well · on: solid `--text`                       | `--border-2` off / `--text` on                                | off: thumb `--text-3` · on: thumb punched out of the fill in the row's `--surface`                                                       | state is carried by **fill, not hue**: off is an empty well, on is a solid pill, so the enabled control is the highlighted one. The beverages stage re-shapes it into an `18px` radio ring. **Deliberately colourless** — the row's `--accent` crate line carries the identity, never the control |
| Dock footer             | card `--surface`                                                   | `--border` top hairline                                       | `--text-3` summary, `--text-2` mark                                                                                                      | pinned to the foot of the configure card (`margin-top: auto`); doubles as the hovered row's doc-comment, replacing the old standalone info panel                                                                                                                                                  |
| Code shell (Quickstart) | `--inset`                                                          | `--border`                                                    | `--code-text` body, `--code-dim` line numbers                                                                                            | accent per code line                                                                                                                                                                                                                                                                              |
| Editor window           | `--surface`, header + status strips on `--inset`                   | `--border` card + `--border` hairline between the three zones | `--code-text` body, `--code-dim` line numbers, `--text-3` status labels, `--text` readings                                               | code sits straight on the window surface — **no nested panel**; tinted `1px`-less rows carry `--line-accent`                                                                                                                                                                                      |
| Bench receipt           | `#F7F3ED` (paper)                                                  | dashed `#CFC9C0`                                              | `#1C1917` ink                                                                                                                            | `#A9C3B4` total                                                                                                                                                                                                                                                                                   |
| Benchmark bar           | track `--border`                                                   | —                                                             | `.before` label `#E0A79C`, `.after` label `#A9C3B4`                                                                                      | fill gradients rust → sage (§2.6)                                                                                                                                                                                                                                                                 |
| Interactive burger      | translucent plate                                                  | plate `#B5AFA7`                                               | captions as above                                                                                                                        | layer hover glow in crate `--accent`                                                                                                                                                                                                                                                              |
| Scrollbar               | `--bg` track                                                       | —                                                             | thumb `--border-2`                                                                                                                       | thumb hover `--border-hover`                                                                                                                                                                                                                                                                      |

Four structural conventions hold the whole page together and should be preserved
in any new component:

1. **The mirrored rail edge.** Both rails — the recipe book and the layer info
   panel — are built on `--surface` with a `--border-2` outline, and are told
   apart by a 4px accent edge on the side that faces the burger: `--facade` on
   the right of the recipe book, `--accent` on the left of the info panel. That
   edge is the visual signature of "this panel belongs to the stack".
2. **Depth is signalled by the extreme surface.** Transcript surfaces (`--inset`)
   sit at the far end of the luminance range from the card surfaces — the
   _darkest_ panel surface in both schemes (see §2.8) — and are never a mid grey.
3. **Assembled layers must overlap, and each one owns its crevice.** Each
   `.layer` is positioned by `--base`, the distance from the stack's floor to its
   _frame's_ bottom edge — so a taller viewBox pushes the art upward and `--base`
   has to come down by the same amount. The assembled values are chosen so every
   layer's base reaches into the layer beneath it; if a `--base` is raised too far
   the layer's top face clears the shade above it and bare background shows
   through as a gap.
4. **Contact shading is animated, not static.** Each layer carries the shade it
   casts on the layer below, tagged `class="crevice"` and driven by `--explode`
   (see §2.7). A static shade would stay behind as a dark lobe once the layers
   separate.

`scripts/render-burger.py` reassembles the five layers outside the browser so an
artwork or `--base` change can be eyeballed in both the assembled and exploded
states.

---

## 5. Typography

| Role            | Family           | Weights                 | Token    |
| --------------- | ---------------- | ----------------------- | -------- |
| Interface       | `Inter`          | 400, 500, 600, 700, 800 | `--ui`   |
| Code / terminal | `JetBrains Mono` | 400, 500, 600, 700      | `--mono` |

```css
--ui: "Inter", system-ui, -apple-system, sans-serif;
--mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

body {
  font-family: var(--ui);
  background: var(--bg);
  color: var(--text);
}
code,
pre,
.mono {
  font-family: var(--mono);
}
```

Both families are self-hosted-free, loaded from Google Fonts with `preconnect`
in `src/layouts/Layout.astro`, and declared `display=swap`.

Display type uses tight tracking: `h1` is `-.045em`, the generic heading rule is
`-.035em`. Body copy sits at `1.6` line-height for comfortable long-form reading.

---

## 6. Radii, Elevation & Motion

**Radii** — `--r: 12px` for major cards. The working scale is `4 / 6 / 8 / 10 /
12` px, with `99px` reserved for pills and `50%` for dots. Use the smallest
radius that reads as intentional; large radii are for containers only.

**Elevation** — shadows are named tokens mixed from a single `--shade` triplet, so
the same geometry reads as deep on the dark canvas and soft on sage paper (the
light theme lightens the alpha and tilts `--shade` to deep sage; §2.8):

| Token                                  | Dark                                                          | Light     |
| -------------------------------------- | ------------------------------------------------------------- | --------- |
| `--shadow-float` (floating panel)      | `0 18px 40px rgb(var(--shade) / .6)`                          | `… / .18` |
| `--shadow-card` (raised card, receipt) | `0 16px 36px rgb(var(--shade) / .45)`                         | `… / .14` |
| `--shadow-lift` (subtle lift)          | `0 2px 8px rgb(var(--shade) / .4)`                            | `… / .12` |
| `--shadow-pop` (order card)            | `0 10px 24px -10px rgb(var(--shade) / .5)`                    | `… / .18` |
| Accent glow                            | `0 0 14px color-mix(in srgb, var(--accent) 35%, transparent)` | same      |

The raw `rgba(0,0,0,…)` literals that used to spell these out by hand are gone;
the two `--explode`-driven burger shadows multiply their alpha by `--shade-a`
(`1` dark / `.4` light) so the unstack keeps its exact choreography at a
lighter ink.

The burger illustration is the exception to "rare": it carries two animated
shadows — one per layer, one for the whole stack — because that pair is what sells
the unstack. They are documented in §2.7 rule 6 rather than here, since their
values are functions of `--explode` rather than fixed elevations.

**Motion** — one shared easing curve, `--ease:
cubic-bezier(.16, 1, .3, 1)`. Transitions are short (`.15s–.3s`). The scroll
choreography is driven by a single `--move` custom property that the sticky hero
and burger stage both read, so the copy fade and the stack separation can never
drift out of sync.

### 6.1 Responsive behaviour

All four breakpoints live in the tail of `global.css`:

| Width   | What changes                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ≤1140px | The layer-info rail becomes a bottom sheet — the burger plus two side rails stop fitting.                                                                                                                                                                                                                                                                                                                        |
| ≤1024px | The recipe book is dropped.                                                                                                                                                                                                                                                                                                                                                                                      |
| ≤820px  | The nav collapses to a wordmark plus a hamburger, with the links and the CTA in a drop-down sheet — the full row needs ~800px, so it was overflowing well before this point. The scroll-linked hero is also re-composed for portrait: the copy stacks above the stack, the burger is re-based to the foot of its frame and pinned to the foot of the viewport, and the pinned journey drops from 280vh to 200vh. |
| ≤640px  | The stepper and the terminal head wrap, and the hero copy compacts and gives up its eyebrow pill.                                                                                                                                                                                                                                                                                                                |

The nav's sheet is intentionally plain: a button that toggles `is-open` on `.nav` and
`.nav-menu`, and closes on a link tap, `Escape`, an outside tap, or a resize past
the breakpoint. On desktop `.nav-menu` is `display: contents`, so the wrapper
costs nothing and its children are the nav row's items exactly as before it
existed — one list, no duplicated markup to keep in sync.

The mobile hero is the one place where the _illustration's geometry_ changes rather
than just its surroundings, and the reason is the one that already caps the
exploded spread (§2.7): the copy and the exploded stack are competing for a single
viewport. On desktop the copy sits _beside_ the stack, so the stack can be centred;
on a phone it sits _above_ it, so `--base` is re-based to the foot of the frame —
which lengthens the unstack for free, since `--base-ex` is untouched — and the
frame's foot is pinned to the viewport's foot with `transform-origin: 50% 100%` so
the scale cannot lift the plate off it. `--fit` and `--lift` then only bite on
_short_ viewports (≤780px and ≤690px tall), where the copy and a full-size stack
genuinely do not both fit.

The journey is deliberately shorter on mobile than on desktop — 200vh against
280vh. The same fraction of a taller viewport is more screens of scrolling, so the
portrait setting was pinning the page for _longer_ than the landscape one (4.2
screens, against 2.8) to unstack a burger that opens in half a screen. One screen
of travel is enough for the copy to fade, the tiers to part, and the chips to be
read.

Only one affordance is dropped rather than restyled at ≤820px: the scroll hint,
which sits exactly where the crown comes to rest. The in-place captions stay —
they are the only text the unstack has — but compact to a single-line chip (the
crate name and its role, no prose; a three-line card is wider than the layer it
labels here, and the tap-to-inspect sheet carries the description) and move from
_below_ their layer to _above_ it, so that each one lands in the gap that has just
opened and none hangs off the bottom edge. They also fade in later than on
desktop, because a 26px chip needs the tiers to have separated far enough to clear
the artwork on both sides.

---

## 7. Consuming the Palette Elsewhere (Tailwind mapping)

The site does not use Tailwind. If you need these tokens in a Tailwind project —
a docs site, a landing page, a slide deck — this mapping is faithful to §2:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        canvas: {
          base: "#121813", // --bg
          raised: "#131B14", // --bg-2
          card: "#162018", // --surface
          hover: "#1C2A20", // --surface-2
          inset: "#0D120E", // --inset
          border: "#253427", // --border
          edge: "#35493B", // --border-2
          hoverEdge: "#4A5F4F", // elevated hover border (literal)
        },
        malt: {
          oatmeal: "#FAF6F0", // --text
          wheat: "#D5B895", // --malt
          caramel: "#A06C38", // --toasted
        },
        sage: {
          accent: "#8FA89B", // --brand, --types, --facade
          fog: "#B8C9BF", // --sage-light
          mint: "#A9C3B4", // commands / success
          deep: "#62806D", // letG terminator (leaf artwork)
        },
        stone: {
          body: "#A8A29E", // --text-2
          dim: "#8B8581", // --text-3
        },
      },
    },
  },
};
```

For the light theme, drop in the Variant 2D values from §2.8 behind the same
keys — every token in that table maps to one of the names above, plus the
`inset`/`edge` pair which simply lighten instead of darken.

---

## 8. Design Guidelines: Do's & Don'ts

### Do

- **Do** use `--brand` (`#8FA89B`) for interactive command-line elements (`$`),
  feature flags, and leaf-crate badges. It ties directly back to the lettuce
  layer in the visual burger.
- **Do** keep backgrounds deep smoked olive-sage (`#121813`), never pure cold
  black (`#000000`). The green-tilted neutral prevents eye strain, keeps flat
  contrast off the artwork, and flatters the warm malt spectrum.
- **Do** use `#FAF6F0` (Oatmeal White) instead of `#FFFFFF` for primary
  typography, to maintain an organic, warm editorial tone.
- **Do** signal depth by going **down** into `--inset` for transcripts and code,
  rather than adding another raised grey.
- **Do** reference tokens in CSS (`var(--inset)`) instead of pasting hex, so a
  retune propagates. The one deliberate exception is artwork (§2.7).
- **Do** route _anything that differs between the dark and light schemes_
  through a `:root` token. The light theme (§2.8) is nothing but an override
  block; if a variant value cannot be expressed as a token swap, the token is
  missing rather than the rule being wrong.
- **Do** keep `--inset` the _recessed_ extreme in both schemes — the darkest panel
  surface, below the canvas as well as below every card. It is how a transcript
  announces itself without extra chrome.
- **Do** darken accents for the light theme rather than recolouring them: `--brand`
  and the crate hues keep their families and only change value.

### Don't

- **Don't** reintroduce neon or radioactive greens (`#10B981`, `#22C55E`,
  `#00FF66`). They conflict with the culinary theme and overpower the hero
  graphics.
- **Don't** use saturated primary blue or magenta in badges, buttons, or text
  gradients. (`#C2A5D9` and `#A3BFC6` are tolerated **inside code blocks only**.)
- **Don't** use solid opaque backgrounds on floating cards. Always use ~95%
  opacity with `backdrop-filter: blur(...)` to maintain layer depth.
- **Don't** use `--malt` as a general-purpose accent. It is the mark and the
  headline ramp; the interactive accent is `--brand`.
- **Don't** add a second stylesheet, a `.light` class, or per-component hex for
  the light theme. One `:root[data-theme="light"]` override block is the whole
  scheme (§2.8).
- **Don't** flip the light theme's depth model upside down independently of the
  tokens: cards rise toward white _because_ their tokens do, not because a rule
  hardcodes a lighter grey.

---

## 9. Appendix: Spec ↔ Implementation Divergence Log

An earlier written spec for Variant 2B was drawn from a Tailwind CDN draft, not
from the shipped Astro implementation. The following values appeared in that
spec but **do not exist anywhere in this codebase**, so they were not adopted
into this guide:

| Spec claim                                                             | Reality in the code                                                                                                                                                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Charcoal Border `#242220`"                                            | Actual `--border` is `#253427`.                                                                                                                                                                                          |
| "Readable Body Text `#D6D3CD` (stone-300)"                             | Actual `--text-2` is `#A8A29E`.                                                                                                                                                                                          |
| "Muted Metadata `#8C877F` (stone-400)"                                 | Actual `--text-3` is `#8B8581` (raised from `#78716C` for SC 1.4.3; §10).                                                                                                                                                |
| "Dim / Disabled `#57534E`"                                             | No such value; the dimmest code text is `--code-dim` (`#6A655F`), and only on `--inset`.                                                                                                                                 |
| "Toasted Crust `#693B10`" (SVG bun stroke)                             | No such value. Bun artwork stroke stops are in §2.7.                                                                                                                                                                     |
| Plate border `#323742`                                                 | No such value; the tray stroke is `#B5AFA7`.                                                                                                                                                                             |
| Sesame `#FFF2DF`                                                       | No such value; the mark is monochrome and seeds are not separately coloured.                                                                                                                                             |
| Lettuce gradient `#8FA89B / #6F887C / #556E62`                         | No such value; the leaf's `letG` stops are `#B0CBBB / #8AA694 / #62806D`.                                                                                                                                                |
| Sage Mist fill at `15%`                                                | Actual `--brand-dim` is `14%`.                                                                                                                                                                                           |
| Headline gradient `90deg … 50%`                                        | Actual is `100deg` with the malt stop at `52%`.                                                                                                                                                                          |
| Mono font `Fira Code`                                                  | Actual is **JetBrains Mono** (`--mono`).                                                                                                                                                                                 |
| "Sage Fog `#B8C9BF` for feature-flag highlights (`--features parley`)" | `--sage-light` is defined but has **0 usages**. The hero install command renders `--features parley` in plain `--text` inside a single `<code>`; there is no flag-highlight span. Either wire the token up or delete it. |
| Mint `#A9C3B4` as a primary accent                                     | Mint is real but scoped to command strings, `.s` string literals and the receipt total — never body text or buttons.                                                                                                     |
| Tailwind config "drop-in"                                              | The build has no Tailwind; see §7 for an external mapping.                                                                                                                                                               |

Divergences in the _shape_ of the palette (which hue means what) were ignored in
favour of the implementation. Divergences in _principles_ — natural over neon,
sage over saturated, tokens over literals — were mutually consistent and are
preserved in §1 and §8.

If any value above should actually be changed, change it in
`src/styles/global.css` `:root` first and then update §2 — not the other way
around.

### Variant 2C retune: soot → Smoked Olive Sage

The canvas family was retuned from a warm soot ramp to a green-tilted olive-sage
ramp. The warm `--text` / `--malt` / `--toasted` spectrum, the herb-sage
`--brand`, and every illustration palette in §2.7 are unchanged; only the neutral
canvas and border family moved.

| Token         | Variant 2B (soot)      | Variant 2C (olive sage) |
| ------------- | ---------------------- | ----------------------- |
| `--bg`        | `#0B0B0A`              | `#121813`               |
| `--bg-2`      | `#121110`              | `#131B14`               |
| `--surface`   | `#141312`              | `#162018`               |
| `--surface-2` | `#1C1A18`              | `#1C2A20`               |
| `--inset`     | `#0E0D0C`              | `#0D120E`               |
| `--border`    | `#292524`              | `#253427`               |
| `--border-2`  | `#3A3633`              | `#35493B`               |
| hover border  | `#4A453F` (warm crust) | `#4A5F4F` (olive)       |

The scrolled and mobile nav fills, the toast fill, the layer-caption hover fill
and the scrollbar thumb hover moved with the ramp — they carry the same hue as
`--bg` / `--bg-2`, lifted as `rgba(...)`.

---

## 10. Accessibility — Contrast

Contrast is verified by a script, not by eye, so it can be re-run whenever a
token moves:

```sh
node scripts/check-contrast.mjs            # failures + advisories
node scripts/check-contrast.mjs --all      # every check
node scripts/check-contrast.mjs --suggest  # nearest passing colour per failure
```

It reads the two `:root` blocks out of `src/styles/global.css` and the Combo
Studio's per-item accents out of `src/components/ComboStudio.astro`, resolves
hex / `rgb()` / `rgba()` / `color-mix()` / `var()` / alpha compositing, and
measures: **SC 1.4.3** (4.5:1 normal text, 3:1 large), **SC 1.4.11** (3:1 UI
parts) and **SC 2.4.11** (3:1 focus indicator). It exits non-zero on any binding
failure, so it can gate CI.

**Current result: 0 binding failures.** 77 of 85 dark checks and 78 of 85 light
checks pass. Meet the thresholds by construction:

| Requirement                  | Ensured by                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| Body + metadata text ≥ 4.5:1 | `--text` / `--text-2` / `--text-3` on every surface, both schemes                                   |
| Interactive sage ≥ 4.5:1     | `--brand` on every surface; `--brand` on `--bg` is 7.1:1 dark / 6.6:1 light                         |
| Crate rails + labels ≥ 4.5:1 | each of `--platform … --facade` on `--surface` and `--inset`                                        |
| Combo Studio accents ≥ 4.5:1 | all nine side/driver accents on `--surface` and `--inset`                                           |
| Code + syntax ≥ 4.5:1        | `--code-text`, `--mint` and every `--syn-*` on `--inset` **and** `--surface`                        |
| Focus ring ≥ 3:1             | `--brand` outline on page and card                                                                  |
| Switch knob ≥ 3:1            | `--text-3` in the off well (4.1:1 dark / 6.0:1 light); `--surface` on the on fill (15.6:1 / 15.1:1) |
| Primary button               | label `--bg` on `--brand`: 7.1:1 dark / 6.6:1 light                                                 |

Reaching 4.5:1 on the surface the palette is drawn on was the binding constraint,
so these tokens were nudged — no other value moved:

| Token                       | Dark before → after               | Light before → after                                                            |
| --------------------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| `--text-3`                  | `#78716C` → `#8B8581`             | `#5C7261` → `#536754`                                                           |
| `--code-dim`                | `#5C5751` → `#6E6963`             | `#6E8770` → `#698167`                                                           |
| `--syn-cmt`                 | `#5C5751` → `#8A8681`             | `#6E8770` → `#4F624F`                                                           |
| `--platform`                | —                                 | `#5C6B60` → `#58665C`                                                           |
| `--authoring`               | `#C2684F` → `#C77158`             | `#A5462C` → `#9E4027`                                                           |
| `--runtime`                 | —                                 | `#8A6220` → `#7E591B`                                                           |
| Combo Studio accents (§2.8) | parley/rust `#C2684F` → `#C77158` | parley/rust → `#9E4027`, pacing/mustard → `#74591A`, surface/nachos → `#7A5414` |

The first pass was bound by `--inset`, the darkest backdrop in both schemes, so
`--code-dim` and `--syn-cmt` were pitched against it. The editor window then
traded that well for the card's own `--surface` (§4 — the code now sits straight
on the window, with no recessed inner panel), which is the _lightest_ backdrop
the palette is drawn on, and both tokens were lifted a second time for it. They
are now checked against **both** surfaces, `--inset` (the Quickstart code shell)
and `--surface` (the editor).

`--code-dim` (line numbers) is held to **3:1** rather than 4.5:1, because line
numbers are incidental UI rather than prose; `--syn-cmt` (comments) is held to the
full 4.5:1.

The Combo Studio's switches and radios are **deliberately colourless**, and carry
their state by **fill** rather than hue: off is an empty `--surface-2` well with a
dim `--text-3` knob at its left, on is a solid `--text` pill with the row's own
`--surface` punched out of it as the knob. So the control that is switched _on_ is
the one carrying the visual weight, and the per-row accent is never consumed
twice. The accent reaches the eye through the row's crate **line** and the tinted,
`--line-accent`-bordered code line it maps to, which is the tie the colour is
reserved for.

### Advisory (non-binding) non-text contrast

Fifteen checks are reported but not enforced: the hairline `--border` /
`--border-2` separators, the elevated hover border, and the plain switch track's
edge. They sit at **1.3–2.4:1** in both schemes. SC 1.4.11 requires 3:1 only for
parts needed to _identify_ a control or understand a graphic; these hairlines
style regions that are already identified by their fill, position and label, and
every control state that must be legible — the focus ring, the primary button,
and the switch knob in both states — passes. Raising the hairlines to a strict
3:1 would replace the theme's whisper-thin edges with visible strokes;
`--suggest` prints the exact colours if that tradeoff is ever wanted:

| Advisory                                      | Dark   | Light  |
| --------------------------------------------- | ------ | ------ |
| `--border` on a card                          | 1.28:1 | 1.68:1 |
| `--border-2` on a card                        | 1.73:1 | 2.06:1 |
| `--border-hover` on a card                    | 2.43:1 | 3.37:1 |
| switch track edge (`--border-2` on `--inset`) | 1.95:1 | 1.64:1 |
