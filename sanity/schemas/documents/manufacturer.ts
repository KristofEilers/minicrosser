import { defineField, defineType } from "sanity";
import { Building2 } from "lucide-react";

export default defineType({
  name: "manufacturer",
  title: "Manufacturer",
  type: "document",
  icon: Building2,
  fields: [
    defineField({
      name: "name",
      title: "Manufacturer Name",
      type: "string",
      validation: (rule) => rule.required().error("Manufacturer name is required"),
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
      title: "Manufacturer Code",
      type: "string",
      description: "Short code for internal reference (e.g., BMW, BOSCH)",
      validation: (rule) => rule.required().max(10),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Inactive manufacturers won't appear in filters",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "code",
      media: "logo",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: `Code: ${subtitle}`,
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
      title: "Code A-Z", 
      name: "codeAsc",
      by: [{ field: "code", direction: "asc" }],
    },
  ],
});