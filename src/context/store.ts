import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seed, coupons, type Product } from "@/data/products";

export interface CartItem { id: string; qty: number; color?: string | undefined; size?: string | undefined }

interface StoreState {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  coupon: string | null;
  cartOpen: boolean;
  quickView: string | null;
  setCartOpen: (o: boolean) => void;
  setQuickView: (id: string | null) => void;
  addToCart: (id: string, qty?: number, color?: string, size?: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  applyCoupon: (code: string) => boolean;
  // admin
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: seed,
      cart: [],
      wishlist: [],
      coupon: null,
      cartOpen: false,
      quickView: null,
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setQuickView: (quickView) => set({ quickView }),
      addToCart: (id, qty = 1, color, size) =>
        set((s) => {
          const ex = s.cart.find((c) => c.id === id);
          return { cart: ex ? s.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c)) : [...s.cart, { id, qty, color, size }] };
        }),
      updateQty: (id, qty) => set((s) => ({ cart: qty <= 0 ? s.cart.filter((c) => c.id !== id) : s.cart.map((c) => (c.id === id ? { ...c, qty } : c)) })),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
      clearCart: () => set({ cart: [], coupon: null }),
      toggleWishlist: (id) => set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] })),
      applyCoupon: (code) => {
        const c = code.trim().toUpperCase();
        if (coupons[c]) { set({ coupon: c }); return true; }
        return false;
      },
      upsertProduct: (p) => set((s) => ({ products: s.products.some((x) => x.id === p.id) ? s.products.map((x) => (x.id === p.id ? p : x)) : [p, ...s.products] })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((x) => x.id !== id), cart: s.cart.filter((c) => c.id !== id) })),
    }),
    { name: "zeeshan-store", skipHydration: true, partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, coupon: s.coupon, products: s.products }) },
  ),
);

export function useCartTotals() {
  const { cart, products, coupon } = useStore();
  const lines = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.id)! }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
  const discount = coupon ? subtotal * (coupons[coupon] ?? 0) : 0;
  const shipping = subtotal === 0 || subtotal > 200 ? 0 : 15;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;
  const count = lines.reduce((a, l) => a + l.qty, 0);
  return { lines, subtotal, discount, shipping, tax, total, count };
}

export const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
