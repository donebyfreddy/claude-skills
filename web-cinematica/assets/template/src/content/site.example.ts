// Single source of truth for verified business facts and page content.
// Only verified information goes here: no invented prices, reviews or claims.

export const business = {
  name: "MR Autolavado",
  street: "Carrer d'Hurtado, 28",
  postalCode: "08022",
  city: "Barcelona",
  district: "Sarrià-Sant Gervasi",
  country: "ES",
  phoneDisplay: "611 45 59 08",
  phoneIntl: "+34611455908",
  whatsapp: "34611455908",
  instagram: "https://www.instagram.com/mr__autolavado/",
  // Source: mrautolavado.com (checked 24 Oct 2026). Mon opening 08:30 confirmed by client.
  hours: [
    { days: "Lunes a viernes", time: "8:30 – 13:30 · 15:30 – 19:00" },
    { days: "Sábado", time: "9:30 – 13:30" },
    { days: "Domingo", time: "Cerrado" },
  ],
  // Supplied by the client from the Google listing on 24 Oct 2026.
  rating: { value: 5.0, count: 61, asOf: "octubre de 2026" },
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=MR+Autolavado+Carrer+d'Hurtado+28+08022+Barcelona",
} as const;

export const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#opiniones", label: "Opiniones" },
  { href: "#contacto", label: "Contacto" },
] as const;

export type Service = {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  image: string;
  imagePosition: string;
  whatsappText: string;
};

// Worded from the official service list (Exteriores, Interiores, Tapicerías,
// Cerámicos, Corrección de pintura, Detailing). Items marked "opcional" there stay optional here.
export const services: Service[] = [
  {
    id: "exterior",
    title: "Lavado exterior",
    summary: "Lavado a mano cuidadoso que devuelve el brillo original a la carrocería.",
    includes: [
      "Lavado a mano y encerado",
      "Limpieza de llantas y neumáticos",
      "Restauración de faros (opcional)",
      "Limpieza de bajos (opcional)",
    ],
    image: "/media/photos/08-gla-blanco.webp",
    imagePosition: "50% 45%",
    whatsappText: "Hola, me gustaría pedir información sobre el lavado exterior.",
  },
  {
    id: "interior",
    title: "Detailing interior",
    summary: "Un habitáculo limpio, cuidado y agradable, rincón a rincón.",
    includes: [
      "Limpieza de tapicerías y moquetas",
      "Limpieza e hidratación de cuero",
      "Limpieza de techo interior",
      "Salpicadero, consola y cristales",
    ],
    image: "/media/photos/09-macan-blanco.webp",
    imagePosition: "50% 40%",
    whatsappText: "Hola, me gustaría pedir información sobre el detailing interior.",
  },
  {
    id: "ceramico",
    title: "Tratamiento cerámico",
    summary: "Protección duradera para la pintura y un brillo profundo.",
    includes: [
      "Recubrimiento cerámico",
      "Film de protección de pintura (PPF)",
      "Limpieza de motor",
      "Eliminación de olores",
    ],
    image: "/media/photos/03-macan-negro.webp",
    imagePosition: "40% 45%",
    whatsappText: "Hola, me gustaría pedir información sobre el tratamiento cerámico.",
  },
  {
    id: "correccion",
    title: "Corrección de pintura",
    summary: "Reducimos defectos de la pintura y realzamos su color original.",
    includes: [
      "Corrección de pintura",
      "Pulido y abrillantado",
      "Valoración previa del estado de la pintura",
    ],
    image: "/media/photos/07-boxster-rojo.webp",
    imagePosition: "50% 40%",
    whatsappText: "Hola, me gustaría pedir información sobre la corrección de pintura.",
  },
];

export type GalleryCategory = "deportivos" | "suv" | "premium";

export const galleryFilters: { id: "todos" | GalleryCategory; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "deportivos", label: "Deportivos" },
  { id: "suv", label: "SUV" },
  { id: "premium", label: "Premium" },
];

export const gallery: {
  src: string;
  alt: string;
  title: string;
  categories: GalleryCategory[];
  position?: string;
}[] = [
  {
    src: "/media/photos/porsche-911.webp",
    alt: "Porsche 911 Turbo negro recién detallado bajo las luces hexagonales del taller MR Autolavado",
    title: "Porsche 911 Turbo",
    categories: ["deportivos", "premium"],
    position: "55% 55%",
  },
  {
    src: "/media/photos/04-clase-g.webp",
    alt: "Mercedes Clase G negro con la carrocería brillante en el taller MR Autolavado",
    title: "Mercedes-Benz Clase G",
    categories: ["suv", "premium"],
  },
  {
    src: "/media/photos/07-boxster-rojo.webp",
    alt: "Porsche Boxster rojo de frente con reflejos hexagonales en el capó",
    title: "Porsche Boxster",
    categories: ["deportivos"],
  },
  {
    src: "/media/photos/03-macan-negro.webp",
    alt: "Porsche Macan negro con la pintura impecable en el taller",
    title: "Porsche Macan",
    categories: ["suv", "premium"],
  },
  {
    src: "/media/photos/08-gla-blanco.webp",
    alt: "Mercedes GLA blanco con reflejos de las luces del techo en el capó",
    title: "Mercedes-Benz GLA",
    categories: ["premium"],
  },
  {
    src: "/media/photos/09-macan-blanco.webp",
    alt: "Porsche Macan blanco junto a la puerta del taller MR Autolavado",
    title: "Porsche Macan",
    categories: ["suv"],
  },
];
