// Progressive frame loader for the scroll-scrubbed hero film.
// Loads coarse-to-fine (every 8th frame, then every 4th, 2nd, all) so any
// scroll position can be drawn early with the nearest loaded frame.

export type FrameSet = {
  count: number;
  width: number;
  height: number;
  /** URL pattern with {i} replaced by the 1-based, zero-padded frame index. */
  pattern: string;
  pad: number;
};

export class FrameStore {
  readonly set: FrameSet;
  private frames: (HTMLImageElement | null)[];
  private aborted = false;
  onProgress?: (loaded: number, total: number) => void;
  onFrameReady?: (index: number) => void;
  loaded = 0;

  constructor(set: FrameSet) {
    this.set = set;
    this.frames = new Array(set.count).fill(null);
  }

  url(i: number) {
    return this.set.pattern.replace("{i}", String(i + 1).padStart(this.set.pad, "0"));
  }

  private order(): number[] {
    const seen = new Set<number>();
    const out: number[] = [];
    for (const step of [8, 4, 2, 1]) {
      for (let i = 0; i < this.set.count; i += step) {
        if (!seen.has(i)) {
          seen.add(i);
          out.push(i);
        }
      }
    }
    const last = this.set.count - 1;
    // Make sure the final (reveal) frame arrives in the first pass.
    if (out.indexOf(last) > 8) {
      out.splice(out.indexOf(last), 1);
      out.splice(1, 0, last);
    }
    return out;
  }

  async load(concurrency = 6) {
    const queue = this.order();
    const worker = async () => {
      while (queue.length && !this.aborted) {
        const i = queue.shift()!;
        const img = new Image();
        img.decoding = "async";
        img.src = this.url(i);
        try {
          await img.decode();
        } catch {
          continue;
        }
        if (this.aborted) return;
        this.frames[i] = img;
        this.loaded++;
        this.onFrameReady?.(i);
        this.onProgress?.(this.loaded, this.set.count);
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  /** Nearest loaded frame to i (searching outward), or null if none yet. */
  nearest(i: number): HTMLImageElement | null {
    const n = this.set.count;
    const idx = Math.max(0, Math.min(n - 1, i));
    if (this.frames[idx]) return this.frames[idx];
    for (let d = 1; d < n; d++) {
      const a = this.frames[idx - d];
      if (a) return a;
      const b = this.frames[idx + d];
      if (b) return b;
    }
    return null;
  }

  abort() {
    this.aborted = true;
  }
}

/** Draw an image to fill the canvas (object-fit: cover) around a focal point, with extra zoom. */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource & { width: number; height: number },
  cw: number,
  ch: number,
  focusX = 0.5,
  focusY = 0.5,
  zoom = 1,
) {
  const iw = img.width;
  const ih = img.height;
  const scale = Math.max(cw / iw, ch / ih) * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = Math.min(0, Math.max(cw - dw, cw / 2 - focusX * dw));
  const dy = Math.min(0, Math.max(ch - dh, ch / 2 - focusY * dh));
  ctx.drawImage(img, dx, dy, dw, dh);
}
