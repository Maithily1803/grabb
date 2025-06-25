import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/images";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);

  return (
    <div>
      <Container>
        <Title>Blog Page</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
          {blogs?.map((blog) => (
            <div key={blog?._id} className="rounded-md overflow-hidden group shadow-md">
              {blog?.mainImage && (
                <Image
                  src={urlFor(blog.mainImage).url()}
                  alt={blog?.title ?? "Blog Image"}
                  width={500}
                  height={500}
                  className="w-full max-h-80 object-cover transition-all duration-300 group-hover:scale-105"
                />
              )}
              <div className="bg-gray-100 p-5 space-y-2">
                <div className="text-xs text-gray-600 flex items-center gap-4">
                  <Calendar className="w-4 h-4" />
                  <span>{dayjs(blog._createdAt).format("DD MMM YYYY")}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">{blog?.title}</h3>

                <div className="text-sm text-shop_dark_green font-medium flex flex-wrap gap-2">
                  {blog?.blogcategories?.map((item, index) => (
                    <span key={index}>{item?.title}</span>
                  ))}
                </div>

                <Link
                  href={`/blog/${blog?.slug?.current ?? ""}`}
                  className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
