import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        products: collection({
            label: 'Products',
            slugField: 'name',
            path: 'src/content/products/*',
            format: { data: 'json' },
            schema: {
                name: fields.slug({ name: { label: 'Name' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                price: fields.number({ label: 'Price' }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Wines', value: 'wines' },
                        { label: 'Beers', value: 'beers' },
                        { label: 'Ciders', value: 'ciders' },
                        { label: 'Soft Drinks', value: 'soft-drinks' },
                        { label: 'Food', value: 'food' },
                    ],
                    defaultValue: 'wines',
                }),
                image: fields.image({
                    label: 'Image',
                    directory: 'public/images/products',
                    publicPath: '/images/products',
                }),
            },
        }),
        posts: collection({
            label: 'Posts',
            slugField: 'title',
            path: 'src/content/posts/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                content: fields.markdoc({ label: 'Content' }),
                publishedAt: fields.date({ label: 'Published At' }),
            },
        }),
    },
});
