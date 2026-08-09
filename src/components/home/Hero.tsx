"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const WORDS = ["Dream Car", "Next Ride", "Perfect Match", "Best Deal"];

function AnimatedWords() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-gradient-gold block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        display: "inline-block",
      }}
    >
      {WORDS[index]}
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const spotRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
      if (spotRef.current) {
        spotRef.current.style.left = `${x * 100}%`;
        spotRef.current.style.top = `${y * 100}%`;
      }
    };
    hero.addEventListener("mousemove", onMove, { passive: true });
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  const scrollToSearch = () => {
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax BG */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=85')`,
          y: yBg,
        }}
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#1A1917]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Mouse glow spotlight */}
      <div
        ref={spotRef}
        className="absolute pointer-events-none w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 70%)",
          transition: "left 0.4s ease, top 0.4s ease",
          left: "50%",
          top: "40%",
        }}
      />

      {/* Decorative lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 opacity-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-px bg-white origin-top"
            style={{ height: i === 1 ? "64px" : "32px" }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        style={{ opacity: opacityHero }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 w-full"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-3 text-[#8A8880] text-xs font-medium tracking-[0.25em] uppercase">
              <span className="w-10 h-px bg-[#C8A96E]/60" />
              Your Last Stop · GTA
              <span className="w-10 h-px bg-[#C8A96E]/60" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-heading font-bold text-white leading-[1.02] mb-6"
            style={{ fontSize: "clamp(3.2rem, 7.5vw, 6rem)" }}
          >
            Find Your
            <br />
            <AnimatedWords />
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-[#B8B5B0] text-lg leading-relaxed mb-10 max-w-lg"
          >
            Hand-inspected pre-owned vehicles at fair, transparent prices. Free GTA delivery, trade-ins welcome, and no hidden fees — ever.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/inventory"
              className="shine-effect group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1A1917] font-semibold rounded-sm text-sm tracking-wide hover:bg-[#F5F4F2] transition-colors duration-200"
            >
              Browse Inventory
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-sm text-sm tracking-wide hover:border-[#C8A96E]/60 hover:bg-white/5 transition-all duration-300"
            >
              Sell Your Car
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-x-10 gap-y-6 pt-8 border-t border-white/10"
          >
            {[
              { value: "Free", label: "GTA Delivery" },
              { value: "$0", label: "Hidden Fees" },
              { value: "150+", label: "Inspection Points" },
              { value: "2026", label: "Established" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + i * 0.08 }}
              >
                <p className="font-heading font-bold text-white text-2xl tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[#8A8880] text-xs mt-0.5 tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={scrollToSearch}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8A8880] hover:text-white transition-colors cursor-pointer group"
        aria-label="Scroll to search"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase group-hover:text-[#C8A96E] transition-colors">Explore</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Bottom frame line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left"
      />
    </section>
  );
}
