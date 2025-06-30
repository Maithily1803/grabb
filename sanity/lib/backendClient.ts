// sanity/lib/backendClient.ts
import { createClient } from 'next-sanity'

export const backendClient = createClient({
  projectId: "yrmiiat0",
  dataset: "production",
  apiVersion: "2024-06-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Optional if only reading
});
