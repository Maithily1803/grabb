// app/(client)/page.tsx
import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories } from "../../sanity/queries";
import { client } from "@/sanity/lib/client";
import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  // Fetch product counts for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const count = await client.fetch(
        `count(*[_type == "product" && references(*[_type == "category" && slug.current == $slug]._id)])`,
        { slug: category.slug?.current }
      );
      return {
        ...category,
        productCount: count || 0,
      };
    })
  );

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


