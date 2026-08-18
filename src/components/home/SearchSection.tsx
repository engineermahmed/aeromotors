"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

const makes = ["Any Make", "Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Jeep", "Volkswagen", "Nissan", "Hyundai", "Kia", "Mazda", "Subaru", "Dodge"];
const bodyStyles = ["Any Body", "Sedan", "Coupe", "SUV", "Truck", "Hatchback", "Convertible", "Wagon", "Van"];
const transmissions = ["Any Trans.", "Automatic", "Manual"];
const priceRanges = ["Any Price", "Under $10K", "$10K–$20K", "$20K–$30K", "$30K–$45K", "$45K+"];
const mileageRanges = ["Any KM", "Under 10K", "10K–30K", "30K–60K", "60K–100K", "100K+"];

const inputBase = "w-full appearance-none bg-transparent text-white text-sm focus:outline-none cursor-pointer placeholder-[#8A8880]";

interface FilterState {
  make: string;
  bodyStyle: string;
  transmission: string;
  price: string;
  mileage: string;
  search: string;
}

const defaultFilters: FilterState = {
  make: "Any Make",
  bodyStyle: "Any Body",
  transmission: "Any Trans.",
  price: "Any Price",
  mileage: "Any KM",
  search: "",
};

function FilterSelect({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 border-r border-[#383532] last:border-r-0">
      <label className="text-[#8A8880] text-[10px] tracking-[0.2em] uppercase font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#222120] text-white">{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function SearchSection() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [focused, setFocused] = useState(false);

  const update = (key: keyof FilterState, val: string) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const hasFilters = JSON.stringify(filters) !== JSON.stringify(defaultFilters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.make !== "Any Make") params.set("make", filters.make);
    if (filters.bodyStyle !== "Any Body") params.set("body", filters.bodyStyle);
    if (filters.transmission !== "Any Trans.") params.set("transmission", filters.transmission);
    if (filters.search) params.set("q", filters.search);
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <section id="search" className="relative z-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`-mt-12 rounded-2xl border transition-all duration-300 overflow-hidden ${
            focused
              ? "border-[#C8A96E]/40 shadow-[0_0_0_1px_rgba(200,169,110,0.15),0_24px_64px_rgba(0,0,0,0.6)]"
              : "border-[#383532] shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
          } bg-[#1E1D1B]/95 backdrop-blur-xl`}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={() => setFocused(false)}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-2 text-[#F5F4F2]">
              <SlidersHorizontal className="w-4 h-4 text-[#C8A96E]" />
              <span className="font-heading font-semibold text-sm">Find Your Vehicle</span>
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="flex items-center gap-1.5 text-[#8A8880] hover:text-white text-xs transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleSearch}>
            {/* Filter row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-t border-[#383532] divide-y sm:divide-y-0 divide-[#383532]">
              <FilterSelect label="Make" options={makes} value={filters.make} onChange={(v) => update("make", v)} />
              <FilterSelect label="Body Style" options={bodyStyles} value={filters.bodyStyle} onChange={(v) => update("bodyStyle", v)} />
              <FilterSelect label="Gearbox" options={transmissions} value={filters.transmission} onChange={(v) => update("transmission", v)} />
              <FilterSelect label="Price Range" options={priceRanges} value={filters.price} onChange={(v) => update("price", v)} />
              <FilterSelect label="Mileage" options={mileageRanges} value={filters.mileage} onChange={(v) => update("mileage", v)} />
            </div>

            {/* Keyword + submit row */}
            <div className="flex items-center gap-4 p-4 border-t border-[#383532]">
              <div className="flex-1 flex items-center gap-3 bg-[#282624] rounded-lg px-4 py-3 border border-[#383532] focus-within:border-[#C8A96E]/50 transition-colors">
                <Search className="w-4 h-4 text-[#8A8880] shrink-0" />
                <input
                  type="text"
                  placeholder="Search by model, color, keyword..."
                  value={filters.search}
                  onChange={(e) => update("search", e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm placeholder-[#8A8880] focus:outline-none"
                />
                {filters.search && (
                  <button type="button" onClick={() => update("search", "")} className="text-[#8A8880] hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="shrink-0 flex items-center gap-2 px-7 py-3 bg-white text-[#1A1917] font-bold text-sm rounded-lg hover:bg-[#C8A96E] transition-colors duration-200 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
