---
name: web-cinematica
description: Crea webs premium "de agencia de 10.000 €" para negocios reales de cualquier sector (lavaderos, restaurantes, barberías, clínicas, gimnasios, inmobiliarias, reformas, tatuajes…) con un hero cinematográfico controlado por scroll (vídeo generado con Higgsfield que avanza y retrocede al hacer scroll), secciones interactivas debajo (tarjetas 3D con hover, comparador antes/después, galería real) y publicación en GitHub privado + Vercel. Incluye preguntas de descubrimiento, dirección creativa estilo ChatGPT con imágenes de GPT Image vía Higgsfield, mockup previo, borradores de vídeo baratos en 480p antes de pagar 1080p y control estricto de créditos. Úsala SIEMPRE que el usuario quiera hacer, rediseñar o vender una web/landing para un negocio o cliente, aunque no diga "cinematográfica", "scroll" ni "Higgsfield" — p. ej. "hazme una web para este restaurante", "quiero una landing de 10K para un cliente", "web guapa para mi barbería", "otra web como la del lavadero".
---

# Web cinemática para negocios reales

Esta skill convierte la información de un negocio real en una web que parece hecha por un estudio
creativo: arriba, una película que el visitante "controla" con el scroll; abajo, una página muy
interactiva que convierte (WhatsApp, llamada, cómo llegar). Nace de un proyecto real
(MR Autolavado, Barcelona) que funcionó muy bien; todo lo que aquí se describe está probado.

**Lo que hace que funcione** (no lo pierdas de vista en ningún sector):
1. **Una transformación visible.** Lo que vende un negocio de servicios es el *antes → después*.
   El hero lo cuenta como una película (sucio → limpio, ingredientes → plato, pelo largo → corte,
   obra → reforma). Cada sector tiene la suya: `references/sector-playbook.md`.
2. **El sitio real del cliente.** El local, el logo y los colores reales aparecen en todas las
   imágenes generadas. Nunca un "estudio genérico de IA". Por eso todo se genera a partir de fotos
   reales como referencia.
3. **Una persona haciendo el trabajo.** El oficio humano da credibilidad; nada "se arregla solo".
4. **Scroll-film arriba + mucha interacción abajo.** Es el formato que le gusta al usuario: el
   hero engancha y por el camino cada sección tiene algo que tocar (tarjetas 3D, comparador
   deslizable, filtros…), más 1–2 **funciones estrella** del sector que hagan destacar al negocio
   (p. ej. un configurador de vinilo para una empresa de wrapping, el antes/después de una obra
   para una constructora). Catálogo en `references/interactive-features.md`.
5. **Honestidad.** Lo generado se rotula como "recreación ilustrativa"; la galería solo lleva
   fotos reales; nunca se inventan reseñas, precios ni datos.
6. **Iterar barato y luego pagar.** Imágenes en calidad baja para decidir, alta para producir;
   vídeo en borrador 480p (~36 créditos) y solo si gusta se "finaliza" a 1080p (~80) en lugar de
   generar de cero en 1080p (~192).

## Cómo trabajar con el usuario

- Habla en el idioma del usuario (normalmente español de España, cercano y directo). Mensajes
  cortos, lo importante primero, sin jerga innecesaria.
- **Enséñale cosas a menudo**: cada imagen, borrador o vista previa se le manda con `SendUserFile`
  (o abriéndola en el navegador). El usuario decide viendo, no leyendo.
- Pregunta con botones (`AskUserQuestion`) cuando haya una decisión real, recomendando una opción.
  No preguntes lo que puedas averiguar tú (web, Google Maps, fotos que ya tienes).
- Los mensajes de voz del usuario llegan transcritos y desordenados: extrae la intención, y si
  algo es ambiguo, confirma con una pregunta concreta.
- Cuando algo no está bien en lo generado (p. ej. "la parte de atrás se limpia sola"), reconócelo,
  explica la causa y propone la corrección con su coste. No regeneres sin permiso.

## Reglas de oro (no negociables)

