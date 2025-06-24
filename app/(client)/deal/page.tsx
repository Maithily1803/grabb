import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { getDealProducts } from "@/sanity/queries";
import { PRODUCT } from "@/sanity.types";
import React from "react";

const DealPage = async () => {
  const products: PRODUCT[] = await getDealProducts();

  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title className="mb-5 underline underline-offset-4 decoration-[1px] text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products.map((product: PRODUCT) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No deals available right now.</p>
        )}
      </Container>
    </div>
  );
};

export default DealPage;
