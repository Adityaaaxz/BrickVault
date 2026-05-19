"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Blocks, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Sparkles, ChevronRight, Mail } from "lucide-react";

// Floating LEGO brick decoration
function FloatingBrick({ color, size, x, y, delay, rotation }: {
  color: string; size: number; x: string; y: string; delay: number; rotation: number;
}) {
  return (
    <motion.div
      className="absolute rounded-md pointer-events-none"
      style={{
        width: size, height: size * 0.6,
        background: `linear-gradient(135deg, ${color}30, ${color}12)`,
        border: `1px solid ${color}25`,
        left: x, top: y, rotate: `${rotation}deg`,
      }}
      animate={{ y: [0, -18, 0], rotate: [`${rotation}deg`, `${rotation + 6}deg`, `${rotation}deg`] }}
      transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute -top-1.5 left-[20%] w-2.5 h-2.5 rounded-full"
        style={{ background: `${color}25`, border: `1px solid ${color}30` }} />
      <div className="absolute -top-1.5 right-[20%] w-2.5 h-2.5 rounded-full"
        style={{ background: `${color}25`, border: `1px solid ${color}30` }} />
    </motion.div>
  );
}

const bricks = [
  { color: "#D1120D", size: 80, x: "8%",  y: "15%", delay: 0,   rotation: -12 },
  { color: "#FFD500", size: 60, x: "5%",  y: "55%", delay: 1.2, rotation: 8 },
  { color: "#0055BF", size: 70, x: "12%", y: "75%", delay: 0.6, rotation: -5 },
  { color: "#00852B", size: 50, x: "80%", y: "20%", delay: 0.8, rotation: 15 },
  { color: "#FF7E14", size: 65, x: "85%", y: "50%", delay: 1.5, rotation: -8 },
  { color: "#8B4DBF", size: 55, x: "78%", y: "78%", delay: 0.3, rotation: 12 },
  { color: "#D1120D", size: 45, x: "20%", y: "88%", delay: 1,   rotation: -15 },
  { color: "#FFD500", size: 75, x: "70%", y: "88%", delay: 0.4, rotation: 6 },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password || (!isLogin && !email)) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");

    // Simulate network request
    await new Promise((r) => setTimeout(r, 1200));

    if (isLogin) {
      // Simple demo auth
      if (username === "admin" && password === "brickvault") {
        localStorage.setItem("userRole", "admin");
        window.location.href = "/pos";
      } else if (username === "admin") {
        setLoading(false);
        setError("Invalid admin password.");
        triggerShake();
      } else {
        localStorage.setItem("userRole", "staff");
        window.location.href = "/pos";
      }
    } else {
      // Demo sign up — redirect to POS instantly
      localStorage.setItem("userRole", "staff");
      window.location.href = "/pos";
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: "#08080f" }}>
      {/* Floating bricks — full background */}
      {bricks.map((b, i) => <FloatingBrick key={i} {...b} />)}

      {/* ── LEFT PANEL — Branding ─────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative px-12 xl:px-20">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(209,18,13,0.1) 0%, rgba(255,213,0,0.05) 40%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-md"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-10"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-14 h-14 bg-lego-red rounded-2xl flex items-center justify-center"
              style={{ boxShadow: "0 6px 0 #8B0B08, 0 10px 30px rgba(209,18,13,0.5)" }}>
              <Blocks className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-black tracking-tight">
              <span className="text-lego-red" style={{ textShadow: "0 0 30px rgba(209,18,13,0.5)" }}>BRICK</span>
              <span className="text-lego-yellow" style={{ textShadow: "0 0 30px rgba(255,213,0,0.5)" }}>VAULT</span>
            </div>
          </motion.div>

          {/* Big brick visual */}
          <div className="relative mx-auto w-48 h-28 mb-10">
            {/* Main brick */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: "linear-gradient(180deg, #FF2A25 0%, #D1120D 60%, #A00E0A 100%)", boxShadow: "0 8px 0 #6B0907, 0 16px 40px rgba(209,18,13,0.5)" }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Studs */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute -top-4 rounded-full"
                  style={{
                    width: 24, height: 24,
                    left: `${10 + i * 16}%`,
                    background: "radial-gradient(circle at 40% 35%, #FF2A25, #A00E0A)",
                    boxShadow: "0 2px 0 #6B0907, 0 0 8px rgba(209,18,13,0.4)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }} />
              ))}
              <div className="absolute top-3 left-3 right-3 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            </motion.div>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-white mb-4 leading-tight">
            Welcome to the<br />
            <span className="text-lego-yellow">Builders</span> Dashboard
          </h1>
          <p className="text-base text-white/40 leading-relaxed mb-8">
            Manage your LEGO product catalog, track inventory, and upload product images — all in one place.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-3 text-left">
            {[
              { dot: "#FFD500", text: "Full product CRUD management" },
              { dot: "#00852B", text: "Drag & drop image upload" },
              { dot: "#0055BF", text: "Real-time stock tracking" },
            ].map(({ dot, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/50">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot, boxShadow: `0 0 8px ${dot}` }} />
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom LEGO divider */}
        <div className="absolute bottom-0 left-0 right-0 h-2"
          style={{ background: "repeating-linear-gradient(90deg, #D1120D 0, #D1120D 40px, #FFD500 40px, #FFD500 80px, #0055BF 80px, #0055BF 120px, #00852B 120px, #00852B 160px)" }} />
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block w-px self-stretch my-8"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(255,213,0,0.15), rgba(255,255,255,0.06), rgba(209,18,13,0.15), transparent)" }} />

      {/* ── RIGHT PANEL — Login Form ──────────────────────────────────── */}
      <div className="flex-1 lg:max-w-[480px] flex items-center justify-center px-6 sm:px-10 py-12 relative">
        {/* Mobile logo */}
        <motion.div
          className="lg:hidden absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-9 h-9 bg-lego-red rounded-xl flex items-center justify-center"
            style={{ boxShadow: "0 3px 0 #8B0B08" }}>
            <Blocks className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black">
            <span className="text-lego-red">BRICK</span>
            <span className="text-lego-yellow">VAULT</span>
          </span>
        </motion.div>

        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Card */}
          <motion.div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              border: "1.5px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {/* Top gradient bar */}
            <div className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #D1120D, #FFD500, #0055BF, #00852B)" }} />

            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-lego-yellow" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/30">Secure Login</span>
                </div>
                <h2 className="text-2xl font-black text-white">{isLogin ? "Sign in to POS" : "Create Account"}</h2>
                <p className="text-sm text-white/35 mt-1">{isLogin ? "Enter your credentials to continue" : "Join the Builders network today"}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email (Signup only) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/35 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                        <motion.input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="builder@brickvault.com"
                          className="lego-input pl-10"
                          style={{ borderColor: error ? "rgba(209,18,13,0.4)" : undefined }}
                          whileFocus={{ scale: 1.01 }}
                        />
                      </div>
                      <div className="h-5" /> {/* Spacer */}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/35 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                    <motion.input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      autoComplete="username"
                      className="lego-input pl-10"
                      style={{ borderColor: error ? "rgba(209,18,13,0.4)" : undefined }}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/35 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                    <motion.input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="lego-input pl-10 pr-12"
                      style={{ borderColor: error ? "rgba(209,18,13,0.4)" : undefined }}
                      whileFocus={{ scale: 1.01 }}
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                      onClick={() => setShowPw(!showPw)}
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-lego-red"
                      style={{ background: "rgba(209,18,13,0.1)", border: "1px solid rgba(209,18,13,0.25)" }}
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black relative overflow-hidden mt-2"
                  style={{
                    background: loading
                      ? "rgba(255,213,0,0.5)"
                      : "linear-gradient(180deg, #FFE44D 0%, #FFD500 60%, #E6BF00 100%)",
                    color: "#1B1B1B",
                    boxShadow: loading ? "none" : "0 4px 0 #B89B00, 0 6px 20px rgba(255,213,0,0.3)",
                  }}
                  whileHover={loading ? {} : { scale: 1.02, boxShadow: "0 6px 0 #B89B00, 0 10px 30px rgba(255,213,0,0.5)" }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> {isLogin ? "Signing in…" : "Creating account…"}</>
                    : <><span>{isLogin ? "Sign In" : "Sign Up"}</span> <ChevronRight className="w-4 h-4" /></>
                  }
                  {!loading && (
                    <motion.span
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: "linear-gradient(rgba(255,255,255,0.15), transparent)" }}
                    />
                  )}
                </motion.button>

                {/* Demo hint */}
                <AnimatePresence>
                  {isLogin && (
                    <motion.div 
                      className="text-center overflow-hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
              
              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(""); }}
                  className="text-xs font-bold text-white/40 hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Back to store */}
          <motion.a
            href="/"
            className="flex items-center justify-center gap-2 mt-6 text-sm text-white/25 hover:text-lego-yellow transition-colors group"
            whileHover={{ y: -2 }}
          >
            ← Back to Store
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
