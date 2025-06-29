import { sanityFetch } from "../lib/live";
import {
  BRAND_QUERY,
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  MY_ORDERS_QUERY,
} from "./queries";

export const getCategories = async (quantity?: number) => {
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
};

export const getAllBrands = async () =>
  (await sanityFetch({ query: BRANDS_QUERY }))?.data ?? [];

export const getDealProducts = async () =>
  (await sanityFetch({ query: DEAL_PRODUCTS }))?.data ?? [];

export const getProductBySlug = async (slug: string) =>
  (await sanityFetch({ query: PRODUCT_BY_SLUG_QUERY, params: { slug } }))?.data ?? null;

export const getBrand = async (slug: string) =>
  (await sanityFetch({ query: BRAND_QUERY, params: { slug } }))?.data ?? null;

export const getMyOrders = async (userId: string) =>
  (await sanityFetch({ query: MY_ORDERS_QUERY, params: { userId } }))?.data ?? null;
