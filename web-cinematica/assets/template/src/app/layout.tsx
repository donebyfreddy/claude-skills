import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { business } from "@/content/site";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mrautolavado.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MR Autolavado · Lavado y detailing de coches en Barcelona",
  description:
    "Lavado a mano, detailing interior, tratamiento cerámico y corrección de pintura en Sarrià-Sant Gervasi, Barcelona. Pide cita por WhatsApp en MR Autolavado.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: business.name,
    title: "MR Autolavado · Detailing de coches en Barcelona",
    description: "Cuidamos cada detalle para que tu coche vuelva a destacar. Pide cita por WhatsApp.",
    images: [{ url: "/media/og.jpg", width: 1200, height: 630, alt: "Porsche 911 en el taller de MR Autolavado" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b0d0e",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoWash",
  name: business.name,
  url: siteUrl,
  image: `${siteUrl}/media/og.jpg`,
  telephone: business.phoneIntl,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.street,
    postalCode: business.postalCode,
    addressLocality: business.city,
    addressRegion: "Cataluña",
    addressCountry: business.country,
  },
  areaServed: "Barcelona",
  sameAs: [business.instagram],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "13:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "15:30",
      closes: "19:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:30", closes: "13:30" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: business.rating.value,
    reviewCount: business.rating.count,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-ES" className={`${barlow.variable} ${inter.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
