# Lenguaje visual de producto sobrio (para dibujar y para construir)

Extraído de un dashboard real (React + Vite + Tailwind v4 + componentes tipo shadcn + `lucide-react`).
Sirve para cualquier sector: cambian las secciones y los datos, no la disciplina.

## Por qué no parece hecho por IA
1. **Casi no hay color.** Fondo blanco, sidebar gris casi blanco, bordes de 1px muy suaves y **un
   solo acento**. Verde/rojo solo para ganancia/pérdida (o estado ok/error).
2. **Estado activo = fondo gris + más peso**, no un color nuevo. Inactivo en gris apagado; hover
   sube al color de texto.
3. **Texto pequeño y con contraste de peso**: 14px menú, 13,5px submenú, 11px badges. Fuente
   Geist (o Inter), `tabular-nums` en todas las cifras.
4. **Sin sombras, degradados ni ilustraciones.** Profundidad con borde y fondo, radios de 0,75rem.
5. **Detalles de producto real**: sidebar comprimible (4,5rem) con la preferencia guardada,
   `title`/`aria-label` en modo compacto, submenú con línea guía y barrita de 3px en la sección
   activa, badge de contador, barra superior fina de aviso («Demo»), pastilla de estado con punto
   pulsante, tarjeta de usuario arriba y de perfil/plan abajo.
6. **Pocos elementos y mucho aire.** El espacio vacío trabaja a favor.
7. **Casos secundarios cuidados**: barra inferior en móvil, `print:hidden`, modo oscuro,
   `prefers-reduced-motion`, foco visible, `aria-current`.

## Anatomía del marco
- `aside` sticky de 15rem: logo + botón comprimir · tarjeta de usuario (avatar, nombre, cifra
  clave) · `nav` principal · separador · Ajustes · tarjeta de contexto abajo (`mt-auto`).
- Cabecera sticky con `backdrop-blur`: estado a la izquierda, notificaciones y avatar a la derecha.
- `main` con `max-w-6xl`, `gap-8`, padding `px-4 md:px-8`.
- Navegación **definida como datos** (`{ href, label, icon }[]`) y pintada desde ahí; secciones
  de administración desplegadas bajo su entrada y como pestañas en móvil.

## Tokens (oklch, semánticos; el tema oscuro redefine los mismos nombres)
Claro: `--background` blanco · `--foreground` oklch(.22 .02 255) · `--primary` oklch(.5 .15 252) ·
`--muted-foreground` oklch(.5 .015 255) · `--border` oklch(.925 .006 250) · `--sidebar`
oklch(.982 .003 250) · `--sidebar-accent` oklch(.945 .006 250) · `--accent` oklch(.95 .025 252) ·
`--gain` oklch(.52 .13 155) · `--loss` oklch(.55 .19 25) · `--radius` .75rem.
Oscuro (`data-theme="oscuro"`): fondo oklch(.17 .02 258), tarjeta .215, primary .68, borde .32.
Los grises llevan un matiz azul mínimo (250), nunca gris puro. Ningún componente usa colores
sueltos: solo `bg-background`, `text-muted-foreground`, `border-border`, `bg-accent`…

## Para adaptar a otro sector
Conserva marco, tokens y reglas; cambia: el acento (un solo tono), las secciones del menú, la
cifra clave de la tarjeta de usuario, y la pantalla estrella. Una métrica grande + gráfico sobrio
+ tabla densa suele bastar; evita rejillas de 6 tarjetas iguales con icono.
