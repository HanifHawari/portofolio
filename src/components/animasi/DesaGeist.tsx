"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/KonteksBahasa";

type Mood = "normal" | "fear" | "angry" | "dizzy" | "happy" | "sleepy";

const ROBOT_PERSONALITIES = [
  { label: "KING", mood: "happy" as Mood },
  { label: "ANGEL", mood: "happy" as Mood },
  { label: "ANGRY", mood: "angry" as Mood },
  { label: "COOL", mood: "normal" as Mood },
  { label: "NERD", mood: "normal" as Mood },
  { label: "SLEEPY", mood: "sleepy" as Mood },
  { label: "AIM", mood: "normal" as Mood },
  { label: "CODER", mood: "happy" as Mood },
  { label: "ASTRO", mood: "normal" as Mood },
  { label: "JOKER", mood: "happy" as Mood },
  { label: "ALIEN", mood: "normal" as Mood },
  { label: "GHOST", mood: "sleepy" as Mood },
];

const CANVAS_H = 500;
const ROBOT_RADIUS = 26;

const STATE = {
  WALKING: "WALKING",
  HELD: "HELD",
  THROWN: "THROWN",
  KNOCKED: "KNOCKED",
  RECOVERING: "RECOVERING",
} as const;
type RobotState = typeof STATE[keyof typeof STATE];

const EXPR = {
  NORMAL: "normal",
  FEAR: "fear",
  ANGRY: "angry",
  DIZZY: "dizzy",
  CONFUSED: "confused",
};

// Physics tuning
const GRAVITY = 0;
const FRICTION = 0.985;
const RESTITUTION = 0.7;
const SETTLE_SPEED = 0.15;
const SETTLE_FRAMES_NEEDED = 20;
const MAX_THROW_SPEED = 28;
const TRAIL_LENGTH = 5;

interface VirtualRobot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  walkDir: number;
  walkPhase: "moving" | "paused";
  phaseTimer: number;
  state: RobotState;
  baseExpression: string;
  expression: string;
  label: string;
  blinkTimer: number;
  settleCounter: number;
  recoverTimer: number;
  shakeSeed: number;
  cursorTrail: {x: number, y: number, t: number}[];
}

