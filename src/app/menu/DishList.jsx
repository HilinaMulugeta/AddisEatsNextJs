import DishCard from "./DishCard";

export default function DishList({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium">No dishes found matching this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish, index) => (
        <DishCard key={dish.id} dish={dish} priority={index === 0} />
      ))}
    </div>
  );
}
