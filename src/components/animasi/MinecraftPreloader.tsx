"use client";

import { useEffect, useState, useRef } from "react";

const BLOCKS = [
  ...[...Array(5)].flatMap((_, x) =>
    [...Array(5)].map((_, y) => ({ x, y, z: 0, type: "ground" }))
  ),
];

const BLOCK_COLORS: Record<string, { top: string; left: string; right: string }> = {
  ground: { top: "#27272a", left: "#18181b", right: "#1c1c1f" },
};

const TERMINAL_STEPS = [
  { text: "> Booting HANIF OS v2.0 ...        ", delay: 400  },
  { text: "> Importing Next.js          [OK]  ", delay: 1000 },
  { text: "> Importing React            [OK]  ", delay: 1500 },
  { text: "> Importing TypeScript       [OK]  ", delay: 2000 },
  { text: "> Importing Framer Motion    [OK]  ", delay: 2500 },
  { text: "> Compiling portfolio ...          ", delay: 2900 },
  { text: "> creativity.exe            [OK]   ", delay: 3300 },
  { text: "> imagination.dll           [OK]   ", delay: 3700 },
  { text: "> SYSTEM READY ✓                   ", delay: 4000 },
];

const ISO_SIZE = 24;

function project(x: number, y: number, z: number) {
  return {
    sx: (x - y) * ISO_SIZE,
    sy: (x + y) * ISO_SIZE * 0.5 - z * ISO_SIZE,
  };
}

const SORTED_BLOCKS = [...BLOCKS].sort((a, b) => a.z - b.z || a.x - b.x);

