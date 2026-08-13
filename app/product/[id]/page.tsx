import { Suspense } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import ProductDetail from "@/components/product/product-detail";
import { getProductById, type SimilarProductCard } from "@/lib/products-data";
import * as productsController from "@/lib/server/controllers/products.controller";
import * as dealOfTheDayController from "@/lib/server/controllers/deal-of-the-day.controller";
import { parsePriceNumber } from "@/lib/format-price";

interface DynamicProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function DynamicProductPage({ params }: DynamicProductPageProps) {
  const { id } = await params;
  const [dbProduct, activeDeal] = await Promise.all([
    productsController.getProduct(id),
    dealOfTheDayController.getActiveDealOfTheDay(),
  ]);

  const isDealActiveForProduct = activeDeal && dbProduct && (activeDeal.productId === dbProduct.id || activeDeal.product.slug === dbProduct.slug);
  let effectivePrice = isDealActiveForProduct && activeDeal.dealPrice ? activeDeal.dealPrice : dbProduct?.price;
  let effectiveOldPrice = isDealActiveForProduct
    ? (activeDeal.compareAtPrice || (dbProduct && dbProduct.price !== effectivePrice ? dbProduct.price : dbProduct?.oldPrice))
    : dbProduct?.oldPrice;

  const dashboardProducts = dbProduct ? await productsController.listProducts() : [];
  const relatedProducts: SimilarProductCard[] = dbProduct
    ? [
        ...dashboardProducts.filter(
          (relatedProduct: any) =>
            relatedProduct.id !== dbProduct.id &&
            relatedProduct.category?.slug === dbProduct.category?.slug,
        ),
        ...dashboardProducts.filter(
          (relatedProduct: any) =>
            relatedProduct.id !== dbProduct.id &&
            relatedProduct.category?.slug !== dbProduct.category?.slug,
        ),
      ]
        .slice(0, 4)
        .map((relatedProduct: any) => ({
          id: relatedProduct.id,
          slug: relatedProduct.slug,
          name: relatedProduct.name,
          category: relatedProduct.category?.title || "XElectron",
          price: relatedProduct.price,
          oldPrice: relatedProduct.oldPrice,
          discount: relatedProduct.discount,
          image: relatedProduct.mainImage || relatedProduct.media[0]?.url || "/category-smartphone.png",
          alt: relatedProduct.name,
          swatches: relatedProduct.colors.map((color: any) => color.bgHex).slice(0, 3),
        }))
    : [];

  const product = dbProduct
    ? {
        id: dbProduct.id,
        slug: dbProduct.slug,
        name: dbProduct.name,
        category: dbProduct.category?.title || "Electronics",
        categorySlug: dbProduct.category?.slug || "general",
        price: effectivePrice || dbProduct.price,
        oldPrice: effectiveOldPrice || undefined,
        discount: dbProduct.discount || undefined,
        rating: dbProduct.rating,
        reviewsCount: `${dbProduct.reviewsCount} Reviews`,
        description: dbProduct.description,
        colors: dbProduct.colors.map((color: any) => ({
          name: color.name,
          bg: color.bgHex,
          border: color.borderHex || undefined,
        })),
        features: dbProduct.features.map((feature: any) => feature.featureText),
        specs: dbProduct.specs.map((spec: any) => ({ label: spec.label, value: spec.value })),
        shippingNotice: dbProduct.shippingNotice,
        mainImage: dbProduct.mainImage,
        images: [...new Set([dbProduct.mainImage, ...dbProduct.media.map((media: any) => media.url)])],
      }
    : getProductById(id);

  return (
    <main className="min-h-dvh overflow-x-hidden bg-white">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400">Loading product...</div>}>
        <ProductDetail
          initialProduct={product}
          initialRelatedProducts={relatedProducts}
          productId={dbProduct?.id}
        />
      </Suspense>
      <Footer />
    </main>
  );
}
