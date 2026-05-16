"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

// Robot bulat dengan ekspresi
function RoundRobot({
  direction,
  scared,
  happy,
  flipping,
  step,
}: {
  direction: 1 | -1;
  scared: boolean;
  happy: boolean;
  flipping: boolean;
  step: boolean;
}) {
  const [blinking, setBlinking] = useState(false);
  const size = 48;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => { setBlinking(false); scheduleBlink(); }, 120);
      }, 2500 + Math.random() * 3000);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  const flipped = direction === -1;
  const eyeColor = scared ? "#ef4444" : "var(--robot-eye)";
  const eyeScaleY = blinking ? 0.05 : scared ? 1.6 : 1;
  const accentColor = scared ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)";
  const mood = scared ? "scared" : happy ? "happy" : "neutral";

  return (
    <motion.div
      animate={flipping ? { rotateX: [0, 360, 0], y: [0, -30, 0] } : {}}
      transition={flipping ? { duration: 0.6, ease: "easeInOut" } : {}}
      style={{ position: "relative", width: size, transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: flipped ? "scaleX(-1)" : "scaleX(1)", transformOrigin: "center" }}>
        
        {/* Label */}
        <div style={{ textAlign: "center", fontSize: 7, fontWeight: 800, letterSpacing: "0.15em", color: scared ? "#ef4444" : "var(--text-muted)", marginBottom: 2, fontFamily: "monospace", opacity: 0.7 }}>
          {scared ? "😱 RUN!" : "ROBOT"}
        </div>

        {/* Antena */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: -2 }}>
          <div style={{ width: 2, height: 10, background: "var(--robot-eye)", opacity: 0.4 }} />
          <motion.div
            animate={scared ? { scale: [1, 1.5, 1] } : { scale: [1, 1.15, 1] }}
            transition={{ duration: scared ? 0.3 : 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: happy ? "#22c55e" : scared ? "#ef4444" : "var(--robot-eye)", marginTop: -1, boxShadow: `0 0 6px ${scared ? "rgba(239,68,68,0.6)" : "rgba(34,197,94,0.4)"}` }}
          />
        </div>

        {/* Badge ikon */}
        <div style={{ textAlign: "center", fontSize: size * 0.28, lineHeight: 1, marginBottom: 0 }}>🤖</div>

        {/* Tubuh kapsul */}
        <motion.div
          animate={scared ? { y: [0, -5, 0], rotate: [-3, 3, -3, 0] } : { y: [0, -1.5, 0] }}
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
            boxShadow: scared ? "0 0 15px rgba(239,68,68,0.3)" : "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {/* Overlay layar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "rgba(255,255,255,0.03)", borderRadius: `${size * 0.35}px ${size * 0.35}px 0 0` }} />

          {/* Dekorasi titik piksel */}
          <div style={{ position: "absolute", top: 5, right: 5, display: "flex", gap: 2 }}>
            {["#ef4444", "#22c55e"].map((c, i) => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
          </div>

          {/* Mata */}
          <div style={{ display: "flex", gap: size * 0.2 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{
                width: size * 0.15,
                height: size * 0.15,
                borderRadius: "50%",
                background: eyeColor,
                transform: `scaleY(${eyeScaleY})`,
                transition: "transform 0.08s ease",
              }} />
            ))}
          </div>

          {/* Mulut */}
          {scared ? (
            <div style={{ width: size * 0.2, height: size * 0.14, borderRadius: "50%", background: "#ef4444", marginTop: 4, opacity: 0.8 }} />
          ) : happy ? (
            <div style={{ width: size * 0.3, height: size * 0.12, borderBottom: `2px solid var(--robot-eye)`, borderRadius: "0 0 50px 50px", marginTop: 4, opacity: 0.7 }} />
          ) : (
            <div style={{ width: size * 0.25, height: 2, background: "var(--robot-eye)", borderRadius: 2, marginTop: 4, opacity: 0.5 }} />
          )}
        </motion.div>

        {/* Kaki */}
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
    </motion.div>
  );
}

