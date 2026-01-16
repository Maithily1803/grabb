import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      // 🔹 Return a safe mock redirect in development
      return NextResponse.json({ redirectUrl: "/success" });
    }

    // 🔹 Real Razorpay integration (when live & keys are set)
    const razorpayOrder = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: body.amount,
        currency: "INR",
        receipt: body.metadata.orderNumber,
        payment_capture: 1,
      }),
    }).then(r => r.json());

    // The frontend can now use this order id to open Razorpay checkout
    return NextResponse.json({ redirectUrl: `https://checkout.razorpay.com/v1/checkout.js?order_id=${razorpayOrder.id}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
