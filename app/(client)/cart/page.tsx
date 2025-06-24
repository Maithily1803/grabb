"use client";

import {
  createRazorpayOrder,
  Metadata,
} from "@/actions/createRazorpayOrder";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
    getGroupedItems,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = getGroupedItems();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleResetCart = () => {
    if (window.confirm("Are you sure you want to reset your cart?")) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress || !user) return;

    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user.fullName ?? "Unknown",
        customerEmail: user.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user.id,
        address: selectedAddress,
      };

      const result = await createRazorpayOrder(groupedItems, metadata);
      if ("error" in result) {
        toast.error(result.error);
      } else if (result?.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (err) {
      toast.error("Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) return <NoAccess />;
  if (!groupedItems || groupedItems.length === 0) return <EmptyCart />;

  return (
    <div className="py-10">
      <Container>
        <Title>Shopping Cart</Title>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10">
          <div className="space-y-3 lg:col-span-2">
            {groupedItems.map((item) => (
              <Card key={item.product._id}>
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <Image
                      src={urlFor(item.product.image[0]).url()}
                      alt={item.product.title}
                      width={150}
                      height={150}
                      className="object-cover rounded-md w-32 h-32"
                    />
                    <div className="flex-1 space-y-2">
                      <h2 className="text-lg font-semibold">{item.product.title}</h2>
                      <QuantityButtons id={item.product._id} />
                      <div className="flex justify-between text-sm text-gray-600">
                        <PriceFormatter price={item.product.price} />
                        <Trash
                          onClick={() => deleteCartProduct(item.product._id)}
                          className="cursor-pointer hover:text-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>Subtotal: ₹{getSubTotalPrice()}</p>
                <p>Tax: ₹0</p>
                <p className="font-semibold">Total: ₹{getTotalPrice()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Address</CardTitle>
              </CardHeader>
              <CardContent>
                {addresses && addresses.length > 0 ? (
                  <RadioGroup
                    value={selectedAddress?._id}
                    onValueChange={(id) =>
                      setSelectedAddress(addresses.find((a) => a._id === id) || null)
                    }
                  >
                    {addresses.map((address) => (
                      <RadioGroupItem key={address._id} value={address._id}>
                        <Label className="ml-2">{address.addressLine1}</Label>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                ) : (
                  <p>No address found</p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleResetCart} variant="outline">
                Reset
              </Button>
              <Button onClick={handleCheckout} disabled={loading}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
        <ProductSideMenu />
      </Container>
    </div>
  );
};

export default CartPage;