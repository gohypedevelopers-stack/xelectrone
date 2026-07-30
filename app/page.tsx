import Navbar from "@/components/navbar/navbar";
import HeroShowcase from "@/components/home/hero-showcase";
import CategorySection from "@/components/home/category-section";
import ProductShowcaseSection from "@/components/home/product-showcase-section";
import BestSellersSection from "@/components/home/best-sellers-section";
import DealOfTheDaySection from "@/components/home/deal-of-the-day-section";
import BrandSetupSection from "@/components/home/brand-setup-section";
import NewProductCardsSection from "@/components/home/new-product-cards-section";
import FaqSection from "@/components/home/faq-section";
import CreatorVideosSection from "@/components/home/creator-videos-section";
import VerifiedReviewsSection from "@/components/home/verified-reviews-section";
import BrandMarqueeSection from "@/components/home/brand-marquee-section";
import BlogSection from "@/components/home/blog-section";
import Footer from "@/components/footer/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#1d1d1f]">
      <Navbar />
      <HeroShowcase />
      <CategorySection />
      <ProductShowcaseSection />
      <BestSellersSection />
      <DealOfTheDaySection />
      <BrandSetupSection />
      <NewProductCardsSection />
      <CreatorVideosSection />
      <BrandMarqueeSection />
      <VerifiedReviewsSection />
      <FaqSection />
      <BlogSection />
      <Footer />
    </main>
  );
}