"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Gauge, Settings } from "lucide-react";
import { Vehicle } from "@/types";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23252525'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23666'%3EImage unavailable%3C/text%3E%3C/svg%3E";

export default function LatestArrivals() {
  const [latest, setLatest] = useState<Vehicle[]>([]);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/vehicles?status=available")
      .then((r) => r.json())
      .then((data: Vehicle[]) => {
        if (!Array.isArray(data)) return;
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLatest(sorted.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (latest.length === 0) return null;

  return (
    <section className="py-24 bg-[#161614]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-3">
            Just In
          </span>
          <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl">
            Latest Arrivals
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Featured Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link
              href={`/inventory/${latest[0]?.id}`}
              className="group relative block rounded-xl overflow-hidden bg-[#252525] border border-[#404040] hover:border-[#8F8F93] transition-all duration-300"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={imgErrors[`0-0`] ? PLACEHOLDER : (latest[0]?.images[0] || PLACEHOLDER)}
                  alt={`${latest[0]?.make} ${latest[0]?.model}`}
                  onError={() => setImgErrors(e => ({ ...e, "0-0": true }))}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="inline-block px-3 py-1 bg-white text-[#1F1E1C] text-xs font-semibold rounded tracking-wide mb-3 w-fit">
                    NEW ARRIVAL
                  </span>
                  <p className="text-[#8F8F93] text-xs tracking-widest uppercase mb-1">
                    {latest[0]?.make}
                  </p>
                  <h3 className="font-heading font-bold text-white text-3xl mb-2">
                    {latest[0]?.model}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-[#BDBDBD] text-sm">
                      <span className="flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-[#8F8F93]" />
                        {new Intl.NumberFormat("en-CA").format(latest[0]?.mileage || 0)} mi
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Settings className="w-4 h-4 text-[#8F8F93]" />
                        {latest[0]?.transmission}
                      </span>
                    </div>
                    <p className="font-heading font-bold text-white text-2xl">
                      {new Intl.NumberFormat("en-CA", {
                        style: "currency",
                        currency: "CAD",
                        currencyDisplay: "code",
                        minimumFractionDigits: 2,
                      }).format(latest[0]?.price || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Stack of 2 smaller cards */}
          <div className="flex flex-col gap-6">
            {latest.slice(1, 3).map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/inventory/${vehicle.id}`}
                  className="group relative block rounded-xl overflow-hidden bg-[#252525] border border-[#404040] hover:border-[#8F8F93] transition-all duration-300"
                >
                  <div className="relative" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={imgErrors[`1-${i}`] ? PLACEHOLDER : vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      onError={() => setImgErrors(e => ({ ...e, [`1-${i}`]: true }))}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      <p className="text-[#8F8F93] text-xs tracking-widest uppercase mb-0.5">
                        {vehicle.make}
                      </p>
                      <h4 className="font-heading font-bold text-white text-xl mb-1">
                        {vehicle.model}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-[#BDBDBD] text-xs">{vehicle.year}</p>
                        <p className="font-heading font-bold text-white text-lg">
                          {new Intl.NumberFormat("en-CA", {
                            style: "currency",
                            currency: "CAD",
                            minimumFractionDigits: 0,
                          }).format(vehicle.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex justify-end"
        >
          <Link
            href="/inventory?filter=new"
            className="inline-flex items-center gap-2 text-[#BDBDBD] hover:text-white text-sm font-medium transition-colors group"
          >
            See All New Arrivals
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
