import { useEffect } from "react";

// Shared across every caller so closing one overlay doesn't re-enable page
// scrolling while another (a modal or the mobile menu) is still open.
let scrollLocks = 0;

/** Disables page scrolling while `locked` is true. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    // Lock <html>, not <body>: globals.css gives html `overflow-x: hidden`, which
    // makes html the page's scroll container, so overflow on body does nothing.
    const root = document.documentElement;
    scrollLocks++;
    root.style.overflow = "hidden";
    return () => {
      scrollLocks--;
      if (scrollLocks === 0) root.style.overflow = "";
    };
  }, [locked]);
}

/** Calls `onEscape` when the Escape key is pressed while `active` is true. */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, onEscape]);
}
