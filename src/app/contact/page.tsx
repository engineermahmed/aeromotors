"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, CheckCircle, MessageCircle } from "lucide-react";

const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  ),
};
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+1 647-607-6355", href: "tel:+16476076355" },
  { icon: MessageCircle, label: "WhatsApp", value: "647-607-6355", href: "https://wa.me/16476076355" },
  { icon: Mail, label: "Email", value: "Zaeem@Aeromotors.ca", href: "mailto:Zaeem@Aeromotors.ca" },
  { icon: MapPin, label: "Location", value: "Greater Toronto Area, Ontario", href: "#" },
];

const hours = [
  { day: "Monday – Friday", time: "10:00 AM – 6:00 PM" },
  { day: "Saturday", time: "10:00 AM – 4:00 PM" },
  { day: "Sunday", time: "Closed" },
  { day: "Public Holidays", time: "Closed" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Enquiry", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const inputCls = "w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors";
  const labelCls = "block text-[#8F8F93] text-xs uppercase tracking-wider mb-2 font-medium";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Header */}
        <section className="bg-[#161614] border-b border-[#404040] py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-3">Get in Touch</span>
              <h1 className="font-heading font-bold text-white text-5xl lg:text-6xl mb-4">Contact Us</h1>
              <p className="text-[#BDBDBD] text-lg max-w-xl">
                Our team is ready to assist with any enquiry. Reach out and experience the AERO MOTORS difference.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Left: Info */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="lg:col-span-2 space-y-6">
                {/* Contact Details */}
                <div className="bg-[#252525] border border-[#404040] rounded-xl p-7">
                  <h2 className="font-heading font-semibold text-white text-xl mb-6">Contact Information</h2>
                  <div className="space-y-5">
                    {contactInfo.map(({ icon: Icon, label, value, href }) => (
                      <a key={label} href={href} className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-[#2A2A2A] border border-[#404040] rounded-lg flex items-center justify-center shrink-0 group-hover:border-[#8F8F93] transition-colors">
                          <Icon className="w-4 h-4 text-[#8F8F93]" />
                        </div>
                        <div>
                          <p className="text-[#8F8F93] text-xs mb-0.5">{label}</p>
                          <p className="text-white text-sm group-hover:text-[#BDBDBD] transition-colors">{value}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-[#252525] border border-[#404040] rounded-xl p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <Clock className="w-5 h-5 text-[#8F8F93]" />
                    <h2 className="font-heading font-semibold text-white text-xl">Business Hours</h2>
                  </div>
                  <div className="space-y-3">
                    {hours.map(({ day, time }) => (
                      <div key={day} className="flex justify-between items-center text-sm py-2.5 border-b border-[#404040] last:border-0">
                        <span className="text-[#BDBDBD]">{day}</span>
                        <span className="text-white font-medium">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social */}
                <div className="bg-[#252525] border border-[#404040] rounded-xl p-7">
                  <h2 className="font-heading font-semibold text-white text-xl mb-5">Follow Us</h2>
                  <div className="flex gap-3">
                    {[
                      { icon: SocialIcons.Instagram, label: "Instagram" },
                      { icon: SocialIcons.Facebook, label: "Facebook" },
                    ].map(({ icon: Icon, label }) => (
                      <a key={label} href="#" aria-label={label}
                        className="w-10 h-10 border border-[#404040] rounded-lg flex items-center justify-center text-[#8F8F93] hover:text-white hover:border-[#8F8F93] transition-all cursor-pointer">
                        <Icon />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right: Contact Form + Map */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="lg:col-span-3 space-y-6">
                {/* Form */}
                <div className="bg-[#252525] border border-[#404040] rounded-xl p-8">
                  <h2 className="font-heading font-bold text-white text-2xl mb-7">Send a Message</h2>
                  {submitted ? (
                    <div className="flex flex-col items-center text-center py-12">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-[#1F1E1C]" />
                      </div>
                      <h3 className="font-heading font-bold text-white text-2xl mb-2">Message Sent!</h3>
                      <p className="text-[#BDBDBD]">Thank you for reaching out. We&apos;ll be in touch within 24 hours.</p>
                      <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "General Enquiry", message: "" }); }} className="mt-6 px-6 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);
                      setSubmitError("");
                      try {
                        const res = await fetch("/api/contacts", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(form),
                        });
                        if (!res.ok) throw new Error("Failed to send");
                        setSubmitted(true);
                      } catch {
                        setSubmitError("Something went wrong. Please try again or contact us directly.");
                      } finally {
                        setSubmitting(false);
                      }
                    }} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Full Name *</label>
                          <input required className={inputCls} placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                          <label className={labelCls}>Phone Number</label>
                          <input type="tel" className={inputCls} placeholder="+1 (647) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Email Address *</label>
                        <input required type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelCls}>Subject</label>
                        <select className={inputCls + " cursor-pointer"} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                          {["General Enquiry", "Vehicle Enquiry", "Finance Enquiry", "Sell My Car", "Test Drive", "Other"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Message *</label>
                        <textarea required rows={5} className={inputCls + " resize-none"} placeholder="How can we help you?"
                          value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                      </div>
                      {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
                      <button type="submit" disabled={submitting} className="w-full py-4 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                        {submitting ? "Sending…" : "Send Message"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Map */}
                <div className="bg-[#252525] border border-[#404040] rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d185891.03494267!2d-79.5421!3d43.7182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2697660dc37f%3A0x3e9c09edefd5a4e0!2sToronto%2C%20ON!5e0!3m2!1sen!2sca!4v1704067200000!5m2!1sen!2sca"
                    width="100%"
                    height="300"
                    style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(83%)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="AERO MOTORS Location"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
