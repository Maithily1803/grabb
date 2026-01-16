import { groq } from "next-sanity";
import { client } from "./lib/client";
import { Category, Brand, Product, MY_ORDERS_QUERYResult } from "../sanity.types";

export const getCategories = async (limit?: number): Promise<Category[]> => {
  const query = groq`*[_type == "category"] | order(title asc) ${
    limit ? `[0...${limit}]` : ""
  } {
    _id,
    title,
    slug,
    image,
    description,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`;
  
  return client.fetch(query);
};

export const getAllBrands = async (): Promise<Brand[]> => {
  const query = groq`*[_type == "brand"] | order(title asc) {
    _id,
    title,
    slug,
    image
  }`;
  
  return client.fetch(query);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const query = groq`*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    images,
    description,
    price,
    discount,
    stock,
    variant,
    status,
    categories[]->{
      _id,
      title,
      slug
    },
    brand->{
      _id,
      title,
      slug
    }
  }`;
  
  return client.fetch(query, { slug });
};

export const getDealProducts = async (): Promise<Product[]> => {
  const query = groq`*[_type == "product" && status == "hot"] | order(name asc) {
    _id,
    name,
    slug,
    images,
    price,
    discount,
    stock,
    variant,
    status,
    categories[]->{
      title
    }
  }`;
  
  return client.fetch(query);
};

export const getBrand = async (slug: string) => {
  const query = groq`*[_type == "product" && slug.current == $slug][0] {
    "brandName": brand->title
  }`;
  
  return client.fetch(query, { slug });
};

export const getMyOrders = async (userId: string): Promise<MY_ORDERS_QUERYResult> => {
  if (!userId) return [];
  
  const query = groq`*[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
    _id,
    orderNumber,
    orderDate,
    customerName,
    email,
    clerkUserId,
    totalPrice,
    amountDiscount,
    status,
    products[]{
      product->{
        _id,
        name,
        slug,
        images,
        price
      },
      quantity
    },
    invoice,
    address
  }`;
  
  return client.fetch(query, { userId });
};