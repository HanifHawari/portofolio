"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";

const typewriterText = `const INITIALIZE_SYSTEM = async () => { const Developer = { ID: "Muhammad_Hanif_Hawari", Origin: "Indonesia", Role: "Creative_Engineer" }; await System.load("Next.js", "React", "TypeScript", "Tailwind_CSS", "Framer_Motion"); if (Project.isComplex) return Developer.solveWith(Physics + Logic + Experience); const Mission = "Crafting digital experiences that feel alive, intentional, and intuitive."; return magic.deploy(); }; // Status: ONLINE | Mode: OPEN_TO_WORK <END_OF_SCRIPT>`;

const BADGES = [
  { id: "b1", text: "FRONTEND ENGINEER", type: "pill", w: 185, h: 46 },
  { id: "b2", text: "FREELANCER", type: "pill", w: 120, h: 46 },
  { id: "b3", text: "INFORMATICS", type: "pill", w: 130, h: 46 },
  { id: "b4", text: "UI/UX", type: "pill", w: 80, h: 46 },
  { id: "b5", text: "GRAPHIC DESIGN", type: "pill", w: 155, h: 46 },
  { id: "b6", text: "✦", type: "icon", w: 50, h: 50 },
  { id: "b7", text: "</>", type: "icon", w: 50, h: 50 },
];

const playDragSound = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

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

