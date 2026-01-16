import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

interface ProductSlug {
  slug: string;
  _updatedAt: string;
}

interface CategorySlug {
  slug: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const products = await client.fetch<ProductSlug[]>(
      `*[_type == "product" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }`
    );

    const categories = await client.fetch<CategorySlug[]>(
      `*[_type == "category" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }`
    );

    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/shop`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/deal`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];

    const productPages = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(category._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
    ];
  }
}