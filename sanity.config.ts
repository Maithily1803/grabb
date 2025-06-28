import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { type SchemaTypeDefinition } from "sanity";

import { categoryType } from "./sanity/schemaTypes/categoryType";
import { blockContentType } from "./sanity/schemaTypes/blockContentType";
import { productType } from "./sanity/schemaTypes/productType";
import { orderType } from "./sanity/schemaTypes/orderType";
import { brandType } from "./sanity/schemaTypes/brandTypes";
import { blogType } from "./sanity/schemaTypes/blogType";
import { blogCategoryType } from "./sanity/schemaTypes/blogCategoryType";
import { authorType } from "./sanity/schemaTypes/authorType";
import { addressType } from "./sanity/schemaTypes/addressType";
import { userType } from "./sanity/schemaTypes/userType"; // ✅ include this too

export default defineConfig({
  name: "default",
  title: "your-project-name",

  projectId: "yrmiiat0",
  dataset: "production",

  plugins: [deskTool()],
  schema: {
    types: [
      categoryType,
      blockContentType,
      productType,
      orderType,
      brandType,
      blogType,
      blogCategoryType,
      authorType,
      addressType,
      userType,
    ],
  },
});


