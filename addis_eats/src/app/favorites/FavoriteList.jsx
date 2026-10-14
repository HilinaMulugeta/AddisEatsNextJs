import DishCard from "../menu/DishCard";
import FavoriteCard from "./FavoriteCard";
import FavoriteListClient from "./FavoriteListClient";

export default function FavoriteList({ dishes }) {
  return (
    <FavoriteListClient dishIds={dishes.map((dish) => dish.id)}>
      {dishes.map((dish, index) => (
        <FavoriteCard key={dish.id} dishId={dish.id}>
          <DishCard dish={dish} priority={index === 0} />
        </FavoriteCard>
      ))}
    </FavoriteListClient>
  );
}
