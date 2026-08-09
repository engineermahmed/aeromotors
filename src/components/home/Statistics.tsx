"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const BASE_STATS = [
  { label: "Inspection Points", value: 150, suffix: "+" },
  { label: "GTA Coverage", value: 100, suffix: "%" },
  { label: "Hidden Fees", value: 0, suffix: "" },
];

function CountUp({ end, duration = 2200, started }: { end: number; duration?: number; started: boolean }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * end));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, end, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function Statistics() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [stockCount, setStockCount] = useState(0);

  useEffect(() => {
    fetch("/api/vehicles?status=available")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setStockCount(data.length))
      .catch(() => {});
  }, []);

  const stats = [
    ...BASE_STATS,
    { label: "Cars in Stock", value: stockCount, suffix: "+" },
  ];

  return (
    <section className="py-28 bg-[#111110] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-3 text-[#8A8880] text-xs font-medium tracking-[0.25em] uppercase mb-3 block">
            <span className="w-8 h-px bg-[#C8A96E]/50 inline-block" />
            Our Standards
            <span className="w-8 h-px bg-[#C8A96E]/50 inline-block" />
          </span>
          <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl">
            The Aero Motors <span className="text-gradient-gold">Promise</span>
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#383532]/40 rounded-2xl overflow-hidden border border-[#383532]/60">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center py-14 px-8 text-center bg-[#1A1917] relative group hover:bg-[#1E1D1B] transition-colors duration-300"
            >
              {/* Ambient glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(200,169,110,0.04) 0%, transparent 70%)" }}
              />

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-[#383532] w-full">
                <motion.div
                  className="h-full bg-[#C8A96E]"
                  initial={{ width: "0%" }}
                  animate={inView ? { width: "100%" } : { width: "0%" }}
                  transition={{ duration: 2, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <p className="font-heading font-bold text-white text-5xl lg:text-6xl mb-2 tabular-nums tracking-tight">
                <CountUp end={stat.value} started={inView} />
                <span className="text-[#C8A96E]">{stat.suffix}</span>
              </p>
              <p className="text-[#8A8880] text-sm tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
