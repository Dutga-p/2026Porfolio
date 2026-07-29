import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      image: image(),
      // Must be an absolute URL (external site) or a root-relative path
      // (internal route) — catches malformed/empty values at build time.
      // It can't verify an internal path actually resolves to a real page;
      // that still has to be checked by hand when adding a project.
      demoUrl: z.union([z.string().url(), z.string().startsWith('/')]),
      category: z.enum(['client', 'demo', 'own']),
      order: z.number().default(0),
    }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experience' }),
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    achievements: z.array(z.string()),
    order: z.number().default(0),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    quote: z.string(),
    avatar: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { projects, experience, testimonials };
