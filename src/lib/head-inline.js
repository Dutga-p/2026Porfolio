// Contenido de los dos scripts inline del <head>.
//
// Vive aquí, y no dentro de BaseLayout.astro, para que astro.config.mjs pueda
// importar exactamente las mismas cadenas y calcular sus hashes CSP en cada
// build. Astro solo hashea automáticamente los <script> que empaqueta él;
// un `is:inline` y un JSON-LD quedan fuera, así que escribirlos directamente
// en el markup obligaría a actualizar el hash a mano cada vez que cambien
// — y el fallo solo aparece en producción.
//
// Es JS y no TS a propósito: astro.config.mjs lo importa en tiempo de config.

export const SITE = 'https://dcom.agency';

// Se ejecuta antes del primer paint para evitar el flash de tema.
export const themeScript = `const stored = localStorage.getItem('theme');
const theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
document.documentElement.dataset.theme = theme;`;

export const personSchemaJson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'David Ordóñez Marín',
  jobTitle: 'Full Stack Software Developer',
  knowsAbout: [
    'Python',
    'Web Scraping',
    'Process Automation',
    'React',
    'React Native',
    'Vue.js',
    'Node.js',
    'Laravel',
    'AWS',
    'Docker',
  ],
  url: `${SITE}/`,
  image: `${SITE}/og-image.webp`,
  sameAs: [
    'https://github.com/Dutga-p',
    'https://www.linkedin.com/in/david-ord%C3%B3%C3%B1ez-mar%C3%ADn-26a504256/',
  ],
});
