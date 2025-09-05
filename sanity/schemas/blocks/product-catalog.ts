import { defineField, defineType } from "sanity";
import { Package } from "lucide-react";

export default defineType({
  name: "product-catalog",
  title: "Product Catalog",
  type: "object",
  icon: Package,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Product Catalog",
    }),
    defineField({
      name: "subtitle", 
      title: "Subtitle",
      type: "string",
      initialValue: "Find the right parts for your vehicle",
    }),
    defineField({
      name: "showSearch",
      title: "Show Search Bar",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showCategories",
      title: "Show Categories Sidebar", 
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showManufacturers",
      title: "Show Manufacturers Sidebar",
      type: "boolean", 
      initialValue: true,
    }),
    defineField({
      name: "productsPerPage",
      title: "Products Per Page",
      type: "number",
      initialValue: 12,
      validation: (Rule) => Rule.min(1).max(50),
    }),
    defineField({
      name: "featuredCategories",
      title: "Featured Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productCategory" }] }],
      description: "Leave empty to show all categories",
    }),
    defineField({
      name: "featuredManufacturers", 
      title: "Featured Manufacturers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "manufacturer" }] }],
      description: "Leave empty to show all manufacturers",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      };
    },
  },
});