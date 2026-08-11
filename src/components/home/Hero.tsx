"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ── Slide data ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    image: "/hero/Hero_Image.png",
    eyebrow: "Just Arrived · GTA",
    headline: ["Sculpted", "for Speed"],
    sub: "The RS5 Sportback — where raw aggression meets refined German precision.",
    make: "Audi",
    model: "RS5 Sportback",
    year: "2023",
    badge: "Sport",
    cta: { label: "View Listing", href: "/inventory" },
  },
  {
    id: 1,
    image: "/hero/Hero_Image_2.jpg",
    eyebrow: "Featured Pick · GTA",
    headline: ["Urban", "Precision"],
    sub: "The BMW M2 Competition — a surgeon's scalpel wrapped in carbon and torque.",
    make: "BMW",
    model: "M2 Competition",
    year: "2022",
    badge: "Track",
    cta: { label: "View Listing", href: "/inventory" },
  },
  {
    id: 2,
    image: "/hero/Hero_Image_3.jpg",
    eyebrow: "Street Certified · GTA",
    headline: ["Track-Born,", "Street-Ready"],
    sub: "503 horsepower of pure intent. The M4 Competition is motorsport without compromise.",
    make: "BMW",
    model: "M4 Competition",
    year: "2021",
    badge: "Performance",
    cta: { label: "View Listing", href: "/inventory" },
  },
  {
    id: 3,
    image: "/hero/Hero_Image_4.jpg",
    eyebrow: "Premium Selection · GTA",
    headline: ["Engineered", "Excellence"],
    sub: "Every surface optimised, every detail considered. The M4 redefines what a sports car can be.",
    make: "BMW",
    model: "M4 Competition",
    year: "2021",
    badge: "Luxury",
    cta: { label: "Browse All", href: "/inventory" },
  },
];

const INTERVAL = 6000;

// ── Easing curves ───────────────────────────────────────────────────────────
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN   = [0.7,  0, 1,   1] as const;

// ── Slide image variants (crossfade + Ken Burns) ────────────────────────────
const imgVariants = {
  enter: { opacity: 0, scale: 1.08 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: EASE_EXPO },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    transition: { duration: 0.6, ease: EASE_IN },
  },
};

// Ken Burns — slow continuous zoom on the active image
const kenBurns = {
  animate: {
    scale: [1, 1.07],
    transition: { duration: INTERVAL / 1000 + 1, ease: "linear", repeat: Infinity, repeatType: "reverse" as const },
  },
};

// ── Text reveal variants ─────────────────────────────────────────────────────
const textWrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
  exit:  { transition: { staggerChildren: 0.05, staggerDirection: -1 as const } },
};

const textItem = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_EXPO },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: EASE_IN },
  },
};

// ── Progress bar (auto-advance indicator) ───────────────────────────────────
function ProgressBar({ active, paused }: { active: boolean; paused: boolean }) {
  return (
    <div className="h-px bg-white/15 w-full overflow-hidden rounded-full">
      {active && (
        <motion.div
          key={paused ? "paused" : "running"}
          className="h-full bg-[#C8A96E] rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={paused ? { scaleX: 0 } : { scaleX: 1 }}
          transition={paused ? { duration: 0 } : { duration: INTERVAL / 1000, ease: "linear" }}
        />
      )}
    </div>
  );
}

// ── Slide counter (flipping number) ─────────────────────────────────────────
function SlideCounter({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-white/50 tracking-widest select-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE_EXPO }}
          className="text-white font-semibold text-sm"
        >
          {String(current + 1).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
      <span className="opacity-30">/</span>
      <span>{String(total).padStart(2, "0")}</span>
    </div>
  );
}

