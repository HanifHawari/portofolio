"use client";

import { useEffect, useState } from "react";

export default function MinecraftPreloader({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setExiting(true);
    const t = setTimeout(onDone, 500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{
        background: "#0a0a0a",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.06)" : "scale(1)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        pointerEvents: exiting ? "none" : "all",
      }}
    />
  );
}
