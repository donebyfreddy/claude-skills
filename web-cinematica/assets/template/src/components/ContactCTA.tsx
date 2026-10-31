import { Clock, MapPin, Phone } from "lucide-react";
import { business } from "@/content/site";
import { directionsUrl, telUrl, whatsappUrl } from "@/lib/links";
import { ButtonLink, WhatsAppIcon } from "./ui/Button";

export function ContactCTA() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative overflow-hidden border-t border-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/photos/porsche-911.webp"
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-[30%_60%] opacity-30"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/60" />

      <div className="container-x relative grid gap-14 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <h2 id="contacto-title" className="display text-[clamp(2.8rem,6.6vw,5.6rem)]">
            ¿Listo para ver <br />
            <span className="text-accent">la diferencia?</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-text/85">Dale a tu coche el cuidado que se merece.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={whatsappUrl()} target="_blank" rel="noopener noreferrer" icon={<WhatsAppIcon className="size-[18px]" />}>
              Reservar cita por WhatsApp
            </ButtonLink>
            <ButtonLink href={telUrl} variant="ghost" icon={<Phone className="size-4" aria-hidden />} arrow={false}>
              Llamar ahora
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">Te respondemos por WhatsApp para confirmar día y hora.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_1fr] lg:grid-cols-1 xl:grid-cols-[1.1fr_1fr]">
          <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-1 xl:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/photos/05-entrada.webp"
              alt="Entrada del taller MR Autolavado en Carrer d'Hurtado, 28, con un coche dentro bajo las luces hexagonales"
              loading="lazy"
              className="size-full object-cover object-[50%_45%]"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-text">
              Así nos encuentras
            </figcaption>
          </figure>

          <address className="not-italic rounded-2xl border border-line bg-surface/80 p-6 backdrop-blur-sm">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="block font-semibold">{business.name}</span>
                <span className="block text-text/80">{business.street}</span>
                <span className="block text-text/80">
                  {business.postalCode} {business.city}
                </span>
              </span>
            </p>
            <p className="mt-4 flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
              <a href={telUrl} className="hover:text-accent">
                {business.phoneDisplay}
              </a>
            </p>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-accent/60 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Cómo llegar
            </a>
          </address>

          <div className="rounded-2xl border border-line bg-surface/80 p-6 backdrop-blur-sm">
            <p className="flex items-center gap-3 font-semibold">
              <Clock className="size-5 text-accent" aria-hidden />
              Horario
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              {business.hours.map((h) => (
                <div key={h.days}>
                  <dt className="text-muted">{h.days}</dt>
                  <dd className="text-text/90">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
