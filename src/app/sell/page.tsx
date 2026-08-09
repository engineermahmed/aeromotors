"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, Upload, X, Car, User, Camera, FileText, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const steps = [
  { id: 1, label: "Your Details", icon: User },
  { id: 2, label: "Vehicle Info", icon: Car },
  { id: 3, label: "Photos", icon: Camera },
  { id: 4, label: "Review", icon: FileText },
];

interface FormData {
  name: string; phone: string; email: string;
  make: string; model: string; year: string; vin: string;
  mileage: string; condition: string; transmission: string; color: string; comments: string;
  images: File[];
}

type Updater = (k: keyof FormData, v: string) => void;

const inputCls = "w-full bg-[#282624] border border-[#383532] text-white placeholder-[#8A8880] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C8A96E]/60 transition-colors";
const labelCls = "block text-[#8A8880] text-[10px] uppercase tracking-[0.15em] mb-2 font-semibold";

// ─── Step panels defined OUTSIDE the page component so React never recreates them ───

function Step1({ form, update }: { form: FormData; update: Updater }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input className={inputCls} placeholder="John Smith" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Phone Number *</label>
          <input className={inputCls} type="tel" placeholder="+1 (234) 567-890" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Email Address *</label>
        <input className={inputCls} type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
      </div>
    </div>
  );
}

