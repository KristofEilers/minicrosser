import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  Files,
  BookA,
  User,
  ListCollapse,
  Quote,
  Menu,
  Settings,
  Package2,
  Building2,
  FolderTree,
  Car,
  GitBranch,
  FileText,
} from "lucide-react";

export const structure = (S: any, context: any) =>
  S.list()
    .title("Content")
    .items([
      // Product Catalog Section
      S.listItem()
        .title("Product Catalog")
        .icon(Package2)
        .child(
          S.list()
            .title("Product Catalog")
            .items([
              S.listItem()
                .title("Products")
                .icon(Package2)
                .schemaType("product")
                .child(
                  S.documentTypeList("product")
                    .title("Products")
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                ),
              S.listItem()
                .title("Manufacturers")
                .icon(Building2)
                .schemaType("manufacturer")
                .child(
                  S.documentTypeList("manufacturer")
                    .title("Manufacturers")
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                ),
              S.listItem()
                .title("Categories")
                .icon(FolderTree)
                .schemaType("productCategory")
                .child(
                  S.documentTypeList("productCategory")
                    .title("Product Categories")
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                ),
              S.divider(),
              S.listItem()
                .title("Vehicle Models")
                .icon(Car)
                .schemaType("vehicleModel")
                .child(
                  S.documentTypeList("vehicleModel")
                    .title("Vehicle Models")
                    .defaultOrdering([
                      { field: "manufacturer.name", direction: "asc" },
                      { field: "model", direction: "asc" },
                    ])
                ),
              S.listItem()
                .title("Vehicle Compatibility")
                .icon(GitBranch)
                .schemaType("vehicleCompatibility")
                .child(
                  S.documentTypeList("vehicleCompatibility")
                    .title("Vehicle Compatibility")
                ),
              S.listItem()
                .title("Product Documents")
                .icon(FileText)
                .schemaType("productDocument")
                .child(
                  S.documentTypeList("productDocument")
                    .title("Product Documents")
                    .defaultOrdering([{ field: "title", direction: "asc" }])
                ),
            ])
        ),
      S.divider(),
      
      // Content Management Section
      orderableDocumentListDeskItem({
        type: "page",
        title: "Pages",
        icon: Files,
        S,
        context,
      }),
      S.listItem()
        .title("Posts")
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Post")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]) // Default ordering
        ),
      orderableDocumentListDeskItem({
        type: "category",
        title: "Categories",
        icon: BookA,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "author",
        title: "Authors",
        icon: User,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "faq",
        title: "FAQs",
        icon: ListCollapse,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "testimonial",
        title: "Testimonials",
        icon: Quote,
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title("Navigation")
        .icon(Menu)
        .child(
          S.editor()
            .id("navigation")
            .schemaType("navigation")
            .documentId("navigation")
        ),
      S.listItem()
        .title("Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("settings")
            .schemaType("settings")
            .documentId("settings")
        ),
    ]);