- **Vídeo final SIEMPRE en 1080p** (requisito del usuario). Nunca se propone ni se entrega 720p ni
  otra resolución menor como final, ni siquiera para ahorrar créditos. Flujo obligatorio: cuando el
  guion, los fotogramas y el storyboard ya están aprobados, se hace **un borrador 480p**
  (`draft: true`); solo si el usuario lo aprueba se **finaliza a 1080p** con `draft_job_id`. Si el
  saldo no llega para borrador + 1080p, se avisa de cuántos créditos faltan antes de empezar;
  no se baja la resolución.

- **Créditos de Higgsfield**: pregunta el tope de gasto al principio. Antes de CADA operación de
  pago: comprueba saldo (`balance`), precio exacto (`get_cost: true`), explica qué se genera y por
  qué, muestra el saldo resultante y espera un "sí" explícito. Aprobar el plan no aprueba gastos.
  Sin reintentos automáticos. Si no se puede verificar el precio, no se genera. Registra todo en
  `production/credit-log.md`. Si el saldo no llega, para y di cuántos créditos faltan.
- **Procedencia de cada imagen**: lleva un inventario `real` / `generada` (tabla en
  `production/assets.md`). Las imágenes generadas nunca van en "trabajos reales" ni se presentan
  como clientes reales. Atención: el usuario a veces trae imágenes que *parecen* fotos pero las hizo
  con ChatGPT; pregunta de dónde sale cada una.
- **Datos verificados**: dirección, teléfono, horario, valoración y servicios salen de la web
  oficial / Google Maps / el usuario. Si no se puede verificar, se omite. Desconfía de testimonios
  de plantilla en webs hechas con constructores (en MR Autolavado una reseña mencionaba otra
  empresa).
- **Marcas ajenas**: si una foto trae logo/matrícula/teléfono de otro negocio (p. ej. un
  concesionario), se elimina en la edición y se avisa al usuario de los derechos de la foto.
- **No tocar lo del cliente**: nunca se modifica su web real, su dominio ni sus cuentas. Se
  publica una demo en una URL propia (`<negocio>.vercel.app`).

## Proceso por fases

Lleva una lista de tareas con estas fases. Hay puntos de control (⛔) donde se espera al usuario.

### Fase 0 — Comprobar herramientas (2 minutos, sin gastar nada)

- Higgsfield: busca sus herramientas con `ToolSearch` ("higgsfield balance", `generate_image`,
  `generate_video`, `models_explore`). **Ojo: el conector "Magnific" NO es Higgsfield** (tiene
  herramientas parecidas pero otro saldo). Si Higgsfield aparece "pending", pide al usuario que lo
  conecte en Conectores y que vuelva a escribir: los conectores activados a mitad de sesión cargan
  en el siguiente turno. Llama a `balance`.
- Navegador integrado (para leer webs que cargan con JavaScript y para la QA visual).
- Local: `node -v`, `ffmpeg`, `python3 -c "import PIL, numpy"`, `gh auth status`, `vercel whoami`.
- Las imágenes adjuntadas en el chat **no se guardan en disco**. Para tenerlas como archivo:
  abre `media_upload_widget` de Higgsfield (debe ser la única herramienta de ese turno), el usuario
  la sube, lees el `media_id` con `read_widget_context`, obtienes la URL con `show_medias` y la
  descargas con `curl` a `assets-src/`. Alternativa: que el usuario copie el archivo a la carpeta.

### Fase 1 — Investigar el negocio (sin preguntar todavía)

Lee su web actual (WebFetch; si sale vacía, el navegador integrado con `get_page_text`), su ficha
de Google Maps (valoración, nº de reseñas, horario, dirección) y su Instagram si lo hay. Anota
servicios con sus palabras exactas, tono, colores y lo que falte. Prepara un resumen de 5–8 líneas
para el usuario.

### Fase 2 — Descubrimiento con preguntas ⛔

