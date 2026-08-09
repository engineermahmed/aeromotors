"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Calculator, FileText, Clock, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  { icon: Clock, title: "Fast Approval", desc: "Most applications are approved within 24 hours — some same day." },
  { icon: Shield, title: "Competitive Rates", desc: "Access to 20+ lenders to ensure you get the best rate available." },
  { icon: Calculator, title: "Flexible Terms", desc: "Choose from 12 to 84 months to suit your budget and lifestyle." },
  { icon: FileText, title: "Simple Process", desc: "Straightforward application with minimal paperwork required." },
];

const faqs = [
  { q: "What credit score do I need?", a: "We work with a range of credit profiles. While better credit scores typically qualify for lower rates, we have lenders for most situations." },
  { q: "How long does approval take?", a: "Most applications receive a decision within 24 hours. Many are approved the same day." },
  { q: "Can I refinance my current vehicle?", a: "Yes, we offer refinancing options that can often lower your monthly payment or reduce your interest rate." },
  { q: "What documents do I need?", a: "Typically: proof of identity, proof of income, proof of residence, and bank statements for the last 3 months." },
];

export default function FinancePage() {
  const [vehicle, setVehicle] = useState(80000);
  const [deposit, setDeposit] = useState(16000);
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(3.9);
  const [form, setForm] = useState({ name: "", email: "", phone: "", income: "", employment: "Employed", vehiclePrice: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const loanAmount = vehicle - deposit;
  const monthly = useMemo(() => {
    const r = rate / 100 / 12;
    if (r === 0) return loanAmount / term;
    return (loanAmount * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
  }, [loanAmount, term, rate]);

  const totalRepayable = monthly * term;
  const totalInterest = totalRepayable - loanAmount;

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
  const inputCls = "w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors";
  const labelCls = "block text-[#8F8F93] text-xs uppercase tracking-wider mb-2 font-medium";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="relative py-28 overflow-hidden bg-[#161614]">
          <div className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80')" }} />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-4">Flexible Finance</span>
              <h1 className="font-heading font-bold text-white text-6xl lg:text-7xl leading-[1.05] mb-5">
                Drive Now,<br /><span className="text-[#BDBDBD]">Pay Your Way</span>
              </h1>
              <p className="text-[#BDBDBD] text-lg max-w-xl mx-auto mb-8">
                Competitive rates, flexible terms, and fast approvals. Let us help you get behind the wheel today.
              </p>
              <a href="#apply" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors">
                Apply Now <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-t border-[#404040]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="bg-[#252525] border border-[#404040] rounded-xl p-7">
                    <Icon className="w-8 h-8 text-white mb-4" />
                    <h3 className="font-heading font-semibold text-white text-lg mb-2">{f.title}</h3>
                    <p className="text-[#BDBDBD] text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Calculator + Form */}
        <section className="py-20 bg-[#161614] border-t border-[#404040]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Calculator */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-[#252525] border border-[#404040] rounded-xl p-8">
                <h2 className="font-heading font-bold text-white text-2xl mb-7">Finance Calculator</h2>

                <div className="space-y-5 mb-7">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className={labelCls + " mb-0"}>Vehicle Price</label>
                      <span className="text-white text-sm font-medium">{fmt(vehicle)}</span>
                    </div>
                    <input type="range" min={10000} max={500000} step={1000} value={vehicle}
                      onChange={(e) => setVehicle(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className={labelCls + " mb-0"}>Deposit</label>
                      <span className="text-white text-sm font-medium">{fmt(deposit)}</span>
                    </div>
                    <input type="range" min={0} max={vehicle * 0.5} step={500} value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Term (months)</label>
                      <select value={term} onChange={(e) => setTerm(Number(e.target.value))}
                        className={inputCls + " cursor-pointer"}>
                        {[24, 36, 48, 60, 72, 84].map((t) => <option key={t} value={t}>{t} months</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Interest Rate (%)</label>
                      <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className={inputCls} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-6 bg-[#2A2A2A] rounded-lg border border-[#404040]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8F8F93]">Loan Amount</span>
                    <span className="text-white font-medium">{fmt(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8F8F93]">Total Interest</span>
                    <span className="text-white font-medium">{fmt(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8F8F93]">Total Repayable</span>
                    <span className="text-white font-medium">{fmt(totalRepayable)}</span>
                  </div>
                  <div className="border-t border-[#404040] pt-3 flex justify-between items-end">
                    <span className="text-[#BDBDBD] text-sm">Monthly Payment</span>
                    <span className="font-heading font-bold text-white text-4xl">{fmt(monthly)}<span className="text-[#8F8F93] text-base font-normal">/mo</span></span>
                  </div>
                </div>
                <p className="text-[#8F8F93] text-xs mt-4">* Representative estimate. Actual terms subject to credit approval and lender criteria.</p>
              </motion.div>

              {/* Application Form */}
              <motion.div id="apply" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-[#252525] border border-[#404040] rounded-xl p-8">
                <h2 className="font-heading font-bold text-white text-2xl mb-7">Finance Application</h2>
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-12">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-[#1F1E1C]" />
                    </div>
                    <h3 className="font-heading font-bold text-white text-2xl mb-2">Application Received!</h3>
                    <p className="text-[#BDBDBD]">Our finance team will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Full Name *</label>
                        <input required className={inputCls} placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelCls}>Phone *</label>
                        <input required type="tel" className={inputCls} placeholder="+1 (234) 567-890" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Email Address *</label>
                      <input required type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Annual Income</label>
                        <input type="number" className={inputCls} placeholder="e.g. 120000" value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelCls}>Employment Status</label>
                        <select className={inputCls + " cursor-pointer"} value={form.employment} onChange={(e) => setForm({ ...form, employment: e.target.value })}>
                          {["Employed", "Self-Employed", "Business Owner", "Retired"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Vehicle Price (if known)</label>
                      <input type="number" className={inputCls} placeholder="e.g. 85000" value={form.vehiclePrice} onChange={(e) => setForm({ ...form, vehiclePrice: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full py-4 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer mt-2">
                      Submit Application
                    </button>
                    <p className="text-[#8F8F93] text-xs text-center">Your details are secure and will only be shared with approved lenders.</p>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 border-t border-[#404040]">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="text-center mb-12">
              <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-3">Common Questions</span>
              <h2 className="font-heading font-bold text-white text-4xl">Finance FAQs</h2>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-[#252525] border border-[#404040] rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                    <span className="font-heading font-medium text-white">{faq.q}</span>
                    <ArrowRight className={`w-4 h-4 text-[#8F8F93] shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 border-t border-[#404040] pt-4">
                      <p className="text-[#BDBDBD] text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
