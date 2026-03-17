import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClearCare — Medical Clarity for Caregivers",
    short_name: "ClearCare",
    description:
      "Decode hospital discharge papers and fight medical billing errors with Gemini AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#0D6E6E",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
