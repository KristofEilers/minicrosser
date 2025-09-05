import { defineField, defineType } from "sanity";
import { GitBranch } from "lucide-react";

export default defineType({
  name: "vehicleCompatibility",
  title: "Vehicle Compatibility",
  type: "document", 
  icon: GitBranch,
  fields: [
    defineField({
      name: "vehicle",
      title: "Vehicle Model",
      type: "reference",
      to: [{ type: "vehicleModel" }],
      validation: (rule) => rule.required().error("Vehicle model is required"),
    }),
    defineField({
      name: "specificEngines",
      title: "Specific Engines",
      type: "array",
      of: [{ type: "string" }],
      description: "If part is only for specific engines, list engine codes. Leave empty for all engines.",
    }),
    defineField({
      name: "yearFrom",
      title: "Compatible From Year",
      type: "number",
      description: "Override vehicle's production year if part compatibility differs",
    }),
    defineField({
      name: "yearTo", 
      title: "Compatible To Year",
      type: "number",
      description: "Override vehicle's production year if part compatibility differs",
    }),
    defineField({
      name: "chassisFrom",
      title: "Chassis From",
      type: "string",
      description: "VIN/Chassis number from which part is compatible",
    }),
    defineField({
      name: "chassisTo",
      title: "Chassis To", 
      type: "string",
      description: "VIN/Chassis number until which part is compatible",
    }),
    defineField({
      name: "restrictions",
      title: "Restrictions/Notes",
      type: "text",
      rows: 2,
      description: "Special conditions, exceptions, or installation notes",
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      options: {
        list: [
          { title: "Front", value: "front" },
          { title: "Rear", value: "rear" },
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
          { title: "Front Left", value: "frontLeft" },
          { title: "Front Right", value: "frontRight" },
          { title: "Rear Left", value: "rearLeft" },
          { title: "Rear Right", value: "rearRight" },
          { title: "All Positions", value: "all" },
        ],
        layout: "dropdown",
      },
      description: "Specific position where part fits",
    }),
    defineField({
      name: "transmissionTypes",
      title: "Transmission Types",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Manual", value: "manual" },
              { title: "Automatic", value: "automatic" },
              { title: "CVT", value: "cvt" },
              { title: "DCT/DSG", value: "dct" },
            ],
          },
        },
      ],
      description: "Leave empty if compatible with all transmission types",
    }),
    defineField({
      name: "driveTypes",
      title: "Drive Types",
      type: "array",
      of: [
        {
          type: "string", 
          options: {
            list: [
              { title: "Front Wheel Drive", value: "fwd" },
              { title: "Rear Wheel Drive", value: "rwd" },
              { title: "All Wheel Drive", value: "awd" },
              { title: "4WD", value: "4wd" },
            ],
          },
        },
      ],
      description: "Leave empty if compatible with all drive types",
    }),
    defineField({
      name: "confidence",
      title: "Compatibility Confidence",
      type: "string",
      options: {
        list: [
          { title: "Confirmed", value: "confirmed" },
          { title: "Likely", value: "likely" },
          { title: "Requires Verification", value: "verify" },
        ],
        layout: "radio",
      },
      initialValue: "confirmed",
    }),
  ],
  preview: {
    select: {
      manufacturer: "vehicle.manufacturer.name",
      model: "vehicle.model",
      generation: "vehicle.generation", 
      yearFrom: "yearFrom",
      yearTo: "yearTo",
      position: "position",
      confidence: "confidence",
    },
    prepare({ manufacturer, model, generation, yearFrom, yearTo, position, confidence }) {
      const vehicle = `${manufacturer} ${model} ${generation || ""}`.trim();
      const years = yearFrom && yearTo ? `(${yearFrom}-${yearTo})` : "";
      const pos = position ? ` - ${position}` : "";
      
      return {
        title: `${vehicle} ${years}${pos}`,
        subtitle: `Confidence: ${confidence}`,
      };
    },
  },
});