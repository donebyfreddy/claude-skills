---
name: mockup-dashboard
description: Antes de construir nada, genera un mockup (con Higgsfield/GPT Image, recomendado pero opcional, o en HTML renderizado con Chrome) realista de cómo quedaría un dashboard o app de panel (financiero, SaaS, salud, logística, marketing, admin, lo que sea), con el lenguaje visual sobrio de producto real (sidebar limpia, un solo acento, tokens, modo claro/oscuro) que no parece hecho por IA. Úsala SIEMPRE que el usuario cuente una idea de dashboard, panel, backoffice, app con sidebar o pantalla de producto ("quiero hacer un panel para…", "tengo una idea de app para…", "cómo quedaría…"), aunque no diga "mockup" ni "Higgsfield". El mockup se aprueba primero; el código viene después.
---

# Mockup primero, código después

Cuando el usuario trae una idea de dashboard (de cualquier sector), **lo primero que ve es una imagen
de cómo quedaría**, no código. Se aprueba el mockup y solo entonces se construye, copiándolo.

## Flujo

1. **Entender la idea en 3 preguntas máximo** (con `AskUserQuestion`, recomendando una opción; no
   preguntes lo que puedas deducir): quién lo usa y para qué decisión, las 4–6 secciones del menú,
   y la pantalla estrella que se va a mockear. Si hay un proyecto con diseño ya existente
   (tokens, `globals.css`, capturas), léelo y úsalo como referencia en vez de inventar.
2. **Elegir el método del mockup.** Higgsfield **no es obligatorio**, pero **se recomienda**: da
   imágenes más pulidas y permite explorar varias composiciones rápido. Si el usuario no lo quiere
   (o no hay créditos/herramientas), usa el método HTML de abajo y sigue el resto del flujo igual.
   Ofrece Higgsfield como primera opción y no insistas si dice que no.
   **Presupuesto (solo Higgsfield)**: carga las herramientas de Higgsfield con `ToolSearch`
   (`select:` + `balance`, `generate_image`, `models_explore`, `media_upload`, `media_confirm`,
   `jobs_wait`, `show_medias`; los nombres llevan un prefijo `mcp__<id>__`). Mira `balance`, calcula
   el coste con `params.get_cost: true` y **pide un sí** antes de gastar. Si Higgsfield no está
   disponible, dilo y ofrece un mockup en HTML estático como alternativa.
3. **Borrador barato** con `gpt_image_2_5`, `quality: low`, `resolution: 1k` (~0,25 créditos),
   3 variantes con composiciones distintas de la misma pantalla. Enséñalas con `SendUserFile`.
4. **Elegir y afinar**: el usuario escoge una; se edita esa imagen (pasándola como referencia) con
   los cambios pedidos. Solo la elegida final se genera en `high`, `2k` (~2,75 créditos).
5. **Pantalla móvil / modo oscuro** solo si el usuario lo pide; no se gasta por defecto.
6. **Entrega**: guarda `mockup-aprobado.png` en `docs/mockups/` del proyecto con un `MOCKUP.md`
   corto (idea, secciones, decisiones, créditos gastados). Pregunta si se pasa a construir.
7. **Construcción**: replica el mockup con el stack del proyecto siguiendo
   `references/lenguaje-visual.md`. El texto, las cifras y los gráficos de la interfaz son
   componentes reales, no la imagen. Verifica en navegador contra el mockup.

## Alternativa sin Higgsfield: mockup en HTML estático

1. Escribe un único `docs/mockups/<pantalla>/mockup-<pantalla>.html` autocontenido (un solo fichero,
   CSS dentro, iconos en SVG inline, la fuente del proyecto con `@font-face` desde `public/fonts`),
   a 1440×900, con los tokens de `references/lenguaje-visual.md` y datos de ejemplo rotulados.
2. Renderízalo a PNG con Chrome headless, sin dependencias: si el proyecto tiene
   `scripts/capturar.mjs` (CDP), `node scripts/capturar.mjs <html> <prefijo> --sizes 1440x900 --still --out <carpeta>`;
   si no, `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=out.png --window-size=1440,900 file.html`.
3. Mira la imagen (`Read`), corrige solapes o textos partidos, vuelve a renderizar y enséñala con `SendUserFile`.
4. Una sola propuesta bien cuidada basta; ofrece variantes solo si el usuario las pide.
5. Guarda `.html` y `.png` en `docs/mockups/` junto a un `MOCKUP.md` (sin créditos que anotar).

## Cómo se escribe el prompt de imagen (solo Higgsfield)

Estructura fija (en inglés rinde mejor; los textos de interfaz, en el idioma del usuario):

> Flat, front-on screenshot of a real web app dashboard, 16:10, light theme. Left sidebar 240px,
> near-white with a hairline border: logo, user card, nav with [secciones con icono lineal],
> one item active (soft grey fill, bolder text), settings at the bottom. Top bar with status pill
> and bell. Main area: [pantalla estrella: 3-4 bloques con datos plausibles]. Palette: white
> background, cool grey neutrals, ONE blue accent, green/red only for positive/negative values.
> Geist-like sans, tabular numbers, 12px radius cards, 1px borders, no shadows, no gradients,
> no 3D, no stock photos, no decorative illustrations. Sharp, pixel-aligned, realistic product UI.
> Spanish labels: "[...]".

- Pide **datos creíbles pero rotulados como ejemplo** en la pantalla; nunca presentes cifras
  inventadas como reales (en finanzas, la etiqueta «ilustrativo» es obligatoria).
- Prohibido en el prompt: «futuristic», «glassmorphism», «neon», «cyberpunk», «dark with glowing»,
  «stunning», degradados morados. Son lo que delata a una IA.
- Si el usuario pide otro estilo (oscuro, colorido, de marca), cámbialo, pero conserva la
  disciplina: pocos colores, jerarquía por peso y espacio, nada de adornos.

## Reglas

- Nunca construyas antes de que el mockup esté aprobado, aunque el usuario tenga prisa: la imagen
  cuesta céntimos y evita rehacer código.
- Un dashboard sirve a una decisión: si la pantalla estrella no responde «qué debo mirar o hacer
  ahora», replantéala antes de dibujarla.
- Una imagen puede mostrar el producto; textos, botones y gráficos finales son componentes editables.
- Si usas Higgsfield, anota créditos gastados y saldo al terminar.
- Si el usuario pide una propuesta de dónde colocar algo nuevo (alertas, filtros…), el mockup debe
  mostrarlo en su sitio recomendado y `MOCKUP.md` explicar por qué ahí.
