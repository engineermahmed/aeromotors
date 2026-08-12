"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

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
  Youtube: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  ),
};

const footerLinks = {
  inventory: [
    { label: "All Vehicles", href: "/inventory" },
    { label: "New Arrivals", href: "/inventory?filter=new" },
    { label: "Featured Cars", href: "/inventory?filter=featured" },
    { label: "Luxury Sedans", href: "/inventory?body=sedan" },
    { label: "Sports Coupes", href: "/inventory?body=coupe" },
    { label: "Premium SUVs", href: "/inventory?body=suv" },
  ],
  services: [
    { label: "Vehicle Finance", href: "/finance" },
    { label: "Sell Your Car", href: "/sell" },
    { label: "Vehicle Inspection", href: "/about" },
    { label: "Trade-In", href: "/sell" },
    { label: "Warranty", href: "/about" },
    { label: "Insurance", href: "/finance" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "/about" },
    { label: "Privacy Policy", href: "/" },
    { label: "Terms of Service", href: "/" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subMsg, setSubMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubState("success");
        setSubMsg(data.alreadySubscribed ? "You're already subscribed!" : "You're subscribed!");
        setEmail("");
      } else {
        setSubState("error");
        setSubMsg(data.error || "Something went wrong.");
      }
    } catch {
      setSubState("error");
      setSubMsg("Network error. Please try again.");
    }
  };

  return (
    <footer className="bg-[#161614] border-t border-[#404040]">
      {/* Newsletter */}
      <div className="border-b border-[#404040]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                Stay in the Loop
              </h3>
              <p className="text-[#BDBDBD] text-sm">
                Be the first to know about our latest arrivals and exclusive offers.
              </p>
            </div>
            {subState === "success" ? (
              <div className="flex items-center gap-3 text-green-400">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{subMsg}</span>
              </div>
            ) : (
              <div className="w-full lg:w-auto">
                <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 lg:w-72 bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={subState === "loading"}
                    className="px-6 py-3 bg-white text-[#1F1E1C] text-sm font-semibold rounded hover:bg-[#BDBDBD] transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-60"
                  >
                    {subState === "loading" ? "Subscribing…" : <><span>Subscribe</span> <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
                {subState === "error" && (
                  <p className="text-red-400 text-xs mt-2">{subMsg}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.jpeg"
                  alt="AERO MOTORS"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-white font-heading font-bold text-xl tracking-widest">
                AERO MOTORS
              </span>
            </Link>
            <p className="text-[#BDBDBD] text-sm leading-relaxed mb-8 max-w-xs">
              Quality pre-owned vehicles at honest, transparent prices. Your Last Stop for hand-inspected cars with free GTA delivery. Est. 2026.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:+16476076355"
                className="flex items-center gap-3 text-[#BDBDBD] hover:text-white transition-colors text-sm group"
              >
                <Phone className="w-4 h-4 text-[#8F8F93] group-hover:text-white transition-colors" />
                +1 647-607-6355
              </a>
              <a
                href="mailto:Zaeem@Aeromotors.ca"
                className="flex items-center gap-3 text-[#BDBDBD] hover:text-white transition-colors text-sm group"
              >
                <Mail className="w-4 h-4 text-[#8F8F93] group-hover:text-white transition-colors" />
                Zaeem@Aeromotors.ca
              </a>
              <div className="flex items-start gap-3 text-[#BDBDBD] text-sm">
                <MapPin className="w-4 h-4 text-[#8F8F93] mt-0.5 shrink-0" />
                <span>Greater Toronto Area, Ontario</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-8">
              {[SocialIcons.Instagram, SocialIcons.Facebook, SocialIcons.Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 border border-[#404040] rounded flex items-center justify-center text-[#8F8F93] hover:text-white hover:border-[#8F8F93] transition-all duration-200 cursor-pointer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-widest mb-5">
                {category === "inventory"
                  ? "Inventory"
                  : category === "services"
                  ? "Services"
                  : "Company"}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#BDBDBD] hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#404040]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8F8F93] text-xs">
            © {new Date().getFullYear()} AERO MOTORS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[#8F8F93] hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="/" className="text-[#8F8F93] hover:text-white text-xs transition-colors">Terms of Service</Link>
            <Link href="/" className="text-[#8F8F93] hover:text-white text-xs transition-colors">Cookie Policy</Link>
            <a
              href="mailto:engineer.mahmed@gmail.com"
              className="text-[#8F8F93] hover:text-white text-xs transition-colors"
            >
              Created by <span className="text-[#C8A96E] hover:text-white transition-colors">MA Solutions</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
