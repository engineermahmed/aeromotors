"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Eye, Heart, Target, Shield, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Statistics from "@/components/home/Statistics";

const values = [
  { icon: Eye, title: "Transparency", desc: "We believe in open, honest communication at every step—clear pricing, full vehicle history, and no surprises." },
  { icon: Shield, title: "Integrity", desc: "We do what we say we'll do. Our word is our bond, and every deal reflects our commitment to doing right by our customers." },
  { icon: Award, title: "Quality", desc: "Every vehicle in our inventory is thoroughly inspected to ensure it meets our high standards before it reaches your driveway." },
  { icon: Heart, title: "Customer Experience", desc: "From first inquiry to final handshake, we're committed to making your car-buying journey smooth, stress-free, and enjoyable." },
  { icon: CheckCircle, title: "Reliability", desc: "You can count on us—whether it's the vehicles we sell, the promises we make, or the after-sale support we provide." },
];

const team = [
  {
    name: "Zaeem Naeem Mirza",
    role: "Owner / Sales Consultant",
    bio: "Zaeem founded Aero Motors with a passion for cars and a belief that buying one should never feel like a gamble. With a background in business and a deep knowledge of the automotive market, he personally oversees every vehicle that enters the Aero Motors inventory—ensuring quality, value, and transparency in every deal. When you work with Zaeem, you're not just buying a car—you're gaining a trusted advisor.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="relative py-28 overflow-hidden bg-[#161614]">
          <div className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80')" }} />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
              <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-4">Our Story</span>
              <h1 className="font-heading font-bold text-white text-6xl lg:text-7xl leading-[1.05] mb-6">About<br />AERO MOTORS</h1>
              <p className="text-[#BDBDBD] text-lg leading-relaxed">
                Founded in 2026, Aero Motors was built to reshape the used car buying experience in the GTA. No hidden fees, no pressure — just quality vehicles and honest service. Your Last Stop.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 border-t border-[#404040]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-4">Who We Are</span>
                <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl mb-6 leading-tight">
                  Your Last Stop<br />for Quality Cars
                </h2>
                <div className="space-y-4 text-[#BDBDBD] leading-relaxed">
                  <p>Aero Motors was founded in 2026 by Zaeem Naeem Mirza with a clear vision: to reshape the used car buying experience in the GTA. We specialize in pre-owned vehicles that are rigorously inspected, competitively priced, and backed by transparent service—so every customer leaves feeling informed and confident.</p>
                  <p>At Aero Motors, we believe buying a car should feel empowering, not overwhelming. We offer trade-in options and are actively working on warranty options to bring you even more peace of mind.</p>
                  <p>Our commitment is simple: no hidden fees, no pressure, just honest deals and great cars. Welcome to your last stop.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85" alt="AERO MOTORS Showroom" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-[#161614] border-t border-[#404040]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Target, title: "Our Mission", content: "To empower GTA drivers with access to quality pre-owned vehicles through honest pricing, transparent service, and a customer-first experience that removes the stress from buying a car." },
                { icon: Eye, title: "Our Vision", content: "To become the most trusted pre-owned car dealership in the GTA—known for integrity, innovation, and a buying experience that puts people first." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-[#252525] border border-[#404040] rounded-xl p-8">
                    <Icon className="w-8 h-8 text-white mb-4" />
                    <h3 className="font-heading font-bold text-white text-xl mb-3">{item.title}</h3>
                    <p className="text-[#BDBDBD] leading-relaxed text-sm">{item.content}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 border-t border-[#404040]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
              <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-3">What We Stand For</span>
              <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl">Our Core Values</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-5 bg-[#252525] border border-[#404040] rounded-xl p-7">
                    <div className="w-12 h-12 bg-[#2A2A2A] border border-[#404040] rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white text-lg mb-2">{v.title}</h3>
                      <p className="text-[#BDBDBD] text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <Statistics />

        {/* Team */}
        <section id="team" className="py-24 border-t border-[#404040]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
              <span className="text-[#8F8F93] text-xs font-medium tracking-[0.2em] uppercase block mb-3">Our People</span>
              <h2 className="font-heading font-bold text-white text-4xl lg:text-5xl">Meet the Team</h2>
            </motion.div>
            <div className="flex justify-center">
              {team.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.09 }}
                  className="bg-[#252525] border border-[#404040] rounded-xl overflow-hidden group hover:border-[#8F8F93] transition-all duration-300 w-full max-w-sm">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image src={member.img} alt={member.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="384px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-white text-lg">{member.name}</h3>
                    <p className="text-[#8F8F93] text-sm mb-3">{member.role}</p>
                    <p className="text-[#BDBDBD] text-xs leading-relaxed">{member.bio}</p>
                  </div>
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
