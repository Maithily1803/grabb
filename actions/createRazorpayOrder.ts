"use server";

import razorpay from "@/lib/razorpay";
import { CartItem } from "@/store";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

type GroupedCartItems = {
  product: CartItem["product"];
  quantity: number;
};

export async function createRazorpayOrder(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // Calculate total amount in INR (paise)
    const totalAmount = items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity * 100;
    }, 0);

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: metadata.orderNumber,
      notes: {
        customer_name: metadata.customerName,
        customer_email: metadata.customerEmail,
        customer_phone: metadata.customerPhone || "",
      },
    };

    const order = await razorpay.orders.create(options);
    return { orderId: order.id, amount: order.amount, currency: order.currency };
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    return { error: "Failed to create order." };
  }
}


    