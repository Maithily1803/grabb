import { Product, Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import { Flame } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="text-sm border-[1px] rounded-md border-shop_light_blue group bg-white hover:shadow-lg hover:shadow-shop_dark_yellow/10 hoverEffect">
      <div className="relative group overflow-hidden bg-shop_light_bg rounded-t-md">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <div className="w-full h-[250px] bg-white flex items-center justify-center relative">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
              <Image
                src={urlFor(product.images[0]).url()}
                alt={product.name || "Product image"}
                width={500}
                height={500}
                priority={false}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-contain transition-all duration-500 ${
                  product?.stock !== 0 
                    ? "group-hover:scale-105" 
                    : "opacity-50 grayscale"
                } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </Link>
        )}
        
        <ProductSideMenu product={product} />
        
        {product?.status === "sale" && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              SALE
            </span>
          </div>
        )}

        {product?.status === "new" && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              NEW
            </span>
          </div>
        )}
        
        {product?.status === "hot" && (
          <Link
            href="/deal"
            className="absolute top-2 left-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 p-1.5 rounded-full shadow-md hover:shadow-lg hoverEffect"
          >
            <Flame size={18} fill="#fff" className="text-white" />
          </Link>
        )}
      </div>
      
      <div className="p-3 flex flex-col gap-2">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-shop_dark_yellow">
            {product.categories.map((cat: Category) => cat.title).join(", ")}
          </p>
        )}
        
        <Title className="text-sm line-clamp-1 hover:text-shop_dark_yellow hoverEffect">
          <Link href={`/product/${product?.slug?.current}`}>
            {product?.name}
          </Link>
        </Title>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={index < 4 ? "text-shop_dark_yellow" : "text-lightText"}
                fill={index < 4 ? "#f0b100" : "#ababab"}
              />
            ))}
          </div>
          <p className="text-lightText text-xs tracking-wide">(5)</p>
        </div>

        <div className="flex items-center gap-2.5">
          <p className="text-lightText text-xs tracking-wide">Stock:</p>
          <p
            className={`text-xs font-semibold ${
              product?.stock === 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {(product?.stock as number) > 0 
              ? `${product?.stock} units` 
              : "Out of stock"}
          </p>
        </div>

        <PriceView price={product.price} discount={product.discount} />

        <AddToCartButton product={product} className="w-full rounded-full mt-1" />
      </div>
    </div>
  );
};

export default ProductCard;