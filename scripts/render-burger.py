#!/usr/bin/env python3
"""Compose the burger layers into one image for visual review.

The five layers are separate <svg> elements absolutely positioned by CSS, so they
are never rendered together outside a browser. To eyeball an artwork change they
have to be reassembled at the same offsets the stylesheet uses.

    python3 scripts/render-burger.py [out.png] [width] [--explode 0..1]

`--explode 0` is the assembled stack, `--explode 1` the fully unstacked state the
scroll choreography ends on. Layer offsets are read from src/styles/global.css so
this stays in step with the stylesheet.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS = (ROOT / "src/styles/global.css").read_text()
JOURNEY = (ROOT / "src/components/Journey.astro").read_text()

# --- args ------------------------------------------------------------------
args = sys.argv[1:]
explode = 0.0
if "--explode" in args:
    i = args.index("--explode")
    explode = float(args[i + 1])
    del args[i:i + 2]
# Extra unstack travel global.css grants on tall viewports (--spread), so this can
# preview the exploded state as it actually lands on a 900px-tall window.
spread = 0.0
if "--spread" in args:
    i = args.index("--spread")
    spread = float(args[i + 1])
    del args[i:i + 2]
out = Path(args[0]) if args else ROOT / "design/_preview/burger.png"
render_w = int(args[1]) if len(args) > 1 else 680

# Contact shade strength, mirroring `.journey-sticky .crevice` in global.css. The
# crevice paths ship with opacity=".9" baked in; the stylesheet overrides it from
# --explode, so the preview has to substitute the animated value or the unstacked
# render keeps dark contact lines the page would have faded out.
crevice_op = 1 - explode * 0.8

# --- stage geometry --------------------------------------------------------
# --- stage geometry --------------------------------------------------------
# The frame is 340x640, but an unstacked layer is allowed to ride above it: the
# layers are absolutely positioned with no overflow clip, so only the sticky
# viewport bounds them. Pad the composed canvas so those renders are faithful
# instead of being cropped at the frame edge — and pad further when --spread is
# simulating a tall viewport, which rides the crown well above the frame.
PAD = 60 + int(spread)

burger_h = int(re.search(r"\.burger\s*\{[^}]*?height:\s*(\d+)px", CSS, re.S).group(1))
burger_w = int(re.search(r"\.burger\s*\{[^}]*?width:\s*(\d+)px", CSS, re.S).group(1))

LAYER_CSS = re.compile(
    r"\.layer-(\w+)\s*\{\s*--base:\s*(-?\d+)px;\s*--base-ex:\s*(-?\d+)px;"
    r"\s*--w:\s*(\d+)px;\s*--drift:\s*(-?[\d.]+);"
)
offsets = {m.group(1): (int(m.group(2)), int(m.group(3)), int(m.group(4)), float(m.group(5)))
           for m in LAYER_CSS.finditer(CSS)}

# --- artwork blocks, in DOM order ------------------------------------------
blocks = []
for m in re.finditer(r"<svg[^>]*?viewBox=\"([^\"]+)\"[^>]*>(.*?)</svg>", JOURNEY, re.S):
    if "stop-color" in m.group(2):
        blocks.append((m.group(1), m.group(2)))

order = re.findall(r'data-layer="(\w+)"', JOURNEY)
if len(order) != len(blocks):
    sys.exit(f"layer/artwork mismatch: {len(order)} layers vs {len(blocks)} svg blocks")

parts = []
print(f"stage {burger_w}x{burger_h}  explode={explode:.2f}  spread={spread:.0f}")
for name, (viewbox, inner) in zip(order, blocks):
    base, base_ex, w, drift = offsets[name]
    bottom = base + explode * (base_ex - base + spread * drift)
    vw, vh = (float(v) for v in viewbox.split()[2:4])
    scale = w / vw
    h = vh * scale
    x = burger_w / 2 - w / 2
    y = burger_h - bottom - h
    print(f"  {name:10s} bottom={bottom:6.1f} -> y={y:7.1f} h={h:5.1f} scale={scale:.3f}")
    inner = inner.replace('opacity=".9"', f'opacity="{crevice_op:.2f}"')
    parts.append(f'<g transform="translate({x:.2f},{y:.2f}) scale({scale:.4f})" '
                 f'filter="url(#layerShadow)">{inner}</g>')

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {-PAD} {burger_w} {burger_h + PAD * 2}" '
    f'width="{burger_w}" height="{burger_h + PAD * 2}">\n'
    f'<rect x="0" y="{ -PAD }" width="100%" height="100%" fill="#0B0B0A"/>\n'
    # Mirror the two CSS shadows so both end states read in these renders. Inkscape
    # has no feDropShadow, so spell them out with the primitives. CSS blur radius is
    # roughly 2x the Gaussian sigma. `layerShadow` is `.burger .layer svg`,
    # `groupShadow` is the `.burger` ground shadow wrapping the whole stack.
    f'<defs><filter id="layerShadow" x="-25%" y="-25%" width="150%" height="170%">'
    f'<feGaussianBlur in="SourceAlpha" stdDeviation="{0.75 + explode * 10:.1f}" result="b"/>'
    f'<feOffset in="b" dx="0" dy="{explode * 18:.1f}" result="o"/>'
    f'<feFlood flood-color="#000000" flood-opacity="{.7 - explode * .06:.2f}" result="c"/>'
    f'<feComposite in="c" in2="o" operator="in" result="s"/>'
    f'<feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>'
    f'</filter>'
    f'<filter id="groupShadow" x="-25%" y="-25%" width="150%" height="170%">'
    f'<feGaussianBlur in="SourceAlpha" stdDeviation="{10 + explode * 12:.1f}" result="gb"/>'
    f'<feOffset in="gb" dx="0" dy="{12 + explode * 12:.1f}" result="go"/>'
    f'<feFlood flood-color="#000000" flood-opacity="{.52 + explode * .12:.2f}" result="gc"/>'
    f'<feComposite in="gc" in2="go" operator="in" result="gs"/>'
    f'<feMerge><feMergeNode in="gs"/><feMergeNode in="SourceGraphic"/></feMerge>'
    f'</filter></defs>\n'
    '<g filter="url(#groupShadow)">\n' + "\n".join(parts) + "\n</g>\n</svg>\n"
)

out.parent.mkdir(parents=True, exist_ok=True)
staged = out.with_suffix(".svg")
staged.write_text(svg)
subprocess.run(
    ["inkscape", "--export-type=png", f"--export-filename={out}",
     "-w", str(render_w), str(staged)],
    check=True, capture_output=True,
)
print(f"wrote {out} ({render_w}px wide)")
