"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gallery, galleryFilters, type GalleryCategory } from "@/content/site";
import { gsap, Flip, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./ui/SectionHeading";
import { TiltCard } from "./ui/TiltCard";

type Filter = "todos" | GalleryCategory;

export function VehicleGallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>("todos");
  const flipState = useRef<Flip.FlipState | null>(null);

  const items = gallery.filter((g) => filter === "todos" || g.categories.includes(filter));

  const changeFilter = (f: Filter) => {
    if (f === filter) return;
    flipState.current = Flip.getState("[data-card]");
    setFilter(f);
    track.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  // Animate filter changes.
  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
      flipState.current = null;
    },
    { scope: root, dependencies: [filter] },
  );

  // Entrance reveal.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-card]", {
          x: 80,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          clearProps: "transform",
          scrollTrigger: { trigger: track.current, start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: "smooth" });
  };

  return (
    <section ref={root} id="trabajos" aria-labelledby="trabajos-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-x flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow="Algunos de nuestros trabajos" id="trabajos-title">
          Coches reales. <br />
          <span className="text-accent">Clientes reales.</span>
        </SectionHeading>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar trabajos">
          {galleryFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => changeFilter(f.id)}
              className={`min-h-10 rounded-full border px-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                filter === f.id
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line text-text/75 hover:border-white/40 hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-12">
        <ul
          ref={track}
          className="no-scrollbar -my-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] py-8 lg:px-[max(var(--gutter),calc((100vw-var(--maxw))/2+var(--gutter)))]"
        >
          {items.map((g) => (
            <li
              key={g.src}
              data-card
              data-flip-id={g.src}
              className="relative w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[min(30vw,400px)]"
            >
              <TiltCard>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.08]"
                    style={{ objectPosition: g.position ?? "50% 50%" }}
                  />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 to-transparent" />
                  <p className="absolute bottom-4 left-5 right-5 flex items-center justify-between transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
                    <span className="display text-2xl">{g.title}</span>
                    <span className="text-[0.65rem] uppercase tracking-[0.18em] text-text/70 transition-colors group-hover:text-accent">
                      MR Autolavado
                    </span>
                  </p>
                </div>
              </TiltCard>
            </li>
          ))}
        </ul>

        <div className="container-x mt-6 flex items-center justify-between">
          <p className="text-sm text-muted">Fotos reales de vehículos tratados en nuestro taller.</p>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Trabajo anterior"
              onClick={() => scrollBy(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-line text-text transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Trabajo siguiente"
              onClick={() => scrollBy(1)}
              className="flex size-11 items-center justify-center rounded-full border border-line text-text transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
