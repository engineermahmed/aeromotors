"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && data.length > 0 && setItems(data))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  const go = (next: number) => {
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };
  const prev = () => go(active === 0 ? items.length - 1 : active - 1);
  const next = () => go(active === items.length - 1 ? 0 : active + 1);

  return (
    <section className="py-24 lg:py-32 border-t border-[#383532]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#8A8880] text-xs font-medium tracking-[0.25em] uppercase block mb-4">
                Client Stories
              </span>
              <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl leading-tight mb-6">
                What Our
                <br />
                <span className="text-gradient-gold">Clients Say</span>
              </h2>
              <p className="text-[#B8B5B0] leading-relaxed text-sm mb-10 max-w-xs">
                Our reputation is built on honest dealing and straightforward
                service. Here&apos;s what real customers say.
              </p>

              {/* Controls */}
              <div className="flex items-center gap-4 mb-8">
                <button onClick={prev}
                  className="w-11 h-11 border border-[#383532] rounded-full flex items-center justify-center text-[#8A8880] hover:border-[#C8A96E]/50 hover:text-white hover:bg-[#C8A96E]/8 transition-all duration-200 cursor-pointer"
                  aria-label="Previous">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1.5">
                  {items.map((_, i) => (
                    <button key={i} onClick={() => go(i)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        i === active ? "w-7 h-2 bg-[#C8A96E]" : "w-2 h-2 bg-[#383532] hover:bg-[#8A8880]"
                      }`}
                      aria-label={`Testimonial ${i + 1}`} />
                  ))}
                </div>
                <button onClick={next}
                  className="w-11 h-11 border border-[#383532] rounded-full flex items-center justify-center text-[#8A8880] hover:border-[#C8A96E]/50 hover:text-white hover:bg-[#C8A96E]/8 transition-all duration-200 cursor-pointer"
                  aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnail list */}
              <div className="space-y-2">
                {items.map((t, i) => (
                  <button key={t.id} onClick={() => go(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                      i === active ? "border-[#C8A96E]/40 bg-[#C8A96E]/8" : "border-transparent hover:border-[#383532] hover:bg-[#222120]"
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-heading shrink-0 transition-all ${
                      i === active ? "bg-[#C8A96E] text-[#1A1917]" : "bg-[#383532] text-[#8A8880]"
                    }`}>
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate transition-colors ${i === active ? "text-white" : "text-[#B8B5B0]"}`}>{t.name}</p>
                      <p className="text-[#8A8880] text-xs truncate">{t.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — card */}
          <div className="lg:col-span-3 relative">
            <div className="absolute -top-4 -left-2 text-[180px] font-heading font-bold text-[#383532]/30 leading-none select-none pointer-events-none">"</div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-[#222120] border border-[#383532] rounded-2xl p-8 lg:p-10"
              >
                <div className="absolute inset-0 rounded-2xl opacity-50"
                  style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(200,169,110,0.06) 0%, transparent 60%)" }} />

                <div className="flex gap-1 mb-6 relative">
                  {Array.from({ length: items[active].rating }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}>
                      <Star className="w-4 h-4 fill-[#C8A96E] text-[#C8A96E]" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-[#F5F4F2] leading-relaxed text-xl lg:text-2xl font-heading font-medium mb-8 relative">
                  &ldquo;{items[active].content}&rdquo;
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-[#383532]">
                  <div className="w-12 h-12 rounded-full bg-[#C8A96E]/15 border border-[#C8A96E]/30 flex items-center justify-center shrink-0">
                    <span className="font-heading font-bold text-[#C8A96E] text-lg">{items[active].name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-white">{items[active].name}</p>
                    <p className="text-[#8A8880] text-sm">{items[active].role}</p>
                  </div>
                  <div className="ml-auto text-[#8A8880] text-xs">{active + 1} / {items.length}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
