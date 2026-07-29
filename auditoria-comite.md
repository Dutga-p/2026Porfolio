# Auditoría de comité técnico — portafolio Astro (`portfolio/`)

**Para:** David Camilo Ordoñez Marín
**Proyecto auditado:** `portfolio/` — reescritura en Astro 7 + Tailwind CSS 4 del sitio personal (i18n ES/EN nativo de Astro, colecciones de contenido tipadas con Zod, sin React/Vue en runtime)
**Comité:** Staff Frontend Engineer · Principal SWE · Senior UX/UI Designer · Frontend Architect · Tech Lead · Hiring Manager · Especialista en Performance Web · Experto en Accesibilidad WCAG 2.2 · Especialista en SEO Técnico · Experto en Diseño de Sistemas Frontend · Especialista en Personal Branding · Reclutador técnico
**Fecha:** 29 de julio de 2026

> **Nota de método.** Esta auditoría se basa en lectura directa y completa del código fuente (componentes `.astro`, `content.config.ts`, i18n, `global.css`, `astro.config.mjs`, `vercel.json`, `robots.txt`) y de los JSON de contenido en `src/content/`. No se ejecutó Lighthouse ni se abrió el sitio en un navegador real (sin herramienta de captura disponible en este entorno); los juicios puramente estéticos de las secciones 1 y 3 están marcados como inferidos del sistema de diseño en código. Los ratios de contraste citados en la sección 7 **sí fueron calculados matemáticamente** a partir de los valores hexadecimales exactos definidos en `global.css`, no estimados a ojo.

---

## 1. Primera impresión

**Puntuación: 5/10** — inferida del código, con un hallazgo que por sí solo pesa más que cualquier defecto visual.

Antes de evaluar tipografía o color, hay un problema que un Tech Lead va a ver en los primeros dos segundos: el logotipo/wordmark del sitio, en el `Navbar` y en el `Footer`, es literalmente:

```
tu<span class="text-accent">.dev</span>
```

(`src/components/layout/Navbar.astro:27`, `src/components/layout/Footer.astro:37`). Esto se renderiza como **"tu.dev"** — un texto que lee como el placeholder genérico de un starter/plantilla ("tu" = "tu marca aquí"), nunca reemplazado por el nombre real, un logo, o siquiera las iniciales "DO" / "DCOM". Es el elemento que aparece en *todas* las páginas, en la posición más visible del sitio (esquina superior izquierda, siempre fija por el `sticky top-0` del header), y comunica exactamente lo contrario de lo que un portafolio de 2 años de experiencia necesita transmitir: que el trabajo está terminado y revisado.

Más allá de ese hallazgo, lo que el código sí demuestra: un sistema de diseño real y unificado (paleta "Editorial Dark" con tokens únicos para ambos temas, acento dorado/bronce diferenciado en vez del verde neón o degradado morado-azul que domina portafolios genéricos), arquitectura 100% estática (Astro SSG, sin runtime de framework) que garantiza que cualquier crawler —incluidos los que no ejecutan JavaScript, como los de LinkedIn o WhatsApp al compartir el link— vea el HTML final real, con el título y meta-descripción correctos por idioma. Eso es una base técnica sólida que el "tu.dev" sin terminar contradice en la superficie.

- 🔴 **Crítico** — Wordmark placeholder sin terminar (`tu.dev`) en las dos ubicaciones de mayor visibilidad del sitio.
- 🟢 **Fortaleza** — Renderizado 100% estático: lo que ve un crawler sin JS es exactamente lo que ve un humano, sin la brecha de hidratación que sí tenía la versión anterior en React.

---

## 2. UX

**Puntuación: 5/10**

### Dónde un reclutador puede perderse o abandonar

