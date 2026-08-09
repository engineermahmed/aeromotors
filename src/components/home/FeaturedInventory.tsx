"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Vehicle } from "@/types";
import VehicleCard from "@/components/shared/VehicleCard";

export default function FeaturedInventory() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetch("/api/vehicles?status=available&featured=true")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setVehicles(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  if (vehicles.length === 0) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-3">
              Hand-Inspected Vehicles
            </span>
            <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl leading-tight">
              Featured
              <br />
              <span className="text-gradient-gold">Inventory</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 text-[#BDBDBD] hover:text-white text-sm font-medium transition-colors group"
            >
              View All Vehicles
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle, i) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 px-10 py-4 border border-[#404040] text-white font-semibold text-sm rounded hover:border-[#8F8F93] hover:bg-white/5 transition-all duration-200"
          >
            Explore Full Inventory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
