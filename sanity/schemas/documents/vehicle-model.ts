import { defineField, defineType } from "sanity";
import { Car } from "lucide-react";

export default defineType({
  name: "vehicleModel",
  title: "Vehicle Model",
  type: "document",
  icon: Car,
  fields: [
    defineField({
      name: "manufacturer",
      title: "Vehicle Manufacturer",
      type: "reference",
      to: [{ type: "manufacturer" }],
      validation: (rule) => rule.required().error("Vehicle manufacturer is required"),
    }),
    defineField({
      name: "model",
      title: "Model Name",
      type: "string",
      validation: (rule) => rule.required().error("Model name is required"),
    }),
    defineField({
      name: "generation",
      title: "Generation",
      type: "string",
      description: "e.g., E90, F30, G20 (for BMW 3 Series generations)",
    }),
    defineField({
      name: "bodyType",
      title: "Body Type",
      type: "string",
      options: {
        list: [
          { title: "Sedan", value: "sedan" },
          { title: "Wagon/Estate", value: "wagon" },
          { title: "Hatchback", value: "hatchback" },
          { title: "Coupe", value: "coupe" },
          { title: "Convertible", value: "convertible" },
          { title: "SUV", value: "suv" },
          { title: "Pickup", value: "pickup" },
          { title: "Van", value: "van" },
        ],
      },
    }),
    defineField({
      name: "productionYearFrom",
      title: "Production Year From",
      type: "number",
      validation: (rule) => rule.required().min(1900).max(new Date().getFullYear() + 2),
    }),
    defineField({
      name: "productionYearTo",
      title: "Production Year To",
      type: "number",
      validation: (rule) => rule.min(1900).max(new Date().getFullYear() + 5),
      description: "Leave empty if still in production",
    }),
    defineField({
      name: "engines",
      title: "Available Engines",
      type: "array",
      of: [
        defineField({
          name: "engine",
          type: "object",
          fields: [
            defineField({
              name: "code",
              title: "Engine Code",
              type: "string",
              description: "e.g., N20B20, 2.0 TDI",
            }),
            defineField({
              name: "displacement",
              title: "Displacement (L)",
              type: "number",
            }),
            defineField({
              name: "power",
              title: "Power (kW)",
              type: "number",
            }),
            defineField({
              name: "fuelType",
              title: "Fuel Type",
              type: "string",
              options: {
                list: [
                  { title: "Petrol", value: "petrol" },
                  { title: "Diesel", value: "diesel" },
                  { title: "Electric", value: "electric" },
                  { title: "Hybrid", value: "hybrid" },
                  { title: "LPG", value: "lpg" },
                  { title: "CNG", value: "cng" },
                ],
                layout: "dropdown",
              },
            }),
          ],
          preview: {
            select: {
              code: "code",
              displacement: "displacement",
              power: "power",
              fuelType: "fuelType",
            },
            prepare({ code, displacement, power, fuelType }) {
              return {
                title: code,
                subtitle: `${displacement}L ${power}kW ${fuelType}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "chassis",
      title: "Chassis/Platform",
      type: "string",
      description: "e.g., MQB, CLAR, etc.",
    }),
    defineField({
      name: "image",
      title: "Vehicle Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      manufacturer: "manufacturer.name",
      model: "model",
      generation: "generation",
      yearFrom: "productionYearFrom",
      yearTo: "productionYearTo",
      media: "image",
    },
    prepare({ manufacturer, model, generation, yearFrom, yearTo, media }) {
      const years = yearTo ? `${yearFrom}-${yearTo}` : `${yearFrom}+`;
      const title = `${manufacturer} ${model}`;
      const subtitle = generation ? `${generation} (${years})` : years;
      
      return {
        title,
        subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Manufacturer, Model",
      name: "manufacturerModel",
      by: [
        { field: "manufacturer.name", direction: "asc" },
        { field: "model", direction: "asc" },
        { field: "productionYearFrom", direction: "desc" },
      ],
    },
    {
      title: "Production Year (newest first)",
      name: "productionYearDesc",
      by: [{ field: "productionYearFrom", direction: "desc" }],
    },
  ],
});