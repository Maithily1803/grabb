import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";
import { groq } from "next-sanity";

// Razorpay Webhook Endpoint
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 400 });
  }

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Razorpay signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error(" Invalid Razorpay webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    console.log("✅ Payment captured:", payment.id);

    try {
      const orderItems = payment.notes?.items
        ? JSON.parse(payment.notes.items)
        : [];

      for (const item of orderItems) {
        await updateProductStock(item.productId, item.quantity);
      }

    } catch (err) {
      console.error("❌ Error updating stock:", err);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Update Sanity product stock levels
async function updateProductStock(productId: string, quantitySold: number) {
  const product = await fetchProductStock(productId);
  const newStock = (product?.stock || 0) - quantitySold;

  return backendClient
    .patch(productId)
    .set({ stock: newStock < 0 ? 0 : newStock })
    .commit()
    .then(() => {
      console.log(`🛒 Updated stock for ${productId}: ${newStock}`);
    });
}

// Fetch current stock from Sanity
async function fetchProductStock(productId: string) {
  return await backendClient.fetch(
    groq`*[_type == "product" && _id == $productId][0]{_id, stock}`,
    { productId }
  );
}