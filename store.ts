import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity/sanity.types"; // adjust the path if needed

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  favoriteProduct: Product[];

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;

  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];

  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

// Helper to calculate discounted price
const calculateDiscountedPrice = (product: Product) => {
  const price = product.price ?? 0;
  const discount = ((product.discount ?? 0) * price) / 100;
  return price - discount;
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce<CartItem[]>((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, []),
        })),

      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter(({ product }) => product._id !== productId),
        })),

      resetCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce((total, item) => {
          const discountedPrice = calculateDiscountedPrice(item.product);
          return total + discountedPrice * item.quantity;
        }, 0),

      getSubTotalPrice: () =>
        get().items.reduce((total, item) => {
          const discountedPrice = calculateDiscountedPrice(item.product);
          return total + discountedPrice * item.quantity;
        }, 0),

      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,

      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item._id === product._id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter((item) => item._id !== product._id)
                : [...state.favoriteProduct, product],
            };
          });
          resolve();
        });
      },

      removeFromFavorite: (productId: string) =>
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item._id !== productId
          ),
        })),

      resetFavorite: () => set({ favoriteProduct: [] }),
    }),
    {
      name: "cart-store",
    }
  )
);

export default useStore;
