import { Star } from "lucide-react";
import { business } from "@/content/site";
import { SectionHeading } from "./ui/SectionHeading";

// Only the verified rating summary is shown. Individual review cards are added
// once the full original texts are confirmed (never reconstructed or invented).
export function ReviewsSection() {
  const { rating } = business;
  return (
    <section id="opiniones" aria-labelledby="opiniones-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <SectionHeading eyebrow="Lo que dicen nuestros clientes" id="opiniones-title">
          Confianza <br />
          <span className="text-accent">que brilla</span>
        </SectionHeading>

        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-8 md:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-accent/10 blur-3xl" />
          <p className="flex items-end gap-4">
            <span className="display text-[5.5rem] leading-[0.8] md:text-[7rem]">
              {rating.value.toFixed(1).replace(".", ",")}
            </span>
            <span className="pb-2">
              <span className="flex gap-1 text-star" aria-label={`${rating.value} de 5 estrellas`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-current" aria-hidden />
                ))}
              </span>
              <span className="mt-2 block text-sm text-muted">
                {rating.count} reseñas en Google · {rating.asOf}
              </span>
            </span>
          </p>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-text/90">
            Nuestros clientes destacan el trato cercano, la atención al detalle y cómo queda el coche por dentro y por fuera.
          </p>
          <a
            href={business.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-text transition-colors hover:border-accent hover:text-accent"
          >
            Leer las reseñas en Google
          </a>
        </div>
      </div>
    </section>
  );
}