// Logika robot berjalan
function WalkingRobot({
  startX,
  startDir,
  speed,
  cursorXRef,
  containerWidth,
  scrollText,
}: {
  startX: number;
  startDir: 1 | -1;
  speed: number;
  cursorXRef: React.MutableRefObject<number>;
  containerWidth: number;
  scrollText: string;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(startX);
  const dirRef = useRef<1 | -1>(startDir);
  const [dir, setDir] = useState<1 | -1>(startDir);
  const [scared, setScared] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [step, setStep] = useState(false);
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const ROBOT_WIDTH = 38;
  const FLEE_DIST = 160;
  const stepTimerRef = useRef(0);

  const tick = useCallback(
    (now: number) => {
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = now;

      const cursorX = cursorXRef.current;
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
      if (newPos <= 0) { newPos = 0; if (!isScared) newDir = 1; }
      else if (newPos >= maxX) { newPos = maxX; if (!isScared) newDir = -1; }

      stepTimerRef.current += dt;
      const stepInterval = isScared ? 0.07 : 0.2;
      if (stepTimerRef.current >= stepInterval) {
        stepTimerRef.current = 0;
        setStep(s => !s);
      }

      posRef.current = newPos;
      if (elRef.current) {
        elRef.current.style.transform = `translateX(${newPos}px)`;
      }

      if (dirRef.current !== newDir) {
        dirRef.current = newDir;
        setDir(newDir);
      }
      
      if (scared !== isScared) {
        setScared(isScared);
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [cursorXRef, speed, containerWidth, scared]
  );

  useEffect(() => {
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const handleClick = () => {
    if (!flipping) {
      setFlipping(true);
      setTimeout(() => setFlipping(false), 700);
    }
  };

  return (
    <div
      ref={elRef}
      style={{ 
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        transform: `translateX(${posRef.current}px)`,
        zIndex: 20, 
        willChange: "transform", 
        pointerEvents: "auto", 
        cursor: "pointer" 
      }}
      onClick={handleClick}
    >
      {/* Gelembung bicara */}
      <AnimatePresence>
        {!scared && !flipping && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute",
              top: -26,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 10,
              background: "var(--bubble-bg)",
              color: "var(--bubble-color)",
              borderRadius: 6,
              padding: "2px 8px",
              whiteSpace: "nowrap",
              fontFamily: "monospace",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {flipping ? "🤸" : `↓ ${scrollText}`}
          </motion.div>
        )}
        {scared && (
          <motion.div
            key="scared"
            initial={{ opacity: 0, y: 4, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: -26,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 10,
              background: "var(--bubble-bg)",
              color: "#ef4444",
              borderRadius: 6,
              padding: "2px 8px",
              whiteSpace: "nowrap",
              fontFamily: "monospace",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            😱 HELP!
          </motion.div>
        )}
      </AnimatePresence>

      <RoundRobot
        direction={dir}
        scared={scared}
        happy={!scared && !flipping}
        flipping={flipping}
        step={step}
      />
    </div>
  );
}

// Ekspor Utama
export default function WalkingRobotBar() {
  const { t } = useLanguage();
  const cursorXRef = useRef(-999);
  const [containerWidth, setContainerWidth] = useState(1200);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollText = (t.hero as any).scrollDown ?? "SCROLL DOWN";

  useEffect(() => {
    setContainerWidth(window.innerWidth);
    const onResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { cursorXRef.current = e.clientX; };
    const onLeave = () => { cursorXRef.current = -999; };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const robots = [
    { id: 1, startX: Math.round(containerWidth * 0.10), startDir: 1  as const, speed: 70 },
    { id: 2, startX: Math.round(containerWidth * 0.70), startDir: -1 as const, speed: 55 },
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
          cursorXRef={cursorXRef}
          containerWidth={containerWidth}
          scrollText={scrollText}
        />
      ))}
    </div>
  );
}
