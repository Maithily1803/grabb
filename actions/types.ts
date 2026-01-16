// /actions/types.ts
import { Address } from "@/sanity.types";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  address: Address;
}
