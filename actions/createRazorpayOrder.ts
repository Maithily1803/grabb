// actions/createRazorpayOrder.ts

export async function createRazorpayOrder(data: {
  amount: number;
  items: { productId: string; quantity: number }[];
  userId?: string;
}) {
  await new Promise((res) => setTimeout(res, 500)); // simulate delay

  return {
    id: "order_mock_123456",
    amount: data.amount || 49900,
    currency: "INR",
    receipt: "rcpt_mock_001",
    status: "created",
    notes: {
      items: JSON.stringify(data.items), // ✅ mock it the way Razorpay does
      userId: data.userId ?? "mock_user_123",
    },
  };
}

