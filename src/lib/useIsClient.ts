import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false during the server render and hydration, true afterwards. Use it to read
 * browser-only values (localStorage, the current date) without a hydration mismatch
 * and without calling setState inside an effect.
 */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
