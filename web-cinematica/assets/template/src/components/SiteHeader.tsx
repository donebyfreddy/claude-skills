"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/content/site";
import { whatsappUrl } from "@/lib/links";
import { WhatsAppIcon } from "./ui/Button";

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSolid(window.scrollY > 40));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid || open
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <a href="#inicio" className="shrink-0" aria-label="MR Autolavado, ir al inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logo.png" alt="MR Autolavado" width={900} height={196} className="h-8 w-auto md:h-10" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative py-2 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-text/80 transition-colors hover:text-text after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full border border-accent/60 px-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-accent-ink sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            Reservar cita
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-text lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        hidden={!open}
        className="h-[calc(100dvh-64px)] overflow-y-auto border-t border-line bg-bg lg:hidden"
      >
        <nav aria-label="Móvil" className="container-x flex flex-col gap-1 py-8">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="display border-b border-line py-4 text-4xl text-text/90 hover:text-accent"
            >
              {item.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-accent-ink"
          >
            <WhatsAppIcon />
            Reservar cita por WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
