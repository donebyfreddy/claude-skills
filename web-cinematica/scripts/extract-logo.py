"""Extract the MR Autolavado logo from its flat grey background into a clean RGBA PNG.

Each pixel is modelled as a blend of the grey background B and one of the two
logo inks (turquoise T or white W): P = a*F + (1-a)*B. For each pixel we solve
alpha against both inks, keep the better fit, then un-blend the colour so no
grey halo remains on the edges.

Usage: python3 -I <skill>/scripts/extract-logo.py assets-src/logo-original.png public/media

Works for a logo on a flat background with one coloured ink plus white (the common
"brand colour + white swoosh" case). For other logos, adapt the two inks (T, W)
or fall back to Higgsfield remove_background and inspect the result on dark/light.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)

img = Image.open(src).convert("RGB")
img = img.resize((img.width * 3, img.height * 3), Image.LANCZOS)
P = np.asarray(img).astype(np.float64) / 255.0

# Background = median of the border pixels.
border = np.concatenate([P[0], P[-1], P[:, 0], P[:, -1]])
B = np.median(border, axis=0)

# Turquoise ink = median of strongly saturated, bright-cyan pixels.
sat = P.max(axis=2) - P.min(axis=2)
cyan_mask = (sat > 0.25) & (P[..., 1] > 0.6) & (P[..., 2] > 0.6) & (P[..., 0] < 0.65)
T = np.median(P[cyan_mask], axis=0)
W = np.array([1.0, 1.0, 1.0])
print("bg", (B * 255).round(), "turquoise", (T * 255).round())


def solve(ink):
    d = ink - B
    a = ((P - B) @ d) / (d @ d)
    a = np.clip(a, 0.0, 1.0)
    recon = B + a[..., None] * d
    err = np.linalg.norm(P - recon, axis=2)
    return a, err


aT, eT = solve(T)
aW, eW = solve(W)
use_t = eT <= eW
alpha = np.where(use_t, aT, aW)

# Kill faint noise from JPEG artefacts in the background, keep soft edges.
alpha = np.clip((alpha - 0.06) / 0.94, 0, 1)

# Un-blend the colour: F = (P - (1-a)B) / a.
safe = np.maximum(alpha, 1e-3)[..., None]
F = np.clip((P - (1 - alpha[..., None]) * B) / safe, 0, 1)
F = np.where(alpha[..., None] > 0.02, F, 0)

rgba = np.dstack([F, alpha]) * 255
out = Image.fromarray(rgba.round().astype(np.uint8), "RGBA")
out = out.crop(out.getbbox())
# Downscale to 2x the original logo size for a crisp retina asset.
target_w = 900
out = out.resize((target_w, round(out.height * target_w / out.width)), Image.LANCZOS)
out.save(out_dir / "logo.png", optimize=True)
out.save(out_dir / "logo.webp", quality=92, method=6)
print("logo", out.size)

# Previews on dark, light and turquoise backgrounds for visual QC.
prev = Image.new("RGB", (out.width, out.height * 3))
for i, col in enumerate([(11, 13, 14), (245, 245, 242), tuple((T * 255).astype(int))]):
    tile = Image.new("RGB", out.size, col)
    tile.paste(out, (0, 0), out)
    prev.paste(tile, (0, out.height * i))
prev.save(out_dir / "_logo-preview.png")
