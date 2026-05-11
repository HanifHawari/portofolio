"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

// ── Mood types and their expressions ────────────────────────────────────────
type Mood = "happy" | "laugh" | "angry" | "sleepy" | "scared" | "cool" | "neutral";

const MOODS: { mood: Mood; icon: string; eyeColor: string; mouthShape: string }[] = [
  { mood: "happy",   icon: "😊", eyeColor: "var(--robot-eye)", mouthShape: "smile"   },
  { mood: "laugh",   icon: "😄", eyeColor: "var(--robot-eye)", mouthShape: "laugh"   },
  { mood: "angry",   icon: "😡", eyeColor: "#ef4444",          mouthShape: "frown"   },
  { mood: "sleepy",  icon: "😴", eyeColor: "var(--robot-eye)", mouthShape: "neutral" },
  { mood: "cool",    icon: "😎", eyeColor: "#3b82f6",          mouthShape: "smile"   },
  { mood: "neutral", icon: "🤖", eyeColor: "var(--robot-eye)", mouthShape: "neutral" },
  { mood: "scared",  icon: "😱", eyeColor: "#ef4444",          mouthShape: "open"    },
];

const ROBOT_PERSONALITIES = [
  { icon: "👑", label: "KING",   mood: "happy"   as Mood },
  { icon: "😇", label: "ANGEL",  mood: "happy"   as Mood },
  { icon: "😡", label: "ANGRY",  mood: "angry"   as Mood },
  { icon: "😎", label: "COOL",   mood: "cool"    as Mood },
  { icon: "🤓", label: "NERD",   mood: "neutral" as Mood },
  { icon: "💤", label: "SLEEPY", mood: "sleepy"  as Mood },
  { icon: "🎯", label: "AIM",    mood: "neutral" as Mood },
  { icon: "</>", label: "CODER", mood: "happy"   as Mood },
];

interface RobotState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scared: boolean;
  dragging: boolean;
  baseMood: Mood;
  currentMood: Mood;
  icon: string;
  label: string;
  size: number;
  blinkTimer: number;
  isBlinking: boolean;
  moodTimer: number;
  walkTimer: number;
  walkDir: number; // radians
}

const CANVAS_H = 460;

