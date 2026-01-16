import { defineQuery } from "next-sanity";

// ✅ Get all brands
const BRANDS_QUERY = defineQuery(`
  *[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "logo": logo.asset->url
  }
`);

// ✅ Get hot deal products (status 'hot' or discount > 0)
const DEAL_PRODUCTS = defineQuery(`
  *[_type == "product" && (status == "hot" || discount > 0)] | order(discount desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    discount,
    "categories": categories[]->title,
    "brand": brand->name,
    "images": images[].asset->url,
    status
  }
`);

// ✅ Get product details by slug
const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    discount,
    stock,
    isFeatured,
    status,
    "categories": categories[]->title,
    "brand": brand->name,
    "images": images[].asset->url,
    variant
  }
`);

// ✅ Get brand info by slug
const BRAND_QUERY = defineQuery(`
  *[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    "logo": logo.asset->url,
    description
  }
`);

// ✅ Get orders for logged-in Clerk user
const MY_ORDERS_QUERY = defineQuery(`
  *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
    _id,
    orderDate,
    status,
    totalAmount,
    products[] {
      quantity,
      product->{
        _id,
        name,
        price,
        "slug": slug.current,
        "images": images[].asset->url
      }
    }
  }
`);

export {
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
};

