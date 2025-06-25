import Container from "@/components/Container";
import Title from "@/components/Title";
import { SINGLE_BLOG_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/images";
import {
  getOthersBlog,
  getSingleBlog,
} from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar, ChevronLeftIcon } from "lucide-react";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

const SingleBlogPage = async ({ params }: PageProps) => {
  const blog: SINGLE_BLOG_QUERYResult = await getSingleBlog(params.slug);

  if (!blog) return notFound();

  return (
    <div className="py-10">
      <Container className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-5">
          {blog?.mainImage && (
            <Image
              src={urlFor(blog.mainImage).url()}
              alt={blog.title || "Blog Image"}
              width={800}
              height={800}
              className="w-full max-h-[500px] object-cover rounded-lg"
            />
          )}

          <div className="text-xs flex items-center gap-5 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{dayjs(blog._createdAt).format("DD MMM YYYY")}</span>
            <div className="flex gap-2">
              {blog?.blogcategories?.map((cat, index) => (
                <span key={index}>{cat?.title}</span>
              ))}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{blog.title}</h1>

          <div className="prose max-w-full dark:prose-invert">
            <PortableText value={blog.body} />
          </div>
        </div>

        <div className="hidden lg:block">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to blog
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default SingleBlogPage;
