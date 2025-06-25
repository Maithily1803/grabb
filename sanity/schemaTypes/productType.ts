import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Product Name', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({ name: 'brand', title: 'Brand', type: 'string' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Men', 'Women', 'Kids', 'Accessories'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      options: {
        list: [
          'Topwear',
          'Bottomwear',
          'Footwear',
          'Bags',
          'Caps',
          'Watches',
        ],
      },
      validation: (Rule) =>
        Rule.custom((sub: unknown, context: any) => {
          if (typeof sub !== 'string') return true

          const category = context?.parent?.category as string | undefined

          const map: Record<string, string[]> = {
            Men: ['Topwear', 'Bottomwear', 'Footwear'],
            Women: ['Topwear', 'Bottomwear', 'Footwear', 'Bags'],
            Kids: ['Topwear', 'Footwear', 'Caps'],
            Accessories: ['Bags', 'Caps', 'Watches'],
          }

          if (!category || !sub) return true

          return map[category]?.includes(sub)
            ? true
            : `Invalid subcategory "${sub}" for category "${category}"`
        }),
    }),
    defineField({ name: 'gender', title: 'Gender', type: 'string' }),
    defineField({ name: 'price', title: 'Price (INR)', type: 'number' }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'material', title: 'Material', type: 'string' }),
    defineField({ name: 'fit', title: 'Fit Type', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
})
