import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { Logs } from "lucide-react";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  const orders = userId ? await getMyOrders(userId) : [];

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>

        <HeaderMenu />

        <div className="w-auto md:w-1/3 flex items-center justify-end gap-3 md:gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />

          {user && (
            <Link
              href="/orders"
              className="group relative hover:text-shop_dark_yellow hoverEffect"
              aria-label="View Orders"
            >
              <Logs className="w-5 h-5" />
              {orders?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-shop_btn_dark_yellow text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center animate-pulse-ring">
                  {orders.length}
                </span>
              )}
            </Link>
          )}

          <ClerkLoaded>
            <SignedIn>
              <div className="border-l pl-3 md:pl-5">
                <UserButton />
              </div>
            </SignedIn>
            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;