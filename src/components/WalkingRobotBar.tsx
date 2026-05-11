"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Square Geist-style robot (matches GeistVillage) ─────────────────────────
function SquareRobot({
  direction,
  scared,
  icon,
  step,
}: {
  direction: 1 | -1;
  scared: boolean;
  icon: string;
  step: boolean;
}) {
  const [blinking, setBlinking] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [currentIcon, setCurrentIcon] = useState(icon);
  const SIZE = 42;

  // Natural blink
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 120);
      }, 2500 + Math.random() * 3000);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Cycle speech icons
  useEffect(() => {
    const ICONS = ["👋", "</>", "🔍", "⚡", "🎯", "✨", "🤖"];
    const cycle = () => {
      setShowIcon(false);
      setTimeout(() => {
        setCurrentIcon(ICONS[Math.floor(Math.random() * ICONS.length)]);
        setShowIcon(true);
      }, 400);
    };
    const id = setInterval(cycle, 4000);
    return () => clearInterval(id);
  }, []);

  const flipped = direction === -1;

  return (
    <div
      style={{
        position: "relative",
        width: SIZE,
        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
        filter: scared ? "drop-shadow(0 0 8px rgba(255,80,80,0.6))" : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
        transition: "filter 0.2s ease",
      }}
    >
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showIcon && (
          <motion.div
            key={scared ? "scared" : currentIcon}
            initial={{ opacity: 0, y: 4, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute",
              top: -28,
              left: "50%",
              transform: flipped ? "translateX(-50%) scaleX(-1)" : "translateX(-50%)",
              fontSize: 12,
              background: "var(--bubble-bg)",
              color: "var(--bubble-color)",
              borderRadius: 6,
              padding: "2px 6px",
              whiteSpace: "nowrap",
              fontFamily: "monospace",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {scared ? "😱" : currentIcon}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Square body (Geist style) */}
      <motion.div
        animate={
          scared
            ? { y: [0, -5, 0], x: [-2, 2, -2, 0] }
            : { y: [0, -2, 0] }
        }
        transition={
          scared
            ? { duration: 0.22, repeat: Infinity }
            : { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          width: SIZE,
          height: SIZE * 0.82,
          background: "var(--robot-body)",
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: scared ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Scanline top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28%", background: "rgba(255,255,255,0.04)", borderRadius: "6px 6px 0 0" }} />

        {/* 3-dot titlebar */}
        <div style={{ position: "absolute", top: 4, left: 5, display: "flex", gap: 2.5 }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
            <div key={i} style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: c, opacity: 0.9 }} />
          ))}
        </div>

        {/* Eyes */}
        <div style={{ display: "flex", gap: SIZE * 0.16 }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: SIZE * 0.14,
                height: SIZE * 0.14,
                borderRadius: "50%",
                background: scared ? "#ef4444" : "var(--robot-eye)",
                transform: `scaleY(${blinking ? 0.05 : scared ? 1.8 : 1}) scaleX(${scared ? 1.4 : 1})`,
                transition: "transform 0.08s ease",
              }}
            />
          ))}
        </div>

        {/* Mouth */}
        <div style={{
          width: scared ? SIZE * 0.28 : SIZE * 0.36,
          height: scared ? SIZE * 0.16 : 2,
          background: scared ? "#ef4444" : "var(--robot-eye)",
          borderRadius: scared ? "50%" : 2,
          marginTop: 4,
          opacity: 0.75,
        }} />
      </motion.div>

      {/* Feet */}
      <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 1, paddingLeft: SIZE * 0.14, paddingRight: SIZE * 0.14 }}>
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: step === (i === 0) ? -3 : 0,
              rotate: step === (i === 0) ? -12 : 12,
            }}
            transition={{ duration: scared ? 0.07 : 0.16 }}
            style={{
              width: SIZE * 0.23,
              height: SIZE * 0.2,
              background: "var(--robot-body)",
              borderRadius: "2px 2px 4px 4px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Single walking robot with cursor avoidance ──────────────────────────────
function WalkingRobot({
  startX,
  startDir,
  speed,
  icon,
  cursorX,
  containerWidth,
}: {
  startX: number;
  startDir: 1 | -1;
  speed: number;
  icon: string;
  cursorX: number;
  containerWidth: number;
}) {
  const posRef = useRef(startX);
  const dirRef = useRef<1 | -1>(startDir);
  const [pos, setPos] = useState(startX);
  const [dir, setDir] = useState<1 | -1>(startDir);
  const [scared, setScared] = useState(false);
  const [step, setStep] = useState(false);
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const ROBOT_WIDTH = 42;
  const FLEE_DIST = 160;
  const stepTimerRef = useRef(0);

  const tick = useCallback(
    (now: number) => {
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = now;

      const curX = posRef.current + ROBOT_WIDTH / 2;
      const dist = Math.abs(cursorX - curX);
      const isScared = dist < FLEE_DIST && cursorX > 0;

      let newDir = dirRef.current;
      if (isScared) {
        newDir = cursorX < curX ? 1 : -1;
      }

      const currentSpeed = isScared ? speed * 2.8 : speed;
      let newPos = posRef.current + newDir * currentSpeed * dt;

      const maxX = containerWidth - ROBOT_WIDTH;
      if (newPos <= 0) { newPos = 0; newDir = 1; }
      else if (newPos >= maxX) { newPos = maxX; newDir = -1; }

      // Step toggle
      stepTimerRef.current += dt;
      const stepInterval = isScared ? 0.07 : 0.2;
      if (stepTimerRef.current >= stepInterval) {
        stepTimerRef.current = 0;
        setStep(s => !s);
      }

      posRef.current = newPos;
      dirRef.current = newDir;

      setPos(newPos);
      setDir(newDir);
      setScared(isScared);

      rafRef.current = requestAnimationFrame(tick);
    },
    [cursorX, speed, containerWidth]
  );

  useEffect(() => {
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  return (
    <div style={{ position: "absolute", bottom: 0, left: pos, zIndex: 20, willChange: "transform" }}>
      <SquareRobot direction={dir} scared={scared} icon={icon} step={step} />
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function WalkingRobotBar() {
  const [cursorX, setCursorX] = useState(-999);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    setContainerWidth(window.innerWidth);
    const onResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursorX(e.clientX);
    const onLeave = () => setCursorX(-999);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const robots = [
    { id: 1, startX: Math.round(containerWidth * 0.10), startDir: 1  as const, speed: 80, icon: "👋" },
    { id: 2, startX: Math.round(containerWidth * 0.70), startDir: -1 as const, speed: 65, icon: "</>" },
  ];

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      height: 64,
      pointerEvents: "none",
      overflow: "visible",
    }}>
      {robots.map((r) => (
        <WalkingRobot
          key={r.id}
          startX={r.startX}
          startDir={r.startDir}
          speed={r.speed}
          icon={r.icon}
          cursorX={cursorX}
          containerWidth={containerWidth}
        />
      ))}
    </div>
  );
}
