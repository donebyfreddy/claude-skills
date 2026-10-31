"""Automatic QC for a generated hero film (run before showing it to the user and
before paying to finalize it).

Usage: python3 -I <skill>/scripts/qc-video.py <video.mp4> <out_dir> [--start start.png] [--end end.png]

Writes to out_dir:
  sheet.jpg      contact sheet, one frame every 0.5 s (look at it!)
  detail.jpg     four full-size frames at 20/40/60/80 % for hands/faces/tools
  ends.jpg       first/last frames next to the start/end stills (if given)
Prints:
  resolution, fps, frame count, duration
  max consecutive-frame difference (a hard cut shows up as > ~30/255;
  a person walking close to the lens can reach ~15, which is fine)
  mean difference first-frame vs start still and last-frame vs end still
"""
import argparse
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("out")
ap.add_argument("--start")
ap.add_argument("--end")
a = ap.parse_args()
out = Path(a.out)
out.mkdir(parents=True, exist_ok=True)
v = a.video

info = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                       "stream=width,height,r_frame_rate,nb_frames:format=duration", "-of", "compact", v],
                      capture_output=True, text=True).stdout
print(info.strip())
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
                            "default=nw=1:nk=1", v], capture_output=True, text=True).stdout)

cols = 5
rows = max(1, int(np.ceil(dur * 2 / cols)))
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", v, "-vf",
                f"fps=2,scale=376:-1,tile={cols}x{rows}", "-frames:v", "1", str(out / "sheet.jpg")], check=True)

frames = []
for i, p in enumerate((0.2, 0.4, 0.6, 0.8)):
    f = out / f"_d{i}.png"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{dur * p:.2f}", "-i", v, "-frames:v", "1", str(f)], check=True)
    frames.append(Image.open(f).convert("RGB"))
w, h = frames[0].size
grid = Image.new("RGB", (w * 2, h * 2))
for i, im in enumerate(frames):
    grid.paste(im, ((i % 2) * w, (i // 2) * h))
grid.thumbnail((2000, 2000))
grid.save(out / "detail.jpg", quality=85)
for f in out.glob("_d*.png"):
    f.unlink()

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", v, "-vf", "scale=188:140,format=gray",
                      "-f", "rawvideo", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, 140, 188).astype(float)
d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
print(f"frames analysed: {len(fr)}  max consecutive diff: {d.max():.1f} at frame {d.argmax()}  median: {np.median(d):.2f}")
print("verdict:", "POSSIBLE HARD CUT, inspect around that frame" if d.max() > 30 else "no hard cuts")

def small(path):
    return np.asarray(Image.open(path).convert("L").resize((188, 140))).astype(float)

if a.start or a.end:
    panels = []
    first_last = []
    for t, name in ((0.05, "first"), (max(0, dur - 0.08), "last")):
        f = out / f"_{name}.png"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.2f}", "-i", v, "-frames:v", "1", str(f)], check=True)
        first_last.append(f)
    if a.start:
        print(f"first frame vs start still: mean diff {np.abs(fr[0] - small(a.start)).mean():.1f}/255")
        panels.append((a.start, first_last[0]))
    if a.end:
        print(f"last frame vs end still:  mean diff {np.abs(fr[-1] - small(a.end)).mean():.1f}/255")
        panels.append((a.end, first_last[1]))
    W, H = 752, 564
    sheet = Image.new("RGB", (W * 2, H * len(panels)))
    for r, (still, frame) in enumerate(panels):
        sheet.paste(Image.open(still).convert("RGB").resize((W, H)), (0, r * H))
        sheet.paste(Image.open(frame).convert("RGB").resize((W, H)), (W, r * H))
    sheet.save(out / "ends.jpg", quality=85)
    for f in first_last:
        f.unlink()
    print("(> ~20 usually means the model reframed the shot: fine for the hero, but then use the stills, not video frames, for the before/after slider)")
print("written:", ", ".join(sorted(p.name for p in out.iterdir())))
