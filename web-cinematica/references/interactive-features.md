# Catálogo de interacciones (Fases 3, 4 y 8)

La web tiene que **dar ganas de seguir haciendo scroll**: el hero engancha y, por el camino, cada
sección ofrece algo que tocar. Regla: **cada sección tiene al menos una interacción con sentido**, y
cada web tiene **1–2 "funciones estrella"** del sector que la hacen destacar frente a la
competencia (lo que el cliente enseñará a sus amigos). Propónlas en la Fase 3, dibújalas en el
mockup de la Fase 4 y constrúyelas en la Fase 8.

Cada interacción debe funcionar con ratón, dedo y teclado, respetar `prefers-reduced-motion` y no
bloquear el scroll de la página.

**Este catálogo no es cerrado.** En cada proyecto, investiga antes de proponer:

1. Busca (WebSearch y navegador) "<sector> website interactive", "best <sector> websites 2026",
   "<sector> awwwards", "<sector> configurator", y mira galerías (Awwwards, FWA, CSS Design Awards,
   Godly, One Page Love, Lapa Ninja) y las webs de los mejores competidores, también de otros
   países.
2. Anota 3–6 interacciones que encajen con este negocio concreto y su público (no copies una
   web: toma la idea).
3. Recomiéndalas al usuario por iniciativa propia, cada una en una línea: qué es, dónde va, por
   qué ayuda a vender, coste (gratis / créditos de Higgsfield / coste por visita) y un enlace de
   ejemplo. Marca la que pondrías tú.
4. Si una idea nueva funciona bien, añádela a este archivo al terminar el proyecto para que la
   próxima web la tenga.

## Contenido
1. Interacciones base (todas las webs)
2. Funciones estrella por tipo (con cómo hacerlas)
3. Funciones con IA en vivo (subir una foto y ver el resultado)
4. Qué evitar

## 1. Interacciones base (ya en la plantilla)

| Interacción | Dónde | Componente |
|---|---|---|
| Película controlada por scroll, va y vuelve | Hero | `CinematicHero` |
| Rótulos de capítulo sincronizados con la acción | Hero | timeline del hero |
| Paneles que se revelan con máscara | Proceso | `TransformationProcess` |
| Tarjetas 3D que se levantan, se inclinan hacia el ratón y brillan | Proceso, galería | `TiltCard` |
| Acordeón de servicios con CTA de WhatsApp por servicio | Servicios | `InteractiveServices` |
| Comparador antes/después arrastrable, con demo por scroll | Antes/después | `BeforeAfterComparison` |
| Galería horizontal con filtros animados (Flip) | Trabajos | `VehicleGallery` |
| Botón flotante de WhatsApp que aparece al pasar el hero | Móvil | `MobileWhatsApp` |

## 2. Funciones estrella por tipo

