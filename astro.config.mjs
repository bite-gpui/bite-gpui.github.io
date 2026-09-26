// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
//
// `compressHTML` is off on purpose. Astro's compressor drops the whitespace
// that ends a line just before an inline tag, so
//
//     <p>
//       ... lives in
//       <span class="mono">gpui_engine</span>
//     </p>
//
// renders as "lives ingpui_engine". It has bitten this site twice already, and
// every prose page here is a wall of inline <span class="mono"> and <code>.
// Keeping the whitespace costs a few hundred bytes of HTML and removes the
// trap.
export default defineConfig({
  compressHTML: false,
});
