"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./ui/SectionHeading";

const BEFORE = "/media/compare/antes.webp";
const AFTER = "/media/compare/despues.webp";

export function BeforeAfterComparison() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(85);
  const userControlled = useRef(false);
  const demo = useRef<ScrollTrigger | null>(null);

  const takeControl = useCallback(() => {
    if (userControlled.current) return;
    userControlled.current = true;
    demo.current?.kill();
    demo.current = null;
  }, []);

  // Scroll-driven demonstration: the divider sweeps once as the section passes,
  // until the visitor touches the control.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const proxy = { p: 85 };
        const tween = gsap.to(proxy, {
          p: 22,
          ease: "power1.inOut",
          onUpdate: () => {
            if (!userControlled.current) setPos(proxy.p);
          },
          scrollTrigger: {
            trigger: frame.current,
            start: "top 75%",
            end: "bottom 35%",
            scrub: 0.8,
          },
        });
        demo.current = tween.scrollTrigger ?? null;
        return () => tween.kill();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => setPos(50));
      return () => mm.revert();
    },
    { scope: root },
  );

  const setFromClientX = (clientX: number) => {
    const rect = frame.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    takeControl();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
    setFromClientX(e.clientX);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const next: Record<string, (p: number) => number> = {
      ArrowLeft: (p) => p - step,
      ArrowDown: (p) => p - step,
      ArrowRight: (p) => p + step,
      ArrowUp: (p) => p + step,
      Home: () => 0,
      End: () => 100,
    };
    const fn = next[e.key];
    if (fn) {
      e.preventDefault();
      takeControl();
      setPos((p) => Math.min(100, Math.max(0, fn(p))));
    }
  };

  return (
    <section ref={root} id="antes-despues" aria-labelledby="ad-title" className="relative overflow-hidden py-24 md:py-32">
      <div className="container-x grid items-end gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:pb-6">
          <SectionHeading eyebrow="Antes / Después" id="ad-title">
            La diferencia está en los <span className="text-accent">detalles</span>
          </SectionHeading>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
            Desliza para ver la transformación. Mismo coche, mismo encuadre: solo cambia el cuidado.
          </p>
          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.18em] text-muted/80">Recreación ilustrativa</p>
        </div>

        <div
          ref={frame}
          className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-2xl bg-surface"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BEFORE}
            alt="Antes: Mercedes-AMG blanco con la carrocería sucia de polvo y barro de carretera"
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AFTER}
            alt="Después: el mismo Mercedes-AMG blanco limpio y brillante"
            className="absolute inset-0 size-full object-cover"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            loading="lazy"
            draggable={false}
          />

          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/70 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-text">
            Antes
          </span>
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-accent px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent-ink">
            Después
          </span>

          <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90" style={{ left: `${pos}%` }} />
          <div
            role="slider"
            tabIndex={0}
            aria-label="Comparar antes y después"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(100 - pos)}% del coche limpio visible`}
            onKeyDown={onKeyDown}
            className="absolute top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-bg/80 text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-sm"
            style={{ left: `${pos}%` }}
          >
            <ChevronsLeftRight className="size-6" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