export default function MinecraftPreloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress]       = useState(0);
  const [visible, setVisible]         = useState<string[]>([]);
  const [termLines, setTermLines]     = useState<string[]>([]);
  const [exiting, setExiting]         = useState(false);
  const doneRef = useRef(false);


  // Build blocks one by one — 160ms per block × 25 blocks = 4000ms (synced with terminal)
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i >= SORTED_BLOCKS.length) { clearInterval(id); return; }
      const b = SORTED_BLOCKS[i];
      setVisible(prev => [...prev, `${b.x},${b.y},${b.z}`]);
      setProgress(Math.round(((i + 1) / SORTED_BLOCKS.length) * 100));
      i++;
    }, 160);
    return () => clearInterval(id);
  }, []);

  // Terminal typewriter
  useEffect(() => {
    const timers = TERMINAL_STEPS.map((step, idx) =>
      setTimeout(() => {
        setTermLines(prev => [...prev, step.text]);
        if (idx === TERMINAL_STEPS.length - 1 && !doneRef.current) {
          doneRef.current = true;
          setTimeout(() => {
            setExiting(true);
            setTimeout(onDone, 500); // call parent after exit anim
          }, 550);
        }
      }, step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  // Canvas bounds
  const allPts = BLOCKS.map(({ x, y, z }) => project(x, y, z));
  const minSx = Math.min(...allPts.map(p => p.sx));
  const maxSx = Math.max(...allPts.map(p => p.sx)) + ISO_SIZE * 2;
  const minSy = Math.min(...allPts.map(p => p.sy));
  const maxSy = Math.max(...allPts.map(p => p.sy)) + ISO_SIZE;
  const canvasW = maxSx - minSx + 20;
  const canvasH = maxSy - minSy + 30;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "#0a0a0a",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.06)" : "scale(1)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
      }} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "radial-gradient(ellipse 55% 40% at 50% 50%, rgba(120,120,120,0.04) 0%, transparent 70%)",
      }} />

      {/* Card */}
      <div
        className="relative flex flex-col md:flex-row overflow-hidden rounded-2xl"
        style={{
          border: "1px solid #27272a",
          maxWidth: 800,
          width: "95vw",
          background: "#0f0f0f",
          boxShadow: "0 0 60px rgba(100,100,100,0.12), 0 30px 60px rgba(0,0,0,0.9)",
        }}
      >
        {/* ── Left: Voxel World ── */}
        <div
          className="flex flex-col items-center justify-center p-6"
          style={{ flex: "0 0 55%" }}
        >
          <p className="text-[10px] tracking-[0.35em] uppercase mb-5 font-mono" style={{ color: "#52525b" }}>
            Building World...
          </p>

          <div style={{ position: "relative", width: canvasW, height: canvasH }}>
            {SORTED_BLOCKS.map((block, i) => {
              const key = `${block.x},${block.y},${block.z}`;
              const shown = visible.includes(key);
              const { sx, sy } = project(block.x, block.y, block.z);
              const ox = sx - minSx + 10;
              const oy = sy - minSy + 10;
              const c = BLOCK_COLORS[block.type] || BLOCK_COLORS.ground;
              const s = ISO_SIZE;

              return (
                <div key={i} style={{
                  position: "absolute", left: ox, top: oy,
                  width: s * 2, height: s * 2,
                  animation: shown
                    ? "blockDrop 0.38s cubic-bezier(0.22,1,0.36,1) forwards"
                    : "none",
                  opacity: shown ? undefined : 0,
                }}>
                  {/* Top face */}
                  <div style={{
                    position: "absolute", width: s * 2, height: s, top: 0, left: 0,
                    background: c.top,
                    clipPath: "polygon(50% 0%, 100% 25%, 50% 50%, 0% 25%)",
                  }} />
                  {/* Left face */}
                  <div style={{
                    position: "absolute", width: s, height: s, top: s * 0.5, left: 0,
                    background: c.left,
                    clipPath: "polygon(0% 0%, 50% 0%, 50% 50%, 0% 100%)",
                  }} />
                  {/* Right face */}
                  <div style={{
                    position: "absolute", width: s, height: s, top: s * 0.5, right: 0,
                    background: c.right,
                    clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 50%)",
                  }} />
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-7 w-full" style={{ maxWidth: canvasW }}>
            <div className="flex justify-between text-[9px] font-mono mb-1.5" style={{ color: "#52525b" }}>
              <span>BUILDING</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: 3, background: "#1a1a1e", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #7dd3fc)",
                transition: "width 0.14s linear",
                borderRadius: 2,
                boxShadow: "0 0 10px rgba(96,165,250,0.55)",
              }} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: "#1f1f23", alignSelf: "stretch", flexShrink: 0 }} />

        {/* ── Right: Terminal ── */}
        <div className="flex flex-col justify-start p-5" style={{ flex: "1 1 45%" }}>
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 mb-5">
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3f3f46" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3f3f46" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6",
              boxShadow: "0 0 6px rgba(59,130,246,0.7)" }} />
            <span className="ml-2 text-[9px] font-mono tracking-widest" style={{ color: "#52525b" }}>
              HANIF_TERMINAL — bash
            </span>
          </div>

          {/* Lines */}
          <div className="flex flex-col gap-2" style={{ minHeight: 220 }}>
            {termLines.map((line, i) => (
              <p key={i} className="text-[11px] font-mono"
                style={{
                  color: line.includes("[OK]") ? "#4ade80"
                    : line.includes("READY") ? "#60a5fa"
                    : line.includes("v2.0")  ? "#a1a1aa"
                    : "#71717a",
                  animation: "termLine 0.22s ease forwards",
                  opacity: 0,
                  whiteSpace: "pre",
                }}
              >
                {line}
              </p>
            ))}
            {/* Blinking cursor */}
            <span style={{
              display: "inline-block", width: 7, height: 13,
              background: "#3b82f6",
              boxShadow: "0 0 5px rgba(59,130,246,0.8)",
              animation: "blink 1s step-end infinite",
              marginTop: 2,
            }} />
          </div>

          <div className="mt-auto pt-4" style={{ borderTop: "1px solid #1a1a1e" }}>
            <p className="text-[9px] font-mono tracking-widest" style={{ color: "#2d2d32" }}>
              MUHAMMAD HANIF HAWARI © 2026
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blockDrop {
          0%   { opacity: 0; transform: translateY(-16px) scale(0.72); }
          65%  { opacity: 1; transform: translateY(4px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes termLine {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