Sigue `references/discovery-questions.md`: 2–3 rondas cortas de preguntas (con botones cuando se
pueda). Objetivo: entender el negocio, la "transformación" que vende, qué fotos reales hay del
local/logo/trabajos, a quién va dirigida la web, el CTA principal (WhatsApp, reserva, llamada), el
tope de créditos y si la web es para vender al cliente (demo) o encargo.

Al terminar, crea `production/assets.md` con el inventario de referencias: archivo, qué es, real o
generado, uso en la web. Pide lo que falte (logo en buena calidad, fotos del local vacío, fotos de
trabajos).

### Fase 3 — Dirección creativa ⛔

Con `references/sector-playbook.md` propone **2–3 conceptos** en pocas líneas cada uno (idea del
hero film, paleta derivada del logo/local real, tipografía, sección estrella). Recomienda uno.
Explica por qué vende (como haría un director creativo: "lo que vende es la transformación").
Incluye las decisiones que mejoran el resultado aunque el usuario no las pida (p. ej. en un
comparador antes/después un coche blanco luce más la suciedad que uno negro).

Propón también el **plan de interacción**: qué se puede tocar en cada sección y 1–2 funciones
estrella del sector. El catálogo `references/interactive-features.md` es el punto de partida, no
el límite: **investiga en cada proyecto** (WebSearch / navegador) qué están haciendo las mejores
webs de ese sector y las premiadas (Awwwards, FWA, CSS Design Awards, Godly, One Page Love,
competidores locales y de otros países), y busca interacciones nuevas que encajen con ESTE
negocio. Luego **recomiéndalas tú, sin esperar a que te las pidan**, en formato directo: "Yo
pondría X en la sección Y, porque hace Z; mira este ejemplo: <enlace>". Ordena las propuestas por
impacto y por coste (gratis / créditos / coste por visita) y deja que el usuario elija. Si alguna necesita IA en
vivo o backend (p. ej. "sube la foto de tu coche y mira cómo queda con el vinilo"), explica el
coste por uso y los requisitos, y ofrece la alternativa sin coste.

### Fase 4 — "Así va a quedar": mockup + storyboard, en bucle hasta estar seguros ⛔

Esto es lo que más valora el usuario: antes de construir o gastar en vídeo, **ver cómo va a quedar
la web** y afinarla conversando, igual que hacía con su ChatGPT. Las imágenes se hacen con
**GPT Image 2.5 vía Higgsfield** (`generate_image`, modelo `gpt_image_2_5`): es el motor de
imágenes de OpenAI, el mismo de ChatGPT. Prompts y costes en `references/higgsfield-production.md`.

1. **Mockup de la página completa**: imagen vertical larga tipo captura de web (hero con el
   negocio real, secciones, tarjetas, comparador, galería, contacto), con las fotos reales del
   local y el logo como referencias. Primero en **borrador barato** (`quality: "low"`, `1k`
   ≈ 0,25 créditos por imagen; pide confirmación igualmente, aunque sea barato).
