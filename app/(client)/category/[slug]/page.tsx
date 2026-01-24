import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getCategories } from "@/sanity/queries";
import React from "react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CategoryPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const categories = await getCategories();

  return (
    <div className="py-10">
      <Container>
        <Title>
          Products by Category:{" "}
          <span className="font-bold text-shop_dark_yellow capitalize">
            {slug}
          </span>
        </Title>

        <CategoryProducts
          key={slug}
          categories={categories}
          slug={slug}
        />
      </Container>
    </div>
  );
};

export default CategoryPage;



