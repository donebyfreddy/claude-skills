import { business } from "@/content/site";

const DEFAULT_MESSAGE =
  "Hola MR Autolavado, me gustaría solicitar cita para mi coche. ¿Qué disponibilidad tenéis?";

export function whatsappUrl(text: string = DEFAULT_MESSAGE) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const telUrl = `tel:${business.phoneIntl}`;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${business.name}, ${business.street}, ${business.postalCode} ${business.city}`,
)}`;
