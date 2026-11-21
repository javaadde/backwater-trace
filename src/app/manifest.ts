import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Backwater",
    description: SITE.short,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F7F3EA",
    theme_color: "#24428F",
    icons: [{ src: "/brand/backwater-trace-mark.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
