"use server";

import { Address } from "@/sanity.types";
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from "crypto";

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
      return { error: "Amount must be at least ₹1.00" };
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return { error: "Payment gateway not configured" };
    }

    const shortReceipt = data.metadata?.orderNumber
      ? data.metadata.orderNumber.replace(/-/g, "").slice(0, 20)
      : String(Date.now());

    const razorpayOrder = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(data.amount),
        currency: "INR",
        receipt: `rcpt_${shortReceipt}`, 
        notes: {
          items: JSON.stringify(data.items),
          userId: data.userId || "",
          metadata: JSON.stringify(data.metadata),
        },
      }),
    });

    if (!razorpayOrder.ok) {
      const error = await razorpayOrder.json();
      console.error("Razorpay API Error:", error);
      return { error: "Failed to create payment order" };
    }

    const order = await razorpayOrder.json();

    if (data.metadata) {
      await backendClient.create({
        _type: "order",
        orderNumber: data.metadata.orderNumber,
        razorpayOrderId: order.id,
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
      orderNumber: data.metadata?.orderNumber,
    };
  } catch (error) {
    console.error("Order creation error:", error);
    return { error: "Failed to create order." };
  }
}

export async function verifyRazorpayPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return { success: false, error: "Payment verification failed" };
    }

    const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === data.razorpay_signature;

    if (isValid) {
      const order = await backendClient.fetch(
        `*[_type == "order" && razorpayOrderId == $orderId][0]`,
        { orderId: data.razorpay_order_id }
      );

      if (order) {
        await backendClient
          .patch(order._id)
          .set({
            status: "paid",
            razorpayPaymentId: data.razorpay_payment_id,
          })
          .commit();

        for (const item of order.products || []) {
          const productId = item.product._ref;
          const quantity = item.quantity;

          const product = await backendClient.fetch(
            `*[_type == "product" && _id == $productId][0]{_id, stock}`,
            { productId }
          );

          if (product) {
            const newStock = Math.max(0, (product.stock || 0) - quantity);
            await backendClient
              .patch(productId)
              .set({ stock: newStock })
              .commit();
          }
        }
      }

      return { success: true, orderId: order?._id };
    }

    return { success: false, error: "Invalid payment signature" };
  } catch (error) {
    console.error("Payment verification error:", error);
    return { success: false, error: "Verification failed" };
  }
}
