import { getDishes } from "./menu/dishes";
import { getServerEnv } from "@/lib/env";

export default async function sitemap() {
  const siteUrl = getServerEnv().SITE_URL.replace(/\/+$/, "");
  const dishes = await getDishes();

  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/menu`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...dishes.map((dish) => ({
      url: `${siteUrl}/menu/${dish.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}
