import { defineCollection} from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    category: z.array(z.string()),
    description: z.string(),
    youtubeId: z.string().optional(),
    youtubeIds: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    highlight: z.string().optional(),
    cardImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().default('Avakkai Studio'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, blog };