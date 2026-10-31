# Construcción y QA (Fases 8 y 9)

## Contenido
1. Estructura del proyecto
2. Plantilla: qué es cada componente y cómo adaptarlo
3. El motor del hero (cómo funciona y cómo sincronizar textos)
4. Rendimiento, accesibilidad y SEO
5. Trampas técnicas ya vividas
6. Checklist de QA en navegador

## 1. Estructura del proyecto

```
<proyecto>/
  assets-src/        originales intocables (fotos, logo, imágenes generadas aprobadas)
  production/        assets.md, credit-log.md, mockup-aprobado.png, final/hero-1080p.mp4,
                     draft/ (en .gitignore), qc/
  public/media/      logo.png/.webp, photos/, hero/{desktop,mobile}/, process/, compare/, og.jpg
  src/app/           layout.tsx (fuentes, metadata, JSON-LD), page.tsx, globals.css (tokens), icon.png
  src/content/       site.ts (datos del negocio), heroFrames.ts (generado)
  src/lib/           gsap.ts, frameStore.ts, links.ts
  src/components/    hero/CinematicHero, TransformationProcess, InteractiveServices,
                     BeforeAfterComparison, VehicleGallery, ReviewsSection, ContactCTA,
                     SiteHeader, SiteFooter, MobileWhatsApp, ui/{Button,SectionHeading,TiltCard}
```

Copia `assets/template/src` encima del proyecto recién creado y renombra
`content/site.example.ts` → `content/site.ts`.

## 2. Plantilla

| Archivo | Qué hace | Qué adaptar |
|---|---|---|
| `content/site.ts` | Única fuente de datos: negocio, horario, valoración, nav, servicios, galería | Todo. Solo datos verificados. Comenta la fuente del horario |
| `lib/links.ts` | `whatsappUrl(texto)`, `telUrl`, `directionsUrl` | Mensaje por defecto de WhatsApp |
| `lib/frameStore.ts` | Carga progresiva de fotogramas (cada 8º, 4º, 2º, todos) y `drawCover` | Nada |
| `lib/gsap.ts` | Registra ScrollTrigger, Flip y useGSAP | Nada |
| `hero/CinematicHero.tsx` | Hero fijado con canvas que dibuja el fotograma según el scroll, textos por capítulos, versión estática para movimiento reducido | Textos, `FOCUS`, tiempos de los capítulos (ver §3), largo del pin |
| `TransformationProcess.tsx` | 3 paneles con revelado y hover 3D | Títulos/textos/alt |
| `InteractiveServices.tsx` | Acordeón horizontal (hover/tap/teclado), lista de incluidos y CTA por servicio | Viene de `services` |
| `BeforeAfterComparison.tsx` | Comparador: demo con scroll, arrastre que toma el control, teclado, `role="slider"` | Textos y alt; imágenes `compare/antes|despues.webp` |
| `VehicleGallery.tsx` | Galería horizontal, filtros con Flip, hover 3D, botones | Renombra al sector (p. ej. `WorkGallery`), filtros |
| `ReviewsSection.tsx` | Valoración verificada + enlace a Google | Añade tarjetas solo con reseñas literales |
| `ContactCTA.tsx` | WhatsApp, llamar, cómo llegar, horario, foto de la entrada | Fotos y textos |
| `SiteHeader.tsx` / `SiteFooter.tsx` / `MobileWhatsApp.tsx` | Navegación fija, menú móvil, pie, botón flotante | Logo y textos |
| `ui/TiltCard.tsx` + `.tilt-card` en CSS | Tarjeta que se levanta, se inclina hacia el ratón y brilla (solo ratón) | Intensidad `max` |
| `app/globals.css` | Tokens de color, tipografía, `.tilt-card`, `.lift-card` | Paleta (acento del logo) |
| `app/layout.tsx` | Fuentes (Barlow Condensed + Inter), metadata, OG, JSON-LD | Tipo de schema (`AutoWash`, `Restaurant`, `HairSalon`, `Dentist`…), horario, `aggregateRating` solo si está verificado |

Textos de interfaz, `alt` y metadata en el idioma del negocio.

## 3. El motor del hero

- Canvas a pantalla completa (en móvil ocupa arriba con proporción 3:4 y el texto va debajo; así
  no se recorta el vídeo a un tercio).
- Un timeline GSAP con ScrollTrigger `pin: true`, `scrub: 0.6`, `end: +=320%` (escritorio) /
  `+=230%` (móvil). Contiene el tween del fotograma y los de los textos, así que todo va y vuelve
  sincronizado.
