"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "Competitive rates from 2.9% APR",
  "Flexible terms from 12 to 84 months",
  "Quick approval — often same day",
  "No hidden fees or prepayment penalties",
];

const metrics = [
  { value: "2.9%", label: "Starting APR", sub: "Subject to approval" },
  { value: "84mo", label: "Max Term", sub: "Flexible options" },
  { value: "< 24h", label: "Fast Decision", sub: "Most applications" },
  { value: "100%", label: "Online Apply", sub: "From anywhere" },
];

export default function FinanceBanner() {
  return (
    <section className="py-24 bg-[#111110]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[#383532]">
          {/* Background */}
          <div className="absolute inset-0 bg-[#181714]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(200,169,110,0.08) 0%, transparent 70%)" }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2">
            {/* Left */}
            <div className="p-10 lg:p-16">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex items-center gap-2 text-[#C8A96E] text-[10px] font-semibold tracking-[0.25em] uppercase mb-4">
                  <span className="w-6 h-px bg-[#C8A96E]" />
                  Flexible Financing
                </span>
                <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl leading-[1.08] mb-5">
                  Drive Away
                  <br />
                  <span className="text-gradient-gold">Today</span>
                </h2>
                <p className="text-[#B8B5B0] leading-relaxed mb-8 max-w-sm text-sm">
                  Our specialists work with leading lenders to find you the most
                  competitive rates — whatever your credit history.
                </p>

                <ul className="space-y-3 mb-10">
                  {benefits.map((benefit, i) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                      className="flex items-center gap-3 text-[#B8B5B0] text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#C8A96E]/15 border border-[#C8A96E]/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#C8A96E]" />
                      </span>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>

                <Link
                  href="/finance"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1917] font-bold text-sm rounded-sm hover:bg-[#C8A96E] transition-colors duration-300 group"
                >
                  Explore Finance Options
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>

            {/* Right — metric cards */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-t lg:border-t-0 lg:border-l border-[#383532] p-10 lg:p-16 flex items-center"
            >
              <div className="grid grid-cols-2 gap-4 w-full">
                {metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                    className="group p-5 bg-[#222120] rounded-xl border border-[#383532] hover:border-[#C8A96E]/40 hover:bg-[#252320] transition-all duration-300"
                  >
                    <p className="font-heading font-bold text-white text-3xl mb-1 tracking-tight group-hover:text-[#C8A96E] transition-colors duration-300">
                      {m.value}
                    </p>
                    <p className="text-white text-xs font-semibold mb-0.5">{m.label}</p>
                    <p className="text-[#8A8880] text-xs">{m.sub}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
