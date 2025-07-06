import { defineField, defineType } from "sanity";
import { TrolleyIcon } from "@sanity/icons";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "price",
      title: "Price (INR)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discount",
      title: "Discount (%)",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "stock",
      title: "Available Stock",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: { type: "brand" },
    }),

    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
        layout: "dropdown",
      },
    }),

    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Men", value: "men" },
          { title: "Women", value: "women" },
          { title: "Kids", value: "kids" },
          { title: "Accessories", value: "accessories" },
          
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "images",
      price: "price",
    },
    prepare({ title, price, media }) {
      return {
        title,
        subtitle: `₹${price}`,
        media: media?.[0],
      };
    },
  },
});
