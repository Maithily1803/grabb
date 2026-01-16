import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { iconPicker } from "sanity-plugin-icon-picker";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "default",
  title: "GRABB E-commerce",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [deskTool(), visionTool(), iconPicker()],
  schema: {
    types: [],
  },
});