import { SiteHeader } from "@/components/SiteHeader";
import { CinematicHero } from "@/components/hero/CinematicHero";
import { TransformationProcess } from "@/components/TransformationProcess";
import { InteractiveServices } from "@/components/InteractiveServices";
import { BeforeAfterComparison } from "@/components/BeforeAfterComparison";
import { VehicleGallery } from "@/components/VehicleGallery";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ContactCTA } from "@/components/ContactCTA";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileWhatsApp } from "@/components/MobileWhatsApp";

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <CinematicHero />
        <TransformationProcess />
        <InteractiveServices />
        <BeforeAfterComparison />
        <VehicleGallery />
        <ReviewsSection />
        <ContactCTA />
      </main>
      <SiteFooter />
      <MobileWhatsApp />
    </>
  );
}
