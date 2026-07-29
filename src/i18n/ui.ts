export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    nav: {
      inicio: 'Inicio',
      proyectos: 'Proyectos',
      sobreMi: 'Sobre mí',
      experiencia: 'Experiencia',
      contacto: 'Contacto',
    },
    hero: {
      availability: 'Abierto a nuevas oportunidades como desarrollador Full Stack',
      titlePrefix: 'David — Desarrollador de Software Full Stack',
      titleSuffix: '& Automatización',
      description:
        'Construyo desde bots de automatización y APIs hasta interfaces web y apps móviles — con foco en Python, React y React Native, y la infraestructura para llevarlo todo a producción.',
      ctaProjects: 'Ver proyectos',
      ctaContact: 'Contáctame',
      ctaCV: 'Descargar CV',
    },
    techStack: {
      eyebrow: 'Stack',
      title: 'Tecnologías que uso',
    },
    projects: {
      eyebrow: 'Proyectos',
      title: 'Trabajo real, en producción',
      description:
        'Desde sitios activos para clientes reales hasta demos que muestran lo que puedo construir para tu negocio.',
      categories: {
        client: 'Cliente real',
        demo: 'Demo',
        own: 'Proyecto propio',
      },
      viewProject: 'Ver proyecto →',
    },
    about: {
      eyebrow: 'Sobre mí',
      title: 'Desarrollador Full Stack con foco en automatización',
      p1: 'Desarrollador de software full stack con 2 años de experiencia en automatización de procesos con Python (bots, web scraping, RPA), desarrollo web (React, Vue, Node.js, Laravel) y aplicaciones móviles (React Native, TypeScript). Especializado en construir pipelines que eliminan trabajo manual repetitivo: desde extracción de datos hasta integraciones con CRM y reportes automáticos.',
      p2: 'Me interesa sumarme a un equipo donde pueda seguir creciendo técnicamente: código mantenible, buenas prácticas de accesibilidad y rendimiento, y la disciplina de medir antes de decidir.',
      highlights: [
        'Automatización real en producción: bots, scraping y pipelines de datos',
        'Full stack: Python, React/Vue, Node.js, Laravel y React Native',
        'Infraestructura y despliegue — AWS, Docker, Nginx, Linux',
      ],
      cta: 'Conoce mis proyectos →',
    },
    experience: {
      eyebrow: 'Experiencia',
      title: 'Mi trayectoria profesional',
      present: 'Presente',
    },
    testimonials: {
      eyebrow: 'Testimonios',
      title: 'Lo que dicen quienes han trabajado conmigo',
      description: 'Evidencia real de mi trabajo en producción, contada por quienes lo vivieron.',
    },
    contact: {
      eyebrow: 'Contacto',
      title: '¿Buscas sumar a alguien así a tu equipo?',
      description:
        'Cuéntame sobre la posición y conversemos — estoy abierto a nuevas oportunidades como desarrollador Full Stack.',
      whatsappMessage: 'Hola David, quiero hablar contigo sobre una oportunidad laboral.',
      form: {
        name: 'Nombre',
        email: 'Email',
        message: 'Mensaje',
        submit: 'Enviar por WhatsApp',
        disclaimer:
          'Al enviar, se abre WhatsApp con tu mensaje ya redactado — no se guarda ningún dato.',
        errors: {
          name: 'Ingresa tu nombre.',
          email: 'Ingresa un email válido.',
          message: 'Cuéntame brevemente de qué se trata.',
        },
        prefillTemplate: 'Hola David, soy {name} ({email}). {message}',
      },
    },
    footer: {
      tagline: 'Desarrollador Full Stack — automatización, web, móvil e infraestructura.',
      rights: 'Todos los derechos reservados.',
      builtWith: 'Construido con Astro + Tailwind CSS.',
    },
  },
  en: {
    nav: {
      inicio: 'Home',
      proyectos: 'Projects',
      sobreMi: 'About',
      experiencia: 'Experience',
      contacto: 'Contact',
    },
    hero: {
      availability: 'Open to new opportunities as a Full Stack developer',
      titlePrefix: 'David — Full Stack Software Developer',
      titleSuffix: '& Automation',
      description:
        "I build everything from automation bots and APIs to web interfaces and mobile apps — focused on Python, React, and React Native, with the infrastructure to ship it all to production.",
      ctaProjects: 'View projects',
      ctaContact: 'Contact me',
      ctaCV: 'Download CV',
    },
    techStack: {
      eyebrow: 'Stack',
      title: 'Technologies I use',
    },
    projects: {
      eyebrow: 'Projects',
      title: 'Real work, in production',
      description:
        'From live sites for real clients to demos that show what I can build for your business.',
      categories: {
        client: 'Real client',
        demo: 'Demo',
        own: 'Own project',
      },
      viewProject: 'View project →',
    },
    about: {
      eyebrow: 'About me',
      title: 'Full Stack developer focused on automation',
      p1: 'Full stack software developer with 2 years of experience in process automation with Python (bots, web scraping, RPA), web development (React, Vue, Node.js, Laravel), and mobile apps (React Native, TypeScript). Focused on building pipelines that remove repetitive manual work: from data extraction to CRM integrations and automated reporting.',
      p2: "I'm looking to join a team where I can keep growing technically: maintainable code, real attention to accessibility and performance, and the discipline of measuring before deciding.",
      highlights: [
        'Real production automation: bots, scraping, and data pipelines',
        'Full stack: Python, React/Vue, Node.js, Laravel, and React Native',
        'Infrastructure and deployment — AWS, Docker, Nginx, Linux',
      ],
      cta: 'Explore my projects →',
    },
    experience: {
      eyebrow: 'Experience',
      title: 'My professional journey',
      present: 'Present',
    },
    testimonials: {
      eyebrow: 'Testimonials',
      title: "What people I've worked with say",
      description: 'Real feedback on my work in production, from the people who experienced it.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Looking to add someone like this to your team?',
      description:
        "Tell me about the role and let's talk — I'm open to new opportunities as a Full Stack developer.",
      whatsappMessage: "Hi David, I'd like to talk to you about a job opportunity.",
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        submit: 'Send via WhatsApp',
        disclaimer: 'Sending opens WhatsApp with your message pre-filled — no data is stored.',
        errors: {
          name: 'Enter your name.',
          email: 'Enter a valid email.',
          message: 'Tell me briefly what this is about.',
        },
        prefillTemplate: "Hi David, I'm {name} ({email}). {message}",
      },
    },
    footer: {
      tagline: 'Full Stack developer — automation, web, mobile, and infrastructure.',
      rights: 'All rights reserved.',
      builtWith: 'Built with Astro + Tailwind CSS.',
    },
  },
} as const;
