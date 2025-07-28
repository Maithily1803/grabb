// actions/createRazorpayOrder.ts

import { Address } from "@/sanity/sanity.types";

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
  await new Promise((res) => setTimeout(res, 500)); // simulate delay

  return {
    id: "order_mock_123456",
    amount: data.amount || 49900,
    currency: "INR",
    receipt: "rcpt_mock_001",
    status: "created",
    redirectUrl: "https://mock-redirect-url.com", // simulate redirect
    notes: {
      items: JSON.stringify(data.items),
      userId: data.userId ?? "mock_user_123",
      metadata: JSON.stringify(data.metadata),
    },
  };
}

