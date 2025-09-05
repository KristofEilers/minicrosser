import { defineField, defineType } from "sanity";
import { Package2 } from "lucide-react";

export default defineType({
  name: "product",
  title: "Product", 
  type: "document",
  icon: Package2,
  groups: [
    {
      name: "general",
      title: "General",
    },
    {
      name: "variants", 
      title: "Variants & Pricing",
    },
    {
      name: "compatibility",
      title: "Compatibility",
    },
    {
      name: "documents",
      title: "Documents",
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "general",
      validation: (rule) => rule.required().error("Product name is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "general",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required for URLs"),
    }),
    defineField({
      name: "productNumber",
      title: "Product Number",
      type: "string",
      group: "general",
      description: "Internal product number/code",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "manufacturer",
      title: "Manufacturer",
      type: "reference",
      to: [{ type: "manufacturer" }],
      group: "general",
      validation: (rule) => rule.required().error("Manufacturer is required"),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productCategory" }] }],
      group: "general",
      validation: (rule) => rule.required().min(1).error("At least one category is required"),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      group: "general",
      description: "Brief description for listings and search results",
    }),
    defineField({
      name: "description",
      title: "Detailed Description",
      type: "block-content",
      group: "general",
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      group: "general",
      description: "Key product features",
    }),
    defineField({
      name: "specifications",
      title: "Technical Specifications",
      type: "array",
      of: [
        defineField({
          name: "specification",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Specification Name",
              type: "string",
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string", 
            }),
            defineField({
              name: "unit",
              title: "Unit",
              type: "string",
              description: "e.g., mm, kg, V, A",
            }),
          ],
          preview: {
            select: {
              name: "name",
              value: "value", 
              unit: "unit",
            },
            prepare({ name, value, unit }) {
              return {
                title: name,
                subtitle: `${value}${unit ? ` ${unit}` : ""}`,
              };
            },
          },
        }),
      ],
      group: "general",
    }),
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [{ type: "productVariant" }],
      group: "variants",
      validation: (rule) => rule.required().min(1).error("At least one variant is required"),
    }),
    defineField({
      name: "priceList",
      title: "Price List Reference",
      type: "string",
      group: "variants",
      description: "Reference to external price list system",
    }),
    defineField({
      name: "compatibleVehicles",
      title: "Compatible Vehicles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vehicleCompatibility" }] }],
      group: "compatibility",
      description: "Vehicles this part is compatible with",
    }),
    defineField({
      name: "replacesPartNumbers",
      title: "Replaces Part Numbers",
      type: "array",
      of: [{ type: "string" }],
      group: "compatibility",
      description: "OEM part numbers this product replaces",
    }),
    defineField({
      name: "replacedByPartNumbers",
      title: "Replaced By Part Numbers",
      type: "array", 
      of: [{ type: "string" }],
      group: "compatibility",
      description: "Newer part numbers that replace this product",
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      group: "compatibility",
      description: "Accessories, alternatives, or complementary products",
    }),
    defineField({
      name: "documents",
      title: "Product Documents",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productDocument" }] }],
      group: "documents",
      description: "Manuals, installation guides, certificates, etc.",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
    }),
    defineField({
      name: "searchKeywords",
      title: "Search Keywords",
      type: "array",
      of: [{ type: "string" }],
      group: "seo",
      description: "Additional keywords for search optimization",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      group: "general",
      description: "Inactive products are hidden from catalog",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "productNumber",
      media: "variants.0.images.0",
      manufacturer: "manufacturer.name",
    },
    prepare({ title, subtitle, media, manufacturer }) {
      return {
        title,
        subtitle: `${manufacturer} | ${subtitle}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Product Number",
      name: "productNumber",
      by: [{ field: "productNumber", direction: "asc" }],
    },
    {
      title: "Recently Updated",
      name: "updatedDesc",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
  ],
});