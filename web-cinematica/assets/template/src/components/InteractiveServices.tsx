"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { services } from "@/content/site";
import { whatsappUrl } from "@/lib/links";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./ui/SectionHeading";
import { WhatsAppIcon } from "./ui/Button";

export function InteractiveServices() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-service]", {
          y: 60,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "transform",
          scrollTrigger: { trigger: "[data-services]", start: "top 82%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="servicios" aria-labelledby="servicios-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Nuestros servicios" id="servicios-title">
          Cuidamos cada <span className="text-accent">detalle</span>
        </SectionHeading>
        <p className="max-w-sm text-base leading-relaxed text-muted md:pb-3">
          Tratamientos profesionales para que tu coche luzca siempre como el primer día.
        </p>
      </div>

      <ul data-services className="container-x mt-12 flex flex-col gap-3 lg:h-[560px] lg:flex-row">
        {services.map((s, i) => {
          const open = i === active;
          const panelId = `servicio-${s.id}`;
          return (
            <li
              key={s.id}
              data-service
              onMouseEnter={() => setActive(i)}
              className={`lift-card group relative overflow-hidden rounded-2xl border bg-surface transition-[flex-grow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-w-0 ${
                open ? "border-accent/50 lg:flex-[3.2]" : "border-line lg:flex-1"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt=""
                loading="lazy"
                className={`absolute inset-0 size-full object-cover transition-[transform,opacity] duration-[1.1s] ease-out ${
                  open ? "scale-100 opacity-70" : "scale-110 opacity-35 group-hover:opacity-55"
                }`}
                style={{ objectPosition: s.imagePosition }}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/10" />

              <div className="relative flex h-full flex-col justify-end p-5 md:p-7">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`flex w-full items-center justify-between gap-4 text-left ${
                      open ? "" : "lg:flex-col-reverse lg:items-start lg:justify-end"
                    }`}
                  >
                    <span
                      className={`display text-[1.7rem] leading-none md:text-3xl lg:whitespace-nowrap ${
                        open ? "" : "lg:rotate-180 lg:[writing-mode:vertical-rl]"
                      }`}
                    >
                      <span className="mr-3 text-base text-accent">0{i + 1}</span>
                      {s.title}
                    </span>
                    <span
                      aria-hidden
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,color,border-color] duration-500 ${
                        open ? "rotate-45 border-accent bg-accent text-accent-ink" : "border-white/30 text-text"
                      }`}
                    >
                      <Plus className="size-5" />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-5 lg:w-[min(440px,40vw)]">
                      <p className="text-base leading-relaxed text-text/90">{s.summary}</p>
                      <ul className="mt-4 space-y-2 text-sm text-text/80">
                        {s.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={whatsappUrl(s.whatsappText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={open ? 0 : -1}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-accent/60 px-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-accent-ink"
                      >
                        <WhatsAppIcon className="size-4" />
                        Consultar por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
