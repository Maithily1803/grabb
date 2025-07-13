import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "@/constant/data";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <SubText>
              GRABB your fit. GRABB your moment. Because fashion isn't just worn — it's owned. 
            </SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover:border-shop-dark-yellow hover:text-shop_dark_yellow"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>
          <div>
            <SubTitle>Quick Links</SubTitle>
              <ul className="space-y-3 mt-4 text-gray-600 text-sm">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                  href={item?.href}
                  className="hover:text-shop_dark_yellow hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle>Categories</SubTitle>
            <SubText>
              <ul className="space-y-3 mt-4">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.value}`}
                    className="hover:text-shop_dark_yellow hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
            </SubText>
          </div>
          <div className="space-y-4">
            <SubTitle>Newsletter</SubTitle>
            <SubText>
              Subscribe to our newsletter to receive updates and exclusive
              offers.
            </SubText>
            <form className="space-y-3">
              <Input placeholder="Enter your email" type="email" required />
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm" />. All
            rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