function Step2({ form, update }: { form: FormData; update: Updater }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Make *</label>
          <input className={inputCls} placeholder="e.g. Toyota" value={form.make} onChange={(e) => update("make", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Model *</label>
          <input className={inputCls} placeholder="e.g. Camry" value={form.model} onChange={(e) => update("model", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Year *</label>
          <input className={inputCls} type="number" placeholder="2021" value={form.year} onChange={(e) => update("year", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>VIN (optional)</label>
          <input className={inputCls} placeholder="17-character VIN" value={form.vin} onChange={(e) => update("vin", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Mileage *</label>
          <input className={inputCls} type="number" placeholder="e.g. 25000" value={form.mileage} onChange={(e) => update("mileage", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Condition</label>
          <select className={inputCls + " cursor-pointer"} value={form.condition} onChange={(e) => update("condition", e.target.value)}>
            {["Excellent", "Good", "Fair", "Poor"].map((c) => <option key={c} className="bg-[#222120]">{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Transmission</label>
          <select className={inputCls + " cursor-pointer"} value={form.transmission} onChange={(e) => update("transmission", e.target.value)}>
            {["Automatic", "Manual"].map((t) => <option key={t} className="bg-[#222120]">{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Color</label>
          <input className={inputCls} placeholder="e.g. Midnight Black" value={form.color} onChange={(e) => update("color", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Additional Comments</label>
        <textarea rows={4} className={inputCls + " resize-none"} placeholder="Service history, modifications, known issues..."
          value={form.comments} onChange={(e) => update("comments", e.target.value)} />
      </div>
    </div>
  );
}

function Step3({ form, handleFiles, removeImage, dragOver, setDragOver }: {
  form: FormData;
  handleFiles: (files: FileList | null) => void;
  removeImage: (i: number) => void;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
}) {
  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
          dragOver ? "border-[#C8A96E]/60 bg-[#C8A96E]/5" : "border-[#383532] hover:border-[#C8A96E]/40 hover:bg-[#C8A96E]/3"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div className="w-16 h-16 rounded-full bg-[#282624] border border-[#383532] flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7 text-[#8A8880]" />
        </div>
        <p className="text-white font-heading font-semibold text-lg mb-1">Drag & drop photos here</p>
        <p className="text-[#8A8880] text-sm mb-1">or click to browse files</p>
        <p className="text-[#8A8880] text-xs">Up to 10 images — JPG, PNG, WEBP</p>
        <input id="file-input" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {form.images.length > 0 && (
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">
          {form.images.map((file, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[#282624] border border-[#383532] group">
              <img src={URL.createObjectURL(file)} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
              <button onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-[#8A8880] text-xs mt-3">{form.images.length}/10 images added (photos stored on submission)</p>
    </div>
  );
}

function Step4({ form, error }: { form: FormData; error: string }) {
  return (
    <div className="space-y-5">
      {[
        { title: "Your Details", rows: [["Name", form.name], ["Phone", form.phone], ["Email", form.email]] },
        { title: "Vehicle Info", rows: [["Make", form.make], ["Model", form.model], ["Year", form.year], ["Mileage", form.mileage ? `${Number(form.mileage).toLocaleString()} mi` : "—"], ["Condition", form.condition], ["Transmission", form.transmission], ["Color", form.color || "—"]] },
      ].map(({ title, rows }) => (
        <div key={title} className="bg-[#282624] rounded-xl border border-[#383532] p-5">
          <h3 className="font-heading font-semibold text-white text-sm mb-4 pb-3 border-b border-[#383532]">{title}</h3>
          <div className="space-y-2">
            {rows.map(([l, v]) => (
              <div key={l} className="flex justify-between items-center text-sm">
                <span className="text-[#8A8880]">{l}</span>
                <span className="text-white font-medium">{v || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {form.images.length > 0 && (
        <div className="bg-[#282624] rounded-xl border border-[#383532] p-5">
          <h3 className="font-heading font-semibold text-white text-sm mb-4">{form.images.length} Photo{form.images.length > 1 ? "s" : ""} Attached</h3>
          <div className="grid grid-cols-5 gap-2">
            {form.images.slice(0, 5).map((file, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800/40 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page component ───

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "", phone: "", email: "",
    make: "", model: "", year: "", vin: "", mileage: "",
    condition: "Good", transmission: "Automatic", color: "", comments: "",
    images: [],
  });

  const update: Updater = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 10);
    setForm((f) => ({ ...f, images: [...f.images, ...arr].slice(0, 10) }));
  };

  const removeImage = (i: number) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        sellerName: form.name,
        sellerPhone: form.phone,
        sellerEmail: form.email,
        make: form.make,
        model: form.model,
        year: parseInt(form.year) || 0,
        mileage: parseInt(form.mileage) || 0,
        color: form.color,
        transmission: form.transmission,
        condition: form.condition,
        vin: form.vin || undefined,
        comments: form.comments || undefined,
        imageUrls: [],
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-[#C8A96E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(200,169,110,0.3)]">
            <CheckCircle className="w-10 h-10 text-[#1A1917]" />
          </div>
          <h1 className="font-heading font-bold text-white text-4xl mb-4">Request Submitted!</h1>
          <p className="text-[#B8B5B0] leading-relaxed mb-8">
            Thank you! Our team will review your listing and contact you within 24 hours with a competitive offer. Once approved, your vehicle will appear on our website.
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1917] font-bold text-sm rounded-sm hover:bg-[#C8A96E] transition-colors">
            Return Home
          </a>
        </motion.div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Header */}
        <div className="bg-[#111110] border-b border-[#383532] py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "32px 32px" }}
          />
          <div className="max-w-3xl mx-auto px-6 text-center relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-[#C8A96E] text-[10px] font-semibold tracking-[0.25em] uppercase block mb-3">Get an Offer</span>
              <h1 className="font-heading font-bold text-white text-5xl mb-4">Sell Your Car</h1>
              <p className="text-[#B8B5B0] text-sm">Get a competitive offer within 24 hours. Fair, fast, and no pressure.</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isDone = s.id < step;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive ? "border-[#C8A96E] bg-[#C8A96E]" : isDone ? "border-white bg-white" : "border-[#383532] bg-transparent"
                    }`}>
                      {isDone
                        ? <CheckCircle className="w-5 h-5 text-[#1A1917]" />
                        : <Icon className={`w-5 h-5 ${isActive ? "text-[#1A1917]" : "text-[#8A8880]"}`} />
                      }
                    </div>
                    <span className={`text-[10px] mt-2 font-semibold tracking-wide hidden sm:block transition-colors ${
                      isActive ? "text-[#C8A96E]" : isDone ? "text-[#B8B5B0]" : "text-[#8A8880]"
                    }`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-3 transition-colors duration-300 ${isDone ? "bg-white" : "bg-[#383532]"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#1E1D1B] border border-[#383532] rounded-2xl p-8 mb-6"
            >
              <h2 className="font-heading font-bold text-white text-xl mb-6">{steps[step - 1].label}</h2>
              {step === 1 && <Step1 form={form} update={update} />}
              {step === 2 && <Step2 form={form} update={update} />}
              {step === 3 && <Step3 form={form} handleFiles={handleFiles} removeImage={removeImage} dragOver={dragOver} setDragOver={setDragOver} />}
              {step === 4 && <Step4 form={form} error={error} />}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-6 py-3 border border-[#383532] text-[#8A8880] text-sm rounded-lg hover:border-[#8A8880] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className="flex items-center gap-2 px-8 py-3 bg-white text-[#1A1917] font-bold text-sm rounded-lg hover:bg-[#C8A96E] transition-colors cursor-pointer"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-white text-[#1A1917] font-bold text-sm rounded-lg hover:bg-[#C8A96E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Submit Listing</>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
