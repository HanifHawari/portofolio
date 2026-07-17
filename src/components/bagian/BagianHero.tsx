"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";

const typewriterText = `const INITIALIZE_SYSTEM = async () => { const Developer = { ID: "Muhammad_Hanif_Hawari", Origin: "Indonesia", Role: "Creative_Engineer" }; await System.load("Next.js", "React", "TypeScript", "Tailwind_CSS", "Framer_Motion"); if (Project.isComplex) return Developer.solveWith(Physics + Logic + Experience); const Mission = "Crafting digital experiences that feel alive, intentional, and intuitive."; return magic.deploy(); }; return "ONLINE"; <END_OF_SCRIPT>`;

const BADGES = [
  { id: "b1", text: "FRONTEND ENGINEER", type: "pill", w: 185, h: 46 },
  { id: "b2", text: "LINUX", type: "pill", w: 80, h: 46 },
  { id: "b3", text: "INFORMATICS", type: "pill", w: 130, h: 46 },
  { id: "b4", text: "UI/UX", type: "pill", w: 80, h: 46 },
  { id: "b5", text: "GRAPHIC DESIGN", type: "pill", w: 155, h: 46 },
  { id: "b6", text: "✦", type: "icon", w: 50, h: 50 },
  { id: "b7", text: "</>", type: "icon", w: 50, h: 50 },
  { id: "b8", text: "DATABASE", type: "pill", w: 105, h: 46 },
  { id: "b9", text: "ALGORITMA", type: "pill", w: 115, h: 46 },
];

interface HeroProps {
  isPreloaderDone?: boolean;
}

