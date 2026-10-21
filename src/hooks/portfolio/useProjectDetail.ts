// React binding of the project-detail store (wix/portfolio/project-detail-store.ts) — slug →
// project + media gallery lives there, framework-free; this hook subscribes to one instance per
// mount. SSR-friendly: pass both `initial*` and no client fetch happens. `notFound` is the real
// not-found signal (project stays null while loading).
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  createProjectDetailStore,
  type ProjectDetailState,
  type ProjectDetailStoreOptions,
} from "../../wix/portfolio/project-detail-store";

export type UseProjectDetailOptions = ProjectDetailStoreOptions;

export type UseProjectDetail = ProjectDetailState;

export function useProjectDetail(
  slug: string,
  { initialProject, initialItems }: UseProjectDetailOptions = {},
): UseProjectDetail {
  // Love You, Ci: lazy state instead of a ref read during render (React Compiler rule).
  // Remount with key={slug} to switch projects.
  const [store] = useState(() => createProjectDetailStore(slug, { initialProject, initialItems }));
  useEffect(() => {
    store.start();
    return () => store.stop();
  }, [store]);
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