- **No existe ninguna ruta hacia "esta persona busca empleo".** Revisando Hero, About, Navbar, Footer y el propio formulario de contacto de punta a punta: los CTAs son "Ver proyectos" / "Contáctame" (Hero), "Conoce mis proyectos →" (About), y el formulario de contacto pide literalmente **cotizar un proyecto** (`t.contact.whatsappMessage` = *"Hola David, quiero cotizar un proyecto contigo."*, `Contact.astro:22`). No hay botón de descarga de CV en ningún componente — se verificó con búsqueda exhaustiva de "CV", "resume", "descargar", "download" en todo `src/`: cero resultados. Un reclutador que llega a esta página no tiene ningún camino diseñado para pensar "candidato a full-time"; todo el flujo empuja hacia "cliente que quiere pagar por un proyecto".
- **Un enlace de proyecto roto.** La tarjeta de "LogiCore Solutions" apunta a `demoUrl: "/demos/logicore"` (`src/content/projects/es/logicore.json:6`), pero este proyecto Astro no tiene ninguna ruta `/demos/*` — se confirmó que `src/pages/` solo contiene `index.astro` y `en/index.astro`. Hacer clic en "Ver proyecto →" sobre esa tarjeta lleva a un 404 dentro de este sitio.
- **Sección de stack tecnológico sin encabezado visible.** `TechStack.astro` es un `<section aria-label="Tech stack">` sin ningún `<h2>` ni `SectionHeading` — a diferencia de cada otra sección de la página. Un visitante que escanea rápido no tiene una etiqueta "Stack" o "Tecnologías" que ancle esa franja de logos; solo aparece como una tira decorativa entre el Hero y Proyectos.
- **Sin persistencia de scroll-spy / sección activa.** La navegación es de ancla simple (`#projects`, `#about`...) sin resaltado de la sección visible — en una página de una sola ruta esto es de impacto bajo, pero es una pieza de orientación que sí existía en la versión anterior del sitio y aquí se perdió.

### Lo que funciona bien

- El formulario de contacto ahora **sí es un formulario real**: `<label for>` correctamente asociado a cada campo, validación en cliente (nombre no vacío, regex de email, mensaje no vacío) con mensajes de error inline por campo (`Contact.astro:131-152`) — una mejora genuina de accesibilidad y usabilidad de formularios frente a solo enlaces `mailto`/`wa.me`.
- El menú móvil tiene `aria-expanded`/`aria-controls` correctamente sincronizados en el script (`Navbar.astro:84-129`) y cierra al hacer clic en cualquier enlace.
- El toggle de tema persiste en `localStorage` y se aplica antes del primer paint vía un script inline en `<head>` (`BaseLayout.astro:63-68`), evitando el destello de tema incorrecto.
- Arquitectura de información de una sola página, orden estándar y correcto: Hero → Stack → Proyectos → Sobre mí → Experiencia → Servicios → Testimonios → Contacto.

---

## 3. UI

**Puntuación: 7/10** — inferida de tokens de diseño en código, sin render visual.

Este es, en el papel, un sistema de diseño más maduro que el de la versión anterior del sitio: **un solo bloque de tokens** (`global.css:10-34`) alimenta ambos temas a través de un único `@theme inline` de Tailwind 4 — no hay una paleta "diseñada" y otra "improvisada" como se detectó en la iteración React. El acento (`#b8965a`, un dorado/bronce apagado) es una elección deliberada y distintiva, lejos del verde-menta/azul-morado que domina el 90% de portafolios generados rápido.

Consistencia de componentes: `ServiceCard`, `ProjectCard` y `TestimonialCard` comparten el mismo lenguaje visual (`rounded-2xl border border-border bg-surface`, mismo radio, mismo tratamiento de hover) sin que ninguno reimplemente el patrón desde cero — buena señal de reutilización real, no solo casualidad visual.

- 🟡 **A revisar en vivo** — Los ratios de contraste calculados en la sección 7 muestran que al menos un token (`--text-muted` en tema oscuro) no pasa AA para texto pequeño; vale la pena una pasada con axe DevTools sobre el resto de combinaciones antes de confiar en la paleta completa.
- 🟡 **Consistencia menor** — `TechStack.astro` es la única sección sin `SectionHeading`, rompiendo el patrón "eyebrow + título" que todas las demás secciones comparten.

---

## 4. Calidad del frontend

**Puntuación: 7/10**

El proyecto es notablemente más disciplinado que un portafolio típico de 2 años de experiencia en varios frentes concretos:

- **Componentes pequeños y de una sola responsabilidad.** El componente más grande del proyecto es `Contact.astro` con 164 líneas (incluyendo su propio script de validación); el resto de secciones están entre 28 y 138 líneas. No hay ningún archivo que se acerque al tipo de monolito de 900+ líneas visto en el proyecto React hermano.
- **DRY real en el modelo de datos.** Proyectos, experiencia y testimonios se definen una sola vez por idioma como JSON validado por esquema (`content.config.ts`), no como arrays de JS hardcodeados acoplados por posición a otro archivo de traducción — este es exactamente el tipo de eliminación de acoplamiento posicional que un Staff Engineer pediría en una revisión.
- **Composición limpia**: `HomePage.astro` es solo una lista de imports y orden de secciones (28 líneas) — la responsabilidad de "cuál es el orden de la página" está en un único lugar legible.

