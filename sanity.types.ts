// grabb/sanity.types.ts

export interface Slug {
  _type: "slug";
  current: string;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface Category {
  _id: string;
  _type: "category";
  title: string;
  slug: Slug;
}

export interface Brand {
  _id: string;
  _type: "brand";
  title: string;
  slug: Slug;
  logo: SanityImage;
}

export interface Product {
  _id: string;
  _type: "product";
  name: string;
  slug: Slug;
  price: number;
  discount?: number;
  description: string;
  images: SanityImage[];
  isFeatured?: boolean;
  isAvailable?: boolean;
  category: {
    _type: "reference";
    _ref: string;
  };
  brand: {
    _type: "reference";
    _ref: string;
  };
  sizes?: string[];
  colors?: string[];
}

export interface Address {
  _id: string;
  _type: "address";
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  createdAt: string;
}