export default function HeroSection({ isPreloaderDone = true }: HeroProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

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

  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const badgeBodiesRef = useRef<Matter.Body[]>([]);
  const badgeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const codeLineRef = useRef<HTMLParagraphElement>(null);

  const dragBodyRef = useRef<Matter.Body | null>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const velRef = useRef({ x: 0, y: 0 });
  const boundaryYRef = useRef(0);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Runner, World, Bodies, Events } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 0.8;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Render canvas dihapus untuk optimasi performa (tidak me-render canvas tersembunyi)

    const floor1W = width * 10;
    const floor2W = width * 10;

    const textFloor1 = Bodies.rectangle(width / 2, height * 0.4, floor1W, 200, { isStatic: true, render: { visible: false } });
    const textFloor2 = Bodies.rectangle(width / 2, height * 0.5, floor2W, 200, { isStatic: true, render: { visible: false } });
    const ceiling = Bodies.rectangle(width / 2, -1000, width * 10, 500, { isStatic: true, render: { visible: false } });
    const wallLeft = Bodies.rectangle(-500, height / 2, 1000, height * 10, { isStatic: true, render: { visible: false } });
    const wallRight = Bodies.rectangle(width + 500, height / 2, 1000, height * 10, { isStatic: true, render: { visible: false } });
    const bottomFloor = Bodies.rectangle(width / 2, height + 500, width * 10, 1000, { isStatic: true, render: { visible: false } });

    World.add(engine.world, [textFloor1, textFloor2, ceiling, wallLeft, wallRight, bottomFloor]);

    // Pada Desktop, badge langsung dijatuhkan saat halaman dimuat
    if (window.innerWidth >= 768) {
      const bodies = BADGES.map((badge) => {
        const x = width / 2 + (Math.random() - 0.5) * (width * 0.4);
        const y = 80 + Math.random() * 50;

        if (badge.type === "icon") {
          return Bodies.circle(x, y, badge.w / 2, {
            restitution: 0.6,
            friction: 0.2,
            density: 0.002,
            render: { visible: false },
            label: badge.id
          });
        }
        return Bodies.rectangle(x, y, badge.w, badge.h, {
          restitution: 0.6,
          friction: 0.2,
          density: 0.002,
          chamfer: { radius: badge.type === "icon" ? badge.w / 2 : 20 },
          render: { visible: false },
          label: badge.id
        });
      });
      badgeBodiesRef.current = bodies;
      World.add(engine.world, bodies);
    }

    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, 'afterUpdate', () => {
      badgeBodiesRef.current.forEach(body => {
        const el = badgeRefs.current[body.label];
        if (el) {
          el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) rotate(${body.angle}rad)`;
        }
      });
    });

    let lastBubbleTime = 0;
    Events.on(engine, 'collisionStart', (event) => {
      const now = Date.now();
      if (now - lastBubbleTime > 50) {
        let play = false;
        let maxSpeed = 0;
        event.pairs.forEach(pair => {
          if (pair.bodyA.label.startsWith('b') && pair.bodyB.label.startsWith('b')) {
            play = true;
            const speedA = pair.bodyA.speed;
            const speedB = pair.bodyB.speed;
            maxSpeed = Math.max(maxSpeed, speedA, speedB);
          }
        });

        if (play && maxSpeed > 1) {
          lastBubbleTime = now;
        }
      }
    });


    const handleResize = () => {
      if (!sceneRef.current || !line1Ref.current || !line2Ref.current || !codeLineRef.current) return;
      const newW = sceneRef.current.clientWidth;
      const newH = sceneRef.current.clientHeight;

      const sceneRect = sceneRef.current.getBoundingClientRect();
      const rect1 = line1Ref.current.getBoundingClientRect();
      const rect2 = line2Ref.current.getBoundingClientRect();

      const y1 = rect1.top - sceneRect.top;
      const y2 = rect2.top - sceneRect.top;

      Matter.Body.setPosition(textFloor1, { x: newW / 2, y: y1 + 100 });
      Matter.Body.setPosition(textFloor2, { x: newW / 2, y: y2 + 100 });
      
      const isMobile = window.innerWidth < 768;
      const ceilingY = isMobile ? -270 : -1000; // Pada mobile, bottom ceiling berada di Y = -20 (di atas logo)
      Matter.Body.setPosition(ceiling, { x: newW / 2, y: ceilingY });
      
      Matter.Body.setPosition(wallLeft, { x: -500, y: newH / 2 });
      Matter.Body.setPosition(wallRight, { x: newW + 500, y: newH / 2 });

      const currentBoundaryY = y1;
      boundaryYRef.current = currentBoundaryY;
      Matter.Body.setPosition(bottomFloor, { x: newW / 2, y: currentBoundaryY + 500 });
    };

    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  // Effect to drop badges when preloader finishes (MOBILE ONLY)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 768) return; // Abaikan di desktop (sudah di-spawn di awal)

    if (!isPreloaderDone || !engineRef.current || !sceneRef.current) return;
    if (badgeBodiesRef.current.length > 0) return; // Prevent double spawn

    const width = sceneRef.current.clientWidth;
    const bodies = BADGES.map((badge, index) => {
      // Spawn dari area atas logo pada mobile (aman dari ceiling di y=-20)
      const x = width / 2 + (Math.random() - 0.5) * (width * 0.8);
      const y = 30 + (index * 20) + (Math.random() * 30);

      if (badge.type === "icon") {
        return Matter.Bodies.circle(x, y, badge.w / 2, {
          restitution: 0.6,
          friction: 0.2,
          density: 0.002,
          render: { visible: false },
          label: badge.id
        });
      }
      return Matter.Bodies.rectangle(x, y, badge.w, badge.h, {
        restitution: 0.6,
        friction: 0.2,
        density: 0.002,
        chamfer: { radius: badge.type === "icon" ? badge.w / 2 : 20 },
        render: { visible: false },
        label: badge.id
      });
    });

    badgeBodiesRef.current = bodies;
    Matter.World.add(engineRef.current.world, bodies);
  }, [isPreloaderDone]);

  const handlePointerDown = useCallback((e: React.PointerEvent, badgeId: string) => {
    e.preventDefault();
    if (!engineRef.current || !sceneRef.current) return;
    const body = engineRef.current.world.bodies.find(b => b.label === badgeId);
    if (!body) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    dragBodyRef.current = body;

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

    const isMobile = window.innerWidth < 768;
    const minDragY = isMobile ? -20 : 0;
    const clampedY = Math.max(minDragY, Math.min(y, boundaryYRef.current - 20));

    Matter.Body.setPosition(dragBodyRef.current, { x, y: clampedY });

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

      <div
        ref={sceneRef}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        {BADGES.map(badge => {
          return (
            <div
              key={badge.id}
              ref={el => { badgeRefs.current[badge.id] = el; }}
              className="absolute pointer-events-auto group touch-none will-change-transform"
              onPointerDown={(e) => handlePointerDown(e, badge.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                width: badge.w,
                height: badge.h,
                left: 0,
                top: 0,
                translate: '-50% -50%',
                cursor: 'grab',
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.cursor = 'grabbing'; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.cursor = 'grab'; }}
            >
              <div
                className="w-full h-full flex items-center justify-center font-bold text-white bg-zinc-950 border-2 border-zinc-700 transition-colors duration-300 group-hover:border-zinc-400 group-hover:bg-zinc-900"
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

        <h1
          className="giant-name font-black text-white text-center uppercase leading-[0.8] w-full flex flex-col items-center overflow-hidden max-w-[100vw]"
          style={{
            fontWeight: 900,
            letterSpacing: '-0.04em',
            transform: 'scaleY(1.15)',
          }}
        >
          <span ref={line1Ref} className="mb-2 sm:mb-0 inline-block relative z-30 whitespace-nowrap text-[14vw] sm:text-[clamp(60px,14vw,240px)]">MUHAMMAD</span>
          <span ref={line2Ref} className="inline-block relative z-30 whitespace-nowrap text-[14vw] sm:text-[clamp(60px,14vw,240px)]">HANIF HAWARI</span>
        </h1>

        <div className="w-full max-w-4xl px-4 sm:px-6 md:px-0 mt-4 sm:mt-16 h-[200px] sm:h-[120px] lg:h-[80px] flex justify-center">
          <p ref={codeLineRef} className="text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wide text-center">
            {displayedText}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1.5 h-3.5 bg-zinc-400 ml-1 align-middle"
            />
          </p>
        </div>
      </motion.div>
    </section>
  );
}
