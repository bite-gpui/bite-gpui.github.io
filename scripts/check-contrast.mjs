#!/usr/bin/env node
/**
 * Colour-contrast audit for the bite-gpui themes.
 *
 * Reads the two token blocks straight out of `src/styles/global.css` (the source
 * of truth — see design/DESIGN-SYSTEM.md §2) and checks the foreground/background
 * pairings the stylesheet actually uses against WCAG 2.1:
 *
 *   SC 1.4.3  Contrast (Minimum)   — 4.5:1 normal text, 3:1 large text
 *   SC 1.4.11 Non-text Contrast    — 3:1 for UI parts
 *   SC 2.4.11 Focus Appearance      — 3:1 for the focus indicator
 *
 * Checks carry a severity:
 *   "fail"      a binding requirement — a FAIL exits non-zero (CI-gateable)
 *   "advisory"  reported but not counted: the soft fills and hairline separators
 *               the design uses to *style* a region that is already identified by
 *               its fill, position and label. SC 1.4.11 exempts purely decorative
 *               boundaries; raise these if you want strict 3:1 on every edge.
 *
 * Supports the colour syntaxes the tokens use: hex (#rgb/#rrggbb/#rrggbbaa),
 * rgb()/rgba(), `transparent`, `var()`, bare `--token`, and two-stop
 * `color-mix(in srgb, …)`. Translucent foregrounds are composited over their
 * backdrop before measuring.
 *
 * Usage:  node scripts/check-contrast.mjs [--all] [--suggest]
 *   --all      also list passing checks (default: failures + advisories)
 *   --suggest  for each failure, print the nearest passing colour (mixed toward
 *              white on a dark canvas, black on a light one)
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, "..", "src", "styles", "global.css"), "utf8");
const comboSource = readFileSync(
  join(here, "..", "src", "components", "ComboStudio.astro"),
  "utf8",
);

/* ------------------------------------------------------------------ parsing */

/** Pull `--name: value;` declarations out of the block matching `selector`. */
function readTokens(selector) {
  const re = new RegExp(selector.source + String.raw`\s*\{([\s\S]*?)\n\}`, "m");
  const block = css.match(re);
  if (!block) throw new Error(`token block not found: ${selector}`);
  const tokens = {};
  for (const m of block[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[`--${m[1]}`] = m[2].trim();
  }
  return tokens;
}

const THEMES = {
  dark: readTokens(/:root/),
  light: readTokens(/:root\[data-theme="light"\]/),
};

const TRANSPARENT = { r: 0, g: 0, b: 0, a: 0 };
const WHITE = { r: 255, g: 255, b: 255, a: 1 };
const BLACK = { r: 0, g: 0, b: 0, a: 1 };

/** Split on commas that are not nested inside parentheses. */
function splitTopLevel(str) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      out.push(str.slice(start, i));
      start = i + 1;
    }
  }
  out.push(str.slice(start));
  return out.map((s) => s.trim()).filter(Boolean);
}

function parseColor(input, tokens, depth = 0) {
  if (depth > 12) throw new Error(`colour recursion too deep: ${input}`);
  const str = input.trim();
  if (str === "transparent") return { ...TRANSPARENT };

  let m;
  if ((m = str.match(/^#([0-9a-f]{3,8})$/i))) {
    let h = m[1];
    if (h.length === 3 || h.length === 4)
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }

  if ((m = str.match(/^rgba?\(([^)]+)\)$/i))) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean);
    const num = (v) => (v.endsWith("%") ? (parseFloat(v) / 100) * 255 : parseFloat(v));
    const alpha = (v) =>
      v === undefined ? 1 : v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v);
    return { r: num(parts[0]), g: num(parts[1]), b: num(parts[2]), a: alpha(parts[3]) };
  }

  if ((m = str.match(/^color-mix\(in srgb,\s*([\s\S]+)\)$/i))) {
    const stops = splitTopLevel(m[1]);
    if (stops.length !== 2)
      throw new Error(`color-mix: only 2 stops supported: ${str}`);
    const parsed = stops.map((stop) => {
      const sm = stop.match(/^([\s\S]+?)(?:\s+([\d.]+)%)?$/);
      return {
        color: parseColor(sm[1], tokens, depth + 1),
        pct: sm[2] === undefined ? undefined : parseFloat(sm[2]) / 100,
      };
    });
    if (parsed[0].pct === undefined && parsed[1].pct === undefined) {
      parsed[0].pct = 0.5;
      parsed[1].pct = 0.5;
    } else if (parsed[0].pct === undefined) {
      parsed[0].pct = 1 - parsed[1].pct;
    } else if (parsed[1].pct === undefined) {
      parsed[1].pct = 1 - parsed[0].pct;
    }
    const total = parsed[0].pct + parsed[1].pct || 1;
    const [c1, c2] = parsed;
    const p1 = c1.pct / total;
    const p2 = c2.pct / total;
    const a = c1.color.a * p1 + c2.color.a * p2;
    if (a === 0) return { ...TRANSPARENT };
    return {
      r: (c1.color.r * c1.color.a * p1 + c2.color.r * c2.color.a * p2) / a,
      g: (c1.color.g * c1.color.a * p1 + c2.color.g * c2.color.a * p2) / a,
      b: (c1.color.b * c1.color.a * p1 + c2.color.b * c2.color.a * p2) / a,
      a,
    };
  }

  if ((m = str.match(/^var\(\s*(--[\w-]+)\s*\)$/))) {
    if (tokens[m[1]] === undefined) throw new Error(`unknown token: ${m[1]}`);
    return parseColor(tokens[m[1]], tokens, depth + 1);
  }

  // Bare custom-property name, so checks can name tokens directly.
  if (/^--[\w-]+$/.test(str)) {
    if (tokens[str] === undefined) throw new Error(`unknown token: ${str}`);
    return parseColor(tokens[str], tokens, depth + 1);
  }

  throw new Error(`unparsed colour: ${str}`);
}

