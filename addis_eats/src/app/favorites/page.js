import FavoriteList from "./FavoriteList";
import { getDishes } from "../menu/dishes";

export const metadata = {
  title: "Your favorite dishes",
  description: "Your locally saved Addis Eats dishes.",
  robots: { index: false, follow: false },
};

export default async function FavoritesPage() {
  const dishes = await getDishes();

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Favorite dishes</h1>
        <p className="mt-1 text-sm text-slate-600">Keep the dishes you want to find again.</p>
      </header>
      <FavoriteList dishes={dishes} />
    </div>
  );
}
