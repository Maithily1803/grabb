"use server";

import { Address } from "@/sanity.types";
import razorpay from "@/lib/razorpay";
import { backendClient } from "@/sanity/lib/backendClient";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  address: Address;
}

export async function createRazorpayOrder(data: {
  amount: number;
  items: { productId: string; quantity: number }[];
  userId?: string;
  metadata?: Metadata;
}) {
  try {
    if (!data.amount || data.amount < 100) {
      return { error: "Invalid amount" };
    }

    const order = await razorpay.orders.create({
      amount: Math.round(data.amount),
      currency: "INR",
      receipt: `rcpt_${data.metadata?.orderNumber || Date.now()}`,
      notes: {
        items: JSON.stringify(data.items),
        userId: data.userId || "",
        metadata: JSON.stringify(data.metadata),
      },
    });

    if (data.metadata) {
      await backendClient.create({
        _type: "order",
        orderNumber: data.metadata.orderNumber,
        orderDate: new Date().toISOString(),
        customerName: data.metadata.customerName,
        email: data.metadata.customerEmail,
        clerkUserId: data.metadata.clerkUserId,
        totalPrice: data.amount / 100,
        status: "pending",
        products: data.items.map((item) => ({
          _type: "orderProduct",
          _key: item.productId,
          product: {
            _type: "reference",
            _ref: item.productId,
          },
          quantity: item.quantity,
        })),
        address: data.metadata.address,
      });
    }

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?order_id=${order.id}`,
    };
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return { error: "Failed to create order. Please try again." };
  }
}