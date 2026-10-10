import MenuExplorer from "./MenuExplorer";
import { getCategories, getDishPage } from "./dishes";

export const metadata = {
  title: "Ethiopian food menu",
  description:
    "Explore Addis Eats favorites: Ethiopian breakfast, Doro Wot, Kitfo, Tibs, sides and desserts, made fresh in Addis Ababa.",
  alternates: { canonical: "/menu" },
  openGraph: {
    type: "website",
    title: "Ethiopian food menu | Addis Eats",
    description:
      "Explore Ethiopian breakfast, Doro Wot, Kitfo, Tibs, sides and desserts, made fresh in Addis Ababa.",
    url: "/menu",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Addis Eats Ethiopian food delivery in Addis Ababa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethiopian food menu | Addis Eats",
    description:
      "Explore Ethiopian breakfast, Doro Wot, Kitfo, Tibs, sides and desserts, made fresh in Addis Ababa.",
    images: ["/opengraph-image"],
  },
};

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";
  const requestedCategory = typeof params?.category === "string" ? params.category : "All";
  const requestedPage = Number(params?.page ?? 1);
  const categories = await getCategories();
  const category = categories.includes(requestedCategory) ? requestedCategory : "All";
  const initialPage = await getDishPage({ query, category, page: requestedPage, limit: 4 });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Authentic Menu</h1>
        <p className="text-slate-500 text-xs mt-1">
          Search and browse live results. The first page is server-rendered, then SWR revalidates it in the background.
        </p>
      </div>

      <MenuExplorer
        categories={categories}
        initialPage={initialPage}
        initialQuery={query}
        initialCategory={category}
      />
    </div>
  );
}
