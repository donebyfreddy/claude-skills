# Producción con Higgsfield (Fases 4, 6 y 7)

Precios verificados en octubre de 2026 (plan Plus). **Vuelve a comprobarlos siempre** con
`get_cost: true`, que es gratis y no genera nada.

## Contenido
1. Herramientas y flujo de archivos
2. Modelos y precios
3. Gobierno de créditos
4. Prompts: mockup, storyboard, colocar algo en el local, versión "antes", vídeo
5. QC y errores conocidos

## 1. Herramientas y flujo de archivos

Herramientas del conector Higgsfield (cárgalas con `ToolSearch`, p. ej.
`select:mcp__<id>__balance,mcp__<id>__generate_image,mcp__<id>__generate_video,mcp__<id>__models_explore,mcp__<id>__jobs_wait,mcp__<id>__media_upload,mcp__<id>__media_confirm,mcp__<id>__show_medias`):

- `balance` → créditos disponibles. `models_explore` (`get` con `model_id`) → parámetros de un modelo.
- `generate_image` / `generate_video` con `params.get_cost: true` → precio sin generar.
- `jobs_wait` → espera un trabajo (máx. 15 s por llamada; repite). Devuelve `result_url`.
- `get_preferences` antes de la primera generación (si `auto_create_project` es false, no pases
  `folder_id`).
- **Subir un archivo local**: `media_upload` (filename) → `curl -X PUT -H "Content-Type: image/png"
  -H "If-None-Match: *" --data-binary @archivo '<upload_url>'` (sin la cabecera `If-None-Match`
  la firma falla) → `media_confirm` con `type: "image"`. Usa el `media_id` en `medias`.
- **Imagen que el usuario adjuntó en el chat** (no está en disco): `media_upload_widget` como
  única herramienta del turno → el usuario la sube → `read_widget_context` da el `media_id` →
  `show_medias` da la URL → `curl` para guardarla en `assets-src/`.
- Un trabajo anterior se puede pasar como referencia usando su `job_id` como `value`.
- Descarga cada resultado a `assets-src/` (imágenes) o `production/` (vídeos) con `curl` y apúntalo
  en el inventario y en `production/credit-log.md`.

## 2. Modelos y precios

| Uso | Modelo | Ajustes | Créditos |
|---|---|---|---|
| Borradores de mockup/storyboard | `gpt_image_2_5` | `quality: low`, `resolution: 1k` | 0,25 |
| Imagen intermedia | `gpt_image_2_5` | `medium`, `2k` | 1 |
| Fotograma clave / mockup final / edición precisa | `gpt_image_2_5` | `high`, `2k` (sale ~2336×1744 en 4:3) | 2,75 |
| Borrador de vídeo | `seedance_2_5` | `draft: true` (480p), 12 s / 15 s | 36 / 45 |
| Finalizar borrador aprobado | `seedance_2_5` | `draft_job_id`, `resolution: 1080p` | 80 (12 o 15 s) |
| Vídeo nuevo directo | `seedance_2_5` | 720p 12 s · 1080p 10 s · 1080p 12 s · 1080p 15 s | 84 · 160 · 192 · 240 |

> **Regla del usuario:** el vídeo entregado es siempre 1080p. 720p no es una opción de entrega. Flujo: borrador 480p (con todo ya aprobado) → finalizar a 1080p.
| Alternativa barata para tantear | `minimax_h3_max` | 768p 10 s | 25 |

`gpt_image_2_5` es el modelo de imagen de OpenAI (el de ChatGPT): ideal para editar respetando el
encuadre y para mockups con texto. El "1080p" final de Seedance 2.5 en 4:3 salió a 1664×1248.

## 3. Gobierno de créditos

Antes de cada operación de pago, enseña al usuario:

```
Operación: <qué se genera y para qué>
Modelo/ajustes: <modelo, duración, resolución, formato>
Coste verificado: <get_cost>
Saldo actual → después: <balance> → <resultado>
```

