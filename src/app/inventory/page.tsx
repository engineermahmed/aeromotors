"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleCard from "@/components/shared/VehicleCard";
import { Vehicle } from "@/types";

const filterOptions = {
  makes: ["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Jeep", "Volkswagen", "Nissan", "Hyundai", "Kia", "Mazda", "Subaru", "Dodge", "Audi"],
  bodyStyles: ["Sedan", "Coupe", "SUV", "Truck", "Hatchback", "Convertible", "Wagon", "Van"],
  transmissions: ["Automatic", "Manual"],
  fuelTypes: ["Petrol", "Diesel", "Electric", "Hybrid"],
  driveTypes: ["AWD", "RWD", "FWD", "4WD"],
  colors: ["Black", "White", "Silver", "Grey", "Blue", "Red", "Green", "Brown"],
};

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
          checked ? "bg-white border-white" : "border-[#404040] group-hover:border-[#8F8F93]"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-[#1F1E1C]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="text-[#BDBDBD] text-sm group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}

function FilterSection({ title, options, selected, onToggle }: { title: string; options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#404040] py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-white font-heading font-medium text-sm mb-3 cursor-pointer">
        {title}
        <ChevronDown className={`w-4 h-4 text-[#8F8F93] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-2.5">
          {options.map((opt) => (
            <FilterCheckbox key={opt} label={opt} checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
          ))}
        </div>
      )}
    </div>
  );
}

const ITEMS_PER_PAGE = 9;
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Mileage: Low to High", value: "mileage_asc" },
];

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  const initialMake = searchParams.get("make") || "";
  const initialBody = searchParams.get("body") || "";

  const [filters, setFilters] = useState({
    makes: initialMake ? [initialMake] : [] as string[],
    bodyStyles: initialBody ? [initialBody] : [] as string[],
    transmissions: [] as string[],
    fuelTypes: [] as string[],
    driveTypes: [] as string[],
    colors: [] as string[],
    priceMin: "",
    priceMax: "",
    mileageMax: "",
    search: "",
  });

  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/vehicles?status=available")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setAllVehicles(data))
      .catch(() => {});
  }, []);

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const filtered = useMemo(() => {
    let result = [...allVehicles];
    if (filters.makes.length) result = result.filter((v) => filters.makes.includes(v.make));
    if (filters.bodyStyles.length) result = result.filter((v) => filters.bodyStyles.includes(v.bodyStyle));
    if (filters.transmissions.length) result = result.filter((v) => filters.transmissions.includes(v.transmission));
    if (filters.fuelTypes.length) result = result.filter((v) => filters.fuelTypes.includes(v.fuelType));
    if (filters.driveTypes.length) result = result.filter((v) => filters.driveTypes.includes(v.driveType));
    if (filters.priceMin) result = result.filter((v) => v.price >= Number(filters.priceMin));
    if (filters.priceMax) result = result.filter((v) => v.price <= Number(filters.priceMax));
    if (filters.mileageMax) result = result.filter((v) => v.mileage <= Number(filters.mileageMax));
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.color.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price_asc": return result.sort((a, b) => a.price - b.price);
      case "price_desc": return result.sort((a, b) => b.price - a.price);
      case "mileage_asc": return result.sort((a, b) => a.mileage - b.mileage);
      default: return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [allVehicles, filters, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeFilterCount =
    filters.makes.length + filters.bodyStyles.length + filters.transmissions.length +
    filters.fuelTypes.length + filters.driveTypes.length;

  const clearAll = () => {
    setFilters({ makes: [], bodyStyles: [], transmissions: [], fuelTypes: [], driveTypes: [], colors: [], priceMin: "", priceMax: "", mileageMax: "", search: "" });
    setPage(1);
  };

  const SidebarContent = () => (
    <div className="space-y-0">
      <div className="border-b border-[#404040] py-4">
        <p className="text-white font-heading font-medium text-sm mb-3">Price Range</p>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Min $" value={filters.priceMin}
            onChange={(e) => { setFilters({ ...filters, priceMin: e.target.value }); setPage(1); }}
            className="bg-[#2A2A2A] border border-[#404040] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#8F8F93] transition-colors placeholder-[#8F8F93]" />
          <input type="number" placeholder="Max $" value={filters.priceMax}
            onChange={(e) => { setFilters({ ...filters, priceMax: e.target.value }); setPage(1); }}
            className="bg-[#2A2A2A] border border-[#404040] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#8F8F93] transition-colors placeholder-[#8F8F93]" />
        </div>
      </div>
      <FilterSection title="Make" options={filterOptions.makes} selected={filters.makes} onToggle={(v) => { setFilters({ ...filters, makes: toggle(filters.makes, v) }); setPage(1); }} />
      <FilterSection title="Body Style" options={filterOptions.bodyStyles} selected={filters.bodyStyles} onToggle={(v) => { setFilters({ ...filters, bodyStyles: toggle(filters.bodyStyles, v) }); setPage(1); }} />
      <FilterSection title="Transmission" options={filterOptions.transmissions} selected={filters.transmissions} onToggle={(v) => { setFilters({ ...filters, transmissions: toggle(filters.transmissions, v) }); setPage(1); }} />
      <FilterSection title="Fuel Type" options={filterOptions.fuelTypes} selected={filters.fuelTypes} onToggle={(v) => { setFilters({ ...filters, fuelTypes: toggle(filters.fuelTypes, v) }); setPage(1); }} />
      <FilterSection title="Drive Type" options={filterOptions.driveTypes} selected={filters.driveTypes} onToggle={(v) => { setFilters({ ...filters, driveTypes: toggle(filters.driveTypes, v) }); setPage(1); }} />
      <div className="border-b border-[#404040] py-4">
        <p className="text-white font-heading font-medium text-sm mb-3">Max Mileage</p>
        <input type="number" placeholder="e.g. 50000" value={filters.mileageMax}
          onChange={(e) => { setFilters({ ...filters, mileageMax: e.target.value }); setPage(1); }}
          className="w-full bg-[#2A2A2A] border border-[#404040] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#8F8F93] transition-colors placeholder-[#8F8F93]" />
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="bg-[#161614] border-b border-[#404040] py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-2">Our Collection</span>
              <h1 className="font-heading font-bold text-white text-4xl lg:text-5xl">Vehicle Inventory</h1>
              <p className="text-[#BDBDBD] mt-3">{filtered.length} premium vehicles available</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-[#404040] rounded text-[#BDBDBD] hover:text-white hover:border-[#8F8F93] transition-all text-sm cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-[#1F1E1C] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8F93]" />
              <input type="text" placeholder="Search by make, model, color..." value={filters.search}
                onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                className="w-full bg-[#252525] border border-[#404040] text-white text-sm rounded pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#8F8F93] transition-colors placeholder-[#8F8F93]" />
            </div>
            <div className="relative">
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="appearance-none bg-[#252525] border border-[#404040] text-white text-sm rounded pl-3 pr-8 py-2.5 focus:outline-none focus:border-[#8F8F93] transition-colors cursor-pointer">
                {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8F93] pointer-events-none" />
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1.5 text-[#8F8F93] hover:text-white text-sm transition-colors cursor-pointer">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-white text-sm">
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-2 bg-white text-[#1F1E1C] text-xs font-bold rounded-full px-1.5 py-0.5">{activeFilterCount}</span>
                    )}
                  </h2>
                  {activeFilterCount > 0 && (
                    <button onClick={clearAll} className="text-[#8F8F93] hover:text-white text-xs transition-colors cursor-pointer">Clear All</button>
                  )}
                </div>
                <SidebarContent />
              </div>
            </aside>

            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#1F1E1C] border-r border-[#404040] overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading font-semibold text-white">Filters</h2>
                    <button onClick={() => setSidebarOpen(false)} className="text-[#8F8F93] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
                  </div>
                  <SidebarContent />
                  <button onClick={() => setSidebarOpen(false)} className="w-full mt-6 py-3 bg-white text-[#1F1E1C] font-semibold rounded text-sm cursor-pointer">
                    Show {filtered.length} Results
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 min-w-0">
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="font-heading font-semibold text-white text-2xl mb-2">No vehicles found</p>
                  <p className="text-[#BDBDBD] text-sm mb-6">Try adjusting your filters or search query.</p>
                  <button onClick={clearAll} className="px-6 py-3 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {paginated.map((vehicle, i) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-2 border border-[#404040] rounded text-sm text-[#BDBDBD] hover:text-white hover:border-[#8F8F93] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded text-sm font-medium transition-all cursor-pointer ${
                            p === page ? "bg-white text-[#1F1E1C]" : "border border-[#404040] text-[#BDBDBD] hover:border-[#8F8F93] hover:text-white"
                          }`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-4 py-2 border border-[#404040] rounded text-sm text-[#BDBDBD] hover:text-white hover:border-[#8F8F93] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
