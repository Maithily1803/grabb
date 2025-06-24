import { getProductsByBrand } from "@/sanity/queries";
import { PRODUCT } from "@/sanity.types";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";

interface PageProps {
  params: {
    slug: string;
  };
}

const BrandPage = async ({ params }: PageProps) => {
  const products: PRODUCT[] = await getProductsByBrand(params.slug);

  return (
    <div className="py-10">
      <Container>
        <Title>{params.slug} Products</Title>
        {products.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No products found for this brand.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default BrandPage;
