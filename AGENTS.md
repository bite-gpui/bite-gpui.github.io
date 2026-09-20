## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Design system

Theme: **Variant 2C — Smoked Malt & Smoked Olive Sage**. Full guide:
[`design/DESIGN-SYSTEM.md`](design/DESIGN-SYSTEM.md).

- Design tokens live in the `:root` block of `src/styles/global.css`. That block
  is the source of truth — change it *before* updating any documentation.
- The site is plain CSS with custom properties. **There is no Tailwind in the
  build.** Style new components with `var(--token)` rather than pasting hex.
- Two hues are load-bearing: `--brand` (`#8FA89B`, every interactive affordance)
  and `--malt` (`#D5B895`, the logo mark and headline ramp only). Do not
  introduce neon greens, saturated blues, or magentas — see §8 of the guide.
- The logo/icon kit is regenerated with `sh scripts/build-logo.sh` from
  `public/logo.svg`; the original artwork is `design/logo-source.jpeg`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
