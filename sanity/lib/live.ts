// sanity/lib/live.ts

// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.

import { defineLive } from "next-sanity";
import { client } from "./client";

// ✅ Ensure token exists (needed for secure server + browser fetching)
const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error("❌ SANITY_API_READ_TOKEN is not set in your environment");
}

// ✅ Setup live client with sanityFetch
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,   // used on server
  browserToken: token,  // used in browser (only for read queries)
  fetchOptions: {
    revalidate: 0,      // always fetch latest content (no cache)
  },
});
