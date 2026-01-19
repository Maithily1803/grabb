"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constant/data";
import { Product } from "@/sanity.types";

const query = `*[_type == "product" && variant == $variant] | order(name desc){
  _id,
  name,
  slug,
  price,
  discount,
  variant,
  status,
  stock,
  categories[]->{
    title
  },
  images
}`;

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(
    productType[0]?.title || ""
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, {
          variant: selectedTab.toLowerCase(),
        });
        setProducts(response);
      } catch (error) {
        console.error("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab]); 

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabbar
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">

        <div className={loading ? "contents" : "hidden"}>
          {[...Array(10)].map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>

        {/* Products */}
        <div className={!loading ? "contents" : "hidden"}>
          {products.length ? (
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <NoProductAvailable selectedTab={selectedTab} />
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProductGrid;
