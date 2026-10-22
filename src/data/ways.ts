// The four ways to extend the engine — the taxonomy `/swaps` is built on and the
// one-pager's band repeats. They are the same four the conceptual art names, and
// each one is a different answer to "what do you hand over?":
//
//   wrap   a frame policy        FramePipeline, decorated
//   swap   an implementation     a seam trait, replaced
//   shove  a surface             surface() / gpu_canvas(), inserted
//   serve  a platform            Platform, supplied
//
// `accent` is a crate token from `global.css`, so a card's number and badge take
// the hue of the layer the way touches. It is never a new colour.
export type Way = {
  n: string;
  name: string;
  badge: string;
  does: string;
  facts: string[];
  href: string;
  linkLabel: string;
  accent: "brand" | "engine" | "authoring" | "platform";
};

export const ways: Way[] = [
  {
    n: "01",
    name: "Wrap",
    badge: "Decorate",
    does: "Implements FramePipeline and delegates. It is handed every pass of every frame it admits, forwards the ones it does not change, and decides the ones it does — including whether the frame runs at all.",
    facts: [
      "decorates the frame pipeline",
      "stacks in any order, any number",
      "consumes a trait rather than freezing one",
    ],
    href: "#wrap",
    linkLabel: "The wrap inventory",
    accent: "brand",
  },
  {
    n: "02",
    name: "Swap",
    badge: "Replace",
    does: "Implements one of the algorithm seams and is installed at bootstrap in place of the default. One implementation per seam, chosen when the application is built.",
    facts: [
      "replaces the algorithm",
      "one per seam, never beside it",
      "freezes the trait on publication",
    ],
    href: "#swap",
    linkLabel: "The swap shelf",
    accent: "engine",
  },
  {
    n: "03",
    name: "Shove",
    badge: "Insert",
    does: "Replaces no seam and decorates no pipeline. It builds on the published surface and pushes foreign pixels into the frame — a 3D viewport, a decoded video frame, or a texture you computed.",
    facts: [
      "surface() and gpu_canvas()",
      "same-device or exported handle",
      "sits above the facade",
    ],
    href: "/shove",
    linkLabel: "Bring your own pixels",
    accent: "authoring",
  },
  {
    n: "04",
    name: "Serve",
    badge: "Host",
    does: "Supplies the platform the application runs on: one of the four built-in backends compiled in by cfg, or a Platform implementation of your own.",
    facts: [
      "Metal, Direct3D 11, X11/Wayland, WebGPU",
      "one backend per build, by cfg",
      "or a Platform of your own",
    ],
    href: "/serve",
    linkLabel: "Bring your own platform",
    accent: "platform",
  },
];
