import { getDish } from "@/app/menu/dishes";
import { DELIVERY_FEE_ETB } from "./constants";

export async function resolveOrderItems(requestedItems) {
  const items = [];

  for (const requested of requestedItems) {
    const dish = await getDish(requested.id);
    if (!dish || !dish.availableToday) return null;

    items.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: requested.quantity,
      lineTotal: dish.price * requested.quantity,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    items,
    subtotal,
    deliveryFee: DELIVERY_FEE_ETB,
    total: subtotal + DELIVERY_FEE_ETB,
  };
}
