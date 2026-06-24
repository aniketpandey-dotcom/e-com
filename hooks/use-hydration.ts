import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useHydration() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