// ── Main Hero ────────────────────────────────────────────────────────────────
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY  = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Auto-advance
  const advance = useCallback((dir: 1 | -1 = 1) => {
    setCurrent((c) => (c + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => advance(1), INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, advance, current]);

  const goTo = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent(i);
  };

  const slide = SLIDES[current];

  return (
    <section
      ref={heroRef}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#0D0C0B]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background slides ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* Ken Burns wrapper */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slide.image}')` }}
            variants={kenBurns}
            animate="animate"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Cinematic overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

      {/* ── Vertical stripe accent (left) ── */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C8A96E]/30 to-transparent hidden lg:block" />

      {/* ── Scan-line vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-40 flex flex-col justify-between min-h-dvh"
      >
        {/* Top row: badge */}
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${current}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
              className="flex items-center gap-3"
            >
              <span className="w-6 h-px bg-[#C8A96E]" />
              <span className="text-[#C8A96E] text-[10px] font-semibold tracking-[0.3em] uppercase">
                {slide.eyebrow}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Car badge pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`pill-${current}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: EASE_EXPO, delay: 0.1 }}
              className="hidden sm:flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
              <span className="text-white text-xs font-medium tracking-wide">{slide.badge}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Headline + body ── */}
        <div className="flex-1 flex flex-col justify-center py-12 lg:py-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              variants={textWrap}
              initial="hidden"
              animate="show"
              exit="exit"
              className="max-w-3xl"
            >
              {/* Year / Make / Model strip */}
              <motion.p
                variants={textItem}
                className="text-white/40 text-sm font-mono tracking-[0.2em] uppercase mb-6"
              >
                {slide.year} · {slide.make} · {slide.model}
              </motion.p>

              {/* Headline — two lines, massive */}
              <h1
                className="font-heading font-black text-white leading-[0.95] mb-8 tracking-tight"
                style={{ fontSize: "clamp(3.8rem, 9vw, 7.5rem)" }}
              >
                {slide.headline.map((line, i) => (
                  <motion.span
                    key={i}
                    variants={textItem}
                    className="block"
                    style={{
                      WebkitTextStroke: i === 1 ? "1px rgba(255,255,255,0.15)" : undefined,
                      color: i === 1 ? "transparent" : "white",
                      WebkitTextFillColor: i === 1 ? "transparent" : "white",
                      backgroundImage: i === 1
                        ? "linear-gradient(135deg, #fff 0%, #C8A96E 50%, #fff 100%)"
                        : undefined,
                      WebkitBackgroundClip: i === 1 ? "text" : undefined,
                      backgroundClip: i === 1 ? "text" : undefined,
                    }}
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>

              {/* Sub */}
              <motion.p
                variants={textItem}
                className="text-[#B8B5B0] text-base lg:text-lg leading-relaxed mb-10 max-w-md"
              >
                {slide.sub}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={textItem} className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={slide.cta.href}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#0D0C0B] font-bold text-sm tracking-wide rounded-sm hover:bg-[#C8A96E] transition-colors duration-300"
                >
                  {slide.cta.label}
                  <motion.span
                    className="inline-flex"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
                <Link
                  href="/finance"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold text-sm tracking-wide rounded-sm hover:border-[#C8A96E]/60 hover:bg-white/5 transition-all duration-300"
                >
                  Finance Options
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom bar: stats + slide controls ── */}
        <div className="flex items-end justify-between gap-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE_EXPO }}
            className="hidden md:flex items-center gap-10"
          >
            {[
              { v: "Free", l: "GTA Delivery" },
              { v: "$0", l: "Hidden Fees" },
              { v: "150+", l: "Inspection Points" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col">
                <span className="font-heading font-bold text-white text-xl tracking-tight">{s.v}</span>
                <span className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{s.l}</span>
              </div>
            ))}
          </motion.div>

          {/* Slide controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE_EXPO }}
            className="flex flex-col items-end gap-4 ml-auto"
          >
            {/* Dot progress bars */}
            <div className="flex items-center gap-3">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className="flex flex-col gap-1.5 group cursor-pointer"
                  aria-label={`Go to slide ${i + 1}`}
                  style={{ width: i === current ? 48 : 28, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)" }}
                >
                  <ProgressBar active={i === current} paused={paused} />
                </button>
              ))}
            </div>

            {/* Counter + prev/next */}
            <div className="flex items-center gap-4">
              <SlideCounter current={current} total={SLIDES.length} />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); advance(-1); }}
                  className="w-8 h-8 flex items-center justify-center border border-white/15 rounded-full text-white/50 hover:text-white hover:border-white/40 transition-all duration-200 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); advance(1); }}
                  className="w-8 h-8 flex items-center justify-center border border-white/15 rounded-full text-white/50 hover:text-white hover:border-white/40 transition-all duration-200 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Vertical slide thumbnails (right edge desktop) ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-20">
        {SLIDES.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => goTo(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden rounded-md cursor-pointer transition-all duration-300"
            style={{
              width: 56,
              height: 40,
              opacity: i === current ? 1 : 0.35,
              outline: i === current ? "1.5px solid rgba(200,169,110,0.8)" : "1.5px solid transparent",
              transition: "opacity 0.3s ease, outline 0.3s ease",
            }}
            aria-label={`Go to ${s.make} ${s.model}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${s.image}')` }}
            />
            {i === current && (
              <motion.div
                className="absolute inset-0 bg-[#C8A96E]/10"
                layoutId="thumbActive"
                transition={{ duration: 0.4, ease: EASE_EXPO }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* ── Scroll cue ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/70 transition-colors cursor-pointer group z-20"
        aria-label="Scroll to explore"
      >
        <motion.span
          className="text-[9px] tracking-[0.35em] uppercase"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* ── Bottom edge line ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: EASE_EXPO }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A96E]/20 to-transparent origin-left"
      />
    </section>
  );
}
