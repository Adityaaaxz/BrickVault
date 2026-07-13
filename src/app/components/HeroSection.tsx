"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Zap, Star } from "lucide-react";
import LegoButton from "./LegoButton";
import { playBrickClick } from "@/lib/sound";

// ─── Floating Brick ───────────────────────────────────────────────────────────
function LegoBrick({
  color, size, delay, startX, startY, endX, endY, rotation,
}: {
  color: string; size: number; delay: number;
  startX: number; startY: number; endX: number; endY: number; rotation: number;
}) {
  return (
    <motion.div
      className="absolute rounded-md pointer-events-none"
      style={{
        width: size,
        height: size * 0.6,
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        boxShadow: `0 4px 0 ${color}66, 0 8px 24px ${color}33, inset 0 1px 0 ${color}ff`,
      }}
      initial={{ x: startX, y: startY, opacity: 0, scale: 0, rotate: rotation + 180 }}
      animate={{
        x: endX, y: endY,
        opacity: [0, 1, 1, 0.5],
        scale: [0, 1.3, 1, 0.85],
        rotate: [rotation + 180, rotation - 10, rotation],
      }}
      transition={{ duration: 2.2, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="absolute rounded-full"
        style={{ width: size * 0.3, height: size * 0.3, top: -size * 0.12, left: "15%",
          background: `radial-gradient(circle at 40% 30%, ${color}ff, ${color}88)`,
          boxShadow: `0 2px 4px ${color}44` }} />
      <div className="absolute rounded-full"
        style={{ width: size * 0.3, height: size * 0.3, top: -size * 0.12, right: "15%",
          background: `radial-gradient(circle at 40% 30%, ${color}ff, ${color}88)`,
          boxShadow: `0 2px 4px ${color}44` }} />
      <div className="absolute top-1 left-1 right-1/2 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
    </motion.div>
  );
}

// ─── Particle ──────────────────────────────────────────────────────────────────
function Particle({ color, angle, distance, delay }: { color: string; angle: number; distance: number; delay: number }) {
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: 6, height: 6, background: color, top: "50%", left: "50%", marginLeft: -3, marginTop: -3 }}
      initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      animate={{ opacity: 0, scale: 0, x: tx, y: ty }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
    />
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Generate bricks ──────────────────────────────────────────────────────────
function generateBricks(count: number) {
  const colors = ["#D1120D", "#FFD500", "#0055BF", "#00852B", "#FF7E14", "#8B4DBF", "#00BCD4"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: 28 + Math.random() * 48,
    delay: Math.random() * 2,
    startX: (Math.random() - 0.5) * 1400,
    startY: -400 - Math.random() * 600,
    endX: (Math.random() - 0.5) * 900,
    endY: (Math.random() - 0.5) * 500,
    rotation: Math.random() * 360,
  }));
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, [started, text]);

  return <>{displayed}{started && displayed.length < text.length && <span className="animate-pulse text-lego-yellow">|</span>}</>;
}

export default function HeroSection() {
  const [bricks, setBricks] = useState<ReturnType<typeof generateBricks>>([]);
  const [particles, setParticles] = useState<boolean>(false);
  const [showParticles, setShowParticles] = useState(false);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth: w, innerHeight: h } = window;
    mouseX.set((e.clientX / w - 0.5) * 30);
    mouseY.set((e.clientY / h - 0.5) * 30);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setBricks(generateBricks(22));
    setTimeout(() => { setParticles(true); setShowParticles(true); }, 600);
    setTimeout(() => setShowParticles(false), 2000);
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const titleWords = [
    { word: "Build", color: "text-lego-red" },
    { word: "Your", color: "text-lego-yellow" },
    { word: "Dreams", color: "text-lego-blue" },
  ];

  const particleColors = ["#D1120D", "#FFD500", "#0055BF", "#00852B", "#FF7E14", "#8B4DBF"];
  const particleAngles = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-28">
      {/* Deep background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070710] via-[#0f0f1f] to-lego-dark" />

      {/* Stud texture */}
      <div className="absolute inset-0 lego-stud-bg opacity-20" />

      {/* Parallax glows */}
      <motion.div
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <div className="w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(209,18,13,0.12) 0%, rgba(255,213,0,0.05) 40%, transparent 70%)", filter: "blur(40px)" }} />
      </motion.div>
      <motion.div
        className="absolute top-1/3 left-1/4 pointer-events-none"
        style={{ x: springX, y: springY }}
      >
        <div className="w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,85,191,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 right-1/4 pointer-events-none"
        style={{ x: springX, y: springY }}
      >
        <div className="w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,77,191,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </motion.div>

      {/* Floating bricks layer with parallax */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ x: springX, y: springY }}
      >
        {bricks.map((brick) => (
          <LegoBrick key={brick.id} {...brick} />
        ))}
      </motion.div>

      {/* Particle burst */}
      <AnimatePresence>
        {particles && showParticles && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {particleAngles.map((angle, i) => (
              <Particle
                key={angle}
                color={particleColors[i % particleColors.length]}
                angle={angle}
                distance={150 + Math.random() * 200}
                delay={i * 0.02}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Orbiting ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
        <motion.div
          className="w-[600px] h-[600px] rounded-full"
          style={{ border: "1px solid rgba(255,213,0,0.4)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ border: "1px solid rgba(209,18,13,0.4)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black leading-none mb-6 sm:mb-8" style={{ perspective: "800px" }}>
          {titleWords.map(({ word, color }, i) => (
            <motion.span
              key={word}
              className={`inline-block mr-3 sm:mr-5 ${color}`}
              initial={{ opacity: 0, y: 120, rotateX: -90, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.7 + i * 0.18, type: "spring", stiffness: 120, damping: 14 }}
              style={{
                textShadow: `0 4px 0 rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.2)`,
                display: "inline-block",
              }}
              whileHover={{
                scale: 1.08,
                textShadow: `0 0 30px currentColor, 0 4px 0 rgba(0,0,0,0.4)`,
                transition: { duration: 0.2 },
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle with typewriter */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed px-2 min-h-[4rem]"
        >
          <Typewriter
            text="Discover the world's most iconic building sets. From the Millennium Falcon to the Lamborghini Sián — every brick tells a story."
            delay={1.8}
          />
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <LegoButton
              variant="red"
              size="lg"
              icon={<Zap className="w-5 h-5" />}
              onClick={() => {
                document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Sets
            </LegoButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <LegoButton
              variant="yellow"
              size="lg"
              onClick={() => {
                document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Try Playground
            </LegoButton>
          </motion.div>
        </motion.div>

        {/* Stats with animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
          className="mt-16 sm:mt-20 grid grid-cols-3 gap-6 sm:gap-12 max-w-lg mx-auto"
        >
          {[
            { value: 50000, suffix: "+", label: "Sets Available", color: "#FFD500" },
            { value: 4.9, suffix: "★", label: "Avg Rating", color: "#D1120D" },
            { value: 100, suffix: "%", label: "Authentic", color: "#0055BF" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-2xl sm:text-3xl font-black mb-1 transition-all duration-300 group-hover:scale-110"
                style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}66` }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] sm:text-xs text-white/35 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-lego-yellow transition-colors cursor-pointer group"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => {
          playBrickClick();
          document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity">Scroll</span>
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
}
