import { defineField, defineType } from "sanity";
import { Package } from "lucide-react";

export default defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "object",
  icon: Package,
  fields: [
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      validation: (rule) => rule.required().error("SKU is required for each variant"),
    }),
    defineField({
      name: "name",
      title: "Variant Name",
      type: "string",
      description: "e.g., 'Red', 'Large', 'Left Side'",
    }),
    defineField({
      name: "attributes",
      title: "Attributes",
      type: "array",
      of: [
        defineField({
          name: "attribute",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Attribute Name",
              type: "string",
              description: "e.g., Color, Size, Position",
            }),
            defineField({
              name: "value",
              title: "Attribute Value", 
              type: "string",
              description: "e.g., Red, Large, Left",
            }),
          ],
          preview: {
            select: {
              name: "name",
              value: "value",
            },
            prepare({ name, value }) {
              return {
                title: `${name}: ${value}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "basePrice",
      title: "Base Price (EUR)",
      type: "number",
      description: "Base price before dealer discounts",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "weight",
      title: "Weight (kg)",
      type: "number",
      description: "For shipping calculations",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "object",
      fields: [
        defineField({
          name: "length",
          title: "Length (mm)",
          type: "number",
        }),
        defineField({
          name: "width",
          title: "Width (mm)",
          type: "number",
        }),
        defineField({
          name: "height",
          title: "Height (mm)",
          type: "number",
        }),
      ],
    }),
    defineField({
      name: "images",
      title: "Variant Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "stockStatus",
      title: "Stock Status",
      type: "string",
      options: {
        list: [
          { title: "In Stock", value: "inStock" },
          { title: "Low Stock", value: "lowStock" },
          { title: "Out of Stock", value: "outOfStock" },
          { title: "Discontinued", value: "discontinued" },
          { title: "Pre-Order", value: "preOrder" },
        ],
        layout: "radio",
      },
      initialValue: "inStock",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Inactive variants are hidden from catalog",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "sku",
      media: "images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || subtitle,
        subtitle: `SKU: ${subtitle}`,
        media,
      };
    },
  },
});