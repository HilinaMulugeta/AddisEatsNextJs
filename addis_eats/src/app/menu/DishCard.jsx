import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import { etb } from "@/lib/format";

export default function DishCard({ dish, priority = false }) {
  return (
    <div
      data-dish-card
      data-category={dish.category}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
    >
      <div className="group relative h-44 w-full overflow-hidden bg-slate-100">
        <Link
          href={`/menu/${dish.id}`}
          prefetch={false}
          aria-label={`${dish.spicy ? "🌶️ Spicy " : ""}${dish.category}. View ${dish.name} details`}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          <Image
            src={dish.image}
            alt={dish.imageAlt}
            width={dish.imageWidth}
            height={dish.imageHeight}
            sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1023px) calc(50vw - 1.5rem), (max-width: 1279px) calc((100vw - 20.5rem) / 3), 270px"
            quality={priority ? 55 : 65}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
          {dish.spicy && (
            <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow">
              🌶️ Spicy
            </span>
          )}
          <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {dish.category}
          </span>
        </Link>
        <FavoriteButton dishId={dish.id} dishName={dish.name} />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <h3 className="min-w-0 font-bold text-slate-900 text-base">{dish.name}</h3>
            <span className="shrink-0 font-extrabold text-amber-700 text-sm">{etb.format(dish.price)}</span>
          </div>
          <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">{dish.description}</p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between border-t border-slate-100 gap-2">
          <span
            className={`text-[11px] font-semibold ${
              dish.availableToday ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            {dish.availableToday ? "● Available Today" : "○ Sold Out"}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href={`/menu/${dish.id}`}
              prefetch={false}
              className="inline-flex min-h-11 items-center text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              View
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
    </div>
  );
}
