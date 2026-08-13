"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/format-price";
import Navbar from "@/components/navbar/navbar";
import { CheckCircle2, Clock, Package, Truck, User, ArrowLeft, ShoppingBag } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  product?: {
    id: string;
    name: string;
    mainImage?: string;
    slug?: string;
  };
};

type OrderData = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress?: string;
  items: OrderItem[];
};

function OrdersContent() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const json = await res.json();

        if (isMounted) {
          if (res.status === 401) {
            setError("unauthorized");
          } else if (json.success && Array.isArray(json.data)) {
            setOrders(json.data);
          } else {
            setError(json.error || "Failed to load orders");
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load orders");
          setLoading(false);
        }
      }
    }

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="size-3.5" /> Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0a7ae6] border border-blue-200/60">
            <Truck className="size-3.5" /> Shipped
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200/60">
            <Package className="size-3.5" /> Processing
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60">
            <CheckCircle2 className="size-3.5" /> Confirmed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            <Clock className="size-3.5" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-[#0a7ae6] border-t-transparent" />
      </div>
    );
  }

  if (error === "unauthorized") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50 text-[#0a7ae6]">
            <User className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to view orders</h2>
          <p className="mt-2 text-sm text-slate-600">Please log in to your account to view your order history.</p>
          <Link
            href="/login?redirectTo=/orders"
            className="mt-6 inline-block w-full rounded-xl bg-[#0a7ae6] py-3 text-sm font-semibold text-white transition-all hover:bg-[#086ac9]"
          >
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Orders</h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Track your purchases and view order status.</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a7ae6] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ShoppingBag className="size-8 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No orders placed yet</h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">When you buy products, your orders will show up here.</p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-xl bg-[#0a7ae6] px-6 py-3 text-xs font-semibold text-white transition-all hover:bg-[#086ac9]"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-400">Order ID:</span>{" "}
                        <span className="font-semibold text-slate-900">
                          #XE-{order.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="hidden sm:block text-slate-300">•</div>
                      <div>
                        <span className="text-slate-400">Date:</span>{" "}
                        <span className="font-medium text-slate-700">{formattedDate}</span>
                      </div>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Order Items List */}
                  <div className="divide-y divide-slate-100 px-5 sm:px-6">
                    {order.items.map((item) => {
                      const image = item.product?.mainImage || "/category-smartphone.png";
                      const name = item.product?.name || "XElectron Product";
                      const slug = item.product?.slug || item.product?.id;

                      return (
                        <div key={item.id} className="flex items-center gap-4 py-4">
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-1 sm:size-20">
                            <Image
                              src={image}
                              alt={name}
                              fill
                              className="object-contain p-1"
                              sizes="80px"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            {slug ? (
                              <Link
                                href={`/product/${slug}`}
                                className="truncate text-xs font-semibold text-slate-900 hover:text-[#0a7ae6] sm:text-sm block"
                              >
                                {name}
                              </Link>
                            ) : (
                              <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm">{name}</p>
                            )}
                            <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                              Qty: {item.quantity} × {formatINR(item.unitPrice)}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-semibold text-slate-900 sm:text-sm">
                              {formatINR(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
                    <div className="text-xs text-slate-500 max-w-md truncate">
                      {order.shippingAddress ? (
                        <span><strong className="text-slate-700 font-medium">Ship to:</strong> {order.shippingAddress.replace(/\[Payment:\s*[A-Z_]+\]/gi, "").trim()}</span>
                      ) : null}
                    </div>
                    <div className="text-right text-sm font-semibold text-slate-900">
                      <span className="text-slate-500 font-normal mr-2">Total Paid:</span>
                      <span className="text-[#0a7ae6] text-base font-bold">{formatINR(order.total)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-[#0a7ae6] border-t-transparent" />
        </div>
      }>
        <OrdersContent />
      </Suspense>
    </main>
  );
}
