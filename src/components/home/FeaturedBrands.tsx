"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Brand {
  id: string;
  name: string;
  count: number;
}

const STYLES = [
  "Sedan",
  "SUV",
  "Coupe",
  "Hatchback",
  "Truck",
  "Convertible",
  "Wagon",
  "Van",
];

export default function BrowseSection() {
  const [tab, setTab] = useState<"maker" | "style">("maker");
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setBrands(data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 lg:py-32 border-t border-[#383532]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header + toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-[#8A8880] text-xs font-medium tracking-[0.25em] uppercase block mb-3">
              Explore
            </span>
            <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl">
              Browse <span className="text-gradient-gold">Vehicles</span>
            </h2>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center bg-[#1A1918] border border-[#383532] rounded-lg p-1 w-fit">
            <button
              onClick={() => setTab("maker")}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === "maker"
                  ? "bg-[#C8A96E] text-[#1A1918]"
                  : "text-[#8A8880] hover:text-white"
              }`}
            >
              By Maker
            </button>
            <button
              onClick={() => setTab("style")}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === "style"
                  ? "bg-[#C8A96E] text-[#1A1918]"
                  : "text-[#8A8880] hover:text-white"
              }`}
            >
              By Style
            </button>
          </div>
        </motion.div>

        {/* Panels */}
        <AnimatePresence mode="wait">
          {tab === "maker" ? (
            <motion.div
              key="maker"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            >
              {brands.map((brand, i) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link
                    href={`/inventory?make=${encodeURIComponent(brand.name)}`}
                    className="group flex flex-col items-center justify-center px-4 py-5 bg-[#222120] border border-[#383532] rounded-xl hover:border-[#C8A96E]/60 hover:bg-[#252320] transition-all duration-250 text-center"
                  >
                    <span className="font-heading font-semibold text-white text-base leading-tight group-hover:text-[#C8A96E] transition-colors duration-200">
                      {brand.name}
                    </span>
                    <span className="text-[#8A8880] text-xs mt-1.5 group-hover:text-[#C8A96E]/70 transition-colors duration-200">
                      {brand.count} vehicles
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="style"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            >
              {STYLES.map((style, i) => (
                <motion.div
                  key={style}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    href={`/inventory?body=${encodeURIComponent(style)}`}
                    className="group flex items-center justify-center px-4 py-6 bg-[#222120] border border-[#383532] rounded-xl hover:border-[#C8A96E]/60 hover:bg-[#252320] transition-all duration-250 text-center"
                  >
                    <span className="font-heading font-semibold text-white text-lg group-hover:text-[#C8A96E] transition-colors duration-200">
                      {style}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
