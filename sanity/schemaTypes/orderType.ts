import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
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
    }),
    defineField({
      name: "razorpayPaymentId",
      title: "Razorpay Payment ID",
      type: "string",
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
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
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().positive(),
            },
          ],
          preview: {
            select: {
              title: "product.name",
              quantity: "quantity",
            },
            prepare({ title, quantity }) {
              return {
                title: `${title} (x${quantity})`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "address",
      title: "Delivery Address",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Address Name" },
        { name: "address", type: "string", title: "Street Address" },
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State" },
        { name: "pin", type: "string", title: "PIN Code" },
      ],
    }),
    defineField({
      name: "invoice",
      title: "Invoice",
      type: "object",
      fields: [
        { name: "number", type: "string", title: "Invoice Number" },
        { name: "hosted_invoice_url", type: "url", title: "Invoice URL" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "orderNumber",
      customerName: "customerName",
      status: "status",
      totalPrice: "totalPrice",
    },
    prepare({ title, customerName, status, totalPrice }) {
      return {
        title: `Order: ${title}`,
        subtitle: `${customerName} - ₹${totalPrice} - ${status}`,
      };
    },
  },
});