2. **Explícaselo sección por sección** ("arriba, el coche sucio en vuestro taller; al hacer scroll
   entra el operario…; debajo, tarjetas que se levantan al pasar el ratón…"), dejando claro que
   el hero será un vídeo que se mueve con el scroll y que el mockup es una imagen fija de
   referencia.
3. **Storyboard del hero**: 3 viñetas baratas (inicio / acción / resultado) en el local real, para
   que imagine la película antes de pagar el vídeo.
4. **Bucle de retroalimentación**: pregunta qué cambiaría (colores, orden, textos, coche/plato/
   persona protagonista, tono), regenera solo lo que cambie, en barato, y vuelve a enseñar. Repite
   hasta que el usuario diga que lo ve claro ("esto es como tiene que quedar").
5. Cuando esté aprobado, una versión `high`/`2k` (≈ 2,75) del mockup como **objetivo de diseño
   aprobado** (`production/mockup-aprobado.png`).

El mockup es el objetivo, no algo a calcar: luego se corrigen textos inventados, espaciados raros
o datos falsos que la IA haya dibujado. Si el usuario ya trae un mockup (p. ej. hecho en su
ChatGPT), úsalo como objetivo y salta la generación, pero haz igualmente el storyboard.

**No se pasa a la fase 6–7 (gasto fuerte) sin la frase de confianza del usuario** ("vamos a por
ello", "adelante", "está perfecto").

### Fase 5 — Plan y presupuesto ⛔

Escribe el plan (puede ser en modo plan): arquitectura de secciones, guion del hero por tramos de
scroll, lista de imágenes y vídeos a generar con precio verificado de cada uno, total, saldo
restante y lo que se puede hacer sin gastar. Presupuesto típico de una web completa:

| Pieza | Coste orientativo |
|---|---|
| Mockup (borradores low + 1 high) | 1–4 |
| Fotogramas clave (inicio/fin del hero, pareja del comparador, colocar algo en el local) | 3–15 (2,75 c/u) |
| Borrador de vídeo 480p, 12–15 s | 36–45 por intento |
| Finalizar el borrador aprobado a 1080p | ~80 |
| **Total habitual** | **~130–180** (deja margen para 1 borrador extra) |

Verifica siempre los precios del momento con `get_cost`; estos son de octubre de 2026.

### Fase 6 — Fotogramas clave e imágenes ⛔ (aprobación por operación)

La técnica que da consistencia: **todo sale de una foto base**. Para el hero se necesita el
estado inicial y el final con el mismo encuadre:

1. Elige/genera la **imagen "después"** (estado final ideal) en el local real. Si existe una foto
   real buena, úsala. Si no, genérala con GPT Image usando como referencia la foto del local vacío
   y la del objeto/persona (p. ej. "coloca este coche en este taller con este ángulo").
2. Genera la **imagen "antes"** editando la de "después": "mantén TODO idéntico y alineado píxel a
   píxel, cambia SOLO el estado" (suciedad, desorden, plato sin emplatar…).
3. Comprueba la alineación con `scripts/align-check.py` (fondo ≤ ~6/255 = perfecto) y enseña el
   par al usuario con la vista previa 50/50.

Para el **comparador antes/después** usa un sujeto distinto al del hero y con contraste máximo
(en coches, blanco). El comparador solo se monta con un par alineado de imágenes fijas, nunca con
fotogramas del vídeo (el modelo de vídeo puede reencuadrar).

### Fase 7 — Vídeo del hero: borrador barato → finalizar ⛔ (aprobación por operación)

Detalle completo, prompts y errores conocidos en `references/higgsfield-production.md`.

1. **Guion por segundos** (12–15 s) con cámara fija. Regla clave: **nada cambia de estado sin que
   la persona lo toque** — en un lavado, todo el lado visible recibe espuma antes de aclararse; si
   no, partes del coche "se limpian solas" (le pasó al primer borrador de MR Autolavado). 15 s da
   tiempo a hacerlo todo sin trampas; con 12 s el modelo tiende a atajar.
2. **Borrador 480p** con `seedance_2_5`, `draft: true`, imagen inicial y final, sin audio.
3. **QC automático**: `scripts/qc-video.py` (hoja de contactos, detalle de manos, detección de
   cortes, comparación con los fotogramas). Míralo tú y **mándale el vídeo y la hoja al usuario**.
   Revisa: mismo local, mismo objeto, misma persona y ropa, manos y herramientas creíbles, nada
   que cambie solo, sin cortes.
4. Si algo falla, explica qué y propone un guion corregido con su coste (otro borrador). Nunca
   regeneres sin un "sí".
5. Si se aprueba: **finalizar** con `draft_job_id` a `1080p` (hay que repetir el `prompt`; sin él
   la API devuelve 422). Mismo movimiento, mucha más definición, ~80 créditos en vez de ~192.

### Fase 8 — Construcción (sin gastar créditos; se puede adelantar en paralelo a la fase 6–7)

Stack probado: Next.js (App Router) + TypeScript + Tailwind v4 + GSAP/ScrollTrigger + lucide-react.
Arquitectura, componentes de `assets/template/` y cómo adaptarlos en
`references/build-and-qa.md`. Resumen:

- `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes`
  y `npm i gsap @gsap/react lucide-react`. Lee `AGENTS.md` del proyecto: la versión de Next puede
  tener cambios incompatibles.
- Copia `assets/template/src/*` al proyecto y adapta `src/content/site.ts` (todos los datos del
  negocio en un solo archivo), textos, paleta (tokens en `globals.css`, acento sacado del logo) y
  nombres de secciones al sector.
- Logo con fondo plano → `scripts/extract-logo.py` (transparencia real por píxel, sin halo) y
  favicon con el monograma.
- Medios: `scripts/build-media.py --video … --before … --after … --process …` genera fotogramas de
  escritorio y móvil, pósters, paneles del proceso, comparador, imagen OG y el manifiesto.
- Copy del hero sincronizado con el vídeo real (calcula en qué % del scroll ocurre cada cosa).
- Construye las funciones estrella aprobadas (`references/interactive-features.md`): cada una
  con ratón, dedo y teclado, y terminando en un CTA (WhatsApp con la elección ya escrita).

### Fase 9 — QA en el navegador

Comprueba de verdad en el navegador integrado, escritorio (1440×900) y móvil (375×812): scroll del
hero hacia abajo y hacia arriba, textos en su momento, fotograma final limpio, hover 3D de
tarjetas, comparador (arrastre, teclado y que el scroll no le quite el control), filtros de
galería, enlaces (WhatsApp con mensaje, `tel:`, Maps), consola sin errores, sin desborde
horizontal, `alt` en todas las imágenes, jerarquía de títulos. Lista completa y fallos ya vistos
en `references/build-and-qa.md`. Corrige y vuelve a mirar; no te quedes en el primer resultado
"aceptable".

### Fase 10 — Guardar y publicar ⛔

1. Commit en una rama (nunca directamente en `main` si ya existe historial) con mensaje claro y la
   línea de coautoría que indique el sistema. Los borradores de vídeo van al `.gitignore`.
2. Repo **privado** en GitHub: `gh repo create <usuario>/<negocio> --private --source . --remote origin`
   (si hay varias cuentas en `gh`, usa la activa y dilo).
3. `.vercelignore` con `assets-src`, `production`, `scripts`, `.claude` (no hacen falta en el build).
4. `vercel link --yes --project <negocio>` (conecta también el repo: cada push a `main` despliega)
   y `vercel deploy --prod --yes`. La URL pública es `<negocio>.vercel.app`; las URLs por despliegue
   llevan protección (302) y es normal.
5. Comprueba la web en vivo en el navegador y da al usuario: URL, repo, qué se ha comprobado y qué
   no, créditos gastados y saldo.

## Archivos de la skill

| Archivo | Cuándo leerlo |
|---|---|
| `references/discovery-questions.md` | Fase 2: banco de preguntas por rondas |
| `references/sector-playbook.md` | Fase 3: transformación, hero, comparador y secciones por sector |
| `references/interactive-features.md` | Fases 3, 4, 8: interacciones por sección y funciones estrella (configuradores, IA en vivo…) |
| `references/higgsfield-production.md` | Fases 4, 6, 7: herramientas, modelos, precios, prompts, QC, errores |
| `references/build-and-qa.md` | Fases 8, 9: arquitectura, componentes, rendimiento, trampas técnicas, checklist |
| `assets/template/` | Fase 8: código probado (motor del hero, comparador, tarjetas 3D…) |
| `scripts/extract-logo.py` | Logo con fondo plano → PNG transparente |
| `scripts/align-check.py` | ¿Están alineadas las imágenes antes/después? + vista previa |
| `scripts/qc-video.py` | QC automático de cada vídeo generado |
| `scripts/build-media.py` | Fotogramas, pósters, paneles, comparador, OG y manifiesto |

Ejecuta los scripts con `python3 -I <ruta-de-la-skill>/scripts/<script>.py` desde la raíz del proyecto.
