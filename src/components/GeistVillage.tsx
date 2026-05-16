"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { audioStore } from "@/lib/audioStore";

const playBlupSound = () => {
  const ctx = audioStore.getContext();
  if (!ctx) return;
  
  try {
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(300, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.1);
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.1);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(400, ctx.currentTime + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
    gain2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.17);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.log("Audio play failed", e);
  }
};

// ── Mood types and their expressions ────────────────────────────────────────
type Mood = "happy" | "laugh" | "angry" | "sleepy" | "scared" | "cool" | "neutral";

const MOODS: { mood: Mood; icon: string; eyeColor: string; mouthShape: string }[] = [
  { mood: "happy", icon: "😊", eyeColor: "var(--robot-eye)", mouthShape: "smile" },
  { mood: "laugh", icon: "😄", eyeColor: "var(--robot-eye)", mouthShape: "laugh" },
  { mood: "angry", icon: "😡", eyeColor: "#ef4444", mouthShape: "frown" },
  { mood: "sleepy", icon: "😴", eyeColor: "var(--robot-eye)", mouthShape: "neutral" },
  { mood: "cool", icon: "😎", eyeColor: "#3b82f6", mouthShape: "smile" },
  { mood: "neutral", icon: "🤖", eyeColor: "var(--robot-eye)", mouthShape: "neutral" },
  { mood: "scared", icon: "😱", eyeColor: "#ef4444", mouthShape: "open" },
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
  { icon: "🚀", label: "ASTRO",  mood: "cool"    as Mood },
  { icon: "🤡", label: "JOKER",  mood: "laugh"   as Mood },
  { icon: "👽", label: "ALIEN",  mood: "neutral" as Mood },
  { icon: "👻", label: "GHOST",  mood: "sleepy"  as Mood },
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
  walkDir: number;
  stunTimer: number;
}

const CANVAS_H = 460;

