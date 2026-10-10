import Link from "next/link";
import { getDishes } from "./menu/dishes";
import Image from "next/image";
import { getServerEnv } from "@/lib/env";
import AddToCartButton from "./menu/AddToCartButton";

export const metadata = {
  alternates: { canonical: "/" },
};

function jsonLdScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function HomePage() {
  const dishes = await getDishes();
  const featured = dishes.slice(0, 3);
  const siteUrl = getServerEnv().SITE_URL.replace(/\/+$/, "");
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Addis Eats",
    url: siteUrl,
    servesCuisine: "Ethiopian",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bole Road",
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
    hasMenu: `${siteUrl}/menu`,
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(restaurantJsonLd) }}
      />
      <section className="bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-5">
          <span className="inline-block bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Traditional Habesha Cuisine
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Taste the Soul of Addis Ababa
          </h1>
          <p className="text-amber-100/90 text-base sm:text-lg leading-relaxed">
            From sizzling Tibs and slow-simmered Doro Wot to tender Kitfo and
            warm Chechebsa. Crafted with authentic spices imported straight from
            Ethiopia.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-6 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
            >
              Explore Full Menu →
            </Link>
            <Link
              href="/cart"
              className="bg-amber-900/60 hover:bg-amber-900/80 text-white border border-amber-400/30 font-semibold px-6 py-3 rounded-xl transition"
            >
              View Order Cart
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Featured Specialties
            </h2>
            <p className="text-slate-500 text-sm">
              Chef favorites prepared fresh every day
            </p>
          </div>
          <Link
            href="/menu"
            className="text-amber-700 hover:text-amber-800 text-sm font-semibold"
          >
            See all dishes →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.imageAlt}
                  width={dish.imageWidth}
                  height={dish.imageHeight}
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(50vw - 1.5rem), (max-width: 1280px) calc(33.333vw - 1.5rem), 360px"
                  quality={65}
                  priority={dish.id === featured[0]?.id}
                  fetchPriority={dish.id === featured[0]?.id ? "high" : undefined}
                  className="h-full w-full object-cover"
                />
                {dish.spicy && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                    🌶️ Spicy
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {dish.name}
                    </h3>
                    <span className="font-extrabold text-amber-700">
                      {dish.price} ETB
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                    {dish.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <Link
                    href={`/menu/${dish.id}`}
                    prefetch={false}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                  >
                    View details
                  </Link>
                  <AddToCartButton
                    available={dish.availableToday}
                    dish={{
                      id: dish.id,
                      name: dish.name,
                      price: dish.price,
                      image: dish.image,
                      imageWidth: dish.imageWidth,
                      imageHeight: dish.imageHeight,
                      imageAlt: dish.imageAlt,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
