

import { defineConfig } from "sanity";
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import { deskTool } from "sanity/desk";

import { categoryType } from "./schemaTypes/categoryType";
import { blockContentType } from "./schemaTypes/blockContentType";
import { productType } from "./schemaTypes/productType";
import { orderType } from "./schemaTypes/orderType";
import { brandType } from "./schemaTypes/brandTypes";
import { addressType } from "./schemaTypes/addressType";
import { userType } from "./schemaTypes/userType";

export default defineConfig({
  name: "default",
  title: "GRABB",

  projectId: "yrmiiat0", 
  dataset: "production",

  plugins: [deskTool(),structureTool(), visionTool()],

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


