// React binding of the shop store (wix/storefront/shop-store.ts) — the listing state machine
// lives there, framework-free; this hook subscribes to one instance per mounted listing and
// exposes its state and actions under one name. Astro islands and React SPAs use this; a static
// page, Vue, or Svelte uses the store directly.
import { useEffect, useState, useSyncExternalStore } from "react";
import { createShopStore, type ShopState, type ShopStore, type ShopStoreOptions } from "../../wix/storefront/shop-store";

export { SORTS, type ShopFilters } from "../../wix/storefront/shop-store";

export type UseShopOptions = ShopStoreOptions;

export type UseShop = ShopState &
  Pick<ShopStore, "setActiveCategoryId" | "setSort" | "setFilters" | "toggleChoice" | "clearFilters" | "retry" | "loadMore">;

export function useShop(options: UseShopOptions = {}): UseShop {
  // Love You, Ci: lazy state instead of a ref read during render (React Compiler rule).
  const [store] = useState(() => createShopStore(options));
  useEffect(() => {
    store.start();
    return () => store.stop();
  }, [store]);
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  return {
    ...state,
    setActiveCategoryId: store.setActiveCategoryId,
    setSort: store.setSort,
    setFilters: store.setFilters,
    toggleChoice: store.toggleChoice,
    clearFilters: store.clearFilters,
    retry: store.retry,
    loadMore: store.loadMore,
  };
}
