
// Mocked Razorpay Order Creation

export async function createRazorpayOrder(data: any) {
  // Simulate a delay like real API
  await new Promise((res) => setTimeout(res, 500));

  return {
    id: "order_mock_123456",
    amount: data.amount || 49900,
    currency: "INR",
    receipt: "rcpt_mock_001",
    status: "created",
    notes: data.notes || {},
  };
}