Puntos que sí bajan la nota:

- **Ningún linter configurado.** No hay `eslint.config.*`, `.eslintrc*` ni `biome.json` en `portfolio/`, y `package.json` no tiene script `lint` (solo `dev`, `build`, `preview`, `astro`). El proyecto hermano en React sí tenía ESLint — esta reescritura lo perdió.
- **Cero pruebas automatizadas** — no existe ningún archivo `*.test.*` ni `*.spec.*` real en `src/` (la única coincidencia al buscar "test" fue el nombre del componente `Testimonials`, una falsa alarma).
- El campo `avatar` del esquema de `testimonials` (`content.config.ts:37`, `z.string().optional()`) no se usa en ningún lugar de `TestimonialCard.astro`, que siempre renderiza iniciales — es un campo de esquema muerto, señal menor de que el modelo de datos no se revisó contra su uso real.

---

## 5. Arquitectura

**Puntuación: 8/10** — la mejora más clara respecto a un enfoque típico de portafolio en React puro.

La decisión de fondo — Astro con cero JavaScript de framework en el cliente, contenido como colecciones tipadas con Zod, i18n de rutas nativo en vez de un detector de idioma en runtime — es la arquitectura correcta para lo que este sitio necesita hacer: entregar HTML final, indexable y compartible, con contenido que un no-programador (o el propio David, seis meses después) puede editar añadiendo un archivo JSON sin tocar componentes.

Separación de capas es limpia y consistente: `layout/` (Navbar, Footer), `sections/` (una por bloque de la página), `ui/` (primitivas reutilizables: Button, Container, SectionHeading, las tres Card). No hay ningún componente de sección que reimplemente una primitiva de `ui/` en vez de importarla — a diferencia del patrón de duplicación visto en el proyecto React hermano.

**¿Seguiría construyendo sobre esta arquitectura los próximos dos años?** Sí, sin reservas, para el alcance actual (sitio de una página, bilingüe, con contenido editorial simple). Si el sitio creciera a necesitar páginas de caso de estudio individuales por proyecto, la arquitectura de colecciones de Astro ya está lista para ese salto (`getCollection` + una ruta dinámica `[slug].astro` es la extensión natural, no un rediseño).

Único punto débil arquitectónico real: el enrutamiento de proyecto vía `demoUrl` como string libre (sin validar que sea una ruta interna existente o una URL externa válida) es lo que permitió que el link roto de LogiCore (§2) pasara sin que nada lo detectara — un `z.string().url()` en el esquema, o una unión discriminada `internal | external`, lo habría atrapado en build.

---

## 6. Rendimiento

**Puntuación: 8/10** — no verificado con Lighthouse en vivo, pero la arquitectura de base es de las más favorables posibles para Core Web Vitals.

- **Cero JavaScript de framework en el cliente.** No hay React, Vue ni ningún runtime hidratándose — solo un puñado de `<script>` pequeños e inline (toggle de tema, menú móvil, validación de formulario, marquee). El "costo de arranque" que domina el LCP/TBT de un portafolio en React SPA (bundle de vendor, hidratación) no existe aquí por diseño.
- **Fuentes autoalojadas** vía `@fontsource-variable` (Inter, Space Grotesk) importadas directamente en `global.css` — sin solicitud a un CDN externo de fuentes, evita el salto de conexión a `fonts.googleapis.com` y es compatible con una CSP estricta sin necesidad de `font-src` externo.
- **Imágenes optimizadas por el propio pipeline de Astro** (`astro:assets` `<Image>` en `About.astro` y `ProjectCard.astro`, con `width`/`height` explícitos) — genera automáticamente salida optimizada y evita el CLS de imágenes sin dimensiones.
- **Cabeceras de caché ya configuradas** en `vercel.json`: `immutable` de un año para `/_astro/*` (assets con hash), 30 días con `stale-while-revalidate` para imágenes — política correcta y ya lista para producción.
- El *marquee* de tecnologías anima con CSS puro (`@keyframes`, `transform`), no JavaScript por frame — decisión correcta de rendimiento, y respeta `prefers-reduced-motion` (`TechStack.astro:75-79`).

