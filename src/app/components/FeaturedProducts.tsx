"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ShoppingBag, Package, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import LegoButton from "./LegoButton";
import { useCart } from "@/lib/CartContext";

type Product = {
  id: number; name: string; price: number; category: string;
  image: string; stock: number; pieces: number; ageRange: string; rating: number;
};

const categoryThemes: Record<string, { gradient: string; accent: string; emoji: string; glow: string }> = {
  technic:      { gradient: "from-orange-500/25 via-gray-800/40 to-orange-600/15",   accent: "#FF7E14", emoji: "🏎️", glow: "rgba(255,126,20,0.3)" },
  starwars:     { gradient: "from-blue-500/25 via-gray-800/40 to-blue-700/15",        accent: "#0055BF", emoji: "🚀", glow: "rgba(0,85,191,0.3)" },
  city:         { gradient: "from-green-500/25 via-teal-800/40 to-green-600/15",      accent: "#00852B", emoji: "🏢", glow: "rgba(0,133,43,0.3)" },
  creator:      { gradient: "from-yellow-500/25 via-orange-800/40 to-yellow-600/15",  accent: "#FFD500", emoji: "🎢", glow: "rgba(255,213,0,0.3)" },
  harrypotter:  { gradient: "from-purple-500/25 via-indigo-800/40 to-purple-700/15",  accent: "#8B4DBF", emoji: "🏰", glow: "rgba(139,77,191,0.3)" },
  architecture: { gradient: "from-gray-400/25 via-slate-700/40 to-gray-500/15",       accent: "#A0A5A9", emoji: "🗽", glow: "rgba(160,165,169,0.3)" },
  ninjago:      { gradient: "from-red-500/25 via-red-900/40 to-red-600/15",            accent: "#D1120D", emoji: "🐉", glow: "rgba(209,18,13,0.3)" },
  friends:      { gradient: "from-pink-500/25 via-purple-800/40 to-pink-600/15",       accent: "#E85298", emoji: "🏠", glow: "rgba(232,82,152,0.3)" },
};

// ── 3D Flip Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const theme = categoryThemes[product.image] || categoryThemes.city;
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      ref={ref}
      className="w-full h-[340px] sm:h-[380px] cursor-pointer group"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 80, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 100, damping: 15 }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 60, damping: 15 }}
      >
        {/* FRONT */}
        <div
          className="brick-card flex flex-col overflow-hidden w-full h-full"
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            zIndex: flipped ? 0 : 1
          }}
        >
          {/* Image area */}
          <div className={`relative h-48 sm:h-52 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden flex-shrink-0`}>
            <div className="absolute inset-0 lego-stud-bg opacity-15" />
            {/* Glow blob */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full blur-3xl"
              style={{ background: theme.glow, opacity: 0.5 }} />
            <motion.div
              className="text-7xl sm:text-8xl relative z-10 select-none"
              animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {theme.emoji}
            </motion.div>
            {/* Category badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-white"
              style={{ background: theme.accent, boxShadow: `0 2px 8px ${theme.glow}` }}>
              {product.category}
            </div>
            {product.stock < 10 && (
              <motion.div
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-lego-red/90 text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Only {product.stock} left!
              </motion.div>
            )}
            {/* Flip hint */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/30 text-xs">
              <Eye className="w-3 h-3" /> Details
            </div>
          </div>

          {/* Info area */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white mb-1.5 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
                <span className="flex items-center gap-1"><Package className="w-3 h-3" />{product.pieces.toLocaleString()} pcs</span>
                <span>Ages {product.ageRange}</span>
                <span className="flex items-center gap-0.5 text-lego-yellow font-bold"><Star className="w-3 h-3 fill-current" />{product.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-white">${product.price}</span>
              <LegoButton variant="yellow" size="sm" icon={<ShoppingBag className="w-3.5 h-3.5" />} onClick={handleAdd}>Add</LegoButton>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="brick-card flex flex-col items-center justify-center p-4 sm:p-6 text-center w-full h-full"
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(145deg, #0f0f1f, #1a1a2e)`, 
            border: `2px solid ${theme.accent}30`,
            zIndex: flipped ? 1 : 0
          }}
        >
          <div className="text-4xl sm:text-5xl mb-2 sm:mb-4">{theme.emoji}</div>
          <h3 className="font-black text-base sm:text-lg text-white mb-2 leading-tight">{product.name}</h3>
          <div className="w-10 sm:w-12 h-1 rounded-full mb-3 sm:mb-4 shrink-0" style={{ background: theme.accent }} />
          <div className="grid grid-cols-2 gap-2 w-full mb-auto text-sm shrink-0">
            <div className="glass-panel rounded-xl p-2 sm:p-3 flex flex-col justify-center">
              <div className="font-black text-lg sm:text-xl leading-none mb-1" style={{ color: theme.accent }}>{product.pieces.toLocaleString()}</div>
              <div className="text-white/40 text-[10px] sm:text-xs">Pieces</div>
            </div>
            <div className="glass-panel rounded-xl p-2 sm:p-3 flex flex-col justify-center">
              <div className="font-black text-lg sm:text-xl leading-none mb-1 text-lego-yellow">{product.stock}</div>
              <div className="text-white/40 text-[10px] sm:text-xs">In Stock</div>
            </div>
            <div className="glass-panel rounded-xl p-2 sm:p-3 flex flex-col justify-center">
              <div className="font-black text-lg sm:text-xl leading-none mb-1 text-white">Ages {product.ageRange}</div>
              <div className="text-white/40 text-[10px] sm:text-xs">Age Range</div>
            </div>
            <div className="glass-panel rounded-xl p-2 sm:p-3 flex flex-col justify-center">
              <div className="font-black text-lg sm:text-xl leading-none mb-1 text-lego-yellow flex items-center justify-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-current" />{product.rating}
              </div>
              <div className="text-white/40 text-[10px] sm:text-xs">Rating</div>
            </div>
          </div>
          <motion.button
            className="w-full py-2.5 sm:py-3 mt-3 rounded-xl font-bold text-xs sm:text-sm text-white relative overflow-hidden shrink-0"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`, boxShadow: `0 4px 0 ${theme.accent}66` }}
            whileHover={{ scale: 1.03, boxShadow: `0 6px 20px ${theme.glow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
          >
            {added ? "✓ Added!" : `Add to Cart — $${product.price}`}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section id="collections" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 brick-wall-pattern" />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,213,0,0.3), transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4">
            Iconic <span className="shimmer-text">LEGO</span> Sets
          </h2>
          <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto">
            Handpicked premium sets from our vault. Hover to flip and see details. Every brick a masterpiece.
          </p>
        </motion.div>

        {/* Carousel controls */}
        <div className="flex justify-end gap-2 mb-4">
          <motion.button
            onClick={() => scroll("left")}
            className="p-2.5 rounded-xl glass-panel text-white/50 hover:text-lego-yellow transition-colors disabled:opacity-30"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => scroll("right")}
            className="p-2.5 rounded-xl glass-panel text-white/50 hover:text-lego-yellow transition-colors disabled:opacity-30"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Grid — desktop / Horizontal scroll — mobile */}
        <div
          ref={scrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          onScroll={checkScroll}
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
