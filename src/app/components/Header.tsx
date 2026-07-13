"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Blocks, ShoppingCart, Search, Menu, X } from "lucide-react";
import { playBrickClick } from "@/lib/sound";
import { useCart } from "@/lib/CartContext";

const navLinks = [
  { href: "#collections", label: "Collections" },
  { href: "#playground", label: "Playground" },
  { href: "#benefits", label: "Why LEGO" },
  { href: "#newsletter", label: "Join Club" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { cartCount } = useCart();
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const total = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${scrollProgress}%`;
    }
  }, [scrollProgress]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Scroll progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5 z-10">
        <div
          ref={progressRef}
          className="h-full transition-none"
          style={{
            background: "linear-gradient(90deg, #D1120D 0%, #FFD500 50%, #0055BF 100%)",
            width: `${scrollProgress}%`,
          }}
        />
      </div>

      {/* Top LEGO brick strip */}
      <div className="lego-divider" />

      <nav
        className="transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(13,13,13,0.95)"
            : "rgba(13,13,13,0.7)",
          backdropFilter: scrolled ? "blur(30px) saturate(1.8)" : "blur(12px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,213,0,0.08)"
            : "1px solid rgba(255,255,255,0.04)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,213,0,0.05)"
            : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2.5 sm:gap-3 group"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => playBrickClick()}
            >
              <div className="relative">
                <motion.div
                  className="w-9 h-9 sm:w-11 sm:h-11 bg-lego-red rounded-xl flex items-center justify-center"
                  style={{
                    boxShadow: "0 4px 0 #8B0B08, 0 6px 20px rgba(209,18,13,0.4)",
                  }}
                  whileHover={{ boxShadow: "0 4px 0 #8B0B08, 0 6px 30px rgba(209,18,13,0.7), 0 0 40px rgba(209,18,13,0.3)" }}
                >
                  <Blocks className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                {/* Studs */}
                <div className="absolute -top-1 left-1 w-2.5 h-2.5 bg-lego-red-light rounded-full border border-white/20"
                  style={{ boxShadow: "0 0 6px rgba(255,42,37,0.5)" }} />
                <div className="absolute -top-1 right-1 w-2.5 h-2.5 bg-lego-red-light rounded-full border border-white/20"
                  style={{ boxShadow: "0 0 6px rgba(255,42,37,0.5)" }} />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight">
                <span className="text-lego-red" style={{ textShadow: "0 0 20px rgba(209,18,13,0.4)" }}>BRICK</span>
                <span className="text-lego-yellow" style={{ textShadow: "0 0 20px rgba(255,213,0,0.4)" }}>VAULT</span>
              </span>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-semibold text-white/60 hover:text-white rounded-lg transition-colors duration-200 group overflow-hidden"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playBrickClick()}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  {/* Hover bg */}
                  <motion.span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />
                  {link.label}
                  {/* Sliding underline — LEGO colors */}
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-3/4 transition-all duration-300 rounded-full"
                    style={{
                      background: ["#D1120D","#FFD500","#0055BF","#00852B"][i % 4],
                    }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Right side: Search + Cart + Login + Mobile Toggle */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.88 }}
                className="p-2.5 text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                onClick={() => playBrickClick()}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Cart — real-time count from context */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.88 }}
                className="relative p-2.5 text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                onClick={() => playBrickClick()}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-lego-red rounded-full flex items-center justify-center text-[9px] font-black text-white px-0.5"
                      style={{ boxShadow: "0 0 8px rgba(209,18,13,0.6)" }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Divider */}
              <div className="hidden md:block w-px h-5 bg-white/10 mx-1" />

              {/* Login button — BRICK colors: red→yellow gradient */}
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center px-5 py-2 font-black text-sm rounded-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #D1120D 0%, #FF2A25 40%, #FFD500 100%)",
                  color: "#1B1B1B",
                  boxShadow: "0 3px 0 #8B0B08, 0 5px 20px rgba(209,18,13,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontSize: "0.72rem",
                }}
                onClick={() => playBrickClick()}
              >
                Login
              </motion.a>

              {/* Mobile menu button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 text-white/70 hover:text-lego-yellow transition-colors rounded-lg hover:bg-white/5 ml-1"
                onClick={() => { playBrickClick(); setIsOpen(!isOpen); }}
              >
                <AnimatePresence mode="wait">
                  {isOpen
                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-6 h-6" /></motion.span>
                    : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-6 h-6" /></motion.span>
                  }
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(7,7,16,0.97)" }}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    onClick={() => { playBrickClick(); setIsOpen(false); }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: ["#D1120D","#FFD500","#0055BF","#00852B"][i % 4] }}
                    />
                    {link.label}
                  </motion.a>
                ))}
                
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.07 }}
                  className="pt-2"
                >
                  <a
                    href="/login"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-black rounded-lg transition-all uppercase tracking-widest"
                    style={{
                      background: "linear-gradient(135deg, #D1120D 0%, #FF2A25 40%, #FFD500 100%)",
                      color: "#1B1B1B",
                      boxShadow: "0 3px 0 #8B0B08",
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                    }}
                    onClick={() => { playBrickClick(); setIsOpen(false); }}
                  >
                    Login
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
