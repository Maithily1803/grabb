import { defineArrayMember, defineField, defineType } from "sanity"
import { BasketIcon } from "@sanity/icons"

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "razorpayOrderId",
      title: "Razorpay Order ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "razorpayPaymentId",
      title: "Razorpay Payment ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "User ID (Clerk)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: {
              title: "product.name",
              quantity: "quantity",
              media: "product.image",
            },
            prepare({ title, quantity, media }) {
              return {
                title: `${title} × ${quantity}`,
                media,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "INR",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Discount Applied",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Full Name", type: "string" }),
        defineField({ name: "address", title: "Street Address", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "pin", title: "PIN Code", type: "string" }),
      ],
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Out for Delivery", value: "out_for_delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      email: "email",
      orderId: "orderNumber",
      amount: "totalPrice",
      currency: "currency",
    },
    prepare({ name, orderId, email, amount, currency }) {
      const shortId = orderId?.slice(0, 5) + "..." + orderId?.slice(-4)
      return {
        title: `${name} (${shortId})`,
        subtitle: `${amount} ${currency} • ${email}`,
        media: BasketIcon,
      }
    },
  },
})