/** Source-over compositing of `fg` (any alpha) onto `bg`. */
function over(fg, bg) {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { ...TRANSPARENT };
  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
    a,
  };
}

const lerp = (a, b, t) => ({
  r: a.r + (b.r - a.r) * t,
  g: a.g + (b.g - a.g) * t,
  b: a.b + (b.b - a.b) * t,
  a: 1,
});

function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function luminance({ r, g, b }) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
const hex = ({ r, g, b }) =>
  "#" +
  [r, g, b]
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase();

/* ------------------------------------------------------------------- checks */

const SURFACES = ["--bg", "--bg-2", "--surface", "--surface-2", "--inset"];
const CRATES = ["--platform", "--engine", "--types", "--authoring", "--runtime", "--facade"];

/** The Combo Studio's per-option accents are data, not tokens (§2.8), so they are
read straight out of the component that ships them. */
function readComboColors() {
  const out = { dark: [], light: [] };
  const re =
    /key:\s*"(\w+)",[\s\S]*?color:\s*"(#[0-9A-Fa-f]{6})",\s*\n\s*colorLight:\s*"(#[0-9A-Fa-f]{6})"/g;
  for (const m of comboSource.matchAll(re)) {
    out.dark.push([m[1], m[2]]);
    out.light.push([m[1], m[3]]);
  }
  if (!out.dark.length) throw new Error("no Combo Studio accent colours found");
  return out;
}
const COMBO = readComboColors();

function buildChecks(themeName) {
  const checks = [];
  const add = (id, fg, bg, min = 4.5, { base, severity = "fail" } = {}) =>
    checks.push({ id, fg, bg, min, base, severity });

  // --- SC 1.4.3: normal text on every surface it can sit on -------------------
  for (const surface of SURFACES) {
    add(`text ${surface}`, "--text", surface);
    add(`text-2 ${surface}`, "--text-2", surface);
    // text-3 is never drawn as *text* on surface-2 (only as the toggle thumb fill).
    if (surface !== "--surface-2") add(`text-3 ${surface}`, "--text-3", surface);
  }

  // Interactive sage, wherever it is drawn as text.
  for (const surface of SURFACES) add(`brand ${surface}`, "--brand", surface);

  // Crate rails / labels on the surfaces they label.
  for (const crate of CRATES) {
    add(`${crate} surface`, crate, "--surface");
    add(`${crate} inset`, crate, "--inset");
  }

  // Terminal / code palette. It is drawn on two surfaces: the Quickstart code
  // shell recesses into --inset, while the Combo Studio editor now sits straight
  // on --surface (§4), so every entry has to clear both.
  for (const bg of ["--inset", "--surface"]) {
    const where = bg === "--inset" ? "shell" : "editor";
    add(`code body (${where})`, "--code-text", bg);
    add(`code line numbers (${where})`, "--code-dim", bg, 3);
    add(`code commands (${where})`, "--mint", bg);
    for (const syn of ["--syn-kw", "--syn-fn", "--syn-str", "--syn-type", "--syn-cmt"])
      add(`syntax ${syn} (${where})`, syn, bg);
  }

  add("recipe book title", "--facade", "--surface");
  add("selection text", "--malt", "--surface-2");
  add("primary button label", "--bg", "--brand");

  // Floating chrome.
  add("eyebrow text", "--brand", "--brand-dim", 4.5, { base: "--bg" });
  add("toast text", "--text", "--toast-fill", 4.5, { base: "--bg" });
  for (const crate of ["--platform", "--types", "--runtime"]) {
    add(`caption ${crate}`, crate, "color-mix(in srgb, var(--inset) 84%, transparent)", 4.5, {
      base: "--bg",
    });
  }

  // Combo Studio data accents, used as text on the card and on code chips.
  for (const [name, value] of COMBO[themeName]) {
    add(`combo ${name} surface`, value, "--surface");
    add(`combo ${name} inset`, value, "--inset");
  }

  // --- SC 2.4.11: focus indicator --------------------------------------------
  add("focus ring on page", "--brand", "--bg", 3);
  add("focus ring on card", "--brand", "--surface", 3);

  // --- advisory: soft fills + hairline separators (SC 1.4.11 decorative) ------
  for (const surface of ["--bg", "--surface", "--inset"]) {
    add(`advisory: border ${surface}`, "--border", surface, 3, { severity: "advisory" });
    add(`advisory: border-2 ${surface}`, "--border-2", surface, 3, { severity: "advisory" });
  }
  add("advisory: hover border", "--border-hover", "--surface", 3, { severity: "advisory" });
  // The switch is deliberately colourless: state is carried by fill, not hue. Off
  // is a dim knob in an empty well; on is a solid --text pill with the row's own
  // surface punched out of it, so the knob must stay legible against its fill.
  add("switch knob off well", "--text-3", "--surface-2", 3);
  add("switch knob on fill", "--surface", "--text", 3);
  add("advisory: switch track edge", "--border-2", "--inset", 3, { severity: "advisory" });

  return checks;
}

