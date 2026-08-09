import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SearchSection from "@/components/home/SearchSection";
import FeaturedInventory from "@/components/home/FeaturedInventory";
import LatestArrivals from "@/components/home/LatestArrivals";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import FinanceBanner from "@/components/home/FinanceBanner";
import Testimonials from "@/components/home/Testimonials";
import Statistics from "@/components/home/Statistics";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SearchSection />
        <FeaturedInventory />
        <LatestArrivals />
        <FeaturedBrands />
        <FinanceBanner />
        <Testimonials />
        <Statistics />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