No priorizo mejoras de rendimiento aquí porque no hay ninguna de impacto real pendiente en lo que el código revela — la siguiente acción recomendada es simplemente **correr Lighthouse/PageSpeed Insights sobre el sitio desplegado** para confirmar con números lo que el código ya sugiere.

---

## 7. Accesibilidad — WCAG 2.2

**Cumplimiento estimado: AA con una brecha de contraste verificada matemáticamente en el tema oscuro (el tema por defecto).**

### Bien resuelto

- Skip link funcional: `href="#main-content"` apunta a `<main id="main-content">` real (`HomePage.astro:19`), oculto hasta el foco (`BaseLayout.astro:71-76`).
- Formulario con `<label for>` real en los tres campos, mensajes de error asociados por `data-error-for`.
- Botón de menú móvil con `aria-expanded`/`aria-controls` sincronizados correctamente en JS.
- `prefers-reduced-motion` respetado tanto en el *marquee* CSS como en la utilidad `animate-fade-up`.
- HTML semántico consistente: `<header>`, `<nav aria-label>`, `<footer>`, `<ol>` para la línea de tiempo de experiencia (correcto: es una secuencia ordenada).

### Fallo verificado — contraste de color (WCAG 1.4.3)

Calculé la luminancia relativa y el ratio de contraste (fórmula WCAG estándar) de los tokens de texto contra el fondo, usando los valores hexadecimales exactos de `global.css`:

| Par (tema oscuro, por defecto) | Ratio calculado | Resultado AA (texto normal, ≥4.5:1) |
| --- | --- | --- |
| `--text-secondary` `#9a9aa2` sobre `--bg` `#0b0b0d` | **7.05 : 1** | ✅ Pasa (incluso AAA) |
| `--accent` `#b8965a` sobre `--bg` `#0b0b0d` (usado como color de texto en *eyebrows* y enlaces) | **7.07 : 1** | ✅ Pasa (incluso AAA) |
| `--text-muted` `#6b6b72` sobre `--bg` `#0b0b0d` | **3.72 : 1** | ❌ **No pasa** — falla AA para texto normal |

`--text-muted` se usa en `text-xs` (texto pequeño, sin excepción de "texto grande" aplicable) en al menos: el pie de página (`Footer.astro:73`, "Construido con Astro..."), los sub-labels de contacto (`Contact.astro:57`, "WhatsApp"/"Email"/"GitHub"/"LinkedIn"), el rol/empresa de cada testimonio (`TestimonialCard.astro:30`), y las píldoras de tecnología y categoría de cada proyecto (`ProjectCard.astro:28,43`). Es decir, no es un caso aislado: es el color de texto secundario "silencioso" usado en varios puntos de contenido real, y en el tema por defecto del sitio no cumple el mínimo de contraste AA.

Como control: el mismo par en el tema claro (`--text-muted` `#71717a` sobre `--bg` `#fafaf9`) sí calcula **4.63 : 1**, pasando AA — la brecha es específica del tema oscuro, que es además el que carga primero para cualquier visitante sin preferencia guardada (`BaseLayout.astro:66`, fallback a `'dark'`).

### Otros hallazgos

- 🟡 **Superficial** — `alt` de las capturas de proyecto (`ProjectCard.astro:20`, `alt={project.title}`) duplica el título visible en vez de describir la imagen — cumple 1.1.1 técnicamente, no aporta información real a un lector de pantalla.
- 🟡 **Sección sin nombre visible** — `TechStack.astro` solo tiene `aria-label="Tech stack"` en el `<section>`; no hay un `<h2>` visible ni para usuarios videntes ni en el árbol de accesibilidad como encabezado navegable.
- 🟡 **Íconos duplicados sin marcar** — la lista de tecnologías se duplica (`[...technologies, ...technologies]`, `TechStack.astro:30`) para el loop continuo del *marquee*; la segunda mitad no lleva `aria-hidden="true"`, así que un lector de pantalla que recorra la lista anunciará cada tecnología dos veces.
- Sin foco atrapado dentro del menú móvil abierto (misma clase de gap encontrada en el sitio hermano).

---

## 8. Código

**Puntuación: 7/10**

Legible y consistente — el nivel más parejo de todo lo auditado en esta ronda. Cada componente de sección sigue el mismo patrón exacto (`Props` tipado → `useTranslations` → JSX/Astro template), lo que hace que leer un componente nuevo del proyecto no requiera aprender un patrón distinto cada vez. Eso es, en sí mismo, una señal de Mid+: consistencia deliberada, no solo componentes individualmente correctos.

