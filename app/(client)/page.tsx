// app/(client)/page.tsx
import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories } from "../../sanity/queries";
import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  const categoriesWithCount = categories.map((category) => ({
    ...category,
    productCount: 0, 
  }));

  return (
    <Container className="bg-white">
      <HomeBanner />
      <ProductGrid />
      <HomeCategories categories={categoriesWithCount} />
      <ShopByBrands />
    </Container>
  );
};

export default Home;


