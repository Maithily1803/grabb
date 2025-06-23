"use server";

import stripe from "@/lib/stripe";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  clerkUserId?: string;
  address?: Address | null;
}

type GroupedCartItems = {
  product: CartItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined in environment variables.");
    }

    // Find or create customer by email
    let customerId = "";
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: metadata.customerEmail,
        name: metadata.customerName,
        phone: metadata.customerPhone,
      });
      customerId = customer.id;
    }

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        customerPhone: metadata.customerPhone ?? "",
        clerkUserId: metadata.clerkUserId ?? "",
        address: JSON.stringify(metadata.address ?? {}),
      },
      mode: "payment",
      payment_method_types: ["card", "upi"],
      allow_promotion_codes: true,
      invoice_creation: {
        enabled: true,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/cart`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "inr",
          unit_amount: Math.round(item.product.price * 100), // Assuming price is in INR
          product_data: {
            name: item.product.name,
            images: item.product.image ? [urlFor(item.product.image).url()] : [],
            description: item.product.description || "",
          },
        },
        quantity: item.quantity,
      })),
    };
    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session;
  } catch (err) {
    console.error("Failed to create checkout session:", err);
    throw new Error("Unable to create checkout session. Please try again.");
  }
}


    