// ── Capsule robot character with antenna + LED screen ──────────────────────────
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
  const eyeColor = scared ? "#ef4444" : moodData.eyeColor;
  const accentColor = scared ? "rgba(239,68,68,0.5)" : mood === "angry" ? "rgba(239,68,68,0.3)" : mood === "cool" ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)";

  return (
    <div style={{ position: "relative", width: size, cursor: dragging ? "grabbing" : "grab", userSelect: "none", touchAction: "none" }}>
      {/* Label */}
      <div style={{ textAlign: "center", fontSize: 7, fontWeight: 800, letterSpacing: "0.15em", color: scared ? "#ef4444" : "var(--text-muted)", marginBottom: 2, fontFamily: "monospace", opacity: 0.7 }}>
        {scared ? "😱 RUN!" : label}
      </div>

      {/* Antenna */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: -2 }}>
        <div style={{ width: 2, height: 10, background: "var(--robot-eye)", opacity: 0.4 }} />
        <motion.div
          animate={scared ? { scale: [1, 1.5, 1] } : { scale: [1, 1.15, 1] }}
          transition={{ duration: scared ? 0.3 : 1.5, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: scared ? "#ef4444" : mood === "cool" ? "#3b82f6" : "#22c55e", marginTop: -1, boxShadow: `0 0 6px ${scared ? "rgba(239,68,68,0.6)" : "rgba(34,197,94,0.4)"}` }}
        />
      </div>

      {/* Icon badge */}
      <div style={{ textAlign: "center", fontSize: size * 0.28, lineHeight: 1, marginBottom: 0 }}>{icon}</div>

      {/* Capsule body */}
      <motion.div
        animate={scared ? { y: [0, -5, 0], rotate: [-3, 3, -3, 0] } : mood === "laugh" ? { y: [0, -3, 0] } : { y: [0, -1.5, 0] }}
        transition={scared ? { duration: 0.2, repeat: Infinity } : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: size,
          height: size * 0.9,
          background: "var(--robot-body)",
          borderRadius: `${size * 0.35}px ${size * 0.35}px ${size * 0.2}px ${size * 0.2}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: `1.5px solid ${accentColor}`,
          overflow: "hidden",
          boxShadow: scared ? "0 0 15px rgba(239,68,68,0.3)" : dragging ? "0 0 20px rgba(255,255,255,0.15)" : "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        {/* Screen overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "rgba(255,255,255,0.03)", borderRadius: `${size * 0.35}px ${size * 0.35}px 0 0` }} />

        {/* Pixel dots decoration */}
        <div style={{ position: "absolute", top: 5, right: 5, display: "flex", gap: 2 }}>
          {["#ef4444", "#22c55e"].map((c, i) => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: c, opacity: 0.7 }} />
          ))}
        </div>

        {/* Eyes */}
        <div style={{ display: "flex", gap: size * 0.2 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              width: size * 0.15,
              height: size * 0.15,
              borderRadius: mood === "cool" ? 2 : "50%",
              background: eyeColor,
              transform: `scaleY(${eyeScaleY})`,
              transition: "transform 0.08s ease",
              opacity: mood === "sleepy" ? 0.4 : 1,
            }} />
          ))}
        </div>

        {/* Mouth */}
        {moodData.mouthShape === "smile" && (
          <div style={{ width: size * 0.3, height: size * 0.12, borderBottom: `2px solid var(--robot-eye)`, borderRadius: "0 0 50px 50px", marginTop: 4, opacity: 0.7 }} />
        )}
        {moodData.mouthShape === "laugh" && (
          <div style={{ width: size * 0.35, height: size * 0.15, borderBottom: `2.5px solid var(--robot-eye)`, borderRadius: "0 0 50px 50px", marginTop: 3, opacity: 0.8, background: "rgba(255,255,255,0.04)" }} />
        )}
        {moodData.mouthShape === "frown" && (
          <div style={{ width: size * 0.28, height: size * 0.1, borderTop: `2px solid #ef4444`, borderRadius: "50px 50px 0 0", marginTop: 5, opacity: 0.8 }} />
        )}
        {moodData.mouthShape === "neutral" && (
          <div style={{ width: size * 0.25, height: 2, background: "var(--robot-eye)", borderRadius: 2, marginTop: 4, opacity: 0.5 }} />
        )}
        {moodData.mouthShape === "open" && (
          <div style={{ width: size * 0.2, height: size * 0.14, borderRadius: "50%", background: "#ef4444", marginTop: 4, opacity: 0.8 }} />
        )}
      </motion.div>

      {/* Feet */}
      <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 1, paddingLeft: size * 0.16, paddingRight: size * 0.16 }}>
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            animate={{ y: step === (i === 0) ? -3 : 0, rotate: step === (i === 0) ? -12 : 12 }}
            transition={{ duration: scared ? 0.06 : 0.18 }}
            style={{
              width: size * 0.2,
              height: size * 0.16,
              background: "var(--robot-body)",
              borderRadius: "3px 3px 6px 6px",
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
  const [robotMoods, setRobotMoods] = useState<Record<number, { mood: Mood, blinking: boolean, scared: boolean }>>({});
  
  const robotsRef = useRef<RobotState[]>([]);
  const robotRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const stepsRef = useRef<Record<number, boolean>>({});
  const containerSizeRef = useRef({ w: 900, h: CANVAS_H });
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const cursorRef = useRef({ x: -999, y: -999 });
  const dragRef = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);
  const prevDragPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize robots
  const initRobots = useCallback((w: number) => {
    const newRobots: RobotState[] = ROBOT_PERSONALITIES.map((p, i) => {
      const sz = 44 + (i % 3) * 8;
      const cols = 6;
      return {
        id: i,
        x: 40 + (i % cols) * ((w - 80) / cols) + Math.random() * 30,
        y: 30 + Math.floor(i / cols) * 160 + Math.random() * 40,
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
        stunTimer: 0,
      };
    });
    robotsRef.current = newRobots;
    const initSteps: Record<number, boolean> = {};
    const initMoods: Record<number, { mood: Mood, blinking: boolean, scared: boolean }> = {};
    newRobots.forEach(r => { 
      initSteps[r.id] = false; 
      initMoods[r.id] = { mood: r.currentMood, blinking: false, scared: false };
    });
    stepsRef.current = initSteps;
    setRobots([...newRobots]);
    setSteps({ ...initSteps });
    setRobotMoods(initMoods);
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
        let currentMood = r.currentMood;
        let isBlinking = r.isBlinking;
        let blinkTimer = r.blinkTimer;
        let moodTimer = r.moodTimer;
        let walkTimer = r.walkTimer;
        let walkDir = r.walkDir;
        let stunTimer = (r.stunTimer ?? 0) - dt;
        if (stunTimer < 0) stunTimer = 0;

        let repX = 0, repY = 0;
        for (let j = 0; j < arr.length; j++) {
          if (i === j) continue;
          const o = arr[j];
          const dx = r.x - o.x;
          const dy = r.y - o.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minD = (r.size + o.size) / 2 + 5;
          if (dist > 0 && dist < minD) {
            const overlap = (minD - dist) / minD;
            const nx2 = dx / dist, ny2 = dy / dist;
            repX += nx2 * overlap * 1400;
            repY += ny2 * overlap * 1400;
            const spd = Math.sqrt(o.vx * o.vx + o.vy * o.vy);
            if (spd > 150 && o.dragging) {
              repX += o.vx * 4;
              repY += o.vy * 4;
              stunTimer = 1.2;
            } else if (spd > 30) {
              repX += o.vx * 4;
              repY += o.vy * 4;
            }
          }
        }

        const isScared = r.dragging || stunTimer > 0;
        if (r.dragging) {
          const el = robotRefs.current[r.id];
          if (el) {
            el.style.transform = `translate(${r.x}px, ${r.y}px)`;
            el.style.zIndex = "100";
          }
          return { ...r, scared: isScared, stunTimer };
        }

        // ── Autonomous movement ──
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

        // Autonomous wander
        const walkSpeed = stunTimer > 0 ? 0 : currentMood === "sleepy" ? 300 : currentMood === "angry" ? 900 : 500;
        let vx = r.vx + (Math.cos(walkDir) * walkSpeed + repX) * dt;
        let vy = r.vy + (Math.sin(walkDir) * walkSpeed + repY) * dt;

        vx *= 0.92;
        vy *= 0.92;

        const maxSpeed = stunTimer > 0 ? 300 : currentMood === "sleepy" ? 80 : currentMood === "angry" ? 250 : 160;
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > maxSpeed) { vx = (vx / speed) * maxSpeed; vy = (vy / speed) * maxSpeed; }

        let nx = r.x + vx * dt;
        let ny = r.y + vy * dt;
        const maxX = w - r.size;
        const maxY = CANVAS_H - r.size * 1.65;

        // Step toggle
        const stepThreshold = 5;
        if (speed > stepThreshold) {
          const oldStep = stepsRef.current[r.id];
          if (Math.random() < dt * (speed / 15)) {
            newSteps[r.id] = !oldStep;
            stepsChanged = true;
          }
        }

        if (nx < 0) { nx = 0; vx = Math.abs(vx) * 0.9; walkDir = Math.random() * Math.PI - Math.PI / 2; }
        if (nx > maxX) { nx = maxX; vx = -Math.abs(vx) * 0.9; walkDir = Math.random() * Math.PI + Math.PI / 2; }
        if (ny < 0) { ny = 0; vy = Math.abs(vy) * 0.9; }
        if (ny > maxY) { ny = maxY; vy = -Math.abs(vy) * 0.9; }

        const el = robotRefs.current[r.id];
        if (el) {
          el.style.transform = `translate(${nx}px, ${ny}px)`;
          el.style.zIndex = isScared ? "50" : "10";
          el.style.filter = isScared ? "drop-shadow(0 0 10px rgba(255,80,80,0.6))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.3))";
        }

        return { ...r, x: nx, y: ny, vx, vy, currentMood, blinkTimer, isBlinking, moodTimer, walkTimer, walkDir, stunTimer, scared: isScared };
      });

      robotsRef.current = updated;

      // Update state only for non-frequent changes (moods, steps)
      if (stepsChanged) {
        stepsRef.current = newSteps;
        setSteps({ ...newSteps });
      }

      // Check if any mood changed to trigger a re-render for expressions
      const anyMoodChange = updated.some((r, i) => {
        const prev = robotMoods[r.id];
        return prev && (prev.mood !== r.currentMood || prev.blinking !== r.isBlinking || prev.scared !== r.scared);
      });

      if (anyMoodChange) {
        const newMoods: Record<number, { mood: Mood, blinking: boolean, scared: boolean }> = {};
        updated.forEach(r => {
          newMoods[r.id] = { mood: r.currentMood, blinking: r.isBlinking, scared: r.scared };
        });
        setRobotMoods(newMoods);
      }

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
    playBlupSound();
    dragRef.current = { id, offsetX: e.clientX - rect.left - r.x, offsetY: e.clientY - rect.top - r.y };
    robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: true, scared: true } : rb);

    const onMove = (ev: MouseEvent) => {
      const r2 = container.getBoundingClientRect();
      const rb = robotsRef.current.find(x => x.id === id);
      const sz = rb?.size ?? 48;
      const lx = Math.max(0, Math.min(containerSizeRef.current.w - sz, ev.clientX - r2.left - (dragRef.current?.offsetX ?? 0)));
      const ly = Math.max(0, Math.min(CANVAS_H - sz * 1.65, ev.clientY - r2.top - (dragRef.current?.offsetY ?? 0)));
      const prev = prevDragPosRef.current;
      const dragVx = prev ? (lx - prev.x) / 0.016 : 0;
      const dragVy = prev ? (ly - prev.y) / 0.016 : 0;
      prevDragPosRef.current = { x: lx, y: ly };
      robotsRef.current = robotsRef.current.map(rb2 =>
        rb2.id === id ? { ...rb2, dragging: true, scared: true, x: lx, y: ly, vx: dragVx, vy: dragVy } : rb2
      );
    };
    const onUp = () => {
      prevDragPosRef.current = null;
      robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: false, stunTimer: 1.2, scared: true } : rb);
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
    playBlupSound();
    dragRef.current = { id, offsetX: touch.clientX - rect.left - r.x, offsetY: touch.clientY - rect.top - r.y };
    robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: true, scared: true } : rb);

    const onTMove = (ev: TouchEvent) => {
      ev.preventDefault();
      const t = ev.touches[0];
      const r2 = container.getBoundingClientRect();
      const lx = Math.max(0, Math.min(containerSizeRef.current.w - r.size, t.clientX - r2.left - (dragRef.current?.offsetX ?? 0)));
      const ly = Math.max(0, Math.min(CANVAS_H - r.size * 1.2, t.clientY - r2.top - (dragRef.current?.offsetY ?? 0)));
      const prev = prevDragPosRef.current;
      const dragVx = prev ? (lx - prev.x) / 0.016 : 0;
      const dragVy = prev ? (ly - prev.y) / 0.016 : 0;
      prevDragPosRef.current = { x: lx, y: ly };
      robotsRef.current = robotsRef.current.map(rb =>
        rb.id === id ? { ...rb, dragging: true, scared: true, x: lx, y: ly, vx: dragVx, vy: dragVy } : rb
      );
    };
    const onTEnd = () => {
      prevDragPosRef.current = null;
      robotsRef.current = robotsRef.current.map(rb => rb.id === id ? { ...rb, dragging: false, stunTimer: 1.2, scared: true } : rb);
      dragRef.current = null;
      window.removeEventListener("touchmove", onTMove);
      window.removeEventListener("touchend", onTEnd);
    };
    window.addEventListener("touchmove", onTMove, { passive: false });
    window.addEventListener("touchend", onTEnd);
  }, []);

  return (
    <section className="hidden md:block py-24 sm:py-32 bg-[#0a0a0a] border-t border-b border-zinc-800">
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
          className="relative overflow-hidden group border border-zinc-800 bg-zinc-950/30 transition-all duration-300 cursor-crosshair"
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
          {robots.map((robot) => {
            const moodInfo = robotMoods[robot.id] || { mood: robot.currentMood, blinking: robot.isBlinking, scared: robot.scared };
            return (
              <div
                key={robot.id}
                ref={el => { robotRefs.current[robot.id] = el; }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: moodInfo.scared ? 50 : 10,
                  willChange: "transform, filter",
                  transition: "filter 0.2s ease",
                }}
                onMouseDown={(e) => handleMouseDown(robot.id, e)}
                onTouchStart={(e) => handleTouchStart(robot.id, e)}
              >
                <GeistRobotChar
                  size={robot.size}
                  mood={moodInfo.mood}
                  scared={moodInfo.scared}
                  dragging={robot.dragging}
                  isBlinking={moodInfo.blinking}
                  icon={robot.icon}
                  label={robot.label}
                  step={steps[robot.id] ?? false}
                />
              </div>
            );
          })}

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
