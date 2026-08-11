"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Fuel, Gauge, Settings, ArrowRight } from "lucide-react";
import { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

export default function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(vehicle.price);

  const formattedMileage = new Intl.NumberFormat("en-CA").format(vehicle.mileage);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 8, y: (x - 0.5) * -8 });
    setShine({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: hovered ? "transform 0.1s ease" : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          transformStyle: "preserve-3d",
        }}
      >
        <Link href={`/inventory/${vehicle.id}`} className="group block">
          <div className="relative bg-[#222120] border border-[#383532] rounded-xl overflow-hidden transition-all duration-400 hover:border-[#C8A96E]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            {/* Shine layer */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
              style={{
                background: `radial-gradient(ellipse at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.04) 0%, transparent 60%)`,
              }}
            />

            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#282624]">
              <Image
                src={vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-107"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2 z-10">
                {vehicle.isFeatured && (
                  <span className="px-2.5 py-1 bg-[#C8A96E] text-[#1A1917] text-[10px] font-bold rounded-sm tracking-[0.15em] uppercase">
                    Featured
                  </span>
                )}
                {vehicle.isNew && (
                  <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white text-[10px] font-bold rounded-sm tracking-[0.15em] uppercase border border-white/20">
                    New
                  </span>
                )}
                {vehicle.status === "sold" && (
                  <span className="px-2.5 py-1 bg-red-900/80 text-red-200 text-[10px] font-bold rounded-sm tracking-[0.15em] uppercase">
                    Sold
                  </span>
                )}
              </div>

              {/* Hover CTA overlay */}
              <div className="absolute inset-0 flex items-end justify-center pb-4 z-10">
                <motion.div
                  initial={false}
                  animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 bg-white text-[#1A1917] px-5 py-2.5 rounded-sm text-xs font-bold tracking-wide shadow-xl"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#8A8880] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">
                    {vehicle.make} · {vehicle.year}
                  </p>
                  <h3 className="text-[#F5F4F2] font-heading font-semibold text-lg leading-tight">
                    {vehicle.model}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[#F5F4F2] font-heading font-bold text-xl">
                    {formattedPrice}
                  </p>
                  <p className="text-[#8A8880] text-[10px] mt-0.5">+ tax & fees</p>
                </div>
              </div>

              {/* Specs row */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#383532]">
                <div className="flex items-center gap-1.5 text-[#B8B5B0] text-xs">
                  <Gauge className="w-3.5 h-3.5 text-[#8A8880]" />
                  <span>{formattedMileage} mi</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#B8B5B0] text-xs">
                  <Settings className="w-3.5 h-3.5 text-[#8A8880]" />
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#B8B5B0] text-xs">
                  <Fuel className="w-3.5 h-3.5 text-[#8A8880]" />
                  <span>{vehicle.fuelType}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