**Rasgos de nivel Mid/Mid+:**
- Tipado real de principio a fin: `interface Props` en cada componente, esquemas Zod en el borde de datos (`content.config.ts`), `tsconfig.json` extendiendo `astro/tsconfigs/strict` — el modo estricto de TypeScript está realmente activo, no solo declarado.
- Comentarios escuetos y solo donde aportan algo no obvio (ej. `TechStack.astro:12-13` explicando por qué AWS no tiene ícono — restricción de marca de `simple-icons`, no un olvido).

**Rasgos que todavía leen como early-Mid:**
- Sin lint ni tests, como se detalla en §4 — para un repositorio nuevo, es más fácil de justificar tener cero de esto que tenerlo y luego perderlo, pero sigue siendo la ausencia más visible frente a cualquier revisor técnico.
- El campo de esquema no usado (`avatar` en testimonios) es el único indicio de "modelo de datos que no se validó contra su consumo real" en todo el proyecto.

---

## 9. Personal branding

**Puntuación: 3/10** — la nota más baja de toda esta auditoría, y más baja que la equivalente en el sitio hermano en React.

**Si fuera reclutador con 30 segundos, la impresión que me llevaría es: "esta es la landing de un freelancer de desarrollo web ofreciendo sus servicios" — ni por un segundo pensaría "candidato buscando un puesto Mid Frontend".**

La razón no es sutil, es estructural: **no hay un solo elemento en toda la página dirigido a un reclutador de una empresa.** El Hero no menciona disponibilidad para empleo; el CTA principal lleva a "Ver proyectos" o a un formulario que pide "cotizar un proyecto"; la sección de Servicios enumera seis ofertas comerciales con copy dirigido a dueños de negocio ("¿Tu desarrollador anterior desapareció?", "Vende las 24 horas sin pagar comisiones a marketplaces"); no existe botón de descarga de CV en ningún punto del código. Sumado al wordmark "tu.dev" sin terminar (§1), el efecto combinado es el de un sitio que **no sabe, o no decidió, para qué existe** — y esa ambigüedad es peor aquí que en la versión anterior del sitio, porque aquella al menos tenía una ruta `/portafolio` explícitamente dedicada al candidato; esta reescritura no tiene ninguna sección ni ruta equivalente.

Lo que sí funciona: el stack tecnológico mostrado es concreto y verificable, los proyectos ahora están correctamente categorizados (`client`/`demo`/`own`) — una mejora real de honestidad frente a mezclar sin distinción trabajo real con demos de práctica —, y la arquitectura del propio sitio (estático, tipado, sin dependencias innecesarias) es, para quien sepa leer el código, una pieza de evidencia técnica genuinamente buena. El problema es que ese argumento solo llega a quien abre el repositorio; el 95% de reclutadores solo va a ver la página renderizada, y esa página no les habla a ellos.

---

## 10. Contenido

**Puntuación: 5/10**

Qué falta específicamente para convencer a un reclutador, en orden de impacto:

1. **Cualquier mención de disponibilidad para empleo full-time.** Hoy el único "disponible para" que existe es `hero.availability` = *"Disponible para 2 nuevos proyectos este mes"* (`ui.ts:20`) — lenguaje 100% de freelancer tomando clientes.
2. **CV descargable.** Cero referencias en todo el código; un reclutador que quiera pasar el perfil a un sistema de tracking (ATS) no tiene nada que descargar.
3. **Métricas de impacto en los proyectos.** Igual que en la versión anterior del sitio: las descripciones narran qué se construyó, no qué cambió como resultado (tiempo de carga, usuarios, incidentes reducidos).
4. **Corregir el link roto de LogiCore** (`/demos/logicore`) antes de que alguien haga clic y encuentre un 404 en medio de la sección de proyectos.
5. La fecha de fin de la experiencia actual en Red Real Estate Digital sigue siendo "07/2026" en vez de "Presente" (el esquema sí soporta `endDate` opcional para marcar un rol activo — `content.config.ts:24` — pero la entrada no lo usa).

---

## 11. Tecnología

**Puntuación: 8/10**

Astro 7 + Tailwind 4 + TypeScript estricto + Zod para contenido es, para un sitio mayormente estático y editorial como este, la elección correcta — probablemente más adecuada que React puro, que es lo que usaba la versión anterior del mismo sitio. No hay sobre-ingeniería (no se trajo un framework de estado, ni una librería de animación pesada) ni sub-ingeniería (el tipado y la validación de contenido sí están presentes donde importan).

