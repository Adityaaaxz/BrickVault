"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Lightbulb, Shield, Smile, TrendingUp, Globe, Award } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const benefits = [
  {
    icon: Lightbulb,
    title: "Unleash Creativity",
    description: "Every LEGO set is a canvas for imagination. Build, rebuild, and create something entirely new each time.",
    color: "#FFD500",
    glow: "rgba(255,213,0,0.3)",
    stat: "90+",
    statLabel: "Years of Innovation",
    bg: "from-yellow-500/10 to-yellow-600/5",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Premium ABS plastic ensures every brick clicks perfectly and lasts for generations of builders.",
    color: "#0055BF",
    glow: "rgba(0,85,191,0.3)",
    stat: "400B+",
    statLabel: "Bricks Produced",
    bg: "from-blue-500/10 to-blue-600/5",
  },
  {
    icon: Smile,
    title: "Fun for Everyone",
    description: "From age 4 to 99 — LEGO brings families together. Build solo or make it a team adventure.",
    color: "#D1120D",
    glow: "rgba(209,18,13,0.3)",
    stat: "100+",
    statLabel: "Countries Sold",
    bg: "from-red-500/10 to-red-600/5",
  },
];

const extraStats = [
  { icon: TrendingUp, value: "50K+", label: "Sets Released", color: "#FF7E14" },
  { icon: Globe,      value: "140+", label: "Countries",     color: "#00852B" },
  { icon: Award,      value: "#1",   label: "Toy Brand",     color: "#FFD500" },
];

// Spotlight card effect
function SpotlightCard({ children, color, className = "", style }: { children: React.ReactNode; color: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotOpacity = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    spotOpacity.set(1);
  };

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, ${color}18, transparent 70%)`
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => spotOpacity.set(0)}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0 transition-opacity duration-300"
        style={{ background, opacity: spotOpacity }}
      />
      {children}
    </motion.div>
  );
}

// Animated number
function AnimatedStat({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="text-3xl sm:text-4xl font-black mb-1" style={{ color, textShadow: `0 0 20px ${color}66` }}>
        {value}
      </div>
      <div className="text-xs text-white/40 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

export default function Benefits() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="benefits" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080812] via-lego-dark to-[#080812]" />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-lg"
            style={{
              width: 40 + i * 20,
              height: 24 + i * 12,
              background: ["#D1120D","#FFD500","#0055BF","#00852B","#FF7E14","#8B4DBF"][i % 6],
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 50}%`,
              opacity: 0.06,
            }}
            animate={{ y: [0, -15, 0], rotate: [i * 15, i * 15 + 8, i * 15] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal type="fade-up" className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4">
            More Than Just <span className="text-lego-yellow">Bricks</span>
          </h2>
          <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto">
            Three reasons why LEGO has been the world&apos;s favorite building system for over 90 years.
          </p>
        </ScrollReveal>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} type="fade-up" delay={i * 0.15}>
              <SpotlightCard
                color={b.color}
                className="relative group p-6 sm:p-8 rounded-2xl cursor-default overflow-hidden h-full"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: hoveredIdx === i ? `2px solid ${b.color}40` : "2px solid rgba(255,255,255,0.07)",
                  transition: "border-color 0.3s ease",
                  backdropFilter: "blur(12px)",
                }}
              >
                <motion.div
                  onHoverStart={() => setHoveredIdx(i)}
                  onHoverEnd={() => setHoveredIdx(null)}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative z-10 h-full flex flex-col"
                >
                  {/* Stat badge */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `${b.color}15`,
                        border: `2px solid ${b.color}30`,
                        boxShadow: hoveredIdx === i ? `0 0 20px ${b.glow}` : "none",
                      }}
                      whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }}
                      transition={{ duration: 0.5 }}
                    >
                      <b.icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: b.color }} />
                    </motion.div>
                    <div className="text-right">
                      <div className="text-2xl font-black" style={{ color: b.color }}>{b.stat}</div>
                      <div className="text-xs text-white/30">{b.statLabel}</div>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">{b.title}</h3>
                  <p className="text-sm sm:text-base text-white/50 leading-relaxed flex-1">{b.description}</p>

                  {/* Progress bar decoration */}
                  <div className="mt-6 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${b.color}, ${b.color}66)` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: "80%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>

                {/* Bottom glow line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${b.color}, transparent)` }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: hoveredIdx === i ? 1 : 0 }}
                  animate={{ opacity: hoveredIdx === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Extra stats row */}
        <ScrollReveal type="fade-up" delay={0.3}>
          <div className="grid grid-cols-3 gap-4 sm:gap-8 p-6 sm:p-10 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}>
            {extraStats.map((s) => (
              <div key={s.label} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}15`, border: `1.5px solid ${s.color}30` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <AnimatedStat value={s.value} label={s.label} color={s.color} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
