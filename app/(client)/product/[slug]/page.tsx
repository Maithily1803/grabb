import React from "react";
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getProductBySlug } from "@/sanity/queries";
import { notFound } from "next/navigation";
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";

interface Props {
  params: {
    slug: string;
  };
}

const SingleProductPage = async ({ params }: Props) => {
  const slug = params.slug;

  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      {product?.images && (
        <ImageView images={product.images} isStock={product.stock} />
      )}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-sm text-gray-600 tracking-wide">{product.description}</p>
          <div className="flex items-center gap-0.5 text-xs">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className="text-shop_dark_yellow"
                fill="#f0b100"
              />
            ))}
            <p className="font-semibold">(120)</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-b border-gray-200 py-5">
          <PriceView
            price={product.price}
            discount={product.discount}
            priceClassName="text-3xl font-semibold text-black"
            className="mt-3"
          />
          <p
            className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${
              product.stock === 0
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        <div className="flex items-center gap-2.5 lg:gap-3">
          <AddToCartButton product={product} />
          <FavoriteButton showProduct={true} product={product} />
        </div>

        <ProductCharacteristics product={product} />

                <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
                <RxBorderSplit className="text-lg" />
                <p>Compare color</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
                <FaRegQuestionCircle className="text-lg" />
                <p>Ask a question</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
                <TbTruckDelivery className="text-lg" />
                <p>Delivery & Return</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect cursor-pointer">
                <FiShare2 className="text-lg" />
                <p>Share</p>
            </div>
            </div>


        <div className="flex flex-col">
          <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
            <Truck size={30} className="text-shop_rose" />
            <div>
              <p className="text-base font-semibold text-black">Free Delivery</p>
              <p className="text-sm text-gray-500 underline underline-offset-2">
                Enter your Postal code for Delivery Availability.
              </p>
            </div>
          </div>
          <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
            <CornerDownLeft size={30} className="text-shop_rose" />
            <div>
              <p className="text-base font-semibold text-black">Return Delivery</p>
              <p className="text-sm text-gray-500">
                Free 30days Delivery Returns.{" "}
                <span className="underline underline-offset-2">Details</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SingleProductPage;

