// schemas/addressType.ts
import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Address Label",
      type: "string",
      description: "Label for this address (e.g. Home, Office)",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(200),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pin",
      title: "PIN Code",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{6}$/, {
            name: "pinCode",
            invert: false,
          })
          .error("Please enter a valid 6-digit PIN code."),
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      city: "city",
      state: "state",
      pin: "pin",
      isDefault: "default",
    },
    prepare({ title, subtitle, city, state, pin, isDefault }) {
      const main = `${title || "Unnamed"}${isDefault ? " (Default)" : ""}`;
      const sub = `${subtitle}, ${city}, ${state} - ${pin}`;
      return {
        title: main,
        subtitle: sub,
      };
    },
  },
});

