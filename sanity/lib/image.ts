import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";

const client = createClient({
  projectId: "yrmiiat0", 
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-06-01",
});


const builder: ImageUrlBuilder = imageUrlBuilder(client);


export function urlFor(source: any) {
  return builder.image(source);
}
