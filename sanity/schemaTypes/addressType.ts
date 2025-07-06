// schemas/addressType.ts
import { defineField, defineType } from "sanity"
import { HomeIcon } from "@sanity/icons"

export const addressType = defineType({
  name: "address",
  title: "Address",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      weak: true,
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "email",
    }),
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
    }),
    defineField({
      name: "pin",
      title: "PIN Code",
      type: "string",
      validation: (Rule) => Rule.regex(/^\d{6}$/).error("PIN must be 6 digits"),
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address ?",
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

