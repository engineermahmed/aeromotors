"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { useRef } from "react";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="py-36 relative overflow-hidden">
      {/* Parallax BG */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80')`,
          y: yBg,
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-[#1A1917]/88" />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(200,169,110,0.06) 0%, transparent 70%)" }}
      />

      {/* Decorative corner lines */}
      {[["top-8 left-8", "border-t border-l"], ["top-8 right-8", "border-t border-r"], ["bottom-8 left-8", "border-b border-l"], ["bottom-8 right-8", "border-b border-r"]].map(([pos, border], i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          className={`absolute ${pos} w-12 h-12 ${border} border-[#C8A96E]/20`}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-3 text-[#C8A96E] text-[10px] font-semibold tracking-[0.3em] uppercase mb-6">
            <span className="w-8 h-px bg-[#C8A96E]/60" />
            Ready to Begin?
            <span className="w-8 h-px bg-[#C8A96E]/60" />
          </span>

          <h2
            className="font-heading font-bold text-white leading-[1.04] mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
          >
            Your Perfect Car
            <br />
            <span className="text-gradient-gold">Awaits You</span>
          </h2>

          <p className="text-[#B8B5B0] text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Whether you&apos;re buying, selling, or financing — our team is here
            to help you every step of the way. No pressure, just honest advice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inventory"
              className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-[#1A1917] font-bold text-sm rounded-sm hover:bg-[#C8A96E] transition-colors duration-300"
            >
              Browse Inventory
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+16476076355"
              className="inline-flex items-center gap-2 px-10 py-4 border border-white/20 text-white font-bold text-sm rounded-sm hover:border-[#C8A96E]/60 hover:bg-white/5 transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              Call Us Today
            </a>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-8 text-[#8A8880] text-xs tracking-wide"
          >
            {["No Hidden Fees", "Same-Day Finance", "Trade-In Welcome", "Free Inspection"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C8A96E]" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
