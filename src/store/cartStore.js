import { create } from "zustand";
import { persist } from "zustand/middleware";



export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      addItem(product) {
        const items = get().items;
        const alreadyInCart = items.find((i) => i.productId === product.productId);

        if (alreadyInCart) {
          set({
            items: items.map((i) =>
              i.productId === product.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem(productId) {
        const items = get().items;
        const item = items.find((i) => i.productId === productId);
        if (!item) return;

        if (item.quantity === 1) {
          set({ items: items.filter((i) => i.productId !== productId) });
        } else {
          set({
            items: items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          });
        }
      },

      // Remove a product from the cart entirely, no matter the quantity.
      deleteItem(productId) {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      // Wipe the whole cart.
      clearCart() {
        set({ items: [] });
      },
    }),
    {
      name: "purely-store-cart", // the key used in localStorage
    }
  )
);

// ─── Selector helpers ────────────────────────────────────────────────────────
// Pass these into useCart() so components only re-render when the value changes.
//
//   const totalQuantity = useCart(selectTotalQuantity);
//   const totalPrice    = useCart(selectTotalPrice);

export const selectTotalQuantity = (state) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);


