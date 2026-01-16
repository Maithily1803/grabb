
// sanity/queries/index.ts
import { sanityFetch } from "../lib/live";
import {

  BRAND_QUERY,
  BRANDS_QUERY,
  DEAL_PRODUCTS,

  MY_ORDERS_QUERY,

  PRODUCT_BY_SLUG_QUERY,

} from "./queries";

// ✅ Get all categories
const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      : `*[_type == 'category'] | order(name asc) {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;

    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });

    return data ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ✅ Get all brands
const getAllBrands = async () => {
  try {
    const { data } = await sanityFetch({ query: BRANDS_QUERY });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};




// ✅ Get hot deal products
const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: DEAL_PRODUCTS });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching deal products:", error);
    return [];
  }
};

// ✅ Get product by slug
const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

// ✅ Get brand info by product slug
const getBrand = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: BRAND_QUERY,
      params: { slug },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
};

// ✅ Get orders for logged-in Clerk user
const getMyOrders = async (userId: string) => {
  try {
    const { data } = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
};




export {
  getCategories,
  getAllBrands,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getMyOrders,

};
