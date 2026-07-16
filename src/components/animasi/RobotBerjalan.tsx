"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/KonteksBahasa";

function RoundRobot({
  direction,
  scared,
  happy,
  flipping,
}: {
  direction: 1 | -1;
  scared: boolean;
  happy: boolean;
  flipping: boolean;
  step: boolean;
}) {
  const size = 80;
  const flipped = direction === -1;

  return (
    <motion.div
      animate={flipping ? { y: [0, -50, 0] } : {}}
      transition={flipping ? { duration: 0.5, ease: "easeInOut" } : {}}
      style={{ position: "relative", width: size, display: "flex", flexDirection: "column", alignItems: "center", transformStyle: "preserve-3d" }}
    >
      {/* Label dihapus berdasarkan permintaan user */}

      {/* GIF Robot */}
      <motion.img
        src="/icons/robot.gif"
        alt="Robot"
        width={size}
        height={size}
        draggable={false}
        animate={
          scared
            ? { y: [0, -5, 0], rotate: [-3, 3, -3, 0] }
            : happy
              ? { y: [0, -2, 0] }
              : { y: [0, -1, 0] }
        }
        transition={
          scared
            ? { duration: 0.2, repeat: Infinity }
            : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          objectFit: "contain",
          transform: `scaleX(${flipped ? -1 : 1})`,
          filter: scared
            ? "drop-shadow(0 0 8px rgba(239,68,68,0.8)) hue-rotate(300deg) saturate(200%)"
            : happy
              ? "drop-shadow(0 0 6px rgba(34,197,94,0.4))"
              : "drop-shadow(0 0 4px rgba(255,255,255,0.15))",
        }}
      />
    </motion.div>
  );
}

function WalkingRobot({
  startX,
  startDir,
  speed,
  cursorXRef,
  containerWidth,
  messages,
  robotIndex,
}: {
  startX: number;
  startDir: 1 | -1;
  speed: number;
  cursorXRef: React.MutableRefObject<number>;
  containerWidth: number;
  messages: string[];
  robotIndex: number;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(startX);
  const dirRef = useRef<1 | -1>(startDir);
  const [dir, setDir] = useState<1 | -1>(startDir);
  const [scared, setScared] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [step, setStep] = useState(false);
  const [msgIndex, setMsgIndex] = useState(robotIndex % messages.length);
  const [isPausedState, setIsPausedState] = useState(false);
  const isPausedRef = useRef(false);
  const pauseTimerRef = useRef(0);
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const ROBOT_WIDTH = 80;
  const FLEE_DIST = 160;
  const stepTimerRef = useRef(0);

  const tick = useCallback(
    (now: number) => {
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = now;

      const cursorX = cursorXRef.current;
      const curX = posRef.current + ROBOT_WIDTH / 2;
      const dist = Math.abs(cursorX - curX);
      const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false;
      const isScared = !isMobile && dist < FLEE_DIST && cursorX > 0;

      if (isPausedRef.current && !isScared) {
        pauseTimerRef.current -= dt;
        if (pauseTimerRef.current <= 0) {
          isPausedRef.current = false;
          setIsPausedState(false);
          if (Math.random() > 0.4) {
            dirRef.current = dirRef.current === 1 ? -1 : 1;
            setDir(dirRef.current);
          }
        }
        rafRef.current = requestAnimationFrame(tick);
        return;
      } else if (!isScared && !isPausedRef.current && Math.random() < dt * 0.4) {
        isPausedRef.current = true;
        setIsPausedState(true);
        pauseTimerRef.current = 1 + Math.random() * 2.5;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (isScared && isPausedRef.current) {
        isPausedRef.current = false;
        setIsPausedState(false);
      }

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

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const handleClick = () => {
    if (!flipping) {
      setFlipping(true);
      setTimeout(() => setFlipping(false), 500);
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
      <AnimatePresence>
        {!scared && !flipping && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-7 left-1/2 whitespace-nowrap bg-zinc-800 text-white text-[10px] px-2 py-0.5 rounded shadow-lg border border-zinc-700 font-medium z-10 pointer-events-none"
            style={{ fontFamily: "monospace", transform: "translateX(-50%)" }}
          >
            {flipping ? "🚀" : isPausedState ? "🤔" : messages[msgIndex]}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-zinc-800 border-b border-r border-zinc-700 rotate-45"></div>
          </motion.div>
        )}
        {scared && (
          <motion.div
            key="scared"
            initial={{ opacity: 0, y: 4, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-7 left-1/2 whitespace-nowrap bg-zinc-800 text-[#ef4444] text-[10px] px-2 py-0.5 rounded shadow-lg border border-zinc-700 font-medium z-10 pointer-events-none"
            style={{ fontFamily: "monospace", transform: "translateX(-50%)" }}
          >
            😱 HELP!
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-zinc-800 border-b border-r border-zinc-700 rotate-45"></div>
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

export default function WalkingRobotBar() {
  const { language } = useLanguage();
  const cursorXRef = useRef(-999);
  const [containerWidth, setContainerWidth] = useState(1200);

  const messagesEn = ["Hello! 👋", "Welcome! 😊", "Let's explore! 🚀", "Nice to meet you! 🤝", "Scroll down! 👇"];
  const messagesId = ["Halo! 👋", "Selamat datang! 😊", "Mari jelajahi! 🚀", "Senang bertemu! 🤝", "Gulir ke bawah! 👇"];
  const messages = language === "id" ? messagesId : messagesEn;

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
    { id: 1, startX: Math.round(containerWidth * 0.10), startDir: 1 as const, speed: 70 },
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
      {robots.map((r, index) => (
        <WalkingRobot
          key={r.id}
          startX={r.startX}
          startDir={r.startDir}
          speed={r.speed}
          cursorXRef={cursorXRef}
          containerWidth={containerWidth}
          messages={messages}
          robotIndex={index}
        />
      ))}
    </div>
  );
}
