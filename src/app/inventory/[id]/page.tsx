"use client";

import { use, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Gauge, Settings, Fuel, Zap,
  Shield, Phone, Mail, CheckCircle, ArrowLeft, Share2, Heart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleCard from "@/components/shared/VehicleCard";
import { Vehicle } from "@/types";

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23252525'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23666'%3EImage unavailable%3C/text%3E%3C/svg%3E";
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTerm, setLoanTerm] = useState(84);
  const [interestRate, setInterestRate] = useState(5.99);
  const [availableTerms, setAvailableTerms] = useState([24, 36, 48, 60, 72, 84]);
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [licensingIncluded, setLicensingIncluded] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareToast, setShareToast] = useState("");

  useEffect(() => {
    fetch(`/api/vehicles/${id}`)
      .then((r) => r.json())
      .then((data: Vehicle) => {
        if (data?.id) {
          setVehicle(data);
          setLoanAmount(Math.round(data.price * 0.8 * 100) / 100);
          setForm((f) => ({ ...f, message: `Hi, I'm interested in the ${data.year} ${data.make} ${data.model}.` }));
        }
      })
      .catch(() => {});
    fetch("/api/vehicles?status=available")
      .then((r) => r.json())
      .then((data: Vehicle[]) => Array.isArray(data) && setAllVehicles(data))
      .catch(() => {});
    fetch("/api/finance")
      .then((r) => r.json())
      .then((s) => {
        if (s.defaultRate) setInterestRate(s.defaultRate);
        if (s.defaultTerm) setLoanTerm(s.defaultTerm);
        if (s.availableTerms?.length) setAvailableTerms(s.availableTerms);
      })
      .catch(() => {});
    // Load saved state from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("aero_saved") || "[]");
      setSaved(Array.isArray(saved) && saved.includes(id));
    } catch { /* */ }
  }, [id]);

  const toggleSave = () => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem("aero_saved") || "[]");
      const next = saved ? list.filter((x) => x !== id) : [...list, id];
      localStorage.setItem("aero_saved", JSON.stringify(next));
      setSaved(!saved);
    } catch { /* */ }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Vehicle", url }); return; }
      catch { /* user cancelled */ return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareToast("Link copied to clipboard!");
      setTimeout(() => setShareToast(""), 2500);
    } catch {
      setShareToast("Copy this link: " + url);
      setTimeout(() => setShareToast(""), 4000);
    }
  };

  const relatedVehicles = useMemo(() => {
    if (!vehicle) return [];
    const same = allVehicles.filter((v) => v.id !== vehicle.id && v.make === vehicle.make).slice(0, 3);
    const other = allVehicles.filter((v) => v.id !== vehicle.id && v.make !== vehicle.make).slice(0, Math.max(0, 3 - same.length));
    return [...same, ...other].slice(0, 3);
  }, [vehicle, allVehicles]);

  const effectiveLoanAmount = useMemo(() => {
    let amt = loanAmount;
    if (taxIncluded) amt = Math.round(amt * 1.13 * 100) / 100;
    if (licensingIncluded) amt = Math.round((amt + 170) * 100) / 100;
    return amt;
  }, [loanAmount, taxIncluded, licensingIncluded]);

  const monthlyPayment = useMemo(() => {
    const r = interestRate / 100 / 12;
    if (r === 0) return effectiveLoanAmount / loanTerm;
    return (effectiveLoanAmount * r * Math.pow(1 + r, loanTerm)) / (Math.pow(1 + r, loanTerm) - 1);
  }, [effectiveLoanAmount, loanTerm, interestRate]);

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <p className="text-[#8F8F93]">Loading vehicle…</p>
        </main>
        <Footer />
      </>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(vehicle.price);

  const specs = [
    { label: "Year", value: vehicle.year.toString() },
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Body Style", value: vehicle.bodyStyle },
    { label: "Engine", value: vehicle.engineSize },
    { label: "Horsepower", value: `${vehicle.horsepower} hp` },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Drive Type", value: vehicle.driveType },
    { label: "Fuel Type", value: vehicle.fuelType },
    { label: "Color", value: vehicle.color },
    { label: "Mileage", value: `${new Intl.NumberFormat("en-US").format(vehicle.mileage)} km` },
    ...(vehicle.vin ? [{ label: "VIN", value: vehicle.vin }] : []),
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Breadcrumb */}
        <div className="bg-[#161614] border-b border-[#404040] py-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center gap-3">
            <Link href="/inventory" className="flex items-center gap-1.5 text-[#8F8F93] hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Inventory
            </Link>
            <span className="text-[#404040]">/</span>
            <span className="text-[#BDBDBD] text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Left: Gallery + Details */}
            <div className="xl:col-span-2 space-y-8">
              {/* Gallery */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#252525] border border-[#404040] mb-3">
                  <Image
                    src={imgErrors[activeImage] ? PLACEHOLDER : vehicle.images[activeImage]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill className="object-cover" priority
                    sizes="(max-width: 1280px) 100vw, 66vw"
                    onError={() => setImgErrors(e => ({ ...e, [activeImage]: true }))}
                  />
                  {vehicle.images.length > 1 && (
                    <>
                      <button onClick={() => setActiveImage((i) => (i === 0 ? vehicle.images.length - 1 : i - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer backdrop-blur-sm">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={() => setActiveImage((i) => (i === vehicle.images.length - 1 ? 0 : i + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer backdrop-blur-sm">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded backdrop-blur-sm">
                    {activeImage + 1} / {vehicle.images.length}
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {vehicle.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`relative shrink-0 w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${i === activeImage ? "border-white" : "border-[#404040] hover:border-[#8F8F93]"}`}>
                      <Image src={imgErrors[i] ? PLACEHOLDER : img} alt={`View ${i + 1}`} fill className="object-cover" sizes="96px" onError={() => setImgErrors(e => ({ ...e, [i]: true }))} />
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Overview */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[#252525] border border-[#404040] rounded-xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-[#8F8F93] text-xs tracking-widest uppercase mb-1">{vehicle.make}</p>
                    <h1 className="font-heading font-bold text-white text-3xl">{vehicle.year} {vehicle.model}</h1>
                  </div>
                  <div className="flex gap-2 relative">
                    <button
                      onClick={toggleSave}
                      aria-label={saved ? "Remove from saved" : "Save vehicle"}
                      className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${saved ? "border-red-500 bg-red-500/10 text-red-400" : "border-[#404040] text-[#8F8F93] hover:text-white hover:border-[#8F8F93]"}`}
                    >
                      <Heart className={`w-4 h-4 transition-all duration-200 ${saved ? "fill-red-400" : ""}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      aria-label="Share vehicle"
                      className="w-10 h-10 border border-[#404040] rounded-lg flex items-center justify-center text-[#8F8F93] hover:text-white hover:border-[#8F8F93] transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {shareToast && (
                      <div className="absolute right-0 top-12 bg-[#252525] border border-[#404040] text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-xl">
                        {shareToast}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#2A2A2A] rounded-lg mb-6">
                  {[
                    { icon: Gauge, label: "Mileage", value: `${new Intl.NumberFormat("en-US").format(vehicle.mileage)} km` },
                    { icon: Settings, label: "Transmission", value: vehicle.transmission },
                    { icon: Fuel, label: "Fuel Type", value: vehicle.fuelType },
                    { icon: Zap, label: "Power", value: `${vehicle.horsepower} hp` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col items-center text-center">
                      <Icon className="w-5 h-5 text-[#8F8F93] mb-2" />
                      <p className="text-white font-medium text-sm">{value}</p>
                      <p className="text-[#8F8F93] text-xs">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[#BDBDBD] leading-relaxed">{vehicle.description}</p>
              </motion.div>

              {/* Specifications */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#252525] border border-[#404040] rounded-xl p-8">
                <h2 className="font-heading font-bold text-white text-xl mb-6">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {specs.map((spec, i) => (
                    <div key={spec.label}
                      className={`flex items-center justify-between py-3.5 border-b border-[#404040] ${i % 2 === 0 ? "sm:pr-8" : "sm:pl-8 sm:border-l"}`}>
                      <span className="text-[#8F8F93] text-sm">{spec.label}</span>
                      <span className="text-white text-sm font-medium text-right max-w-[60%]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-[#252525] border border-[#404040] rounded-xl p-8">
                <h2 className="font-heading font-bold text-white text-xl mb-6">Features & Options</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-white shrink-0" />
                      <span className="text-[#BDBDBD] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Finance Calculator */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-[#252525] border border-[#404040] rounded-xl p-8">
                <h2 className="font-heading font-bold text-white text-xl mb-6">Finance Calculator</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-2">Loan Amount</label>
                    <input type="number" value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full bg-[#2A2A2A] border border-[#404040] text-white rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-2">Interest Rate (%)</label>
                    <div className="w-full bg-[#2A2A2A] border border-[#404040] rounded px-3 py-2.5 text-sm flex items-center justify-between cursor-default select-none">
                      <span className="text-white">{interestRate.toFixed(2)}%</span>
                      <span className="text-[#8F8F93] text-xs">Set by dealer</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-2">Term (months)</label>
                    <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full bg-[#2A2A2A] border border-[#404040] text-white rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors cursor-pointer">
                      {availableTerms.map((t) => <option key={t} value={t}>{t} months</option>)}
                    </select>
                  </div>
                </div>
                {/* Add-on toggles */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setTaxIncluded((v) => !v)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded border text-sm font-medium transition-all cursor-pointer ${taxIncluded ? "bg-white text-[#1F1E1C] border-white" : "bg-transparent text-[#BDBDBD] border-[#404040] hover:border-[#8F8F93] hover:text-white"}`}
                  >
                    <span className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${taxIncluded ? "bg-[#1F1E1C] border-[#1F1E1C]" : "border-current"}`}>
                      {taxIncluded && <CheckCircle className="w-3 h-3" />}
                    </span>
                    Add Tax (13% HST)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLicensingIncluded((v) => !v)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded border text-sm font-medium transition-all cursor-pointer ${licensingIncluded ? "bg-white text-[#1F1E1C] border-white" : "bg-transparent text-[#BDBDBD] border-[#404040] hover:border-[#8F8F93] hover:text-white"}`}
                  >
                    <span className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${licensingIncluded ? "bg-[#1F1E1C] border-[#1F1E1C]" : "border-current"}`}>
                      {licensingIncluded && <CheckCircle className="w-3 h-3" />}
                    </span>
                    Add Licensing & Fees (+CAD 170)
                  </button>
                </div>
                {(taxIncluded || licensingIncluded) && (
                  <div className="mb-4 px-4 py-3 bg-[#2A2A2A] rounded border border-[#404040] text-xs text-[#8F8F93] space-y-1">
                    <div className="flex justify-between"><span>Base loan amount</span><span className="text-white">{new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(loanAmount)}</span></div>
                    {taxIncluded && <div className="flex justify-between"><span>HST (13%)</span><span className="text-white">+ {new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(loanAmount * 0.13)}</span></div>}
                    {licensingIncluded && <div className="flex justify-between"><span>Licensing & Fees</span><span className="text-white">+ CAD 170.00</span></div>}
                    <div className="flex justify-between pt-1 border-t border-[#404040]"><span className="text-[#BDBDBD]">Total financed</span><span className="text-white font-medium">{new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(effectiveLoanAmount)}</span></div>
                  </div>
                )}
                <div className="p-5 bg-[#2A2A2A] rounded-lg border border-[#404040] flex items-center justify-between">
                  <p className="text-[#BDBDBD] text-sm">Est. Monthly Payment</p>
                  <p className="font-heading font-bold text-white text-3xl">
                    {new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monthlyPayment)}
                    <span className="text-[#8F8F93] text-sm font-normal">/mo</span>
                  </p>
                </div>
                <p className="text-[#8F8F93] text-xs mt-3">* Estimate only. Actual rate subject to credit approval.</p>
              </motion.div>
            </div>

            {/* Right: Sticky Contact Panel */}
            <div>
              <div className="sticky top-24 space-y-5">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                  className="bg-[#252525] border border-[#404040] rounded-xl p-7">
                  <div className="flex items-center gap-2 mb-3">
                    {vehicle.isFeatured && <span className="text-xs px-2 py-0.5 bg-white text-[#1F1E1C] rounded font-semibold">FEATURED</span>}
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold border ${vehicle.status === "available" ? "border-green-800 text-green-400" : "border-[#404040] text-[#8F8F93]"}`}>
                      {vehicle.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-heading font-bold text-white text-4xl mb-1">{formattedPrice}</p>
                  <p className="text-[#8F8F93] text-sm mb-6">
                    or from ~{new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monthlyPayment)}/mo
                  </p>
                  <div className="flex gap-3 mb-3">
                    <a href="tel:+1234567890" className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors">
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <a href="mailto:info@aeromotors.com" className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#404040] text-white font-semibold text-sm rounded hover:border-[#8F8F93] transition-colors">
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </div>
                  <Link href="/finance" className="block w-full text-center py-3 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:text-white hover:border-[#8F8F93] transition-all">
                    Apply for Finance
                  </Link>
                </motion.div>

                {/* Inquiry Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-[#252525] border border-[#404040] rounded-xl p-7">
                  <h3 className="font-heading font-semibold text-white mb-5">Inquire About This Vehicle</h3>
                  {sent ? (
                    <div className="flex flex-col items-center text-center py-6">
                      <CheckCircle className="w-12 h-12 text-white mb-3" />
                      <p className="font-heading font-semibold text-white mb-1">Inquiry Sent!</p>
                      <p className="text-[#BDBDBD] text-sm">We&apos;ll be in touch shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await fetch("/api/contacts", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: form.name,
                            email: form.email,
                            phone: form.phone,
                            subject: `Inquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                            message: form.message || "Customer submitted an inquiry via the vehicle page.",
                          }),
                        });
                        if (!res.ok) throw new Error("Failed");
                      } catch {
                        // still show success to user even on network error
                      }
                      setSent(true);
                    }} className="space-y-3">
                      {[
                        { placeholder: "Your Name *", key: "name", type: "text", required: true },
                        { placeholder: "Email Address *", key: "email", type: "email", required: true },
                        { placeholder: "Phone Number", key: "phone", type: "tel", required: false },
                      ].map((f) => (
                        <input key={f.key} type={f.type} placeholder={f.placeholder} required={f.required}
                          value={form[f.key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors" />
                      ))}
                      <textarea rows={3} placeholder="Your message..." value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors resize-none" />
                      <button type="submit" className="w-full py-3.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                        Send Inquiry
                      </button>
                    </form>
                  )}
                </motion.div>

                {/* Trust badges */}
                <div className="bg-[#252525] border border-[#404040] rounded-xl p-6">
                  {[
                    { icon: Shield, label: "Verified History", desc: "Full vehicle history report" },
                    { icon: CheckCircle, label: "Inspected", desc: "Multi-point inspection passed" },
                    { icon: Phone, label: "Expert Support", desc: "Mon–Sat, 9am–7pm" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3 py-3 border-b border-[#404040] last:border-0">
                      <Icon className="w-5 h-5 text-[#8F8F93] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium">{label}</p>
                        <p className="text-[#8F8F93] text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Vehicles */}
          {relatedVehicles.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading font-bold text-white text-3xl mb-8">Similar Vehicles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedVehicles.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
