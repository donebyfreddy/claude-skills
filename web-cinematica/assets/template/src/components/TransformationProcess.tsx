"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./ui/SectionHeading";
import { TiltCard } from "./ui/TiltCard";

const steps = [
  { n: "01", title: "Entra", text: "Tu coche llega con las marcas del uso diario.", img: "/media/process/01.webp", alt: "Porsche 911 negro sucio de polvo y barro dentro del taller" },
  { n: "02", title: "Se transforma", text: "Espuma activa y aclarado, panel a panel.", img: "/media/process/02.webp", alt: "Operario de MR Autolavado aplicando espuma al Porsche 911" },
  { n: "03", title: "Sale impecable", text: "Un acabado que se ve bajo cualquier luz.", img: "/media/process/03.webp", alt: "Porsche 911 negro limpio y brillante bajo las luces hexagonales" },
];

export function TransformationProcess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        // clearProps so the hover lift isn't clipped and CSS hover zoom works afterwards.
        gsap.from("[data-step]", {
          clipPath: "inset(0 100% 0 0)",
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.18,
          clearProps: "clipPath",
          scrollTrigger: { trigger: "[data-steps]", start: "top 80%" },
        });
        gsap.from("[data-step] img", {
          scale: 1.15,
          duration: 1.6,
          ease: "expo.out",
          stagger: 0.18,
          clearProps: "transform",
          scrollTrigger: { trigger: "[data-steps]", start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="proceso" aria-labelledby="proceso-title" className="relative py-24 md:py-32">
      <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="El proceso" id="proceso-title">
          Un resultado <br className="hidden sm:block" />
          <span className="text-accent">extraordinario</span>
        </SectionHeading>
        <p className="max-w-xs text-base leading-relaxed text-muted md:pb-3">Mismo cuidado. Cada detalle importa.</p>
      </div>

      <ol
        data-steps
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 md:mx-auto md:grid md:max-w-[var(--maxw)] md:grid-cols-3 md:overflow-visible md:gap-5"
      >
        {steps.map((s, i) => (
          <li key={s.n} data-step className="relative w-[82%] shrink-0 snap-center md:w-auto">
            <TiltCard>
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface md:aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.alt}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.08]"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 md:p-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-accent/70 font-[family-name:var(--font-barlow)] text-lg font-bold text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-ink">
                    {s.n}
                  </span>
                  <span>
                    <span className="display block text-3xl">{s.title}</span>
                    <span className="mt-1 block text-sm text-text/80">{s.text}</span>
                  </span>
                </figcaption>
              </figure>
            </TiltCard>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-[18px] top-1/2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg text-accent md:flex"
              >
                <ArrowRight className="size-4" />
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="container-x mt-5 text-[0.7rem] uppercase tracking-[0.18em] text-muted/80">
        Recreación ilustrativa en nuestro taller
      </p>
    </section>
  );
}
