import Razorpay from "razorpay";

const isMock = process.env.NEXT_PUBLIC_RAZORPAY_MOCK === "true";

let razorpay: any;

if (isMock) {
  // Mocked Razorpay instance
  razorpay = {
    orders: {
      create: async (options: any) => {
        return {
          id: "order_mock_123456",
          amount: options.amount,
          currency: options.currency || "INR",
          receipt: options.receipt || "rcpt_mock_001",
          status: "created",
        };
      },
    },
  };
} else {
  // Real Razorpay instance (needs real keys in .env)
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export default razorpay;
