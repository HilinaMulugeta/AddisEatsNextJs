import { getServerEnv } from "@/lib/env";

export default function robots() {
  const siteUrl = getServerEnv().SITE_URL.replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/api/",
        "/cart",
        "/checkout",
        "/login",
        "/signup",
        "/orders",
        "/profile",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