// --- helper: rounded rect path ---
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// --- wajah robot digambar langsung, per-ekspresi ---
function drawFace(ctx: CanvasRenderingContext2D, robot: VirtualRobot, t: number) {
  const { expression } = robot;
  const wobble = Math.sin(t / 60 + robot.shakeSeed) * 1.2;

  // face plate (dasar wajah, mirip panel gelap di kepala robot)
  ctx.save();
  ctx.fillStyle = "#141a33";
  roundRectPath(ctx, -17, -12, 34, 22, 8);
  ctx.fill();

  const eyeY = -1;
  const eyeGap = 8;

  const eyeColor = "#7fe3ff";
  const pupilGlow = "#e8fbff";

  const drawEye = (side: number) => {
    const ex = side * eyeGap;
    ctx.save();
    ctx.translate(ex, eyeY);

    if (expression === EXPR.NORMAL || expression === "happy" || expression === "sleepy") {
      // Jika blinkTimer <= 0, mata berkedip tertutup sekejap
      if (robot.blinkTimer < 5 && robot.blinkTimer > 0) {
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-3.5, 0);
        ctx.lineTo(3.5, 0);
        ctx.stroke();
      } else {
        // mata oval tenang
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        if (expression === "sleepy") {
          ctx.ellipse(0, 1, 3.2, 1.5, 0, 0, Math.PI * 2);
        } else {
          ctx.ellipse(0, 0, 3.2, 4.2, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.fillStyle = pupilGlow;
        ctx.beginPath();
        ctx.arc(-0.8, -1.2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (expression === EXPR.FEAR) {
      // mata membelalak lebar + goyang halus (gemetar)
      ctx.translate(wobble * 0.6, 0);
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.ellipse(0, 0.5, 4.4, 5.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pupilGlow;
      ctx.beginPath();
      ctx.arc(0, -0.5, 1.6, 0, Math.PI * 2);
      ctx.fill();
      // alis terangkat (kaget/takut)
      ctx.strokeStyle = eyeColor;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-4 * side, -8);
      ctx.quadraticCurveTo(0, -11, 4 * side, -7.5);
      ctx.stroke();
    } else if (expression === EXPR.ANGRY) {
      // mata menyipit jadi garis tajam
      ctx.strokeStyle = eyeColor;
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-3.5, 1.5);
      ctx.lineTo(3.5, -1.5);
      ctx.stroke();
      // alis menukik marah
      ctx.beginPath();
      ctx.moveTo(-4.5 * side, -6);
      ctx.lineTo(3 * side, -2);
      ctx.stroke();
    } else if (expression === EXPR.CONFUSED) {
      // mata asimetris: satu sipit satu melotot, pandangan gak searah (bingung)
      const isRight = side === 1;
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.ellipse(0, isRight ? -1.5 : 0.8, 3.2, isRight ? 4.6 : 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pupilGlow;
      ctx.beginPath();
      ctx.arc(isRight ? 1 : -1, isRight ? -2 : 1, 1, 0, Math.PI * 2);
      ctx.fill();
      if (isRight) {
        // alis terangkat cuma sebelah, ciri khas raut bingung
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-3, -8);
        ctx.quadraticCurveTo(1, -11.5, 4.5, -8);
        ctx.stroke();
      }
    } else if (expression === EXPR.DIZZY) {
      // mata jadi spiral kecil (pusing)
      ctx.strokeStyle = eyeColor;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      const spin = t / 80;
      for (let a = 0; a < Math.PI * 3.2; a += 0.35) {
        const r = 0.6 + a * 0.6;
        const px = Math.cos(a + spin) * r;
        const py = Math.sin(a + spin) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  drawEye(-1);
  drawEye(1);

  // mulut
  ctx.strokeStyle = eyeColor;
  ctx.fillStyle = eyeColor;
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  const mouthY = 6;
  if (expression === EXPR.NORMAL || expression === "sleepy") {
    ctx.arc(0, mouthY - 2, 4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  } else if (expression === "happy") {
    ctx.arc(0, mouthY - 2, 4, 0, Math.PI);
    ctx.fill();
  } else if (expression === EXPR.FEAR) {
    ctx.ellipse(0, mouthY, 2, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (expression === EXPR.ANGRY) {
    ctx.moveTo(-4, mouthY);
    ctx.lineTo(4, mouthY);
    ctx.stroke();
  } else if (expression === EXPR.CONFUSED) {
    // mulut kecil miring, kesan "hmm?"
    ctx.moveTo(-3, mouthY - 0.5);
    ctx.quadraticCurveTo(0, mouthY + 1.8, 3.5, mouthY - 1.5);
    ctx.stroke();
  } else if (expression === EXPR.DIZZY) {
    ctx.moveTo(-4, mouthY);
    ctx.quadraticCurveTo(-2, mouthY + 2, 0, mouthY);
    ctx.quadraticCurveTo(2, mouthY - 2, 4, mouthY);
    ctx.stroke();
  }

  ctx.restore();
}

// Lengan dihapus sesuai permintaan

function drawRobot(ctx: CanvasRenderingContext2D, robot: VirtualRobot, t: number) {
  ctx.save();
  ctx.translate(robot.x, robot.y);

  // (Teks label dihilangkan)

  const tilt =
    robot.state === STATE.THROWN || robot.state === STATE.KNOCKED
      ? Math.atan2(robot.vy, robot.vx) * 0.15
      : Math.sin(t / 200 + robot.shakeSeed) * 0.05;
  ctx.rotate(tilt);

  // bayangan lembut di lantai
  ctx.beginPath();
  ctx.ellipse(0, ROBOT_RADIUS + 6, ROBOT_RADIUS * 0.65, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fill();

  // 2 antena kecil di atas kepala (bentuk V)
  ctx.strokeStyle = "#c9d3e0";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  
  const antennaPulse = 0.5 + Math.abs(Math.sin(t / 300));
  const glowColor = `rgba(127,227,255,${0.5 + antennaPulse * 0.5})`;
  
  const drawAntenna = (side: number) => {
    ctx.beginPath();
    const startX = side * 9;
    const startY = -ROBOT_RADIUS * 0.88;
    const endX = side * 16;
    const endY = -ROBOT_RADIUS * 1.28;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(endX, endY, 3, 0, Math.PI * 2);
    ctx.fillStyle = glowColor;
    ctx.fill();
  };

  drawAntenna(-1);
  drawAntenna(1);

  // body: bentuk teardrop membulat
  const grad = ctx.createLinearGradient(0, -ROBOT_RADIUS, 0, ROBOT_RADIUS);
  grad.addColorStop(0, "#fbfdff");
  grad.addColorStop(1, "#c9d3e0");
  ctx.beginPath();
  ctx.moveTo(-ROBOT_RADIUS * 0.95, -ROBOT_RADIUS * 0.15);
  ctx.bezierCurveTo(
    -ROBOT_RADIUS * 1.02, -ROBOT_RADIUS * 0.95,
    -ROBOT_RADIUS * 0.5, -ROBOT_RADIUS * 1.15,
    0, -ROBOT_RADIUS * 1.05
  );
  ctx.bezierCurveTo(
    ROBOT_RADIUS * 0.5, -ROBOT_RADIUS * 1.15,
    ROBOT_RADIUS * 1.02, -ROBOT_RADIUS * 0.95,
    ROBOT_RADIUS * 0.95, -ROBOT_RADIUS * 0.15
  );
  ctx.bezierCurveTo(
    ROBOT_RADIUS * 1.05, ROBOT_RADIUS * 0.55,
    ROBOT_RADIUS * 0.6, ROBOT_RADIUS * 1.08,
    0, ROBOT_RADIUS * 1.08
  );
  ctx.bezierCurveTo(
    -ROBOT_RADIUS * 0.6, ROBOT_RADIUS * 1.08,
    -ROBOT_RADIUS * 1.05, ROBOT_RADIUS * 0.55,
    -ROBOT_RADIUS * 0.95, -ROBOT_RADIUS * 0.15
  );
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // highlight/kilau di bagian atas kepala
  ctx.beginPath();
  ctx.ellipse(-ROBOT_RADIUS * 0.3, -ROBOT_RADIUS * 0.55, ROBOT_RADIUS * 0.32, ROBOT_RADIUS * 0.18, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fill();

  // panel dada tipis
  ctx.strokeStyle = "rgba(148,163,184,0.5)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, ROBOT_RADIUS * 0.35, ROBOT_RADIUS * 0.55, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // aksen indikator state
  const stateAccent = {
    [STATE.WALKING]: "#7dd3fc",
    [STATE.HELD]: "#fbbf24",
    [STATE.THROWN]: "#f87171",
    [STATE.KNOCKED]: "#fb923c",
    [STATE.RECOVERING]: "#a78bfa",
  }[robot.state];
  ctx.beginPath();
  ctx.arc(0, ROBOT_RADIUS * 0.62, 2.6, 0, Math.PI * 2);
  ctx.fillStyle = stateAccent as string;
  ctx.fill();

  drawFace(ctx, robot, t);

  ctx.restore();
}

export default function GeistVillage() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const robotsRef = useRef<VirtualRobot[]>([]);
  const draggingRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  
  const containerSize = useRef({ width: 800, height: CANVAS_H });

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup observer for dynamic width
    const obs = new ResizeObserver((entries) => {
       const rect = entries[0].contentRect;
       containerSize.current = { width: rect.width, height: CANVAS_H };
       if (canvasRef.current) {
           canvasRef.current.width = rect.width;
           canvasRef.current.height = CANVAS_H;
       }
    });
    obs.observe(containerRef.current);
    
    const activePersonalities = typeof window !== 'undefined' && window.innerWidth < 768 
        ? ROBOT_PERSONALITIES.slice(0, 8) 
        : ROBOT_PERSONALITIES;
        
    const newRobots: VirtualRobot[] = activePersonalities.map((p, i) => {
      const w = containerRef.current!.clientWidth;
      const x = 60 + Math.random() * (w - 120);
      const y = 60 + Math.random() * (CANVAS_H - 120);
      
      return {
        id: i,
        x, y,
        vx: 0, vy: 0,
        walkDir: Math.random() * Math.PI * 2,
        walkPhase: "moving",
        phaseTimer: 60 + Math.random() * 200,
        state: STATE.WALKING,
        baseExpression: p.mood,
        expression: p.mood,
        label: p.label,
        blinkTimer: 60 + Math.random() * 120,
        settleCounter: 0,
        recoverTimer: 0,
        shakeSeed: Math.random() * 1000,
        cursorTrail: [],
      };
    });
    
    robotsRef.current = newRobots;

    return () => obs.disconnect();
  }, []);

  const distance = (a: VirtualRobot, b: VirtualRobot) => Math.hypot(a.x - b.x, a.y - b.y);

  const applyVelocity = (robot: VirtualRobot) => {
    const trail = robot.cursorTrail;
    if (trail.length < 2) return;
    const first = trail[0];
    const last = trail[trail.length - 1];
    const dt = Math.max(1, last.t - first.t);
    let vx = ((last.x - first.x) / dt) * 16; 
    let vy = ((last.y - first.y) / dt) * 16;

    const speed = Math.hypot(vx, vy);
    if (speed > MAX_THROW_SPEED) {
      const scale = MAX_THROW_SPEED / speed;
      vx *= scale;
      vy *= scale;
    }
    robot.vx = vx;
    robot.vy = vy;
  };

  const checkCollisions = useCallback((robots: VirtualRobot[]) => {
    for (let i = 0; i < robots.length; i++) {
      for (let j = i + 1; j < robots.length; j++) {
        const a = robots[i];
        const b = robots[j];
        const dist = distance(a, b);
        const minDist = ROBOT_RADIUS * 2.2; // Slightly larger for nice bounce
        if (dist < minDist && dist > 0) {
          const overlap = minDist - dist;
          const nx = (a.x - b.x) / dist;
          const ny = (a.y - b.y) / dist;
          a.x += (nx * overlap) / 2;
          a.y += (ny * overlap) / 2;
          b.x -= (nx * overlap) / 2;
          b.y -= (ny * overlap) / 2;

          const rvx = a.vx - b.vx;
          const rvy = a.vy - b.vy;
          const velAlongNormal = rvx * nx + rvy * ny;
          if (velAlongNormal < 0) {
            const impulse = -(1 + RESTITUTION) * velAlongNormal * 0.5;
            a.vx += impulse * nx;
            a.vy += impulse * ny;
            b.vx -= impulse * nx;
            b.vy -= impulse * ny;
          }

          [a, b].forEach((robot, idx) => {
            const other = idx === 0 ? b : a;
            const wasMoving = Math.hypot(other.vx, other.vy) > 1.5;
            if (robot.state === STATE.WALKING && wasMoving) {
              robot.state = STATE.KNOCKED;
              robot.expression = EXPR.ANGRY;
              robot.settleCounter = 0;
            }
          });
        }
      }
    }
  }, []);

  const updatePhysics = useCallback(() => {
    const robots = robotsRef.current;
    const WIDTH = containerSize.current.width;
    const HEIGHT = containerSize.current.height;

    robots.forEach((robot) => {
      robot.blinkTimer -= 1;
      if (robot.blinkTimer < 0) {
          robot.blinkTimer = 60 + Math.random() * 120;
      }

      if (robot.state === STATE.HELD) {
        return;
      }

      if (robot.state === STATE.THROWN || robot.state === STATE.KNOCKED) {
        robot.vy += GRAVITY;
        robot.vx *= FRICTION;
        robot.vy *= FRICTION;
        robot.x += robot.vx;
        robot.y += robot.vy;

        if (robot.x < ROBOT_RADIUS) {
          robot.x = ROBOT_RADIUS;
          robot.vx *= -RESTITUTION;
        }
        if (robot.x > WIDTH - ROBOT_RADIUS) {
          robot.x = WIDTH - ROBOT_RADIUS;
          robot.vx *= -RESTITUTION;
        }
        if (robot.y < ROBOT_RADIUS) {
          robot.y = ROBOT_RADIUS;
          robot.vy *= -RESTITUTION;
        }
        if (robot.y > HEIGHT - ROBOT_RADIUS - 10) { // Slight padding bottom
          robot.y = HEIGHT - ROBOT_RADIUS - 10;
          robot.vy *= -RESTITUTION;
        }

        const speed = Math.hypot(robot.vx, robot.vy);
        if (speed < SETTLE_SPEED) {
          robot.settleCounter++;
          if (robot.settleCounter > SETTLE_FRAMES_NEEDED) {
            robot.state = STATE.RECOVERING;
            robot.expression = EXPR.DIZZY;
            robot.recoverTimer = 40; 
          }
        } else {
          robot.settleCounter = 0;
        }
        return;
      }

      if (robot.state === STATE.RECOVERING) {
        robot.recoverTimer--;
        if (robot.recoverTimer <= 0) {
          robot.state = STATE.WALKING;
          robot.walkPhase = "moving";
          robot.phaseTimer = 100 + Math.random() * 200;
          robot.expression = robot.baseExpression;
          robot.walkDir = Math.random() * Math.PI * 2;
        }
        return;
      }

      if (robot.state === STATE.WALKING) {
        robot.phaseTimer--;

        if (robot.phaseTimer <= 0) {
          if (robot.walkPhase === "moving") {
            // Berhenti sejenak, wajah bingung
            robot.walkPhase = "paused";
            robot.expression = EXPR.CONFUSED;
            robot.phaseTimer = 40 + Math.random() * 80;
          } else {
            // Lanjut jalan
            robot.walkPhase = "moving";
            robot.expression = robot.baseExpression;
            robot.phaseTimer = 100 + Math.random() * 300;
            // sekalian ganti arah dikit, kesan "oh oke lanjut jalan"
            robot.walkDir += (Math.random() - 0.5) * 1.5;
          }
        }

        if (robot.walkPhase === "moving") {
          const speed = 0.35; 
          robot.x += Math.cos(robot.walkDir) * speed;
          robot.y += Math.sin(robot.walkDir) * speed;

          if (robot.x < ROBOT_RADIUS || robot.x > WIDTH - ROBOT_RADIUS) {
            robot.walkDir = Math.PI - robot.walkDir;
          }
          if (robot.y < ROBOT_RADIUS || robot.y > HEIGHT - ROBOT_RADIUS - 10) {
            robot.walkDir = -robot.walkDir;
          }
          robot.x = Math.max(ROBOT_RADIUS, Math.min(WIDTH - ROBOT_RADIUS, robot.x));
          robot.y = Math.max(ROBOT_RADIUS, Math.min(HEIGHT - ROBOT_RADIUS - 10, robot.y));

          if (Math.random() < 0.005) {
            robot.walkDir += (Math.random() - 0.5) * 1.2;
          }
        }
      }
    });

    checkCollisions(robots);
  }, [checkCollisions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (t: number) => {
      updatePhysics();
      
      const WIDTH = containerSize.current.width;
      const HEIGHT = containerSize.current.height;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // We don't draw the background because we have the CSS background on the container
      
      robotsRef.current.forEach((robot) => drawRobot(ctx, robot, t));
      
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updatePhysics]);

  const getMousePos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
       clientX = e.touches[0].clientX;
       clientY = e.touches[0].clientY;
    } else {
       clientX = (e as React.MouseEvent).clientX;
       clientY = (e as React.MouseEvent).clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getMousePos(e);
    const robots = robotsRef.current;
    
    const hit = [...robots].reverse().find(
      (r) => Math.hypot(r.x - pos.x, r.y - pos.y) < ROBOT_RADIUS * 1.5
    );
    if (!hit) return;
    
    if ('touches' in e && e.cancelable) e.preventDefault();

    draggingRef.current = hit.id;
    hit.state = STATE.HELD;
    hit.expression = EXPR.FEAR;
    hit.vx = 0;
    hit.vy = 0;
    hit.cursorTrail = [{ x: pos.x, y: pos.y, t: performance.now() }];
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingRef.current == null) return;
    if ('touches' in e && e.cancelable) e.preventDefault();
    
    const pos = getMousePos(e);
    const robot = robotsRef.current.find((r) => r.id === draggingRef.current);
    if (!robot) return;

    robot.x = pos.x;
    robot.y = pos.y;
    robot.cursorTrail.push({ x: pos.x, y: pos.y, t: performance.now() });
    if (robot.cursorTrail.length > TRAIL_LENGTH) robot.cursorTrail.shift();
  };

  const handlePointerUp = () => {
    if (draggingRef.current == null) return;
    const robot = robotsRef.current.find((r) => r.id === draggingRef.current);
    if (robot) {
      applyVelocity(robot);
      robot.state = STATE.THROWN;
      robot.expression = EXPR.FEAR;
      robot.settleCounter = 0;
    }
    draggingRef.current = null;
  };
  
  useEffect(() => {
     const el = containerRef.current;
     if (!el) return;
     const onTouchMove = (e: TouchEvent) => {
         if (draggingRef.current != null && e.cancelable) {
             e.preventDefault();
         }
     };
     el.addEventListener('touchmove', onTouchMove, { passive: false });
     return () => el.removeEventListener('touchmove', onTouchMove);
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          ref={containerRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          onTouchCancel={handlePointerUp}
          className="relative overflow-hidden group border border-zinc-800 bg-zinc-950/30 transition-all duration-300 rounded-lg cursor-grab active:cursor-grabbing"
          style={{ height: CANVAS_H, touchAction: 'none' }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/30 to-transparent z-0 pointer-events-none" />
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none" />
          <div className="absolute top-0 left-1/4 right-1/4 h-[12px] bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none z-0" />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `linear-gradient(var(--geist-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--geist-grid-color) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }} />
          
          {/* We render the canvas on top of the CSS background */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </motion.div>
      </div>
    </section>
  );
}