**¿Seguiría usando este stack?** Sí, sin reservas. **¿Migraría algo?** No. **¿Qué añadiría?** Un linter (ESLint con el plugin de Astro, o Biome) y un mínimo de pruebas — no porque el stack lo necesite para funcionar, sino porque su ausencia es lo único que un revisor técnico puede señalarle al stack en sí. **¿Cambiaría alguna librería?** No — `simple-icons` para los logos del stack tecnológico es una elección apropiada y ligera (SVGs crudos, sin paquete de íconos genérico).

---

## 12. Comparación con el mercado

| Nivel | Qué se espera | Dónde cae este proyecto |
| --- | --- | --- |
| **Junior** | Sitio funcional, sin atención a performance/SEO/tipado. | Superado con margen en todo lo técnico. |
| **Mid** | Código organizado, algo de tipado, consciencia de performance y SEO básico. | Superado en la mayoría de dimensiones técnicas (arquitectura, tipado, performance). |
| **Mid+** | Arquitectura que anticipa crecimiento, modelo de datos validado, sistema de diseño coherente, mínimo de guardarraíles (lint/tests). | **Aquí está el proyecto en lo técnico** — le falta solo lint/tests para cerrar esta franja por completo. |
| **Senior** | Todo lo anterior más criterio de producto explícito: el sitio comunica correctamente su propio propósito de negocio. | **Aquí es donde el proyecto retrocede** — un producto pensado para "conseguir empleo" que en su ejecución solo vende servicios freelance es, precisamente, el tipo de desalineación entre objetivo de negocio y producto que separa a Mid+ de Senior. |

La lectura más honesta: en ingeniería pura, este código está en la frontera Mid+/Senior temprano. En criterio de producto —la capacidad de construir exactamente lo que el objetivo de negocio requiere, no solo lo que es técnicamente elegante— el resultado hoy no cumple su propio propósito declarado. Un Tech Lead que solo mirara el repositorio pensaría Mid+; el mismo Tech Lead, si además viera el sitio publicado y notara que no puede encontrar el CV ni una sola señal de "busco empleo", bajaría esa impresión de forma notable.

---

## 13. Qué haría un Staff Engineer

| Área | Decisión de un Staff Engineer |
| --- | --- |
| Wordmark | Reemplazaría "tu.dev" por el nombre real o un logotipo simple antes de cualquier otro cambio — es la corrección de mayor relación impacto/esfuerzo de todo el proyecto. |
| Enfoque del sitio | Añadiría una sección o modo "candidato" explícito (CTA de CV, mención de disponibilidad para empleo, un párrafo dirigido a reclutadores) sin necesariamente duplicar todo el sitio como hacía la versión en React — quizás un simple `Props.audience` en `HomePage.astro` que ajuste el Hero/CTA/Contact, reutilizando el resto. |
| `demoUrl` | Cambiaría el esquema Zod de `projects` a una unión (`z.union([z.string().url(), z.string().startsWith('/')])`) validada contra rutas reales, o simplemente correría un chequeo de enlaces rotos en CI. |
| TechStack | Le agregaría un `SectionHeading` real y marcaría la mitad duplicada del marquee con `aria-hidden="true"`. |
| Contraste | Subiría `--text-muted` en el tema oscuro a un valor con ≥4.5:1 sobre `--bg` (por ejemplo, algo cercano a `#8a8a92`) y lo verificaría con una herramienta antes de fusionar. |
| Guardarraíles | Añadiría ESLint (plugin oficial de Astro) + un test mínimo con Vitest para las funciones puras de `i18n/utils.ts` (`getLangFromUrl`, `getLocalizedPath`, `getAlternateLang`) — son funciones puras, triviales de testear, y son exactamente el tipo de lógica que un refactor futuro podría romper en silencio. |
| Qué eliminaría | El campo `avatar` sin uso del esquema de testimonios, o lo implementaría de verdad. |
| Qué añadiría | Un CTA de CV visible en el Hero y en el Navbar; datos estructurados de tipo `JobSeeker`/mención explícita de disponibilidad laboral en el copy, ya que el JSON-LD `Person` (`BaseLayout.astro:17-28`) es un buen punto de partida pero no comunica intención de búsqueda de empleo por sí solo. |

---

## 14. Roadmap priorizado

### Imprescindible antes de enviar el portafolio

