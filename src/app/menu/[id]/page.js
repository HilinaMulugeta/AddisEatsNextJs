import { getDishes, getDish } from "../dishes";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "../AddToCartButton";
import { getServerEnv } from "@/lib/env";

function jsonLdScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return {
      title: "Dish not found",
      description: "This Addis Eats menu item could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const summary =
    dish.description.length > 100
      ? `${dish.description.slice(0, 97).trimEnd()}...`
      : dish.description;
  const description = `${dish.name}: ${summary} Order for ${dish.price} ETB in Addis Ababa.`;
  const imageUrl = `/menu/${dish.id}/opengraph-image`;

  return {
    title: dish.name,
    description,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: {
      type: "website",
      title: `${dish.name} | Addis Eats`,
      description,
      url: `/menu/${dish.id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${dish.name} Ethiopian food from Addis Eats`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dish.name} | Addis Eats`,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((dish) => ({ id: dish.id }));
}

export const dynamicParams = true;

export default async function DishDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  const siteUrl = getServerEnv().SITE_URL.replace(/\/+$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: new URL(dish.image, siteUrl).href,
    url: new URL(`/menu/${dish.id}`, siteUrl).href,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
      availability: dish.availableToday
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-amber-700 transition"
      >
        ← Back to All Dishes
      </Link>

      <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="relative aspect-[4/3] max-h-[520px] bg-slate-100 sm:aspect-[16/10] md:aspect-auto md:h-[min(68vh,560px)] md:min-h-[420px]">
          <Image
            src={dish.image}
            alt={dish.imageAlt}
            width={dish.imageWidth}
            height={dish.imageHeight}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={65}
            priority
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
          {dish.spicy && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              🌶️ Authentic Spicy
            </span>
          )}
          <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {dish.category}
          </span>
        </div>

        <div className="flex flex-col gap-6 p-5 sm:p-8 md:p-10">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
              {dish.category}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {dish.name}
            </h1>
            <p className="text-3xl font-black text-amber-700 sm:text-4xl">
              {dish.price} <span className="text-xl font-bold">ETB</span>
            </p>
            <p className="max-w-prose text-sm leading-7 text-slate-600">
              {dish.description}
            </p>
            {dish.spicy ? (
              <p className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                🌶️ Spiced with authentic berbere
              </p>
            ) : null}
          </div>

          <div className="mt-auto space-y-4 border-t border-slate-100 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-medium text-slate-500">Today’s availability</span>
              <span
                className={`rounded-full px-3 py-1.5 font-semibold ${dish.availableToday ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
              >
                {dish.availableToday
                  ? "Available Today"
                  : "Currently Unavailable"}
              </span>
            </div>

            <AddToCartButton
              showGoToCart
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
    </div>
  );
}
