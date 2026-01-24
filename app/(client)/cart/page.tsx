"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
import {
  createRazorpayOrder,
  Metadata,
  verifyRazorpayPayment,
} from "@/actions/createRazorpayOrder";
import { urlFor } from "@/sanity/lib/image";

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  config?: {
    display: {
      blocks: {
        banks: {
          name: string;
          instruments: Array<{
            method: string;
          }>;
        };
      };
      sequence: string[];
      preferences: {
        show_default_blocks: boolean;
      };
    };
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const CartPage = () => {
  const { deleteCartProduct, resetCart, getGroupedItems } = useStore();
  const groupedItems = getGroupedItems();
  const router = useRouter();

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const getSubTotal = () =>
    groupedItems.reduce(
      (acc, item) => acc + (item.product.price ?? 0) * item.quantity,
      0
    );

  const getDiscount = () =>
    groupedItems.reduce(
      (acc, item) =>
        acc +
        ((item.product.price ?? 0) * (item.product.discount ?? 0)) /
          100 *
          item.quantity,
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
      toast.error("Please select an address.");
      return;
    }

    if (!scriptLoaded) {
      toast.error("Payment system loading. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const orderNumber = crypto.randomUUID();
      const metadata: Metadata = {
        orderNumber,
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
        setLoading(false);
        return;
      }

      // 🔥 RAZORPAY OPTIONS WITH RESTRICTED PAYMENT METHODS
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.amount,
        currency: result.currency,
        name: "GRABB Fashion",
        description: "Order Payment",
        order_id: result.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const verification = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              toast.success("Payment successful!");
              resetCart();
              router.push(`/success?orderNumber=${orderNumber}`);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.fullName ?? "",
          email: user.emailAddresses[0]?.emailAddress ?? "",
          contact: user.phoneNumbers?.[0]?.phoneNumber ?? "",
        },
        theme: {
          color: "#f0b100",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
        // 🎯 THIS RESTRICTS TO UPI AND CARD ONLY
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using UPI or Card",
                instruments: [
                  {
                    method: "upi",
                  },
                  {
                    method: "card",
                  },
                ],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: false, // Hide default payment options
            },
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed.");
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
                      <Link href={`/product/${item.product.slug?.current}`}>
                        {item.product.images?.[0] ? (
                          <Image
                            src={urlFor(item.product.images[0]).url()}
                            alt={item.product.name ?? "Product Image"}
                            width={128}
                            height={128}
                            className="object-cover rounded-md w-32 h-32 hover:scale-105 transition-transform cursor-pointer"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-md text-gray-500 text-sm">
                            No Image
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 space-y-2">
                        <Link href={`/product/${item.product.slug?.current}`}>
                          <h2 className="text-lg font-semibold hover:text-shop_dark_yellow transition-colors cursor-pointer">
                            {item.product.name ?? "No Name"}
                          </h2>
                        </Link>
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
                            className="cursor-pointer hover:text-red-500 transition-colors"
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

            <Button
              onClick={handleResetCart}
              variant="destructive"
              className="mt-3"
            >
              Reset Cart
            </Button>
          </div>

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
                          selectedAddress?._id === address._id
                            ? "text-shop_dark_yellow"
                            : ""
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <RadioGroupItem value={address._id.toString()} />
                        <Label className="grid gap-1.5 flex-1 cursor-pointer">
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

            <Button
              type="button"
              onClick={handleCheckout}
              disabled={loading || !selectedAddress || !user || !scriptLoaded}
              className="w-full bg-shop_dark_yellow hover:bg-shop_dark_yellow/90 text-white font-semibold"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;