- **El dibujo va en `onUpdate` del timeline**, no del ScrollTrigger (si no, al terminar el scrub el
  último fotograma se queda sin pintar).
- El fotograma avanza en `0.04 → 0.90` del timeline. Momento del vídeo `t` (s) de `D` (s) →
  posición `0.04 + 0.86 · t/D`. Úsalo para colocar cada rótulo cuando ocurre esa acción en el
  vídeo real (mira la hoja de contactos). Ejemplo MR (15 s): espuma empieza 0,24; coche todo
  blanco 0,50; aclarado 0,58–0,81; operario fuera 0,90 → rótulo final en 0,88.
- Zoom suave final (1 → 1,06) para dar "movimiento de cámara" sin pedírselo al modelo.
- Póster `<img fetchPriority="high">` = primer fotograma (LCP sin saltos). Con
  `prefers-reduced-motion` se muestra la foto final limpia y todo el texto, sin pin.
- `FOCUS` = punto del encuadre que debe quedar visible al recortar (centro del protagonista).

## 4. Rendimiento, accesibilidad y SEO

- Fotogramas: escritorio 1280 px, 10 fps, WebP q56 (~10 MB para 15 s, se cargan en segundo plano
  y de forma progresiva); móvil 720×960, 6 fps, q54 (~3,5 MB). Con `saveData` se usa el set móvil.
- Imágenes con `alt` descriptivo, `loading="lazy"` fuera del primer pantallazo.
- Un `h1`, `h2` por sección, foco visible, botones reales, slider con teclado, enlace "saltar al
  contenido", contraste ≥ 4,5:1.
- `lang`, título y descripción locales, canonical a la web real del negocio (la demo no compite en
  Google), OG 1200×630, JSON-LD con datos verificados.

## 5. Trampas técnicas ya vividas

- **`new Date()` en un componente de servidor** rompe el build con Cache Components → año fijo.
- **Caché de `.next` con CSS viejo**: si una clase nueva no aparece en el CSS compilado,
  `rm -rf .next && npm run build`. Compruébalo con `grep` en `.next/static/chunks/*.css`.
- **`scroll-behavior: smooth` global** hace que los `scrollTo` de las pruebas aterricen en otro
  sitio: aplícalo solo con `html:focus-within` y nunca con movimiento reducido.
- **Las animaciones de entrada dejan `transform`/`clip-path` en línea** y anulan el hover o
  recortan la tarjeta levantada → `clearProps` en esos `gsap.from`.
- **`overflow-x: auto` recorta en vertical** → la galería necesita `py-8 -my-8` para que la
  tarjeta pueda subir.
- **Títulos cortados en tarjetas estrechas del acordeón** → texto vertical cuando están cerradas.
- **Recarga del navegador = restauración de scroll**: al medir posiciones tras navegar, espera a
  que ScrollTrigger cree el pin o recarga con otra query (`?v=2`).
- **Capturas con viewport emulado** salen reducidas: usa `zoom` sobre la zona de la página.
- **Mismo vídeo para escritorio y móvil**: en móvil recorta a 3:4 centrado en el protagonista; si
  la persona trabaja a un lado, desplaza `--process` / `--mobile-focus`.

## 6. Checklist de QA

Escritorio 1440×900 y móvil 375×812 (y tablet 768 si hay tiempo):

- [ ] Hero: primer pantallazo correcto; scroll abajo avanza el vídeo; scroll arriba lo rebobina;
      rótulos en su momento; fotograma final + CTA; transición limpia a la sección siguiente.
- [ ] Sin fotogramas en negro al hacer scroll rápido.
- [ ] Proceso, servicios, galería: hover 3D con ratón; tap en móvil; servicios con teclado.
- [ ] Comparador: demo con scroll; arrastre toma el control; flechas de teclado; el scroll ya no
      lo mueve después de tocarlo.
- [ ] Filtros de la galería; botones anterior/siguiente.
- [ ] Enlaces: WhatsApp (número y mensaje), `tel:`, Maps, Instagram.
- [ ] Consola sin errores; ninguna imagen rota; todas con `alt`; jerarquía de títulos.
- [ ] Sin desborde horizontal en móvil; botón flotante de WhatsApp no tapa contenido.
- [ ] `npm run build` y `eslint` limpios.
- [ ] Rótulos de "recreación ilustrativa" en lo generado; galería solo con fotos reales.
- [ ] Tras publicar: la URL en vivo responde 200 y el hero funciona allí.
