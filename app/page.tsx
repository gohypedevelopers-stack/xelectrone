import Navbar from "@/components/navbar/navbar";
import HeroShowcase from "@/components/home/hero-showcase";
import CategorySection from "@/components/home/category-section";
import ProductShowcaseSection from "@/components/home/product-showcase-section";
import BestSellersSection from "@/components/home/best-sellers-section";
import BrandSetupSection from "@/components/home/brand-setup-section";
import NewProductCardsSection from "@/components/home/new-product-cards-section";
import FaqSection from "@/components/home/faq-section";
import CreatorVideosSection from "@/components/home/creator-videos-section";
import Footer from "@/components/footer/footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f6f8] text-[#1d1d1f]">
      <Navbar />
      <HeroShowcase />
      <CategorySection />
      <ProductShowcaseSection />
      <BestSellersSection />
      <BrandSetupSection />
      <NewProductCardsSection />
      <FaqSection />
      <CreatorVideosSection />
      <Footer />
    </main>
  );
}