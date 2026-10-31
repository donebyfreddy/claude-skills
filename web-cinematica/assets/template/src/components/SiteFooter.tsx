import { business, nav } from "@/content/site";
import { telUrl, whatsappUrl } from "@/lib/links";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg pb-28 pt-14 md:pb-14">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logo.png" alt="MR Autolavado" width={900} height={196} loading="lazy" className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-muted">
            Lavado y detailing de coches en {business.district}, Barcelona.
          </p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="grid gap-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-text/80 hover:text-accent">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="grid gap-2 text-sm">
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-text/80 hover:text-accent">
              WhatsApp
            </a>
          </li>
          <li>
            <a href={telUrl} className="text-text/80 hover:text-accent">
              {business.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="text-text/80 hover:text-accent">
              Instagram
            </a>
          </li>
          <li className="text-muted">
            {business.street}, {business.postalCode} {business.city}
          </li>
        </ul>
      </div>
      <div className="container-x mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© 2026 MR Autolavado</p>
        <p>Las escenas de lavado son recreaciones ilustrativas en nuestro taller.</p>
      </div>
    </footer>
  );
}
