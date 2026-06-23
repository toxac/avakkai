import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    // Strict categories enforced as requested
    category: z.enum(['TV Commercial', 'Film', 'Independent Film']),
    tags: z.array(z.string()),
    youtubeId: z.string(),
    featured: z.boolean().default(false),
    // Core B2B conversion metrics
    metricValue: z.string(),   // e.g., "1-Day Shoot", "Zero-CG Stunts", "16M+ Views"
    metricLabel: z.string(),   // e.g., "Production Efficiency", "Visual Scale", "Organic Reach"
  }),
});

export const collections = {
  'projects': projectsCollection,
};