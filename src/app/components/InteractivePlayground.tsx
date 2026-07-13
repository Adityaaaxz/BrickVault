"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { playBrickClick } from "@/lib/sound";
import { RotateCcw, Grip } from "lucide-react";

const brickTypes = [
  { id: 1, color: "#D1120D", w: 80, h: 40, label: "2×4" },
  { id: 2, color: "#FFD500", w: 60, h: 40, label: "2×3" },
  { id: 3, color: "#0055BF", w: 40, h: 40, label: "2×2" },
  { id: 4, color: "#00852B", w: 100, h: 40, label: "2×5" },
  { id: 5, color: "#FF7E14", w: 80, h: 40, label: "2×4" },
  { id: 6, color: "#8B4DBF", w: 60, h: 40, label: "2×3" },
];

type PlacedBrick = {
  id: number;
  templateId: number;
  color: string;
  w: number;
  h: number;
  x: number;
  y: number;
};

function DraggableBrick({ brick, onDragEnd }: { brick: PlacedBrick; onDragEnd: (id: number, info: PanInfo) => void }) {
  const x = useMotionValue(brick.x);
  const y = useMotionValue(brick.y);
  const scale = useTransform([x, y], () => 1);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, scale, position: "absolute", left: 0, top: 0, width: brick.w, height: brick.h }}
      onDragStart={() => playBrickClick()}
      onDragEnd={(_, info) => { playBrickClick(); onDragEnd(brick.id, info); }}
      whileDrag={{ scale: 1.15, zIndex: 50, boxShadow: `0 12px 40px ${brick.color}66` }}
      className="cursor-grab active:cursor-grabbing rounded-md select-none touch-none"
    >
      <div className="w-full h-full rounded-md relative" style={{ background: `linear-gradient(180deg, ${brick.color} 0%, ${brick.color}cc 100%)`, boxShadow: `0 3px 0 ${brick.color}88, 0 5px 15px ${brick.color}44` }}>
        {/* Studs */}
        <div className="absolute -top-2 left-[15%] w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: `linear-gradient(135deg, ${brick.color} 0%, ${brick.color}dd 100%)` }} />
        <div className="absolute -top-2 right-[15%] w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: `linear-gradient(135deg, ${brick.color} 0%, ${brick.color}dd 100%)` }} />
        {brick.w >= 60 && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: `linear-gradient(135deg, ${brick.color} 0%, ${brick.color}dd 100%)` }} />}
        {/* Shine */}
        <div className="absolute top-1 left-1 right-1/2 h-1 rounded-full bg-white/20" />
      </div>
    </motion.div>
  );
}

export default function InteractivePlayground() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [placedBricks, setPlacedBricks] = useState<PlacedBrick[]>([]);
  const nextId = useRef(1);

  const addBrick = (template: typeof brickTypes[0]) => {
    playBrickClick();
    const newBrick: PlacedBrick = {
      id: nextId.current++,
      templateId: template.id,
      color: template.color,
      w: template.w,
      h: template.h,
      x: 100 + Math.random() * 200,
      y: 60 + Math.random() * 150,
    };
    setPlacedBricks((prev) => [...prev, newBrick]);
  };

  const handleDragEnd = (id: number, info: PanInfo) => {
    setPlacedBricks((prev) => prev.map((b) => b.id === id ? { ...b, x: b.x + info.offset.x, y: b.y + info.offset.y } : b));
  };

  const resetPlayground = () => {
    playBrickClick();
    setPlacedBricks([]);
  };

  return (
    <section id="playground" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-lego-dark via-[#0a0a1a] to-lego-dark" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-10 sm:mb-14" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Brick <span className="text-lego-green">Playground</span></h2>
          <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto">Click bricks to add them, then drag to build. Let your creativity flow!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Brick palette */}
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-white/10 bg-white/5 overflow-x-auto">
            <Grip className="w-4 h-4 text-white/30 flex-shrink-0" />
            {brickTypes.map((bt) => (
              <motion.button key={bt.id} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} onClick={() => addBrick(bt)}
                className="flex-shrink-0 rounded-md cursor-pointer relative" style={{ width: bt.w * 0.7, height: bt.h * 0.7, background: `linear-gradient(180deg, ${bt.color} 0%, ${bt.color}cc 100%)`, boxShadow: `0 2px 0 ${bt.color}88` }}>
                <div className="absolute -top-1 left-[20%] w-2 h-2 rounded-full" style={{ background: bt.color }} />
                <div className="absolute -top-1 right-[20%] w-2 h-2 rounded-full" style={{ background: bt.color }} />
              </motion.button>
            ))}
            <div className="flex-1" />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={resetPlayground} className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-lego-red hover:bg-white/20 transition-colors cursor-pointer flex-shrink-0">
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Build area */}
          <div ref={constraintsRef} className="relative h-[300px] sm:h-[400px] playground-grid overflow-hidden">
            {placedBricks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm sm:text-base">
                Click a brick above to start building! 🧱
              </div>
            )}
            {placedBricks.map((brick) => (
              <DraggableBrick key={brick.id} brick={brick} onDragEnd={handleDragEnd} />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-t border-white/10 bg-white/5 text-xs text-white/30">
            <span>{placedBricks.length} brick{placedBricks.length !== 1 ? "s" : ""} placed</span>
            <span>Drag to move • Click palette to add</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
