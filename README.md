# Portafolio — David Ordóñez Marín

Sitio personal y portafolio profesional. Estático, bilingüe (ES/EN) y sin JavaScript de framework en el cliente.

**En producción:** [dcom.agency](https://dcom.agency) · **Repo:** [Dutga-p/2026Porfolio](https://github.com/Dutga-p/2026Porfolio)

## Stack

| Capa       | Herramienta                                                                    |
| :--------- | :----------------------------------------------------------------------------- |
| Framework  | [Astro 7](https://docs.astro.build) — salida estática, cero JS por defecto     |
| Estilos    | [Tailwind CSS 4](https://tailwindcss.com) vía `@tailwindcss/vite` + tokens CSS |
| Contenido  | Content Collections con esquemas Zod (JSON en `src/content/`)                  |
| Tipografía | Space Grotesk (display) + Inter (texto), self-hosted con Fontsource            |
| Iconos     | `simple-icons` (SVG inline, sin peticiones externas)                           |
| Calidad    | ESLint 10 + `eslint-plugin-astro`, Vitest, TypeScript                          |
| Deploy     | Vercel (estático + cabeceras de seguridad en `vercel.json`)                    |

## Requisitos

- **Node.js ≥ 22.12** (declarado en `engines`)
- **pnpm** — el proyecto usa `pnpm-lock.yaml` y `pnpm-workspace.yaml`

## Arranque rápido

```sh
pnpm install
pnpm dev          # http://localhost:4321
```

## Comandos

| Comando        | Acción                                              |
| :------------- | :-------------------------------------------------- |
| `pnpm install` | Instala dependencias                                |
| `pnpm dev`     | Servidor de desarrollo en `localhost:4321`          |
| `pnpm build`   | Compila el sitio estático a `./dist/`               |
| `pnpm preview` | Sirve el build local, tal como saldrá en producción |
| `pnpm lint`    | ESLint sobre todo el proyecto                       |
| `pnpm test`    | Tests unitarios con Vitest                          |
| `pnpm astro …` | CLI de Astro (`astro check`, `astro add`, …)        |

## Estructura

```text
src/
├── components/
│   ├── HomePage.astro       # compone las secciones en orden
│   ├── layout/              # Navbar (tema + menú móvil), Footer
│   ├── sections/            # Hero, TechStack, Projects, About,
│   │                        # Experience, Testimonials, Contact
│   └── ui/                  # Container, Button, ProjectCard, …
├── content/
│   ├── projects/{es,en}/    # una ficha por archivo JSON
│   ├── experience/{es,en}/
│   └── testimonials/{es,en}/
├── i18n/
│   ├── ui.ts                # todas las cadenas de interfaz (ES/EN)
│   └── utils.ts             # helpers de idioma y rutas
├── layouts/
│   ├── BaseLayout.astro     # <head>, SEO, JSON-LD, tema anti-flash
│   └── PageLayout.astro     # BaseLayout + Navbar + Footer
├── pages/
│   ├── index.astro          # ES  →  /
│   └── en/index.astro       # EN  →  /en/
└── styles/global.css        # tokens de diseño + capa base
```

Las imágenes de proyectos viven en `src/assets/` (las optimiza Astro); el CV, favicons y la imagen OG en `public/` (se sirven tal cual).

## Contenido

Cada sección de datos es una Content Collection validada por Zod en [content.config.ts](src/content.config.ts). Los archivos se agrupan por idioma y las secciones filtran por el prefijo del `id` (`es/`, `en/`), así que **cada entrada necesita su archivo en ambos idiomas** para aparecer en las dos versiones del sitio.

### Añadir un proyecto

1. Guarda la captura en `src/assets/projects/mi-proyecto.webp`.
2. Crea `src/content/projects/es/mi-proyecto.json` y su gemelo en `en/`:

```json
{
  "title": "Nombre del proyecto",
  "description": "Qué resuelve y con qué se construyó.",
  "technologies": ["Laravel", "Vue.js", "PostgreSQL"],
  "image": "../../../assets/projects/mi-proyecto.webp",
  "demoUrl": "https://ejemplo.com/",
  "category": "client",
  "order": 2
}
```

- `category`: `client` · `demo` · `own` — define la etiqueta de la tarjeta.
- `order`: ascendente; controla la posición en la grilla.
- `demoUrl`: URL absoluta o ruta interna que empiece por `/`. El esquema valida el formato, **no** que la ruta interna exista — eso se comprueba a mano.

### Añadir experiencia o testimonio

Mismo patrón, en `src/content/experience/` y `src/content/testimonials/`. Campos: `role`, `organization`, `startDate`, `endDate` (opcional), `achievements[]`, `order` para experiencia; `name`, `role`, `company`, `quote`, `order` para testimonios.

Un error de esquema **rompe el build** con el archivo y campo exactos — es intencional: evita publicar fichas a medias.

## Internacionalización

- Rutas: español en la raíz (`/`), inglés bajo `/en/` (`prefixDefaultLocale: false`).
- Todo el texto de interfaz está centralizado en [ui.ts](src/i18n/ui.ts). No hay cadenas sueltas en los componentes: cada sección recibe `lang` y llama a `useTranslations(lang)`.
- `BaseLayout` genera automáticamente `canonical`, `hreflang` por idioma y `x-default`.
- Para añadir un tercer idioma: agrégalo a `languages` en `ui.ts`, a `locales` en [astro.config.mjs](astro.config.mjs), crea `src/pages/<lang>/index.astro` y duplica los JSON de contenido.

## Diseño y accesibilidad

- **Tokens** en `:root` dentro de [global.css](src/styles/global.css), expuestos a Tailwind con `@theme inline`. Cambiar la paleta es editar variables, no clases.
- **Modo oscuro por defecto**; el claro es opt-in vía `[data-theme="light"]` en `<html>`. Un script inline en `BaseLayout` aplica la preferencia guardada antes del primer paint para evitar el flash de tema.
- Enlace de salto al contenido, foco visible global, menú móvil con trampa de foco reversible (Tab cicla, Escape cierra y devuelve el foco) y respeto a `prefers-reduced-motion`.
- El formulario de contacto valida en cliente y abre WhatsApp con el mensaje prellenado — no hay backend ni datos en tránsito hacia terceros.

## SEO

Open Graph, Twitter Cards, JSON-LD de tipo `Person` y sitemap (`@astrojs/sitemap`) se generan desde `BaseLayout` con el `site` definido en `astro.config.mjs`. Si cambia el dominio, ese es el único punto a tocar.

## Despliegue

Build estático (`pnpm build` → `dist/`) desplegado en Vercel. [vercel.json](vercel.json) añade CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y cacheo largo e inmutable para `/_astro/` y las imágenes.

>  El `script-src` del CSP autoriza los scripts inline por **hash sha256**. Si editas el script de tema o el JSON-LD de `BaseLayout.astro`, el navegador los bloqueará en producción hasta que regeneres el hash correspondiente en `vercel.json`. La consola del navegador imprime el hash esperado en el mensaje de bloqueo.

## Licencia

Código sin licencia pública. El contenido, las imágenes y la marca son propiedad de David Ordóñez Marín.
