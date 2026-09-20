#!/bin/sh
# Regenerate the bite-gpui logo + icon kit from the vector master.
#
# Run from the repo root:  sh scripts/build-logo.sh
#
# Master:  public/logo.svg — the potraced mark, monochrome, filled with the
#          Smoked Malt token from src/styles/global.css. The header renders the
#          same outlines inline (see src/components/Logo.astro) so the mark can
#          inherit `currentColor`; this file exists for the favicon/icon kit.
# Source:  design/logo-source.jpeg — the original artwork the master was traced
#          from (potrace is not part of the build; re-tracing is a manual step).
#
# Requires: inkscape, imagemagick, pngquant, optipng.
set -eu

# Keep in step with the tokens in src/styles/global.css.
MALT="#D5B895"
BG="#0B0B0A"

MASTER="public/logo.svg"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Normalise whatever fill the master carries to MALT, so this is idempotent and
# also works on a freshly traced (white-filled) master. The mark is monochrome
# by design, so flattening every fill to one colour is the intended result.
sed -E "s/fill=\"#[0-9A-Fa-f]{6}\"/fill=\"$MALT\"/g" "$MASTER" > "$TMP/malt.svg"
sed "s/$MALT/$BG/g" "$TMP/malt.svg" > "$TMP/ink.svg"

# --- Vector master, in the brand highlight ---------------------------------
cp "$TMP/malt.svg" "$MASTER"

# --- Raster logos ----------------------------------------------------------
inkscape --export-type=png --export-filename="$TMP/malt512.png" -w 512 "$TMP/malt.svg" 2>/dev/null
inkscape --export-type=png --export-filename="$TMP/ink512.png" -w 512 "$TMP/ink.svg" 2>/dev/null
magick "$TMP/malt512.png" -strip PNG32:public/logo.png
magick "$TMP/ink512.png" -strip PNG32:public/logo-ink.png

# --- Favicon set: malt mark on a #0B0B0A tile ------------------------------
# The mark is inset in the tile, and small sizes are filled more than large ones
# to offset the fact that the trace thins out when rendered below ~32px.
inkscape --export-type=png --export-filename="$TMP/m15.png"  -w 15  "$TMP/malt.svg" 2>/dev/null
inkscape --export-type=png --export-filename="$TMP/m28.png"  -w 28  "$TMP/malt.svg" 2>/dev/null
inkscape --export-type=png --export-filename="$TMP/m40.png"  -w 40  "$TMP/malt.svg" 2>/dev/null
inkscape --export-type=png --export-filename="$TMP/m140.png" -w 140 "$TMP/malt.svg" 2>/dev/null
inkscape --export-type=png --export-filename="$TMP/m146.png" -w 146 "$TMP/malt.svg" 2>/dev/null
inkscape --export-type=png --export-filename="$TMP/m379.png" -w 379 "$TMP/malt.svg" 2>/dev/null

# Rounded tiles for the .ico frames (radius scales with the frame). The source
# renders are kept as full RGBA so the trace's antialiasing survives compositing.
magick -size 16x16 xc:none -fill "$BG" -draw 'roundrectangle 0,0 15,15 3,3' \
  \( "$TMP/m15.png" \) -gravity center -composite -strip PNG32:"$TMP/q16.png"
magick -size 32x32 xc:none -fill "$BG" -draw 'roundrectangle 0,0 31,31 6,6' \
  \( "$TMP/m28.png" \) -gravity center -composite -strip PNG32:"$TMP/q32.png"
magick -size 48x48 xc:none -fill "$BG" -draw 'roundrectangle 0,0 47,47 9,9' \
  \( "$TMP/m40.png" \) -gravity center -composite -strip PNG32:"$TMP/q48.png"

# -colors 256 makes ImageMagick write a palettised ICO with a 1-bit AND mask
# instead of 8-bit RGBA frames, which halves the file (15 KB -> 7.4 KB) at no
# visible cost at these sizes.
magick "$TMP/q16.png" "$TMP/q32.png" "$TMP/q48.png" -colors 256 public/favicon.ico

# Full-bleed squares, for platforms that mask the corners themselves.
magick -size 180x180 xc:"$BG" \( "$TMP/m140.png" \) -gravity center -composite -strip PNG32:"$TMP/s180.png"
magick -size 192x192 xc:"$BG" \( "$TMP/m146.png" \) -gravity center -composite -strip PNG32:"$TMP/s192.png"
magick -size 512x512 xc:"$BG" \( "$TMP/m379.png" \) -gravity center -composite -strip PNG32:"$TMP/s512.png"

pngquant --force --quiet --skip-if-larger --speed 1 --output public/apple-touch-icon.png "$TMP/s180.png" 2>/dev/null || cp "$TMP/s180.png" public/apple-touch-icon.png
pngquant --force --quiet --skip-if-larger --speed 1 --output public/icon-192.png "$TMP/s192.png" 2>/dev/null || cp "$TMP/s192.png" public/icon-192.png
pngquant --force --quiet --skip-if-larger --speed 1 --output public/icon-512.png "$TMP/s512.png" 2>/dev/null || cp "$TMP/s512.png" public/icon-512.png

optipng -quiet -o4 public/logo.png public/logo-ink.png 2>/dev/null || true

echo "=== asset kit ==="
ls -l public/logo.svg public/logo.png public/logo-ink.png public/favicon.ico public/apple-touch-icon.png public/icon-192.png public/icon-512.png
echo
magick identify -format '  %f %wx%h %b\n' public/favicon.ico public/apple-touch-icon.png public/icon-192.png public/icon-512.png
echo "  logo.svg fill: $(grep -o 'fill="#[0-9A-Fa-f]*"' public/logo.svg | head -1)"
