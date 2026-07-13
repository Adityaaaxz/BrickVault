"use client";

import { motion } from "framer-motion";
import { Blocks, Globe, Share2, MessageCircle, Heart, ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const footerLinks = [
  { title: "Shop",    links: ["New Sets","Best Sellers","By Theme","By Age","Accessories"] },
  { title: "Support", links: ["Help Center","Returns","Shipping","Warranty","Contact Us"] },
  { title: "Company", links: ["About Us","Careers","Press","Blog","Affiliates"] },
];

const socialLinks = [
  { icon: Globe,         label: "Web",     href: "#" },
  { icon: Share2,        label: "Share",   href: "#" },
  { icon: MessageCircle, label: "Chat",    href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#080810] overflow-hidden">
      {/* Decorative top bricks strip */}
      <div
        className="h-4 w-full"
        style={{
          background: "repeating-linear-gradient(90deg, #D1120D 0, #D1120D 40px, #FFD500 40px, #FFD500 80px, #0055BF 80px, #0055BF 120px, #00852B 120px, #00852B 160px, #FF7E14 160px, #FF7E14 200px, #8B4DBF 200px, #8B4DBF 240px)",
          boxShadow: "0 2px 20px rgba(209,18,13,0.3)",
        }}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(209,18,13,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,213,0,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div className="relative z-10 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <ScrollReveal type="slide-left" delay={0}>
                <motion.a href="#" className="flex items-center gap-2.5 mb-5 group" whileHover={{ scale: 1.05 }}>
                  <div className="w-10 h-10 bg-lego-red rounded-xl flex items-center justify-center"
                    style={{ boxShadow: "0 3px 0 #8B0B08, 0 6px 15px rgba(209,18,13,0.4)" }}>
                    <Blocks className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-black tracking-tight">
                    <span className="text-lego-red">BRICK</span>
                    <span className="text-lego-yellow">VAULT</span>
                  </span>
                </motion.a>
                <p className="text-sm text-white/30 mb-6 max-w-xs leading-relaxed">
                  The ultimate destination for premium LEGO sets. Build Your Dreams
                </p>

                {/* Social icons */}
                <div className="flex gap-2.5">
                  {socialLinks.map(({ icon: Icon, label, href }) => (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-lego-yellow transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Link columns */}
            {footerLinks.map((col, ci) => (
              <div key={col.title}>
                <ScrollReveal type="fade-up" delay={ci * 0.1}>
                  <h4 className="text-xs font-black text-white mb-5 uppercase tracking-[0.2em]">{col.title}</h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <motion.a
                          href="#"
                          className="group flex items-center gap-1 text-sm text-white/30 hover:text-lego-yellow transition-colors duration-200"
                          whileHover={{ x: 3 }}
                        >
                          {link}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em]">
              © 2026 BrickVault
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/20 uppercase tracking-[0.2em]">
              Made with by Dittosptra
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