export default function HeroSection() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      if (displayedText.length < typewriterText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(typewriterText.slice(0, displayedText.length + 1));
        }, 30);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 3000);
      }
    } else {
      setDisplayedText("");
      setIsTyping(true);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping]);

  // Matter.js Physics integration
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [badgePositions, setBadgePositions] = useState<Record<string, { x: number, y: number, angle: number }>>({});

  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const codeLineRef = useRef<HTMLParagraphElement>(null);

  // Custom Dragging State
  const dragBodyRef = useRef<Matter.Body | null>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const velRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Events } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 0.8;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      }
    });
    render.canvas.style.display = 'none';

    // Thick Boundaries to prevent glitching out
    const floor1W = width * 0.58; // MUHAMMAD
    const floor2W = width * 0.98; // HANIF HAWARI

    const textFloor1 = Bodies.rectangle(width / 2, height * 0.4, floor1W, 200, { isStatic: true, render: { visible: false } });
    const textFloor2 = Bodies.rectangle(width / 2, height * 0.5, floor2W, 200, { isStatic: true, render: { visible: false } });
    const ceiling = Bodies.rectangle(width / 2, -180, width * 3, 500, { isStatic: true, render: { visible: false } });
    const wallLeft = Bodies.rectangle(-500, height / 2, 1000, height * 3, { isStatic: true, render: { visible: false } });
    const wallRight = Bodies.rectangle(width + 500, height / 2, 1000, height * 3, { isStatic: true, render: { visible: false } });
    const bottomFloor = Bodies.rectangle(width / 2, height + 500, width * 3, 1000, { isStatic: true, render: { visible: false } });

    World.add(engine.world, [textFloor1, textFloor2, ceiling, wallLeft, wallRight, bottomFloor]);

    const badgeBodies = BADGES.map((badge) => {
      const x = width / 2 + (Math.random() - 0.5) * (width * 0.4);
      const y = 80 + Math.random() * 50;

      return Bodies.rectangle(x, y, badge.w, badge.h, {
        restitution: 0.5,
        friction: 0.2,
        density: 0.002,
        chamfer: { radius: badge.type === "icon" ? badge.w / 2 : 20 },
        render: { visible: false },
        label: badge.id
      });
    });

    World.add(engine.world, badgeBodies);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    Events.on(engine, 'afterUpdate', () => {
      const newPos: Record<string, { x: number, y: number, angle: number }> = {};
      badgeBodies.forEach(body => {
        newPos[body.label] = { x: body.position.x, y: body.position.y, angle: body.angle };
      });
      setBadgePositions(newPos);
    });

    const handleResize = () => {
      if (!sceneRef.current || !line1Ref.current || !line2Ref.current || !codeLineRef.current) return;
      const newW = sceneRef.current.clientWidth;
      const newH = sceneRef.current.clientHeight;
      render.canvas.width = newW;
      render.canvas.height = newH;

      const sceneRect = sceneRef.current.getBoundingClientRect();
      const rect1 = line1Ref.current.getBoundingClientRect();
      const rect2 = line2Ref.current.getBoundingClientRect();

      // Ensure the floors are perfectly aligned to the top edge of the text lines
      const y1 = rect1.top - sceneRect.top;
      const y2 = rect2.top - sceneRect.top;

      // Bodies' origin is their center.
      // textFloors have height=200, so top edge is at center.y - 100. Thus center.y = y + 100.
      Matter.Body.setPosition(textFloor1, { x: newW / 2, y: y1 + 100 });
      Matter.Body.setPosition(textFloor2, { x: newW / 2, y: y2 + 100 });

      // ceiling bottom edge is at y=70 (below navbar)
      Matter.Body.setPosition(ceiling, { x: newW / 2, y: -180 });

      // walls
      Matter.Body.setPosition(wallLeft, { x: -500, y: newH / 2 });
      Matter.Body.setPosition(wallRight, { x: newW + 500, y: newH / 2 });

      // bottomFloor top edge. Height is 1000.
      // On mobile, keep badges above "MUHAMMAD" (y1).
      // On desktop, keep badges above "HANIF HAWARI" (y2).
      const isMobile = newW <= 768;
      if (isMobile) {
        Matter.Body.setPosition(bottomFloor, { x: newW / 2, y: y1 + 500 });
      } else {
        Matter.Body.setPosition(bottomFloor, { x: newW / 2, y: y2 + 500 });
      }
    };

    // Small delay to ensure fonts are loaded and layout is complete before measuring
    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, []);

  // Custom Physics Drag Handlers
  const handlePointerDown = useCallback((e: React.PointerEvent, badgeId: string) => {
    e.preventDefault();
    if (!engineRef.current || !sceneRef.current) return;
    const body = engineRef.current.world.bodies.find(b => b.label === badgeId);
    if (!body) return;

    playDragSound();

    e.currentTarget.setPointerCapture(e.pointerId);
    dragBodyRef.current = body;

    // Set static so it follows mouse exactly without gravity fighting it
    Matter.Body.setStatic(body, true);

    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastPosRef.current = { x, y };
    lastTimeRef.current = Date.now();
    velRef.current = { x: 0, y: 0 };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragBodyRef.current || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    Matter.Body.setPosition(dragBodyRef.current, { x, y });

    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velRef.current = {
        x: (x - lastPosRef.current.x) / dt * 20,
        y: (y - lastPosRef.current.y) / dt * 20
      };
    }
    lastPosRef.current = { x, y };
    lastTimeRef.current = now;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragBodyRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    Matter.Body.setStatic(dragBodyRef.current, false);
    // Apply calculated momentum
    Matter.Body.setVelocity(dragBodyRef.current, velRef.current);

    dragBodyRef.current = null;
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />

      {/* Physics Scene Container - Fully covers section but allows scroll through events-none */}
      <div
        ref={sceneRef}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        {BADGES.map(badge => {
          const pos = badgePositions[badge.id];
          if (!pos) return null;

          return (
            <div
              key={badge.id}
              className="absolute pointer-events-auto group touch-none"
              onPointerDown={(e) => handlePointerDown(e, badge.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                width: badge.w,
                height: badge.h,
                left: pos.x - badge.w / 2,
                top: pos.y - badge.h / 2,
                transform: `rotate(${pos.angle}rad)`,
                cursor: 'grab',
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.cursor = 'grabbing'; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.cursor = 'grab'; }}
            >
              <div
                className="w-full h-full flex items-center justify-center font-bold text-white bg-zinc-950 border-2 border-zinc-700 shadow-xl transition-all duration-300 group-hover:border-zinc-400 group-hover:bg-zinc-900 group-hover:scale-[1.08]"
                style={{
                  borderRadius: badge.type === "icon" ? '50%' : '9999px',
                  fontSize: badge.type === "icon" ? '22px' : '13px',
                  letterSpacing: badge.type === "icon" ? 'normal' : '0.15em',
                  userSelect: 'none',
                }}
              >
                {badge.text}
              </div>
            </div>
          );
        })}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center px-0 md:px-6 pt-20 relative z-10 pointer-events-none"
      >
        {/* Giant Name */}
        <h1
          className="font-black text-white text-center uppercase leading-[0.85] w-full text-[clamp(28px,10vw,240px)] md:text-[clamp(60px,14vw,240px)]"
          style={{
            fontWeight: 900,
            letterSpacing: '-0.04em',
            transform: 'scaleY(1.15)',
            marginTop: '10vh'
          }}
        >
          <span ref={line1Ref} className="inline-block relative z-30 whitespace-nowrap">MUHAMMAD</span>
          <br />
          <span ref={line2Ref} className="inline-block relative z-30 whitespace-nowrap">HANIF HAWARI</span>
        </h1>

        {/* Code subtitle line with typewriter effect */}
        <p ref={codeLineRef} className="px-6 md:px-0 mt-16 text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wide max-w-4xl text-center min-h-[160px] md:min-h-[100px] lg:min-h-[60px]">
          {displayedText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-1.5 h-3.5 bg-zinc-400 ml-1 align-middle"
          />
        </p>
      </motion.div>
    </section>
  );
}