/** Nearest passing colour, mixed toward white (dark canvas) or black (light). */
function suggest(fg, bg, min) {
  const towardWhite = luminance(bg) < 0.5;
  const target = towardWhite ? WHITE : BLACK;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const t = (lo + hi) / 2;
    if (contrast(lerp(fg, target, t), bg) >= min) hi = t;
    else lo = t;
  }
  return hex(lerp(fg, target, hi));
}

/* -------------------------------------------------------------------- runner */

const showAll = process.argv.includes("--all");
const doSuggest = process.argv.includes("--suggest");
let failures = 0;
let advisories = 0;

for (const [themeName, tokens] of Object.entries(THEMES)) {
  console.log(`\n=== ${themeName.toUpperCase()} ===`);
  const rows = [];

  for (const check of buildChecks(themeName)) {
    let status = "PASS";
    let ratio = 0;
    let fgHex = "";
    let bgHex = "";
    let fix = "";
    try {
      let bg = parseColor(check.bg, tokens);
      if (bg.a < 1) bg = over(bg, parseColor(check.base ?? "--bg", tokens));
      let fg = parseColor(check.fg, tokens);
      if (fg.a < 1) fg = over(fg, bg);
      ratio = contrast(fg, bg);
      if (ratio < check.min) status = "FAIL";
      fgHex = hex(fg);
      bgHex = hex(bg);
      if (doSuggest && status === "FAIL") fix = suggest(fg, bg, check.min);
    } catch (err) {
      status = "SKIP";
      fgHex = String(err.message);
    }
    rows.push({ ...check, status, ratio, fgHex, bgHex, fix });
    if (status === "FAIL") {
      if (check.severity === "advisory") advisories++;
      else failures++;
    }
  }

  for (const row of rows) {
    const visible = showAll || row.status !== "PASS" || row.severity === "advisory";
    if (!visible) continue;
    const ratio = row.ratio ? row.ratio.toFixed(2) : "  – ";
    const tag = row.severity === "advisory" ? "ADV " : "    ";
    console.log(
      `  ${tag}${row.status}  ${ratio.padStart(5)}:1  (min ${row.min})  ${row.id}`,
    );
    if (row.status === "FAIL") {
      console.log(
        `         ${row.fgHex} on ${row.bgHex}${row.fix ? `  → try ${row.fix}` : ""}`,
      );
    }
  }

  const failed = rows.filter((r) => r.status === "FAIL" && r.severity === "fail").length;
  const adv = rows.filter((r) => r.status === "FAIL" && r.severity === "advisory").length;
  const passed = rows.filter((r) => r.status === "PASS").length;
  console.log(
    `  ${passed} passed · ${failed} failed · ${adv} advisory (of ${rows.length})`,
  );
}

console.log(
  `\n${failures} binding failure(s), ${advisories} advisory (non-binding), across ${Object.keys(THEMES).length} themes.`,
);
process.exit(failures ? 1 : 0);
