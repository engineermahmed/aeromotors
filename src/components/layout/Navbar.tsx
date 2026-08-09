"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/finance", label: "Finance" },
  { href: "/sell", label: "Sell Your Car" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-[#C8A96E] origin-left"
        style={{ scaleX }}
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-[#1A1917]/92 backdrop-blur-xl border-b border-[#383532]/80 shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 overflow-hidden rounded-sm ring-1 ring-white/10 group-hover:ring-[#C8A96E]/40 transition-all duration-300">
                <Image
                  src="/logo.jpeg"
                  alt="AERO MOTORS"
                  fill
                  className="object-contain transition-transform duration-400 group-hover:scale-110"
                  priority
                />
              </div>
              <span
                className="text-white font-heading font-bold text-[1.1rem] tracking-[0.18em] group-hover:text-[#F5F4F2] transition-colors"
              >
                AERO MOTORS
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium tracking-wide transition-colors duration-200 group py-1 ${
                      isActive ? "text-white" : "text-[#8A8880] hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px transition-all duration-300 ${
                        isActive
                          ? "w-full bg-[#C8A96E]"
                          : "w-0 bg-white group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <a
                href="tel:+16476076355"
                className="hidden lg:flex items-center gap-2 text-[#8A8880] hover:text-white transition-colors text-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+1 647-607-6355</span>
              </a>
              <Link
                href="/inventory"
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-white text-[#1A1917] text-sm font-semibold rounded-sm tracking-wide hover:bg-[#C8A96E] transition-colors duration-200"
              >
                Browse Cars
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-white rounded-sm hover:bg-white/8 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={menuOpen ? "close" : "open"}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#1A1917] lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-[#383532]">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image src="/logo.jpeg" alt="AERO MOTORS" fill className="object-contain" />
                </div>
                <span className="text-white font-heading font-bold tracking-[0.18em]">AERO MOTORS</span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-white rounded-sm hover:bg-white/8 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    className={`block text-4xl font-heading font-bold py-3 border-b border-[#383532]/60 tracking-tight transition-colors duration-200 ${
                      pathname === link.href ? "text-white" : "text-[#8A8880] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="px-8 pb-12 flex flex-col gap-4"
            >
              <a href="tel:+16476076355" className="flex items-center gap-2 text-[#8A8880] text-sm">
                <Phone className="w-4 h-4" />
                +1 647-607-6355
              </a>
              <Link
                href="/inventory"
                className="w-full py-4 bg-white text-[#1A1917] font-bold rounded-sm text-center tracking-wide hover:bg-[#C8A96E] transition-colors"
              >
                Browse Inventory
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
