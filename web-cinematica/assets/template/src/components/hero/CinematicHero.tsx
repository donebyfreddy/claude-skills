"use client";

import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FrameStore, drawCover } from "@/lib/frameStore";
import { heroFrames } from "@/content/heroFrames";
import { whatsappUrl } from "@/lib/links";
import { ButtonLink, WhatsAppIcon } from "../ui/Button";

// Focal point of the car in the 4:3 source, used when cropping for narrow screens.
const FOCUS = { x: 0.5, y: 0.6 };

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const canvas = canvasRef.current!;
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px)",
        },
        (ctx) => {
          const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
          if (!motion) {
            section.dataset.static = "true";
            return;
          }
          section.dataset.static = "false";

          const saveData =
            (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false;
          const set = mobile || saveData ? heroFrames.mobile : heroFrames.desktop;
          const store = new FrameStore(set);
          const c2d = canvas.getContext("2d", { alpha: false })!;
          const state = { frame: 0, zoom: 1 };
          let lastDrawn = -1;
          let lastZoom = -1;
          let cw = 0;
          let ch = 0;

          const draw = (force = false) => {
            const i = Math.round(state.frame);
            if (!force && i === lastDrawn && state.zoom === lastZoom) return;
            const img = store.nearest(i);
            if (!img) return;
            drawCover(c2d, img, cw, ch, FOCUS.x, FOCUS.y, state.zoom);
            lastDrawn = i;
            lastZoom = state.zoom;
            section.dataset.ready = "true";
          };

          const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            cw = Math.round(rect.width * dpr);
            ch = Math.round(rect.height * dpr);
            canvas.width = cw;
            canvas.height = ch;
            draw(true);
          };
          const ro = new ResizeObserver(resize);
          ro.observe(canvas);

          // Redraw when a closer frame finishes loading.
          store.onFrameReady = (i) => {
            if (Math.abs(i - state.frame) < 6 || lastDrawn === -1) draw(true);
          };
          const start = () => store.load(mobile ? 4 : 6);
          if (document.readyState === "complete") start();
          else window.addEventListener("load", start, { once: true });

          const last = set.count - 1;
          // Draw on every timeline update (including while the scrub is catching up).
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            onUpdate: () => draw(),
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: mobile ? "+=230%" : "+=320%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
            },
          });

          // Film progress over the pin. Video time t (0–15 s) sits at 0.04 + 0.86 · t/15:
          // foam starts ≈0.24, car fully foamed ≈0.50, rinse ≈0.58–0.81, worker gone ≈0.90.
          tl.to(state, { frame: last, duration: 0.86 }, 0.04);
          tl.to(state, { zoom: 1.06, duration: 0.1, ease: "power1.inOut" }, 0.9);

          // Copy choreography (same timeline, so it reverses in lockstep).
          tl.to("[data-hero='intro']", { autoAlpha: 0, y: -40, duration: 0.08 }, 0.12);
          tl.fromTo("[data-hero='ch2']", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.26);
          tl.to("[data-hero='ch2']", { autoAlpha: 0, y: -24, duration: 0.05 }, 0.52);
          tl.fromTo("[data-hero='ch3']", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.6);
          tl.to("[data-hero='ch3']", { autoAlpha: 0, y: -24, duration: 0.05 }, 0.8);
          tl.fromTo("[data-hero='final']", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.88);
          tl.to("[data-hero='cue']", { autoAlpha: 0, duration: 0.04 }, 0.02);
          tl.to("[data-hero='progress']", { scaleX: 1, duration: 1 }, 0);

          return () => {
            store.abort();
            ro.disconnect();
            ScrollTrigger.refresh();
          };
        },
      );

      // Initial entrance of the intro copy (independent of scroll).
      gsap.from("[data-hero='intro'] > *", {
        y: 28,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.15,
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="inicio"
      aria-labelledby="hero-title"
      data-static="true"
      className="group/hero relative h-svh min-h-[560px] w-full overflow-hidden bg-bg"
    >
      {/* Media layer. On phones it keeps the film's 3:4 proportion at the top (less crop), copy sits below. */}
      <div className="absolute inset-x-0 top-0 h-full max-md:h-[min(100%,133.4vw)]">
        {/* Poster: first paint + reduced-motion view. Dirty car while animated, clean car when static. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroFrames.poster}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover transition-opacity duration-500 group-data-[ready=true]/hero:opacity-0 group-data-[static=true]/hero:hidden"
          style={{ objectPosition: `${FOCUS.x * 100}% ${FOCUS.y * 100}%` }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroFrames.clean}
          alt="Porsche 911 Turbo negro impecable bajo las luces hexagonales del taller MR Autolavado"
          className="absolute inset-0 hidden size-full object-cover group-data-[static=true]/hero:block"
          style={{ objectPosition: `${FOCUS.x * 100}% ${FOCUS.y * 100}%` }}
        />
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 size-full group-data-[static=true]/hero:hidden"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent md:hidden" />
      </div>

      {/* Scrims for legibility */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent max-md:bg-gradient-to-t max-md:from-bg max-md:via-black/10 max-md:to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="container-x relative flex h-full flex-col justify-end pb-20 md:justify-center md:pb-0">
        {/* Stage 1 copy */}
        <div data-hero="intro" className="max-w-[640px] group-data-[static=true]/hero:hidden">
          <p className="eyebrow mb-5 text-text/80">Más que un lavado</p>
          <h1 id="hero-title" className="display text-[clamp(3.2rem,9vw,7.6rem)]">
            Devuelve el brillo <span className="text-accent">a tu coche</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-text/85 md:text-lg">
            Cuidamos cada detalle para que tu coche vuelva a destacar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={whatsappUrl()} target="_blank" rel="noopener noreferrer" icon={<WhatsAppIcon className="size-[18px]" />}>
              Reservar cita
            </ButtonLink>
            <ButtonLink href="#proceso" variant="ghost">
              Descubre el proceso
            </ButtonLink>
          </div>
        </div>

        {/* Static (reduced-motion) version of the copy */}
        <div className="hidden max-w-[640px] group-data-[static=true]/hero:block">
          <p className="eyebrow mb-5 text-text/80">Más que un lavado</p>
          <p className="display text-[clamp(3.2rem,9vw,7.6rem)]" aria-hidden>
            Devuelve el brillo <span className="text-accent">a tu coche</span>
          </p>
          <p className="mt-6 max-w-md text-lg text-text/85">El resultado habla por sí solo.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={whatsappUrl()} target="_blank" rel="noopener noreferrer" icon={<WhatsAppIcon className="size-[18px]" />}>
              Reservar cita
            </ButtonLink>
            <ButtonLink href="#proceso" variant="ghost">
              Descubre el proceso
            </ButtonLink>
          </div>
        </div>

        {/* Chapters */}
        <p
          data-hero="ch2"
          aria-hidden
          className="invisible absolute bottom-24 left-[var(--gutter)] opacity-0 md:bottom-28"
        >
          <span className="display block text-[clamp(2.2rem,5vw,4rem)]">
            <span className="text-accent">02 · </span>Se transforma
          </span>
          <span className="mt-2 block max-w-xs text-sm text-text/80">Espuma activa por toda la carrocería para despegar la suciedad.</span>
        </p>
        <p
          data-hero="ch3"
          aria-hidden
          className="invisible absolute bottom-24 left-[var(--gutter)] opacity-0 md:bottom-28"
        >
          <span className="display block text-[clamp(2.2rem,5vw,4rem)]">
            <span className="text-accent">03 · </span>Aclarado
          </span>
          <span className="mt-2 block max-w-xs text-sm text-text/80">Panel a panel, de delante hacia atrás, hasta recuperar el brillo.</span>
        </p>

        {/* Final reveal */}
        <div
          data-hero="final"
          className="invisible absolute inset-x-[var(--gutter)] bottom-20 opacity-0 md:bottom-24 md:left-auto md:right-[var(--gutter)] md:max-w-[520px] md:text-right"
        >
          <p className="display text-[clamp(2.4rem,5.4vw,4.6rem)]">
            El resultado habla <span className="text-accent">por sí solo.</span>
          </p>
          <div className="mt-6 flex md:justify-end">
            <ButtonLink href={whatsappUrl()} target="_blank" rel="noopener noreferrer" icon={<WhatsAppIcon className="size-[18px]" />}>
              Reservar mi cita
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Scroll cue + progress */}
      <div
        data-hero="cue"
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-text/70 md:flex group-data-[static=true]/hero:hidden"
      >
        Desliza para descubrir
        <ChevronDown className="size-4 animate-bounce" />
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5 group-data-[static=true]/hero:hidden">
        <div data-hero="progress" className="h-full origin-left scale-x-0 bg-accent" />
      </div>
      <p className="absolute bottom-4 right-[var(--gutter)] text-[0.6rem] uppercase tracking-[0.2em] text-text/45 md:bottom-6">
        Recreación ilustrativa en nuestro taller
      </p>
    </section>
  );
}
