"use client";

import { Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setProducts([]);

      try {
        const query = `
          *[
            _type == "product" &&
            $slug in categories[]->slug.current
          ] | order(name asc)
        `;

        const data = await client.fetch<Product[]>(query, { slug });
        setProducts(data);
      } catch (error) {
        console.error("Category product fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  return (
    <div className="py-10 flex flex-col md:flex-row gap-8">
      {/* Category Sidebar */}
      <aside className="w-full md:w-56">
        <div className="rounded-xl border bg-white overflow-hidden">
          {categories.map((cat) => {
            const isActive = cat.slug?.current === slug;

            return (
              <Link
                key={cat._id}
                href={`/category/${cat.slug?.current}`}
                className={`
                  block px-4 py-3 text-sm transition-colors
                  ${
                    isActive
                      ? "bg-shop_dark_yellow/10 text-shop_dark_yellow font-semibold"
                      : "text-darkColor hover:bg-gray-50"
                  }
                `}
              >
                {cat.title}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Products Grid */}
      <section className="flex-1">
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-shop_dark_yellow" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <NoProductAvailable selectedTab={slug} />
        )}
      </section>
    </div>
  );
};

export default CategoryProducts;




