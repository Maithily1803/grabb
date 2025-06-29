// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { categoryType } from "./sanity/schemaTypes/categoryType";
import { blockContentType } from "./sanity/schemaTypes/blockContentType";
import { productType } from "./sanity/schemaTypes/productType";
import { orderType } from "./sanity/schemaTypes/orderType";
import { brandType } from "./sanity/schemaTypes/brandTypes";
import { addressType } from "./sanity/schemaTypes/addressType";
import { userType } from "./sanity/schemaTypes/userType";

export default defineConfig({
  name: "default",
  title: "Grabb Studio",

  projectId: "j7ziydlt", // ✅ your correct project ID
  dataset: "production",

  plugins: [deskTool()],

  schema: {
    types: [
      categoryType,
      blockContentType,
      productType,
      orderType,
      brandType,
      addressType,
      userType,
    ],
  },
});


