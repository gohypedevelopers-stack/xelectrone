import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import ShopContent, { type ShopProduct } from "@/components/shop/shop-content";
import * as productsController from "@/lib/server/controllers/products.controller";

export default async function ShopPage() {
  let products: ShopProduct[] = [];

  try {
    const dashboardProducts = await productsController.listProducts();
    products = dashboardProducts.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      mainImage: product.mainImage || "/category-smartphone.png",
      hoverImage: product.media.find((media) => media.url !== product.mainImage)?.url ?? null,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category?.title || "XElectron",
      categorySlug: product.category?.slug || "",
      showInBestSellers: product.showInBestSellers,
      createdAt: product.createdAt.toISOString(),
    }));
  } catch {
    // Keep the storefront reachable if the catalog is temporarily unavailable.
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ShopContent products={products} />
      <Footer />
    </main>
  );
}
