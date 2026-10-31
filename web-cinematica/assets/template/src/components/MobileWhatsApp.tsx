"use client";

import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/links";
import { WhatsAppIcon } from "./ui/Button";

/** Floating WhatsApp button on small screens. Hidden over the hero and the contact section. */
export function MobileWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const contact = document.getElementById("contacto");
    let pastHero = false;
    let inContact = false;
    const update = () => setVisible(pastHero && !inContact);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === contact) inContact = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar cita por WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-4 right-4 z-40 inline-flex min-h-13 items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-accent-ink shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-[transform,opacity] duration-500 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <WhatsAppIcon className="size-5" />
      Reservar cita
    </a>
  );
}