y espera un "sí". Después: comprueba `balance`, añade una fila a `production/credit-log.md`
(nº, fecha, operación, ajustes, coste, saldo, frase de aprobación del usuario, resultado del QC,
job id). Una petición explícita del usuario con el precio ya conocido ("hazme el sucio y el
limpio") cuenta como aprobación de esas operaciones concretas.

- Sin reintentos automáticos. Si un trabajo falla antes de empezar (p. ej. error 422), comprueba
  que el saldo no ha cambiado antes de relanzarlo, y dilo.
- Si Higgsfield sugiere un preset ("preset_recommendation"), no se ha generado nada: relanza con
  `declined_preset_id` para generar lo aprobado tal cual.
- Si el tope no llega, para y di cuánto falta y cuál sería la siguiente operación.

## 4. Prompts

Escribe los prompts en **inglés** (rinden mejor), describiendo el local real con detalle concreto
(paredes, franjas de color, techo, suelo, rótulos, puertas, equipamiento) y diciendo qué NO debe
cambiar. Formato habitual: 4:3 (encaja con fotos de móvil y se recorta bien a 16:9 y a vertical).

### Mockup de la web (Fase 4)
Referencias: foto del local + logo (+ foto del protagonista). `aspect_ratio: "9:16"`.

```
A full-length vertical screenshot of a premium one-page website for <NEGOCIO>, a <SECTOR> in
<CIUDAD>, designed by an award-winning studio. Dark/light <PALETA> palette with a single accent
colour <HEX> taken from the logo. Sections from top to bottom:
1) Cinematic hero: <ESCENA DEL HERO EN EL LOCAL REAL de la imagen de referencia>, big condensed
   headline "<TITULAR>", accent on "<PALABRAS>", two buttons "<CTA1>" and "<CTA2>", minimal nav
   with the real logo from the reference image.
2) "<TÍTULO PROCESO>": three connected cinematic panels 01/02/03 showing the same <PROTAGONISTA>
   in the same place: <INICIO>, <ACCIÓN>, <RESULTADO>.
3) "<TÍTULO SERVICIOS>": four large photo cards: <SERVICIO 1..4>.
4) Before/after comparison with a vertical slider handle: <SUJETO> <ANTES> vs <DESPUÉS>.
5) Gallery of real work: a horizontal row of photo cards with filter pills.
6) Reviews: Google rating <VALORACIÓN> with stars.
7) Contact: "<TÍTULO CONTACTO>", WhatsApp button, address, map.
Editorial typography, generous spacing, realistic photography, no lorem ipsum, Spanish copy.
```

### Storyboard del hero (Fase 4) — 3 imágenes low
Una por momento (inicio / acción / resultado), mismo prompt de escena + "frame N of a film,
identical camera position and lens in all frames".

### Colocar un sujeto en el local real (Fase 6)
Referencias: [1] foto del local (o una foto ya buena hecha en él), [2] foto del sujeto.

```
Professional photograph. Use the FIRST image as the exact environment, camera and lighting:
<descripción detallada del local>. Keep that place and camera position identical. Replace
<lo que haya> with <SUJETO> from the SECOND image, keeping it exactly as it is: <rasgos que no
pueden cambiar>. Place it <posición y ángulo>, fully inside the frame. <estado ideal: clean,
glossy…>, with reflections of <luces reales>. Natural shadows. Photorealistic, sharp, no text
other than the real wall sign.
```

### Versión "antes" alineada (Fase 6)
Referencia: la imagen "después".

```
Edit this exact photograph. Keep EVERYTHING identical and pixel-aligned: same camera position,
framing, crop, lens perspective, lighting and colour grading; <el local> stays perfectly
unchanged. Keep <SUJETO> identical in shape, position and details (<lista>). ONLY change its
condition: <descripción realista y concreta del estado "antes", por zonas>. Realistic, not
exaggerated. Photorealistic, same sharpness as the original.
```

Quitar marcas ajenas (matrículas de concesionario, teléfonos): "ONLY ONE CHANGE: replace … with a
plain blurred plate with a small blue EU strip, no legible text".

### Vídeo del hero (Fase 7)
`generate_video` con `model: "seedance_2_5"`, `mode: "omni_reference"`, `draft: true`,
`duration: 15`, `aspect_ratio: "4:3"`, `generate_audio: false`,
`medias: [{value: <antes>, role: "start_image"}, {value: <después>, role: "end_image"}]`.

Nota: Seedance 2.5 usa estas imágenes como **referencias fuertes**, no como fotogramas exactos:
el vídeo puede quedar algo reencuadrado (en MR salió ~8 % desplazado). Es coherente de principio a
fin, así que vale para el hero; para el comparador usa siempre las imágenes fijas.

Plantilla:

```
Locked-off static camera on a tripod for the entire shot: no camera movement, no zoom, no cut.
Photorealistic documentary footage inside <descripción del local>. <PROTAGONISTA> stays
completely stationary the whole time; <rasgos> never change. The place never changes.

CRUCIAL RULE: nothing changes state by itself. Every visible part is first <primer tratamiento>
and only becomes <estado final> where the <persona/herramienta> works on it.

0-1.5s: <estado inicial quieto>.
1.5-3.5s: a professional <rol> with <rasgos y ropa concretos> walks in from the left holding
<herramienta realista, cómo está conectada>.
3.5-8s: <primera acción sobre TODO lo visible, en orden espacial>.
8-9.5s: <pausa/efecto intermedio creíble>.
9.5-13.5s: <segunda acción que revela el resultado panel a panel, en orden espacial>.
13.5-15s: he steps back and walks out of frame; <estado final>, exactly matching the final frame.

Natural human anatomy, realistic hands holding the tools correctly, believable physics, consistent
identity and clothing of the worker, no morphing, no extra people, no text overlays.
```

Finalizar: `generate_video` con `model: "seedance_2_5"`, `draft_job_id: <id del borrador>`,
`resolution: "1080p"`, `generate_audio: false` **y el mismo `prompt`** (obligatorio).

## 5. QC y errores conocidos

- Imágenes "antes/después": `scripts/align-check.py after.png before.png preview.jpg` → fondo
  ≤ ~6/255 = alineado. Mira la vista previa tú y mándasela al usuario.
- Vídeos: `scripts/qc-video.py video.mp4 production/qc/<nombre> --start antes.png --end despues.png`.
  Revisa `sheet.jpg` (historia completa), `detail.jpg` (manos, caras, herramientas) y el
  diagnóstico de cortes. Checklist:
  - ¿El local es el real (techo, franjas, rótulo, suelo)?
  - ¿El protagonista es el mismo de principio a fin?
  - ¿La persona mantiene cara, ropa y anatomía? ¿Sujeta bien las herramientas?
  - ¿Alguna parte cambia de estado sin que nadie la toque? (el fallo más típico)
  - ¿Hay cortes, saltos o deformaciones?
  - ¿Se entiende la historia sin texto?
- Errores ya vistos y su solución:
  - Conector "pending" → el usuario lo conecta y escribe de nuevo; carga en el siguiente turno.
  - Confundir Magnific con Higgsfield → mira el nombre del conector en el estado de conectores.
  - `422 prompt too short` al finalizar → añade el prompt.
  - Preset sugerido → `declined_preset_id`.
  - Imagen del chat inaccesible → widget de subida.
  - "Se limpia solo" → guion con tratamiento previo de todo lo visible y 15 s.
