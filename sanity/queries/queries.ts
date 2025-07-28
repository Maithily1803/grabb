import { defineQuery } from "next-sanity";

// ✅ Get all brands
export const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc)`);

// ✅ Get hot deal products
export const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,
    "categories": categories[]->title,
    "status": status
  }`
);


// ✅ Get product details by slug
export const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0]{
    ...,
    "id": _id,
    "slug": slug.current,
    "categories": categories[]->title,
    "brand": brand->title,
    images[],
    price,
    discount,
    description,
    name,
    variant,
    stock,
    isFeatured,
    status
  }`
);


// ✅ Get brand info for a product by slug
export const BRAND_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug]{
    "brandName": brand->title
  }`
);

// ✅ Get orders for logged-in Clerk user
export const MY_ORDERS_QUERY = defineQuery(
  `*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
    ...,
    products[]{
      ...,
      product->
    }
  }`
);
