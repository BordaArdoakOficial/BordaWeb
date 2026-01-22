import { defineCollection, z } from 'astro:content';

const products = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.string(),
        image: z.string(),
    }),
});

export const collections = {
    products,
};
