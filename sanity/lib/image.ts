import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";
import { SanityImage } from "../../sanity.types";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImage) {
  return builder.image(source);
}