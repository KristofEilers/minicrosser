import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export default defineType({
  name: "productDocument",
  title: "Product Document",
  type: "document",
  icon: FileText,
  fields: [
    defineField({
      name: "title",
      title: "Document Title",
      type: "string",
      validation: (rule) => rule.required().error("Document title is required"),
    }),
    defineField({
      name: "type",
      title: "Document Type",
      type: "string",
      options: {
        list: [
          { title: "Installation Manual", value: "installation" },
          { title: "User Manual", value: "manual" },
          { title: "Technical Data Sheet", value: "datasheet" },
          { title: "Certificate", value: "certificate" },
          { title: "Warranty Information", value: "warranty" },
          { title: "Safety Instructions", value: "safety" },
          { title: "CAD Drawing", value: "cad" },
          { title: "Exploded View", value: "exploded" },
          { title: "Compatibility List", value: "compatibility" },
          { title: "Other", value: "other" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "Document File",
      type: "file",
      validation: (rule) => rule.required().error("Document file is required"),
      options: {
        accept: ".pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.png,.jpg,.jpeg",
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Brief description of document content",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "German", value: "de" },
          { title: "English", value: "en" },
          { title: "French", value: "fr" },
          { title: "Spanish", value: "es" },
          { title: "Italian", value: "it" },
          { title: "Multi-language", value: "multi" },
        ],
        layout: "dropdown",
      },
      initialValue: "de",
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: "Document version (e.g., v1.0, Rev. A)",
    }),
    defineField({
      name: "validFrom",
      title: "Valid From",
      type: "date",
      description: "Date from which this document version is valid",
    }),
    defineField({
      name: "validTo",
      title: "Valid To",
      type: "date",
      description: "Leave empty if document has no expiration",
    }),
    defineField({
      name: "products",
      title: "Related Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Products this document applies to",
    }),
    defineField({
      name: "categories",
      title: "Related Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productCategory" }] }],
      description: "If document applies to entire categories",
    }),
    defineField({
      name: "isPublic",
      title: "Public Access",
      type: "boolean",
      initialValue: true,
      description: "Uncheck for documents requiring special dealer access",
    }),
    defineField({
      name: "downloadCount",
      title: "Download Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Automatically tracked download counter",
    }),
    defineField({
      name: "fileSize",
      title: "File Size (MB)",
      type: "number",
      description: "For display purposes",
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      version: "version",
      language: "language",
    },
    prepare({ title, type, version, language }) {
      const subtitle = [type, version, language].filter(Boolean).join(" • ");
      return {
        title,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Document Type",
      name: "type",
      by: [{ field: "type", direction: "asc" }],
    },
    {
      title: "Most Downloaded",
      name: "downloadDesc",
      by: [{ field: "downloadCount", direction: "desc" }],
    },
  ],
});