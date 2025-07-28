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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Address } from "@/sanity/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct,
    resetCart,
    getGroupedItems,
  } = useStore();

  const groupedItems = getGroupedItems();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      setSelectedAddress(defaultAddress ?? data[0] ?? null);
    } catch (error) {
      console.error("Address fetch error:", error);
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

  const getSubTotal = () => {
    return groupedItems.reduce((acc, item) => {
      const price = item.product.price ?? 0;
      return acc + price * item.quantity;
    }, 0);
  };

  const getTotal = () => {
    return groupedItems.reduce((acc, item) => {
      const price = item.product.price ?? 0;
      const discount = item.product.discount ?? 0;
      const discountedPrice = price * (1 - discount / 100);
      return acc + discountedPrice * item.quantity;
    }, 0);
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

      const result = await createRazorpayOrder({
        amount: getTotal() * 100,
        items: groupedItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        userId: user.id,
        metadata,
      });

      if ("error" in result) {
        toast.error(String(result.error));
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
            {groupedItems.map((item) => {
              const price = item.product.price ?? 0;
              const discount = item.product.discount ?? 0;
              const discountedPrice = price * (1 - discount / 100);
              const itemTotal = discountedPrice * item.quantity;

              return (
                <Card key={item.product._id}>
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {item.product.images?.[0] ? (
                        <Image
                          src={urlFor(item.product.images[0]).url()}
                          alt={item.product.name ?? "Product Image"}
                          width={128}
                          height={128}
                          className="object-cover rounded-md w-32 h-32"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-md text-gray-500 text-sm">
                          No Image
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        <h2 className="text-lg font-semibold">{item.product.name ?? "No Name"}</h2>
                        <QuantityButtons product={item.product} />
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600 flex gap-2 items-center">
                            <PriceFormatter amount={discountedPrice} />
                            {discount > 0 && (
                              <span className="line-through text-red-400">
                                <PriceFormatter amount={price} />
                              </span>
                            )}
                          </div>
                          <Trash
                            onClick={() => deleteCartProduct(item.product._id)}
                            className="cursor-pointer hover:text-red-500"
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: <PriceFormatter amount={itemTotal} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>Subtotal: <PriceFormatter amount={getSubTotal()} /></p>
                <p>Tax: ₹0</p>
                <p className="font-semibold">Total: <PriceFormatter amount={getTotal()} /></p>
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
                      <div
                        key={address._id}
                        className={`flex items-start gap-2 py-2 cursor-pointer ${
                          selectedAddress?._id === address._id
                            ? "text-shop_dark_green"
                            : ""
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <RadioGroupItem value={address._id} />
                        <Label className="grid gap-1.5 flex-1">
                          <span className="font-semibold">{address.name}</span>
                          <span className="text-sm text-black/60">
                            {address.address}, {address.city}, {address.state}{" "}
                            {address.pin}
                          </span>
                        </Label>
                      </div>
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
                {loading ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
