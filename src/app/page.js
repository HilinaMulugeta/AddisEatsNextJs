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
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#13251f] text-white shadow-xl">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="relative grid min-h-[34rem] items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_0.92fr] lg:gap-12 lg:p-14">
          <div className="relative z-10 max-w-xl py-4 lg:py-8">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold tracking-wide text-amber-100">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber-400" />
              Traditional Habesha cuisine
            </div>
            <h1 className="max-w-lg text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Taste the soul
              <span className="mt-1 block font-serif font-medium italic text-amber-300">
                of Addis Ababa.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              From sizzling Tibs and slow-simmered Doro Wot to tender Kitfo and
              warm Chechebsa. Browse the menu, create your account, and follow
              your order status.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-[#17251f] shadow-lg shadow-black/10 transition hover:bg-amber-300"
              >
                Explore the menu <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/cart"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View your cart
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="text-amber-300">✦</span>
                Made with Habesha flavor
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="text-amber-300">⌖</span>
                Addis Ababa, Ethiopia
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-amber-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#26352e] p-2 shadow-2xl">
              <div className="relative aspect-[4/4.35] overflow-hidden rounded-[1.2rem] bg-[#26352e]">
                <Image
                  src={featured[0].image}
                  alt={featured[0].imageAlt}
                  fill
                  sizes="(max-width: 1023px) min(90vw, 560px), 44vw"
                  quality={75}
                  priority
                  fetchPriority="high"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      A local favorite
                    </p>
                    <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                      {featured[0].name}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm">
                    {featured[0].price} ETB
                  </span>
                </div>
              </div>
            </div>
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
