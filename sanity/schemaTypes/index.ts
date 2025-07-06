import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";

import { productType } from "./productType";
import { orderType } from "./orderType";
import { brandType } from "./brandTypes";
import { userType } from "./userType";
import { addressType } from "./addressType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    productType,
    orderType,
    brandType,
    addressType,
    userType,
  ],
}
















