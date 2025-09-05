import { defineField, defineType } from "sanity";
import { FolderTree } from "lucide-react";

export default defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  icon: FolderTree,
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      validation: (rule) => rule.required().error("Category name is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required for URLs"),
    }),
    defineField({
      name: "code",
      title: "Category Code",
      type: "string",
      description: "Internal code for category (e.g., ENG, ELEC, BRAKE)",
      validation: (rule) => rule.required().max(20),
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "productCategory" }],
      description: "Leave empty for root categories",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "For category landing pages",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description", 
      type: "text",
      description: "Meta description for category pages",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Inactive categories won't appear in navigation",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "code",
      media: "image",
      parent: "parent.name",
    },
    prepare({ title, subtitle, media, parent }) {
      return {
        title,
        subtitle: parent ? `${parent} → ${subtitle}` : subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder", 
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});