### Comparadores (lo que más gusta)
- **Antes/después deslizable**: detailing, reformas y construcción ("así puede quedar tu
  cocina"), home staging, limpieza, jardinería, pintura, restauración de muebles, estética
  (solo casos reales con consentimiento). Varios pares en un carrusel ("cocina", "baño", "fachada").
- **Comparador de acabados**: mismo objeto con 2–4 acabados (mate / brillo / satinado; madera /
  piedra) con botones encima del slider.

### Configuradores visuales (sin IA, gratis por visita, instantáneos)
- **Configurador de vinilo/wrap** (empresas de vinilado, concesionarios, PPF): foto del coche de
  perfil en el local; el usuario elige color y acabado y la carrocería cambia al instante.
  Cómo: genera con GPT Image una **máscara de la carrocería** (o pide versiones del mismo coche en
  4–8 colores/acabados con encuadre idéntico y comprueba con `align-check.py`); en el navegador,
  capas apiladas con transición, o recoloreado con `mix-blend-mode: color` sobre la máscara
  para colores libres + capa de brillos para el acabado. Al final: "Pedir presupuesto con este
  color" → WhatsApp con el color elegido en el mensaje.
- **Cocina/baño configurable** (reformas): mismo espacio con 3–4 estilos/materiales pregenerados.
- **Elige tu corte/estilo** (barberías): galería de estilos reales → mensaje de cita con el estilo.
- **Monta tu menú/pack** (restaurantes, eventos): selección de platos/servicios → mensaje de
  reserva con la selección (sin precios inventados; si hay precios reales, se suman).

### Exploración
- **Vista 360° de un objeto**: 24–36 fotogramas (generados con vídeo de órbita o fotos reales)
  arrastrando en horizontal, mismo motor de canvas que el hero.
- **Puntos calientes sobre una imagen**: el usuario toca puntos del coche/plato/local y aparece la
  explicación ("aquí aplicamos cerámico", "pan de masa madre de 48 h").
- **Línea de tiempo de una obra** con slider: semana 1 → semana 6.
- **Mapa del local o del barrio** con pines (cómo llegar, aparcamiento).

### Ayudar a decidir (convierte mucho)
- **Quiz "¿qué servicio necesito?"** de 3–4 preguntas → recomendación → WhatsApp con las
  respuestas ya escritas. Gratis, no requiere backend.
- **Calculadora orientativa** solo si el negocio da los rangos reales (si no, que estime tiempo o
  pasos, no precio).
- **Disponibilidad/reserva**: solo si el negocio ya tiene sistema (enlázalo o incrústalo); nunca
  inventar un sistema de reservas.

### Detalles de micro-interacción
- Botones magnéticos y flechas que se desplazan al pasar el ratón.
- Titulares que se revelan por líneas al entrar.
- Contadores animados **solo con cifras verdaderas** (años, clientes, valoración).
- Vídeo corto al pasar el ratón por una tarjeta (reutilizando fotogramas del hero).
- Cursor personalizado sutil en la galería ("arrastra").

## 3. Funciones con IA en vivo ("sube tu foto y mira cómo quedaría")

Ejemplo: una empresa de vinilos donde el visitante sube la foto de su coche y ve cómo quedaría con
el vinilo elegido. Es la función más espectacular y la que más destaca, pero tiene **coste por
uso y requisitos**: antes de construirla, explícaselo al usuario y pide su aprobación.

- **Cómo**: ruta de servidor de Next.js (`app/api/visualizar/route.ts`) que recibe la foto y el
  estilo y llama a un modelo de edición de imagen (OpenAI GPT Image vía su API, o Vercel AI
  Gateway si el proyecto ya está en Vercel). Higgsfield por MCP no sirve aquí: es para producir
  contenido, no para que la web llame a la IA en vivo.
- **Coste**: cada visita que la use cuesta (céntimos por imagen) y se paga aparte: necesita una API
  key del cliente o del usuario guardada como variable de entorno en Vercel (`vercel env add`),
  nunca en el código.
- **Protección**: límite de usos por IP/día, protección anti-bots (Vercel BotID o Cloudflare
  Turnstile), tamaño máximo de foto, solo imágenes.
- **Privacidad**: aviso claro ("tu foto se usa solo para generar la vista previa y no se guarda"),
  no almacenar fotos, nada de caras ni matrículas legibles en el resultado.
- **Expectativas**: rótulo "simulación orientativa", y tras el resultado, CTA a presupuesto real.
- **Alternativa sin coste por uso**: el configurador sobre una foto fija del local (sección 2),
  que da el 80 % del efecto con 0 € por visita. Recomiéndalo para demos; deja la versión con IA
  como mejora de pago al vender la web.

## 4. Qué evitar

- Interacciones que secuestran el scroll o obligan a hacer scroll muchas pantallas para ver lo
  básico (máximo un pin largo: el hero; la galería puede tener uno corto).
- Efectos que solo funcionan con ratón (siempre equivalente táctil).
- Animar todo a la vez; un foco de movimiento por pantalla.
- Datos falsos para "rellenar" una interacción (contadores, precios, reseñas, disponibilidad).
