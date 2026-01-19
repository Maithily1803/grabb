import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getCategories } from "@/sanity/queries";
import React from "react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

const CategoryPage = async ({ params }: PageProps) => {
  const categories = await getCategories();

  return (
    <div className="py-10">
      <Container>
        <Title>
          Products by Category:{" "}
          <span className="font-bold text-shop_dark_yellow capitalize">
            {params.slug}
          </span>
        </Title>

        {/* 🔥 KEY IS THE FIX */}
        <CategoryProducts
          key={params.slug}
          categories={categories}
          slug={params.slug}
        />
      </Container>
    </div>
  );
};

export default CategoryPage;


