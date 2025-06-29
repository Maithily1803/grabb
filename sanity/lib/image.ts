// grabb/sanity/lib/image.ts

import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "j7ziydlt", 
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-06-01",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
