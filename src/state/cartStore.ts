import { create } from "zustand";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: CartItem) => void;
  remove: (packId: string, licenseId: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "naifos_cart_v1";

function loadInitial(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode, quota) — cart just won't survive reload */
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadInitial(),
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  add: (item) => {
    const exists = get().items.some(
      (i) => i.packId === item.packId && i.licenseId === item.licenseId,
    );
    if (exists) {
      set({ isOpen: true });
      return;
    }
    const items = [...get().items, item];
    persist(items);
    set({ items, isOpen: true });
  },
  remove: (packId, licenseId) => {
    const items = get().items.filter(
      (i) => !(i.packId === packId && i.licenseId === licenseId),
    );
    persist(items);
    set({ items });
  },
  clear: () => {
    persist([]);
    set({ items: [] });
  },
}));
