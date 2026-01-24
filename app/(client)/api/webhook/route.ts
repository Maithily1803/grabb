import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";
import {
  rateLimit,
  getIpAddress,
  createRateLimitHeaders,
} from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    const ip = getIpAddress(req.headers);
    const rateLimitResult = rateLimit(ip, {
      interval: 60000,
      maxRequests: 30,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error(" Missing Razorpay signature");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    console.log("Webhook event received:", event.event);


    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      console.log("Payment captured:", payment.id);

      try {

        if (payment.notes?.items) {
          const orderItems = JSON.parse(payment.notes.items);
          for (const item of orderItems) {
            await updateProductStock(item.productId, item.quantity);
          }
        }


        if (payment.notes?.metadata) {
          const metadata = JSON.parse(payment.notes.metadata);
          await updateOrderStatus(
            metadata.orderNumber,
            "paid",
            payment.id
          );
        }
      } catch (err) {
        console.error(" Error processing webhook:", err);
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      console.log("Payment failed:", payment.id);

      if (payment.notes?.metadata) {
        const metadata = JSON.parse(payment.notes.metadata);
        await updateOrderStatus(metadata.orderNumber, "failed");
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function updateProductStock(productId: string, quantitySold: number) {
  try {
    const product = await backendClient.fetch(
      `*[_type == "product" && _id == $productId][0]{_id, stock}`,
      { productId }
    );

    if (!product) {
      console.error(`Product not found: ${productId}`);
      return;
    }

    const newStock = Math.max(0, (product?.stock || 0) - quantitySold);

    await backendClient.patch(productId).set({ stock: newStock }).commit();

    console.log(`🛒 Stock updated for ${productId}: ${newStock}`);
  } catch (error) {
    console.error(`Error updating stock for ${productId}:`, error);
  }
}

async function updateOrderStatus(
  orderNumber: string,
  status: string,
  paymentId?: string
) {
  try {
    const order = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]{_id}`,
      { orderNumber }
    );

    if (!order) {
      console.error(`Order not found: ${orderNumber}`);
      return;
    }

    const updateData: Record<string, string> = { status };
    if (paymentId) {
      updateData.razorpayPaymentId = paymentId;
    }

    await backendClient.patch(order._id).set(updateData).commit();

    console.log(`Order ${orderNumber} updated to ${status}`);
  } catch (error) {
    console.error(`Error updating order ${orderNumber}:`, error);
  }
}