// ── Mini Geist robot character ────────────────────────────────────────────────
function GeistRobotChar({
  size,
  mood,
  scared,
  dragging,
  isBlinking,
  icon,
  label,
  step,
}: {
  size: number;
  mood: Mood;
  scared: boolean;
  dragging: boolean;
  isBlinking: boolean;
  icon: string;
  label: string;
  step: boolean;
}) {
  const moodData = MOODS.find(m => m.mood === mood) || MOODS[0];

  const eyeScaleY = isBlinking ? 0.05 : (scared ? 1.8 : 1);
  const eyeScaleX = scared ? 1.4 : 1;
  const eyeColor = scared ? "#ef4444" : moodData.eyeColor;

  // Brow position for angry
  const browOffset = mood === "angry" ? -2 : 0;

  return (
    <div style={{ position: "relative", width: size, cursor: dragging ? "grabbing" : "grab", userSelect: "none", touchAction: "none" }}>
      {/* Label above */}
      <div style={{
        textAlign: "center",
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: "0.15em",
        color: scared ? "#ef4444" : "var(--text-muted)",
        marginBottom: 1,
        fontFamily: "monospace",
        opacity: 0.8,
      }}>
        {scared ? "😱 RUN!" : label}
      </div>

      {/* Hat icon */}
      <div style={{ textAlign: "center", fontSize: size * 0.32, lineHeight: 1, marginBottom: -1 }}>
        {icon}
      </div>

      {/* Square body */}
      <motion.div
        animate={
          scared
            ? { y: [0, -5, 0], x: [-2, 2, -2, 0] }
            : mood === "laugh"
            ? { y: [0, -3, 0], rotate: [-1, 1, -1, 0] }
            : { y: [0, -1.5, 0] }
        }
        transition={
          scared
            ? { duration: 0.22, repeat: Infinity }
            : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          width: size,
          height: size * 0.82,
          background: "var(--robot-body)",
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: scared
            ? "1.5px solid rgba(239,68,68,0.7)"
            : mood === "angry"
            ? "1.5px solid rgba(239,68,68,0.3)"
            : "1.5px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Scanline top highlight */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28%", background: "rgba(255,255,255,0.04)", borderRadius: "6px 6px 0 0" }} />

        {/* 3-dots titlebar */}
        <div style={{ position: "absolute", top: 5, left: 5, display: "flex", gap: 2.5 }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
            <div key={i} style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: c, opacity: 0.9 }} />
          ))}
        </div>

        {/* Brows (for angry/scared) */}
        {(mood === "angry" || scared) && (
          <div style={{ display: "flex", gap: size * 0.16, marginBottom: 2, marginTop: browOffset }}>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  width: size * 0.14,
                  height: 2.5,
                  background: "#ef4444",
                  borderRadius: 2,
                  transform: i === 0 ? "rotate(15deg)" : "rotate(-15deg)",
                }}
              />
            ))}
          </div>
        )}

        {/* Eyes */}
        <div style={{ display: "flex", gap: size * 0.16 }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: size * 0.13,
                height: size * 0.13,
                borderRadius: "50%",
                background: eyeColor,
                transform: `scaleY(${eyeScaleY}) scaleX(${eyeScaleX})`,
                transition: "transform 0.08s ease",
                opacity: mood === "sleepy" ? 0.5 : 1,
              }}
            />
          ))}
        </div>

        {/* Mouth */}
        {moodData.mouthShape === "smile" && (
          <div style={{ width: size * 0.38, height: size * 0.16, borderBottom: `2px solid var(--robot-eye)`, borderRadius: "0 0 50px 50px", marginTop: 4, opacity: 0.8 }} />
        )}
        {moodData.mouthShape === "laugh" && (
          <div style={{ width: size * 0.42, height: size * 0.2, borderBottom: `2.5px solid var(--robot-eye)`, borderRadius: "0 0 50px 50px", marginTop: 3, opacity: 0.9, background: "rgba(255,255,255,0.06)" }} />
        )}
        {moodData.mouthShape === "frown" && (
          <div style={{ width: size * 0.35, height: size * 0.14, borderTop: `2px solid #ef4444`, borderRadius: "50px 50px 0 0", marginTop: 6, opacity: 0.9 }} />
        )}
        {moodData.mouthShape === "neutral" && (
          <div style={{ width: size * 0.32, height: 2, background: "var(--robot-eye)", borderRadius: 2, marginTop: 5, opacity: 0.6 }} />
        )}
        {moodData.mouthShape === "open" && (
          <div style={{ width: size * 0.3, height: size * 0.18, borderRadius: "50%", background: "#ef4444", marginTop: 4, opacity: 0.9 }} />
        )}
      </motion.div>

      {/* Feet */}
      <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 1, paddingLeft: size * 0.14, paddingRight: size * 0.14 }}>
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: step === (i === 0) ? -3 : 0,
              rotate: step === (i === 0) ? -12 : 12,
            }}
            transition={{ duration: scared ? 0.06 : 0.18 }}
            style={{
              width: size * 0.22,
              height: size * 0.2,
              background: "var(--robot-body)",
              borderRadius: "2px 2px 4px 4px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GeistVillage() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [robots, setRobots] = useState<RobotState[]>([]);
  const [steps, setSteps] = useState<Record<number, boolean>>({});
  const robotsRef = useRef<RobotState[]>([]);
  const stepsRef = useRef<Record<number, boolean>>({});
  const containerSizeRef = useRef({ w: 900, h: CANVAS_H });
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const cursorRef = useRef({ x: -999, y: -999 });
  const dragRef = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);

  // Initialize robots
  const initRobots = useCallback((w: number) => {
    const newRobots: RobotState[] = ROBOT_PERSONALITIES.map((p, i) => {
      const sz = 44 + (i % 3) * 8;
      return {
        id: i,
        x: 40 + (i % 4) * ((w - 80) / 4) + Math.random() * 30,
        y: 30 + Math.floor(i / 4) * 180 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 50,
        vy: (Math.random() - 0.5) * 30,
        scared: false,
        dragging: false,
        baseMood: p.mood,
        currentMood: p.mood,
        icon: p.icon,
        label: p.label,
        size: sz,
        blinkTimer: Math.random() * 4,
        isBlinking: false,
        moodTimer: Math.random() * 5 + 3,
        walkTimer: Math.random() * 2,
        walkDir: Math.random() * Math.PI * 2,
      };
    });
    robotsRef.current = newRobots;
    const initSteps: Record<number, boolean> = {};
    newRobots.forEach(r => { initSteps[r.id] = false; });
    stepsRef.current = initSteps;
    setRobots([...newRobots]);
    setSteps({ ...initSteps });
  }, []);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      containerSizeRef.current = { w: r.width, h: CANVAS_H };
      if (robotsRef.current.length === 0) initRobots(r.width);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [initRobots]);

  // Animation loop
  useEffect(() => {
    const tick = (now: number) => {
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = now;
      const { w } = containerSizeRef.current;

      let stepsChanged = false;
      const newSteps = { ...stepsRef.current };

      const updated = robotsRef.current.map((r, i, arr) => {
        if (r.dragging) return r;

        let { vx, vy, blinkTimer, isBlinking, moodTimer, walkTimer, walkDir, currentMood } = r;

        // Soft repulsion from other robots
        let repX = 0;
        let repY = 0;
        for (let j = 0; j < arr.length; j++) {
          if (i === j) continue;
          const other = arr[j];
          const dxR = r.x - other.x;
          const dyR = r.y - other.y;
          const distR = Math.sqrt(dxR * dxR + dyR * dyR);
          const minDist = (r.size + other.size) * 0.55; 
          
          if (distR > 0 && distR < minDist) {
            const force = (minDist - distR) / minDist;
            repX += (dxR / distR) * force * 800; // Stronger repulsion push
            repY += (dyR / distR) * force * 800;
          }
        }

        // Attraction to center (very soft) to keep them from hugging walls constantly
        const centerDx = (w / 2) - (r.x + r.size / 2);
        const centerDy = (CANVAS_H / 2) - (r.y + r.size / 2);
        repX += centerDx * 0.8;
        repY += centerDy * 0.8;

        // Blink logic
        blinkTimer -= dt;
        if (blinkTimer <= 0) {
          isBlinking = !isBlinking;
          blinkTimer = isBlinking ? 0.12 : (2.5 + Math.random() * 3);
        }

        // Mood timer
        moodTimer -= dt;
        if (moodTimer <= 0) {
          moodTimer = 4 + Math.random() * 6;
          const availMoods: Mood[] = ["happy", "laugh", "neutral", "cool"];
          if (r.baseMood === "angry") availMoods.push("angry");
          if (r.baseMood === "sleepy") availMoods.push("sleepy");
          currentMood = availMoods[Math.floor(Math.random() * availMoods.length)];
        }

        // Walk direction change
        walkTimer -= dt;
        if (walkTimer <= 0) {
          walkTimer = 1.0 + Math.random() * 2.5;
          walkDir = Math.random() * Math.PI * 2;
        }

        // Autonomous wander (increased base speed drastically to overcome friction)
        const walkSpeed = currentMood === "sleepy" ? 300 : currentMood === "angry" ? 900 : 500;
        vx += (Math.cos(walkDir) * walkSpeed + repX) * dt;
        vy += (Math.sin(walkDir) * walkSpeed + repY) * dt;

        const friction = 0.95; // Less friction so they slide more naturally
        vx *= friction;
        vy *= friction;

        const maxSpeed = currentMood === "sleepy" ? 60 : currentMood === "angry" ? 180 : 120;
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > maxSpeed) { vx = (vx / speed) * maxSpeed; vy = (vy / speed) * maxSpeed; }

        let nx = r.x + vx * dt;
        let ny = r.y + vy * dt;
        const maxX = w - r.size;
        const maxY = CANVAS_H - r.size * 1.2;

        // Step toggle (foot animation)
        const stepThreshold = 5;
        if (speed > stepThreshold) {
          const oldStep = stepsRef.current[r.id];
          if (Math.random() < dt * (speed / 15)) {
            newSteps[r.id] = !oldStep;
            stepsChanged = true;
          }
        }

        // Bounce off walls instead of just stopping
        if (nx < 0) { nx = 0; vx = Math.abs(vx) * 0.9; walkDir = Math.random() * Math.PI - Math.PI / 2; }
        if (nx > maxX) { nx = maxX; vx = -Math.abs(vx) * 0.9; walkDir = Math.random() * Math.PI + Math.PI / 2; }
        if (ny < 0) { ny = 0; vy = Math.abs(vy) * 0.9; }
        if (ny > maxY) { ny = maxY; vy = -Math.abs(vy) * 0.9; }

        return { ...r, x: nx, y: ny, vx, vy, currentMood, blinkTimer, isBlinking, moodTimer, walkTimer, walkDir };
      });

      robotsRef.current = updated;
      if (stepsChanged) {
        stepsRef.current = newSteps;
        setSteps({ ...newSteps });
      }
      setRobots([...updated]);
      rafRef.current = requestAnimationFrame(tick);
    };

    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Cursor tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => { cursorRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { cursorRef.current = { x: -999, y: -999 }; };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("mousemove", onMove); document.removeEventListener("mouseleave", onLeave); };
  }, []);

  // Mouse drag
  const handleMouseDown = useCallback((id: number, e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const r = robotsRef.current.find(rb => rb.id === id);
    if (!r) return;
    dragRef.current = { id, offsetX: e.clientX - rect.left - r.x, offsetY: e.clientY - rect.top - r.y };
    robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: true, scared: true } : rb);

    const onMove = (ev: MouseEvent) => {
      const r2 = container.getBoundingClientRect();
      const lx = Math.max(0, Math.min(containerSizeRef.current.w - (dragRef.current ? robotsRef.current.find(rb=>rb.id===id)?.size??48 : 48), ev.clientX - r2.left - (dragRef.current?.offsetX ?? 0)));
      const ly = Math.max(0, Math.min(CANVAS_H - (robotsRef.current.find(rb=>rb.id===id)?.size??48)*1.2, ev.clientY - r2.top - (dragRef.current?.offsetY ?? 0)));
      robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: true, scared: true, x: lx, y: ly, vx: 0, vy: 0 } : rb);
    };
    const onUp = () => {
      robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: false, scared: false } : rb);
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  // Touch drag
  const handleTouchStart = useCallback((id: number, e: React.TouchEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const touch = e.touches[0];
    const rect = container.getBoundingClientRect();
    const r = robotsRef.current.find(rb => rb.id === id);
    if (!r) return;
    dragRef.current = { id, offsetX: touch.clientX - rect.left - r.x, offsetY: touch.clientY - rect.top - r.y };
    robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: true, scared: true } : rb);

    const onTMove = (ev: TouchEvent) => {
      ev.preventDefault();
      const t = ev.touches[0];
      const r2 = container.getBoundingClientRect();
      const lx = Math.max(0, Math.min(containerSizeRef.current.w - (r.size), t.clientX - r2.left - (dragRef.current?.offsetX ?? 0)));
      const ly = Math.max(0, Math.min(CANVAS_H - r.size * 1.2, t.clientY - r2.top - (dragRef.current?.offsetY ?? 0)));
      robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: true, scared: true, x: lx, y: ly, vx: 0, vy: 0 } : rb);
    };
    const onTEnd = () => {
      robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: false, scared: false } : rb);
      dragRef.current = null;
      window.removeEventListener("touchmove", onTMove);
      window.removeEventListener("touchend", onTEnd);
    };
    window.addEventListener("touchmove", onTMove, { passive: false });
    window.addEventListener("touchend", onTEnd);
  }, []);

  return (
    <section className="py-24 sm:py-32 bg-[#0a0a0a] border-t border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
                {t.geistVillage.title}
              </h2>
              <p className="text-zinc-400">{t.geistVillage.subtitle}</p>
            </div>
          </div>
        </motion.div>

        {/* Game box */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          ref={containerRef}
          className="relative overflow-hidden group border border-zinc-800 bg-zinc-950/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] active:translate-y-0 active:scale-[0.98] transition-all duration-300 cursor-crosshair"
          style={{ height: CANVAS_H }}
        >
          {/* Ultra Minimalist Top-Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/30 to-transparent z-0" />
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
          <div className="absolute top-0 left-1/4 right-1/4 h-[12px] bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none z-0" />
          {/* Grid floor */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }} />

          {/* Robots */}
          {robots.map((robot) => (
            <motion.div
              key={robot.id}
              animate={robot.scared && !robot.dragging ? { rotate: [-3, 3, -3, 0] } : { rotate: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                left: robot.x,
                top: robot.y,
                zIndex: robot.dragging ? 100 : robot.scared ? 50 : 10,
                filter: robot.scared
                  ? "drop-shadow(0 0 10px rgba(255,80,80,0.6))"
                  : "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
                transition: "filter 0.2s ease",
              }}
              onMouseDown={(e) => handleMouseDown(robot.id, e)}
              onTouchStart={(e) => handleTouchStart(robot.id, e)}
            >
              <GeistRobotChar
                size={robot.size}
                mood={robot.currentMood}
                scared={robot.scared}
                dragging={robot.dragging}
                isBlinking={robot.isBlinking}
                icon={robot.icon}
                label={robot.label}
                step={steps[robot.id] ?? false}
              />
            </motion.div>
          ))}

          {/* Loading state */}
          {robots.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-zinc-600 text-sm tracking-widest">Loading robots…</div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
