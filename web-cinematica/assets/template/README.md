# Plantilla probada (MR Autolavado, oct 2026)

Código real de una web que funcionó en producción. Cópialo sobre un proyecto Next.js recién
creado (`src/` encima de `src/`) y adáptalo; no lo reescribas desde cero.

1. `cp -R <skill>/assets/template/src/* <proyecto>/src/`
2. `mv src/content/site.example.ts src/content/site.ts` y cambia TODOS los datos (el ejemplo es de
   MR Autolavado: no dejes nada suyo en otro negocio).
3. Genera medios con `scripts/build-media.py` (crea `src/content/heroFrames.ts`).
4. Ajusta textos, paleta (`globals.css`), schema de `layout.tsx`, secciones del sector.
5. Renombra `VehicleGallery` si el sector no es de coches (y sus textos "Coches reales…").

Mapa de componentes y cómo adaptarlos: `references/build-and-qa.md`.

Dependencias: `npm i gsap @gsap/react lucide-react`.
