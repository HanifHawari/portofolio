"use client";

import { useState } from "react";
import MinecraftPreloader from "@/components/animasi/MinecraftPreloader";

// Panel animation: 1.6s total
// 0–35%  : panels slide IN from top & bottom → meet at center
// 35–58% : hold
// 58–100%: panels slide OUT → page revealed

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  const handlePreloaderDone = () => {
    setPhase("reveal");
    // Switch to done at 750ms — panels are still opening, creating a nice overlap
    setTimeout(() => setPhase("done"), 750);
  };

  return (
    <>
      {/* 1. Preloader */}
      {phase === "loading" && (
        <MinecraftPreloader onDone={handlePreloaderDone} />
      )}

      {/* 2. Two-panel curtain — stays mounted during reveal + done so animation completes */}
      {phase !== "loading" && (
        <div className="fixed inset-0 z-[9998] pointer-events-none">

          {/* ── Top panel ── slides down to center, then back up */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "50%",
              background: "#0a0a0a",
              animation: "topPanelReveal 1.6s cubic-bezier(0.65,0,0.35,1) forwards",
            }}
          >
            {/* Glow line at bottom edge of top panel */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent 0%, rgba(160,160,160,0.7) 30%, rgba(200,200,200,0.9) 50%, rgba(160,160,160,0.7) 70%, transparent 100%)",
              boxShadow: "0 0 12px 3px rgba(150,150,150,0.4)",
            }} />
          </div>

          {/* ── Bottom panel ── slides up to center, then back down */}
          <div
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              height: "50%",
              background: "#0a0a0a",
              animation: "bottomPanelReveal 1.6s cubic-bezier(0.65,0,0.35,1) forwards",
            }}
          >
            {/* Glow line at top edge of bottom panel */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent 0%, rgba(160,160,160,0.7) 30%, rgba(200,200,200,0.9) 50%, rgba(160,160,160,0.7) 70%, transparent 100%)",
              boxShadow: "0 0 12px 3px rgba(150,150,150,0.4)",
            }} />
          </div>
        </div>
      )}

      {/* 3. Main content — rises into view as panels separate */}
      <div
        style={{
          opacity:    phase === "done" ? 1 : 0,
          transform:  phase === "done" ? "scale(1) translateY(0)" : "scale(0.97) translateY(16px)",
          transition: phase === "done"
            ? "opacity 0.95s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)"
            : "none",
          visibility: phase === "loading" ? "hidden" : "visible",
        }}
      >
        {phase !== "loading" ? children : null}
      </div>

      <style>{`
        /* Top panel: starts off-screen top → slides to center → slides back up */
        @keyframes topPanelReveal {
          0%   { transform: translateY(-100%); }
          35%  { transform: translateY(0%);    }
          58%  { transform: translateY(0%);    }
          100% { transform: translateY(-100%); }
        }
        /* Bottom panel: starts off-screen bottom → slides to center → slides back down */
        @keyframes bottomPanelReveal {
          0%   { transform: translateY(100%);  }
          35%  { transform: translateY(0%);    }
          58%  { transform: translateY(0%);    }
          100% { transform: translateY(100%);  }
        }
      `}</style>
    </>
  );
}
