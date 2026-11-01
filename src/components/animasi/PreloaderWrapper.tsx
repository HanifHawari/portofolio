"use client";

import { useEffect, useState } from "react";

// Panel animation: 1.6s total
// 0–35%  : panels slide IN from top & bottom → meet at center
// 35–58% : hold
// 58–100%: panels slide OUT → page revealed

export default function PreloaderWrapper({ navbar, children }: { navbar: React.ReactNode; children: React.ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const fadeIn: React.CSSProperties = {
    opacity: phase === "done" ? 1 : 0,
    visibility: phase === "loading" ? "hidden" : "visible",
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase("reveal");
      setTimeout(() => setPhase("done"), 750);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Two-panel curtain — stays mounted during reveal + done so animation completes */}
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
          ...fadeIn,
          // "none" when done: any other transform makes this div the containing block
          // for position:fixed descendants (the modals), so they would scroll with the page
          transform:  phase === "done" ? "none" : "scale(0.97) translateY(16px)",
          transition: phase === "done"
            ? "opacity 0.95s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)"
            : "none",
        }}
      >
        {children}
      </div>

      {/* The fixed navbar only fades in: the content's transform above would trap it, so it
          scrolled away if the visitor scrolled during the reveal. Rendered after the content
          so it paints on top while both are still fading in. */}
      <div
        style={{
          ...fadeIn,
          transition: phase === "done" ? "opacity 0.95s cubic-bezier(0.22,1,0.36,1)" : "none",
        }}
      >
        {navbar}
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