| Mejora | Impacto | Esfuerzo | Prioridad |
| --- | --- | --- | --- |
| Reemplazar el wordmark "tu.dev" por el nombre/marca real | Muy alto — primera impresión en cada página | Trivial | **P0** |
| Corregir el link roto de LogiCore (`/demos/logicore`) | Alto — 404 dentro de la sección de proyectos | Trivial | **P0** |
| Añadir un CTA de descarga de CV visible (Hero y/o Navbar) | Muy alto — hoy no existe ningún camino hacia esto | Bajo | **P0** |
| Corregir el contraste de `--text-muted` en tema oscuro (3.72:1 → ≥4.5:1) | Alto — falla WCAG AA verificada, en el tema por defecto | Trivial | **P0** |
| Marcar "Presente" en la experiencia activa (Red Real Estate Digital) | Medio | Trivial | **P0** |

### Alto impacto

| Mejora | Impacto | Esfuerzo | Prioridad |
| --- | --- | --- | --- |
| Añadir framing explícito de "busco empleo" (disponibilidad, mensaje dirigido a reclutadores, quizás una variante de Hero) | Muy alto — es la brecha central de todo el sitio frente a su propósito declarado | Medio | P1 |
| Reescribir 2-3 proyectos como casos de estudio con métricas | Alto | Medio (redacción, no código) | P1 |
| Configurar ESLint + un mínimo de pruebas (Vitest sobre `i18n/utils.ts`) | Alto — percepción técnica y guardarraíles reales | Bajo-medio | P1 |
| Añadir `SectionHeading` a `TechStack` y marcar el marquee duplicado con `aria-hidden` | Medio-alto — a11y y consistencia visual | Bajo | P1 |

### Impacto medio

| Mejora | Impacto | Esfuerzo | Prioridad |
| --- | --- | --- | --- |
| `alt` descriptivo real en capturas de proyecto, no duplicado del título | Medio | Bajo | P2 |
| hreflang con URLs absolutas en vez de relativas | Medio — alineado con la recomendación de Google | Bajo | P2 |
| Validar `demoUrl` contra un esquema/lista de rutas reales en build | Medio — previene la próxima regresión de este tipo | Bajo | P2 |
| Diversificar o etiquetar mejor la fuente de los testimonios (mismo patrón de solape con clientes/empleador que en la versión anterior) | Medio — honestidad de marca | Bajo | P2 |

### Mejoras opcionales

| Mejora | Impacto | Esfuerzo | Prioridad |
| --- | --- | --- | --- |
| Usar o eliminar el campo `avatar` sin uso en el esquema de testimonios | Bajo | Bajo | P3 |
| Foco atrapado dentro del menú móvil abierto | Bajo-medio — a11y | Bajo | P3 |
| Página de caso de estudio por proyecto (ruta dinámica sobre la colección ya existente) | Opcional, alto valor si se hace | Medio-alto | P3 |

---

## 15. Puntuaciones

| Criterio | Nota |
| --- | --- |
| Diseño UI *(inferido de código)* | 7/10 |
| UX | 5/10 |
| Arquitectura | 8/10 |
| Código | 7/10 |
| Rendimiento | 8/10 |
| Accesibilidad | 6/10 |
| SEO | 5/10 |
| Mantenibilidad | 7/10 |
| Escalabilidad | 6/10 |
| Calidad visual *(inferido de código)* | 7/10 |
| Calidad técnica | 7/10 |
| Branding personal | **3/10** |
| Profesionalidad | 5/10 |
| Preparación para entrevistas | 6/10 |

### Nivel global: **Mid**

Técnicamente, este proyecto sostiene una conversación de **Mid+** sin problema: arquitectura estática con contenido tipado, sistema de diseño unificado, cero deuda de dependencias innecesarias. Lo que lo retiene en Mid — y lo que un Tech Lead notaría de inmediato, sin necesitar abrir el código — es que el producto terminado no ejecuta su propio propósito: no hay ruta hacia un CV, no hay una sola línea de copy dirigida a un reclutador, y el wordmark del sitio es un placeholder sin terminar. Ninguna de las tres cosas requiere más que un día de trabajo; ese es exactamente el tamaño de la brecha entre lo que este código ya sabe hacer y lo que el sitio hoy comunica.

---

## 16. Informe para un Hiring Manager

Hablando exclusivamente como responsable de contratación evaluando este perfil para un rol Frontend Mid/Mid+ in-house:

