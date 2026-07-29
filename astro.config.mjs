// @ts-check
import { createHash } from 'node:crypto';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { SITE, personSchemaJson, themeScript } from './src/lib/head-inline.js';

/** @param {string} source @returns {`sha256-${string}`} */
const sha256 = (source) => `sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}`;

// https://astro.build/config
export default defineConfig({
  site: SITE,
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // El CSP se genera aquí, no en vercel.json: Astro calcula los hashes
  // sha256 de cada script/estilo inline en cada build y los emite en un
  // <meta>. Mantenerlos a mano rompía producción cada vez que se
  // reempaquetaba un script (p. ej. al editar Navbar.astro).
  // `script-src` y `style-src` los añade Astro automáticamente.
  // `frame-ancestors` no se incluye: los <meta> CSP lo ignoran, así que
  // esa protección la cubre la cabecera X-Frame-Options de vercel.json.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "img-src 'self'",
        "font-src 'self'",
        "connect-src 'self'",
      ],
      // Astro hashea solo los <script> que empaqueta él. Los dos inline del
      // <head> se hashean aquí, desde la misma fuente que los renderiza.
      scriptDirective: {
        hashes: [sha256(personSchemaJson), sha256(themeScript)],
      },
    },
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
