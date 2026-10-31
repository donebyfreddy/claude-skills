"""Check that a generated edit (e.g. the dirty/"before" version) is pixel-aligned with
its source (the clean/"after" image), and render a 50/50 slider preview.

Usage: python3 -I <skill>/scripts/align-check.py <after.png> <before.png> <preview.jpg> [--boxes "x0,y0,x1,y1;..."]

Boxes are fractions (0..1) of regions that must NOT change (walls, ceiling,
signage, doors). Default: side walls, ceiling and top band. Avoid floor near the
subject: shadows, water or dirt there legitimately change.
A mean difference <= ~6/255 per box means the background is preserved and the pair
works for a before/after slider. > ~12 means the model moved the camera or
redrew the scene: do not use the pair for the slider.
"""
import argparse

import numpy as np
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("after")
ap.add_argument("before")
ap.add_argument("preview")
ap.add_argument("--boxes", default="0,0,0.18,0.5;0.82,0,1,0.5;0.3,0,0.7,0.12;0,0,1,0.06")
a = ap.parse_args()

after = Image.open(a.after).convert("RGB")
before = Image.open(a.before).convert("RGB").resize(after.size, Image.LANCZOS)
A = np.asarray(after).astype(float)
B = np.asarray(before).astype(float)
W, H = after.size
worst = 0.0
for box in a.boxes.split(";"):
    x0, y0, x1, y1 = [float(v) for v in box.split(",")]
    r = (int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))
    d = np.abs(A[r[1]:r[3], r[0]:r[2]] - B[r[1]:r[3], r[0]:r[2]]).mean()
    worst = max(worst, d)
    print(f"box {box}: mean diff {d:.1f}/255")
print("verdict:", "ALIGNED, OK for slider" if worst <= 8 else ("BORDERLINE, inspect visually" if worst <= 12 else "NOT ALIGNED, don't use for slider"))

x = W // 2
out = before.copy()
out.paste(after.crop((x, 0, W, H)), (x, 0))
ImageDraw.Draw(out).rectangle((x - 2, 0, x + 2, H), fill=(255, 255, 255))
out.thumbnail((1600, 1600))
out.save(a.preview, quality=88)
print("preview:", a.preview)
