"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import useStore from "@/store";
import { Address } from "@/sanity.types";
import { createRazorpayOrder, Metadata } from "@/actions/createRazorpayOrder";
import { urlFor } from "@/sanity/lib/image";

const CartPage = () => {
  const { deleteCartProduct, resetCart, getGroupedItems } = useStore();
  const groupedItems = getGroupedItems();

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock addresses for development
  const fetchAddresses = async () => {
    setLoading(true);
    try {
  const data: Address[] = [
  {
    _id: "addr1",
    _type: "address",
    name: "Home",
    address: "123, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pin: "400001",
    default: true,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
  },
  {
    _id: "addr2",
    _type: "address",
    name: "Office",
    address: "456, Business Street",
    city: "Pune",
    state: "Maharashtra",
    pin: "411001",
    default: false,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
  },
];


      setAddresses(data);
      const defaultAddr = data.find((a) => a.default) ?? data[0] ?? null;
      setSelectedAddress(defaultAddr);
    } catch (err) {
      console.error("Address fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Cart calculations
  const getSubTotal = () =>
    groupedItems.reduce((acc, item) => acc + (item.product.price ?? 0) * item.quantity, 0);

  const getDiscount = () =>
    groupedItems.reduce(
      (acc, item) => acc + ((item.product.price ?? 0) * (item.product.discount ?? 0) / 100) * item.quantity,
      0
    );

  const getTotal = () => getSubTotal() - getDiscount();

  const handleResetCart = () => {
    if (window.confirm("Are you sure you want to reset your cart?")) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress || !user) {
      toast.error("Please select an address and make sure you are signed in.");
      return;
    }

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
      console.error(err);
      toast.error("Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) return <NoAccess />;
  if (!groupedItems || groupedItems.length === 0) return <EmptyCart />;

  return (
    <div className="py-10 bg-gray-50">
      <Container>
        <div className="flex items-center gap-2 mb-5">
          <Title>Shopping Cart</Title>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cart Items */}
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
                            onClick={() => {
                              deleteCartProduct(item.product._id);
                              toast.success("Product deleted!");
                            }}
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

            <Button onClick={handleResetCart} variant="destructive" className="mt-3">
              Reset Cart
            </Button>
          </div>

          {/* Order Summary + Address */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <PriceFormatter amount={getSubTotal()} />
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <PriceFormatter amount={getDiscount()} />
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <PriceFormatter amount={getTotal()} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                {addresses && addresses.length > 0 ? (
                  <RadioGroup value={selectedAddress?._id}>
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`flex items-center space-x-2 mb-4 cursor-pointer ${
                          selectedAddress?._id === address._id ? "text-shop_dark_green" : ""
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <RadioGroupItem value={address._id.toString()} />
                        <Label className="grid gap-1.5 flex-1">
                          <span className="font-semibold">{address.name}</span>
                          <span className="text-sm text-black/60">
                            {address.address}, {address.city}, {address.state} {address.pin}
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

            <Button
              type="button"
              onClick={handleCheckout}
              disabled={loading || !selectedAddress || !user}
              className="w-full"
            >
              {loading ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;

