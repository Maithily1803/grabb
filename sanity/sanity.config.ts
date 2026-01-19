import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"
import { iconPicker } from "sanity-plugin-icon-picker"

import { schemaTypes } from "./schemaTypes" 

export default defineConfig({
  name: "default",
  title: "GRABB E-commerce",

  projectId: "yrmiiat0",
  dataset: "production",

  plugins: [
    deskTool(),
    visionTool(),
    iconPicker()
  ],

  schema: {
    types: schemaTypes
  }
})

