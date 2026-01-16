
export type SanityImageCrop = {
  _type: 'sanity.imageCrop';
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
};

export type SanityImageHotspot = {
  _type: 'sanity.imageHotspot';
  height?: number;
  width?: number;
  x?: number;
  y?: number;
};

export type SanityImageAsset = {
  _type: 'sanity.imageAsset';
  _id: string;
  url: string;
};

export type SanityImage = {
  _type: 'image';
  _key: string;
  asset: {
    _ref: string;
    _type: 'reference';
  };
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
};

export type Category = {
  _id: string;
  _type: 'category';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  image?: SanityImage;
  description?: string;
};

export type Brand = {
  _id: string;
  _type: 'brand';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  image?: SanityImage;
};

export type Product = {
  _id: string;
  _type: 'product';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  images?: SanityImage[];
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  variant?: string;
  status?: 'new' | 'sale' | 'hot';
  categories?: Category[];
  brand?: Brand;
};

export type Address = {
  _id: string;
  _type: 'address';
  _createdAt: string;
  _updatedAt: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  phone?: string;
  default?: boolean;
};

export type Invoice = {
  number?: string;
  hosted_invoice_url?: string;
};

export type OrderProduct = {
  product: Product;
  quantity: number;
};

export type Order = {
  _id: string;
  _type: 'order';
  _createdAt: string;
  _updatedAt: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  email: string;
  clerkUserId: string;
  totalPrice: number;
  amountDiscount?: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  products?: OrderProduct[];
  invoice?: Invoice;
  address?: Address;
};

export type MY_ORDERS_QUERYResult = Order[];
export type BRANDS_QUERYResult = Brand[];
export type PRODUCT = Product;