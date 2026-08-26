import { Suspense } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import ProductDetail from "@/components/product/product-detail";

export default function ProductPage() {
  return (
    <main className="min-h-dvh overflow-x-clip bg-white">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400">Loading product...</div>}>
        <ProductDetail />
      </Suspense>
      <Footer />
    </main>
  );
}
