"use client";

import { Studio } from "sanity";
import config from "@/sanity/sanity.config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StudioPage() {
  return <Studio config={config} />;
}
