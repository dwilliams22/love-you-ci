// React binding of the services store (wix/bookings/services-store.ts) — the listing state lives
// there, framework-free; this hook subscribes to one instance per mounted listing and exposes its
// state and actions under one name. SSR-friendly: pass server-fetched data as `initial*` (Astro
// frontmatter / server component) and no client fetch happens for the first paint; a SPA passes
// nothing. Astro islands and React SPAs use this; a static page, Vue, or Svelte uses the store directly.
import { useEffect, useState, useSyncExternalStore } from "react";
import { createServicesStore, type ServicesState, type ServicesStore, type ServicesStoreOptions } from "../../wix/bookings/services-store";

export type UseServicesOptions = ServicesStoreOptions;

export type UseServices = ServicesState & Pick<ServicesStore, "setActiveCategoryId" | "setActiveLocationId" | "loadMore">;

export function useServices(options: UseServicesOptions = {}): UseServices {
  // Love You, Ci: lazy state instead of a ref read during render (React Compiler rule)
  const [store] = useState(() => createServicesStore(options));
  useEffect(() => {
    store.start();
    return () => store.stop();
  }, [store]);
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  return { ...state, setActiveCategoryId: store.setActiveCategoryId, setActiveLocationId: store.setActiveLocationId, loadMore: store.loadMore };
}
