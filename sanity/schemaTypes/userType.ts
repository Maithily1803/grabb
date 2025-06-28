// schemas/userType.ts
import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

export const userType = defineType({
  name: "user",
  title: "Users",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "clerkId",
      title: "Clerk User ID",
      type: "string",
      description: "User ID from Clerk",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
    }),
  ],
});
