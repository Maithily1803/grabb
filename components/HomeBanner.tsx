import React from "react";
import Image from "next/image";
import banner_1 from "@/images/banner_1.jpg"; // default import for jpg
import { Title } from "./ui/text";
import Link from "next/link";

const HomeBanner = () => {
  return (
    <div className="py-16 md:py-0 bg-shop_light_pink rounded-lg px-10 lg:px-24 flex items-center justify-between">
      {/* Left side content */}
      <div>
        <Title className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Our Store!
        </Title>
        <p className="mb-6 text-lg text-gray-700">
          Discover great deals on amazing products.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Shop Now
        </Link>
      </div>

      {/* Right side image */}
      <div className="hidden md:block">
        <Image
          src={banner_1}
          alt="Home Banner"
          width={500}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default HomeBanner;
