export const dishes = [
  {
    id: "kitfo",
    name: "Kitfo",
    price: 1200,
    category: "Main",
    image: "/images/dishes/Kitfo.jpg",
    imageWidth: 1080,
    imageHeight: 1350,
    imageAlt: "Kitfo Ethiopian beef dish with mitmita and spiced butter",
    spicy: true,
    availableToday: true,
    description:
      "Finely minced extra-lean beef warmed gently in mitmita spice and pure niter kibbeh, traditionally served with ayib and gomen.",
  },
  {
    id: "doro",
    name: "Doro Wot",
    price: 1350,
    category: "Main",
    image: "/images/dishes/Doro.jpg",
    imageWidth: 1080,
    imageHeight: 1080,
    imageAlt: "Doro Wot Ethiopian chicken stew with berbere and egg",
    spicy: true,
    availableToday: true,
    description:
      "A festive, slow-cooked spicy chicken stew simmered in rich berbere spice blend and authentic spiced butter, accompanied by a hard-boiled egg.",
  },
  {
    id: "chechebsa",
    name: "Chechebsa",
    price: 400,
    category: "Breakfast",
    image: "/images/dishes/Chechebsa.jpg",
    imageWidth: 1000,
    imageHeight: 1500,
    imageAlt: "Chechebsa Ethiopian breakfast flatbread",
    spicy: false,
    availableToday: true,
    description:
      "Shredded, pan-fried kitcha flatbread tossed softly in fragrant niter kibbeh spiced butter and a touch of berbere, served warm.",
  },
  {
    id: "tibs",
    name: "Special Tibs",
    price: 950,
    category: "Main",
    image: "/images/dishes/Tibs.jpg",
    imageWidth: 1200,
    imageHeight: 960,
    imageAlt: "Sizzling Ethiopian tibs with onions and peppers",
    spicy: true,
    availableToday: true,
    description:
      "Tender beef cubes sautéed with rosemary, red onions, garlic, and sliced jalapeño peppers, served sizzling hot.",
  },
  {
    id: "dulet",
    name: "Dulet",
    price: 500,
    category: "Breakfast",
    image: "/images/dishes/Dulet.jpg",
    imageWidth: 960,
    imageHeight: 960,
    imageAlt: "Dulet traditional Ethiopian breakfast",
    spicy: false,
    availableToday: true,
    description:
      "A traditional, finely minced breakfast mixture of lean beef, tripe, and liver sautéed with spiced butter, garlic, and hot green peppers.",
  },
  {
    id: "chips",
    name: "Chips",
    price: 550,
    category: "Side",
    image: "/images/dishes/Chips.jpg",
    imageWidth: 736,
    imageHeight: 1313,
    imageAlt: "Crispy golden potato chips",
    spicy: false,
    availableToday: true,
    description:
      "Crispy, golden-fried potato chips seasoned lightly with salt, perfect as a quick snack or a crunchy side dish.",
  },
  {
    id: "burger",
    name: "Addis Special Burger",
    price: 850,
    category: "Burgers",
    image: "/images/dishes/Burger.jpg",
    imageWidth: 736,
    imageHeight: 1308,
    imageAlt: "Addis special burger with beef patty and fresh vegetables",
    spicy: false,
    availableToday: false,
    description:
      "A juicy, grilled beef patty layered inside a soft bun with crisp lettuce, fresh tomatoes, onions, and signature house sauce.",
  },
  {
    id: "fetira",
    name: "Fetira with Honey",
    price: 300,
    category: "Breakfast",
    image: "/images/dishes/Fetira.jpg",
    imageWidth: 445,
    imageHeight: 845,
    imageAlt: "Fetira Ethiopian layered flatbread served with honey",
    spicy: false,
    availableToday: true,
    description:
      "Crispy, layered pastry flatbread served warm, commonly enjoyed drizzled with sweet honey or cooked with an egg filling.",
  },
  {
    id: "mahberawi",
    name: "Mahberawi Platter",
    price: 2850,
    category: "Main",
    image: "/images/dishes/Mahberawi.jpg",
    imageWidth: 736,
    imageHeight: 981,
    imageAlt: "Mahberawi Ethiopian combination platter over injera",
    spicy: false,
    availableToday: true,
    description:
      "A grand, celebratory combination platter featuring an assortment of key meat dishes like tibs, wot, and kitfo served together over injera.",
  },
  {
    id: "icecream",
    name: "Strawberry Ice Cream",
    price: 250,
    category: "Dessert",
    image: "/images/dishes/IceCream.jpg",
    imageWidth: 736,
    imageHeight: 1104,
    imageAlt: "Strawberry ice cream dessert",
    spicy: false,
    availableToday: true,
    description:
      "Smooth and creamy chilled ice cream, offering a sweet and refreshing finish to clear the palate after a spicy meal.",
  },
];

export async function getDishes() {
  return dishes;
}

export async function getCategories() {
  return ["All", ...new Set(dishes.map((dish) => dish.category))];
}

export async function getDishPage({ query = "", category = "All", page = 1, limit = 4 } = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = dishes.filter((dish) => {
    const matchesCategory = category === "All" || dish.category === category;
    const searchableText = `${dish.name} ${dish.description} ${dish.category}`.toLocaleLowerCase();
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
  const safeLimit = Math.max(1, Math.floor(Number(limit) || 4));
  const requestedPage = Math.floor(Number(page));
  const totalPages = Math.max(1, Math.ceil(filtered.length / safeLimit));
  const safePage = Math.min(Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1), totalPages);

  return {
    items: filtered.slice((safePage - 1) * safeLimit, safePage * safeLimit),
    page: safePage,
    limit: safeLimit,
    total: filtered.length,
    totalPages,
  };
}

export async function getDish(id) {
  if (!id) return null;
  const normalized = id.toLowerCase().trim();
  return (
    dishes.find(
      (d) => d.id.toLowerCase() === normalized || d.id === `dish-${normalized}`,
    ) || null
  );
}
