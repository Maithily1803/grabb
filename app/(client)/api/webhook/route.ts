import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";
import { groq } from "next-sanity";

// Razorpay Webhook Endpoint
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const isProd = process.env.NODE_ENV === "production";

  // Skip signature verification in development
  if (isProd && webhookSecret) {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid Razorpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment;
    console.log("✅ Payment captured:", payment.id);

    try {
      const orderItems = payment.notes?.items
        ? JSON.parse(payment.notes.items)
        : [];

      for (const item of orderItems) {
        await updateProductStock(item.productId, item.quantity);
      }

      console.log("🧾 User ID (if needed):", payment.notes?.userId);
    } catch (err) {
      console.error("❌ Error processing webhook:", err);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Update stock in Sanity
async function updateProductStock(productId: string, quantitySold: number) {
  const product = await backendClient.fetch(
    groq`*[_type == "product" && _id == $productId][0]{_id, stock}`,
    { productId }
  );

  const newStock = (product?.stock || 0) - quantitySold;

  return backendClient
    .patch(productId)
    .set({ stock: newStock < 0 ? 0 : newStock })
    .commit()
    .then(() => {
      console.log(`🛒 Stock updated for ${productId}: ${newStock}`);
    });
}
