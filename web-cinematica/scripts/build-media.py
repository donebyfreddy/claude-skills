"""Build all web media for a cinematic scroll site from the hero film and stills.

Usage (run from the project root, Python 3 + Pillow + ffmpeg):
  python3 -I <skill>/scripts/build-media.py \
      --video production/final/hero-1080p.mp4 \
      --before assets-src/compare-before.png --after assets-src/compare-after.png \
      [--process "1.0:0.5,0.73:0.64,end:0.5"] [--mobile-focus 0.5] \
      [--desktop-width 1280 --desktop-fps 10 --desktop-q 56] \
      [--mobile-width 720 --mobile-fps 6 --mobile-q 54]

--process: three "time:focusX" picks for the process panels. time is seconds,
a fraction of the duration if < 1 and has a dot (e.g. 0.73), or "end".
"1.0" means second 1.
focusX moves the 3:4 crop horizontally (0..1) to keep the person in frame.

Outputs (public/media/...):
  hero/desktop/f_###.webp   full-frame sequence for tablet/desktop
  hero/mobile/f_###.webp    3:4 centre crops for phones
  hero/poster.webp, hero/clean.webp   first and last frames
  process/01.webp 02.webp 03.webp     portrait stills from the film
  compare/antes.webp, compare/despues.webp   aligned before/after pair (if given)
  og.jpg                    1200x630 share image (last frame + logo if present)
and src/content/heroFrames.ts (frame manifest consumed by CinematicHero).
"""
import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("--video", required=True)
ap.add_argument("--before")
ap.add_argument("--after")
ap.add_argument("--process", default="1.0:0.5,0.5:0.5,end:0.5")
ap.add_argument("--mobile-focus", type=float, default=0.5)
ap.add_argument("--desktop-width", type=int, default=1280)
ap.add_argument("--desktop-fps", type=float, default=10)
ap.add_argument("--desktop-q", type=int, default=56)
ap.add_argument("--mobile-width", type=int, default=720)
ap.add_argument("--mobile-fps", type=float, default=6)
ap.add_argument("--mobile-q", type=int, default=54)
args = ap.parse_args()

ROOT = Path.cwd()
OUT = ROOT / "public" / "media"
video = Path(args.video).resolve()


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height:format=duration", "-of", "json", str(path)],
        capture_output=True, text=True, check=True).stdout
    data = json.loads(out)
    s = data["streams"][0]
    return s["width"], s["height"], float(data["format"]["duration"])


def extract(vf, fps, dest: Path, quality):
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["ffmpeg", "-v", "error", "-i", str(video), "-vf", f"fps={fps},{vf}",
                        f"{tmp}/f_%03d.png"], check=True)
        for f in sorted(Path(tmp).glob("f_*.png")):
            Image.open(f).save(dest / f.with_suffix(".webp").name, "WEBP", quality=quality, method=6)
    files = sorted(dest.glob("f_*.webp"))
    size = sum(f.stat().st_size for f in files)
    first = Image.open(files[0])
    print(f"{dest.relative_to(ROOT)}: {len(files)} frames, {size / 1e6:.1f} MB, {first.size}")
    return len(files), first.size


def frame_at(t, out_png):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(video),
                    "-frames:v", "1", str(out_png)], check=True)
    return Image.open(out_png).convert("RGB")


def crop_aspect(img, aspect, focus_x=0.5):
    w, h = img.size
    if w / h > aspect:
        nw = round(h * aspect)
        x = min(max(0, round(focus_x * w - nw / 2)), w - nw)
        return img.crop((x, 0, x + nw, h))
    nh = round(w / aspect)
    return img.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))


def save_webp(img, path, width=None, quality=82):
    path.parent.mkdir(parents=True, exist_ok=True)
    if width and img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(path, "WEBP", quality=quality, method=6)


vw, vh, duration = probe(video)
print("video", vw, vh, f"{duration:.2f}s")

mw = round(vh * 3 / 4) // 2 * 2
mx = min(max(0, round(vw * args.mobile_focus - mw / 2)), vw - mw)

d_count, d_size = extract(f"scale={args.desktop_width}:-2:flags=lanczos", args.desktop_fps,
                          OUT / "hero" / "desktop", args.desktop_q)
m_count, m_size = extract(f"crop={mw}:{vh}:{mx}:0,scale={args.mobile_width}:-2:flags=lanczos",
                          args.mobile_fps, OUT / "hero" / "mobile", args.mobile_q)

with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    first = frame_at(0.05, tmp / "a.png")
    last = frame_at(max(0, duration - 0.08), tmp / "b.png")
    save_webp(first, OUT / "hero" / "poster.webp", 1600, 80)
    save_webp(last, OUT / "hero" / "clean.webp", 1600, 82)

    for i, pick in enumerate(args.process.split(","), start=1):
        t_raw, fx = pick.split(":")
        if t_raw == "end":
            t = duration - 0.08
        elif "." in t_raw and float(t_raw) < 1:
            t = duration * float(t_raw)
        else:
            t = float(t_raw)
        t = min(max(0.0, t), duration - 0.08)
        img = crop_aspect(frame_at(t, tmp / f"p{i}.png"), 3 / 4, float(fx))
        save_webp(img, OUT / "process" / f"0{i}.webp", 900, 80)

    og = crop_aspect(last, 1200 / 630, 0.5).resize((1200, 630), Image.LANCZOS)
    logo_path = OUT / "logo.png"
    if logo_path.exists():
        logo = Image.open(logo_path)
        logo = logo.resize((360, round(logo.height * 360 / logo.width)), Image.LANCZOS)
        og.paste(logo, (48, 630 - logo.height - 44), logo)
    og.save(OUT / "og.jpg", quality=86)

if args.before and args.after:
    after = Image.open(args.after).convert("RGB")
    before = Image.open(args.before).convert("RGB").resize(after.size, Image.LANCZOS)
    save_webp(before, OUT / "compare" / "antes.webp", 1800, 82)
    save_webp(after, OUT / "compare" / "despues.webp", 1800, 82)
    print("compare pair written")

manifest = {
    "poster": "/media/hero/poster.webp",
    "clean": "/media/hero/clean.webp",
    "desktop": {"count": d_count, "width": d_size[0], "height": d_size[1],
                "pattern": "/media/hero/desktop/f_{i}.webp", "pad": 3},
    "mobile": {"count": m_count, "width": m_size[0], "height": m_size[1],
               "pattern": "/media/hero/mobile/f_{i}.webp", "pad": 3},
}
dest = ROOT / "src" / "content" / "heroFrames.ts"
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(
    "// Generated by build-media.py — do not edit by hand.\n"
    "import type { FrameSet } from \"@/lib/frameStore\";\n\n"
    "export const heroFrames: { poster: string; clean: string; desktop: FrameSet; mobile: FrameSet } = "
    + json.dumps(manifest, indent=2) + ";\n")
print("manifest written:", dest.relative_to(ROOT))