**¿Lo invitaría a una entrevista técnica?** Sí, si llegara a ver el código — la arquitectura y las decisiones técnicas (tipado, contenido validado, cero dependencias innecesarias) son sólidas. **El problema es que, tal como está el sitio hoy, es poco probable que yo, como reclutador, llegue a mirar el código**: la página en sí no me da ninguna señal de que esta persona busca un puesto, así que probablemente la trataría como el sitio de un freelance y seguiría de largo.

**Fortalezas que destacaría:** arquitectura estática bien pensada para el problema real (contenido editorial, bilingüe, indexable), modelo de datos tipado y validado en vez de arrays acoplados por posición, disciplina de performance "gratis" por elección de stack.

**Dudas que tendría:** ¿por qué el wordmark del sitio quedó sin terminar? ¿Este candidato revisa su propio trabajo antes de publicarlo? ¿Está buscando empleo de verdad, o está construyendo su negocio freelance y el "portafolio" es un efecto secundario?

**Qué mejoraría antes de contratar:** ninguna duda técnica seria — las preguntas son todas de presentación y comunicación, no de capacidad.

**¿El sitio refleja realmente 2 años de experiencia?** En la ingeniería, sí, y en algunos aspectos (tipado, arquitectura de contenido) por encima del promedio. En la ejecución del propósito declarado del sitio, no — un desarrollador con más experiencia navegando procesos de contratación no habría publicado una landing 100% orientada a vender servicios como su única carta de presentación para buscar empleo.

---

## 17. Informe ejecutivo final

**Mayor punto fuerte:** la arquitectura. Elegir Astro estático con contenido tipado por Zod en vez de repetir el patrón SPA-con-runtime-pesado es, para este caso de uso, la decisión más senior de todo el proyecto — resuelve de raíz el problema de "lo que ve un crawler sin JS" que perseguía a la versión anterior del sitio, y deja una base fácil de mantener y extender.

**Mayor punto débil:** el sitio no ejecuta su propio propósito. Está construido, de arriba a abajo, como una landing de servicios freelance — sin CV, sin mensaje de disponibilidad laboral, sin una sola línea dirigida a un reclutador — a pesar de que tú me dijiste que su función es buscar empleo. Sumado al wordmark "tu.dev" sin terminar, la primera impresión que deja es la de un trabajo interrumpido antes de su enfoque final, no la de un candidato listo para revisión.

**Las tres mejoras de mayor impacto, en orden:**
1. Terminar el wordmark y añadir un CTA de CV visible — ambas son de horas, no de días, y son lo primero que ve cualquier persona.
2. Reescribir el Hero/Contact con framing dirigido a reclutadores (disponibilidad para empleo, no solo para "proyectos").
3. Corregir el link roto de LogiCore y el contraste insuficiente de `--text-muted` en modo oscuro — ambos son defectos verificables que cualquier revisor meticuloso va a encontrar en los primeros minutos.

**Errores que podrían hacer que un reclutador descarte tu candidatura sin decírtelo:** el wordmark sin terminar es, de toda esta auditoría, el que más pesa — no por ser "grave" técnicamente, sino porque es lo primero que se ve y lee como "no revisé mi propio trabajo antes de publicarlo". El link roto de LogiCore es el segundo: un reclutador que hace clic en un proyecto y encuentra un 404 generaliza esa impresión al resto del sitio sin decírtelo.

**Qué deberías hacer durante el próximo mes:** primero, arregla los cinco puntos de la lista "imprescindible" (todos son de horas). Segundo, decide conscientemente el propósito de este sitio — si es tu portafolio de búsqueda de empleo, reescribe Hero/Contact/CTA con esa audiencia en mente; si prefieres mantenerlo como landing freelance, entonces necesitas un sitio o sección separada específicamente para la búsqueda de empleo, no ambos mezclados sin resolver como ocurría en la versión anterior. Tercero, con el tiempo que quede, añade ESLint y un par de pruebas sobre `i18n/utils.ts`, y reescribe 2-3 proyectos como casos de estudio con métricas reales.

**¿Lo usaría para postular a empresas exigentes tal como está hoy?** No todavía, y no por el código — por lo que el sitio le dice a quien lo visita. Un Tech Lead que solo mirara el repositorio te daría el beneficio de la duda de Mid+; el mismo Tech Lead, mirando la página publicada, no encontraría ninguna señal de que estás buscando un puesto en su equipo. Cerrar esa brecha es, de toda esta auditoría, la corrección más barata con el retorno más alto.
