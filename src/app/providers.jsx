"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "addis-eats-cart";
const EMPTY_CART = "[]";

function readCart(raw) {
  const parsed = JSON.parse(raw);
  if (
    !Array.isArray(parsed) ||
    parsed.some(
      (item) =>
        typeof item.id !== "string" ||
        typeof item.name !== "string" ||
        !Number.isFinite(item.price) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        typeof item.image !== "string",
    )
  ) {
    throw new Error("Saved cart has an invalid shape");
  }
  return parsed;
}

function subscribeToCart(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("addis-eats-cart-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("addis-eats-cart-change", callback);
  };
}

function getCartSnapshot() {
  return window.localStorage.getItem(CART_STORAGE_KEY) || EMPTY_CART;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}

export function Providers({ children }) {
  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const [writeError, setWriteError] = useState(null);
  const cartState = useMemo(() => {
    try {
      return { items: readCart(cartSnapshot), error: null };
    } catch {
      return {
        items: [],
        error: "Your saved cart could not be loaded. Clear this browser's saved cart to continue.",
      };
    }
  }, [cartSnapshot]);
  const items = cartState.items;
  const storageError = writeError || cartState.error;

  const updateStoredItems = useCallback((update) => {
    try {
      const current = readCart(window.localStorage.getItem(CART_STORAGE_KEY) || EMPTY_CART);
      const nextItems = update(current);
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
      setWriteError(null);
      window.dispatchEvent(new Event("addis-eats-cart-change"));
    } catch {
      setWriteError("Your cart could not be saved. Check browser storage and try again.");
    }
  }, []);

  const addItem = useCallback((dish) => {
    updateStoredItems((current) => {
      const existing = current.find((item) => item.id === dish.id);
      if (existing) {
        return current.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...current,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          image: dish.image,
          imageWidth: dish.imageWidth,
          imageHeight: dish.imageHeight,
          imageAlt: dish.imageAlt,
        },
      ];
    });
  }, [updateStoredItems]);

  const updateQuantity = useCallback((id, delta) => {
    updateStoredItems((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        })
        .filter(Boolean),
    );
  }, [updateStoredItems]);

  const clearCart = useCallback(() => updateStoredItems(() => []), [updateStoredItems]);
  const clearCartStorage = useCallback(() => {
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      setWriteError(null);
      window.dispatchEvent(new Event("addis-eats-cart-change"));
    } catch {
      setWriteError("Your saved cart could not be cleared in this browser.");
    }
  }, []);

  const value = useMemo(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    return {
      items,
      addItem,
      updateQuantity,
      clearCart,
      clearCartStorage,
      storageError,
      count,
      subtotal,
    };
  }, [items, addItem, updateQuantity, clearCart, clearCartStorage, storageError]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside Providers");
  }
  return ctx;
}
