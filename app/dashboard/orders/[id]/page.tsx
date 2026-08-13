"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  User,
  AlertCircle,
  ExternalLink,
  Check,
} from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatINR } from "@/lib/format-price";

type OrderDetailItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  product?: {
    id: string;
    name: string;
    mainImage?: string;
    slug?: string;
    price?: number;
  };
};

type OrderDetailData = {
  id: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  shippingAddress?: string;
  paymentMethod?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  items: OrderDetailItem[];
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const json = await res.json();

        if (isMounted) {
          if (res.ok && json.success && json.data) {
            setOrder(json.data);
          } else {
            setError(json.error || "Order not found");
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load order details");
          setLoading(false);
        }
      }
    }

    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setOrder((prev) => (prev ? { ...prev, status: json.data.status } : null));
      } else {
        alert(json.error || "Failed to update order status");
      }
    } catch {
      alert("Network error while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getFulfillmentBadge = (status: string) => {
    if (status === "DELIVERED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="size-3.5" /> FULFILLED
        </span>
      );
    }
    if (status === "SHIPPED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold font-bold text-[#0a7ae6]">
          <Truck className="size-3.5" /> IN TRANSIT
        </span>
      );
    }
    if (status === "CANCELLED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
          <AlertCircle className="size-3.5" /> CANCELLED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
        <Clock className="size-3.5" /> UNFULFILLED
      </span>
    );
  };

  if (loading) {
    return (
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <div className="flex min-h-[70vh] items-center justify-center bg-[#f5f5f5]">
            <div className="size-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !order) {
    return (
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f5f5f5] p-6 text-center">
            <Package className="mb-3 size-12 text-black/30" />
            <h2 className="text-xl font-bold text-black">Order Not Found</h2>
            <p className="mt-1 text-sm text-black/60">{error || "The requested order could not be located."}</p>
            <Link
              href="/dashboard/orders"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/80"
            >
              <ArrowLeft className="size-4" /> Back to Orders
            </Link>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const orderRef = `#XE-${order.id.slice(-8).toUpperCase()}`;
  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const isFulfilled = order.status === "DELIVERED" || order.status === "SHIPPED";

  const rawAddress = order.shippingAddress || "";
  const paymentMatch = rawAddress.match(/\[Payment:\s*([A-Z_]+)\]/i);
  const displayPaymentMethod = order.paymentMethod || (paymentMatch ? paymentMatch[1].toUpperCase() : "CARD");
  const cleanAddress = rawAddress.replace(/\[Payment:\s*[A-Z_]+\]/gi, "").trim();

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "UPI":
        return "UPI Instant Payment";
      case "COD":
        return "Cash on Delivery (COD)";
      case "NETBANKING":
        return "Net Banking";
      default:
        return "Credit / Debit Card (CARD)";
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-6 lg:p-8">
            {/* Top Navigation & Actions Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/orders"
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black"
                >
                  <ArrowLeft className="size-4" />
                </Link>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl font-bold text-black sm:text-2xl">{orderRef}</h1>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      <Check className="size-3" /> PAID
                    </span>
                    {getFulfillmentBadge(order.status)}
                  </div>
                  <p className="mt-1 text-xs text-black/55">{formattedDate} from Online Store</p>
                </div>
              </div>

              {/* Status Selector & Fulfillment Buttons */}
              <div className="flex flex-wrap items-center gap-2">

                <div className="relative inline-block">
                  <select
                    value={order.status}
                    disabled={isUpdating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="h-9 rounded-lg border border-black/15 bg-white px-3 pr-8 text-xs font-semibold text-black/80 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50"
                  >
                    <option value="PENDING">Status: Pending</option>
                    <option value="CONFIRMED">Status: Confirmed</option>
                    <option value="PROCESSING">Status: Processing</option>
                    <option value="SHIPPED">Status: Shipped</option>
                    <option value="DELIVERED">Status: Delivered</option>
                    <option value="CANCELLED">Status: Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2-Column Shopify Style Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* LEFT COLUMN: Items & Payment Breakdown (70%) */}
              <div className="space-y-6 lg:col-span-8">
                {/* Items Card */}
                <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.02] px-5 py-3.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/75">
                      <Package className="size-4 text-black/60" />
                      <span>
                        {isFulfilled ? "Fulfilled Items" : "Unfulfilled Items"} ({totalItemsCount})
                      </span>
                    </div>
                    {getFulfillmentBadge(order.status)}
                  </div>

                  <div className="divide-y divide-black/10">
                    {order.items.map((item) => {
                      const image = item.product?.mainImage || "/category-smartphone.png";
                      const name = item.product?.name || "XElectron Product";
                      const slug = item.product?.slug || item.product?.id;

                      return (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
                          <div className="flex items-center gap-4">
                            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-white p-1">
                              <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                              />
                            </div>
                            <div>
                              {slug ? (
                                <Link
                                  href={`/product/${slug}`}
                                  target="_blank"
                                  className="group inline-flex items-center gap-1 text-sm font-semibold text-black hover:text-[#0a7ae6]"
                                >
                                  <span>{name}</span>
                                  <ExternalLink className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Link>
                              ) : (
                                <p className="text-sm font-semibold text-black">{name}</p>
                              )}
                              <p className="mt-1 text-xs text-black/55">
                                {formatINR(item.unitPrice)} × {item.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="text-right font-semibold text-black text-sm">
                            {formatINR(item.unitPrice * item.quantity)}
                          </div>
                        </div>
                      );
                    })}
                  </div>


                </div>

                {/* Payment Breakdown Card */}
                <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/10 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/75">
                      <CreditCard className="size-4 text-black/60" />
                      <span>Payment Details</span>
                    </div>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      Paid
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-black/75">
                    <div className="flex justify-between py-0.5">
                      <span className="text-black/60">Payment Method:</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="size-3.5 text-[#0a7ae6]" />
                        {getPaymentLabel(displayPaymentMethod)}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-black/60">Subtotal ({totalItemsCount} items)</span>
                      <span>{formatINR(order.total)}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-black/60">Shipping (Standard Free Delivery)</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between pt-2.5 border-t border-black/10 text-sm font-bold text-black">
                      <span>Total Paid</span>
                      <span className="text-[#0a7ae6] text-base">{formatINR(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black/75 mb-4 flex items-center gap-2">
                    <Clock className="size-4 text-black/60" />
                    <span>Order Timeline</span>
                  </h3>
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/10">
                    <div className="relative">
                      <span className="absolute -left-6 top-0.5 size-3.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                      <p className="text-xs font-semibold text-black">Order Placed Successfully</p>
                      <p className="text-[11px] text-black/55">{formattedDate}</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-6 top-0.5 size-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                      <p className="text-xs font-semibold text-black">Confirmation email sent to {order.user.email}</p>
                    </div>
                    {isFulfilled && (
                      <div className="relative">
                        <span className="absolute -left-6 top-0.5 size-3.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                        <p className="text-xs font-semibold text-black">Order fulfilled and dispatched</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Customer & Shipping (30%) */}
              <div className="space-y-6 lg:col-span-4">
                {/* Customer Details Card */}
                <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black/75 flex items-center gap-2">
                    <User className="size-4 text-black/60" />
                    <span>Customer</span>
                  </h3>
                  <div>
                    <p className="text-sm font-semibold text-black">{order.user.name}</p>
                    <p className="text-xs text-black/55 font-medium mt-0.5">1 order placed</p>
                  </div>
                  <div className="border-t border-black/10 pt-3 space-y-1.5">
                    <p className="text-xs font-semibold text-black/75 mb-1">Contact Information</p>
                    <a
                      href={`mailto:${order.user.email}`}
                      className="flex items-center gap-1.5 text-xs text-[#0a7ae6] hover:underline"
                    >
                      <Mail className="size-3.5 shrink-0" />
                      <span className="truncate">{order.user.email}</span>
                    </a>
                    {order.user.phone ? (
                      <a
                        href={`tel:${order.user.phone}`}
                        className="flex items-center gap-1.5 text-xs text-black/80 hover:text-[#0a7ae6]"
                      >
                        <Phone className="size-3.5 shrink-0 text-black/60" />
                        <span>{order.user.phone}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-black/45">
                        <Phone className="size-3.5 shrink-0" />
                        <span>No phone number</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address Card */}
                <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black/75 flex items-center gap-2">
                    <MapPin className="size-4 text-black/60" />
                    <span>Shipping Address</span>
                  </h3>
                  <div className="text-xs leading-relaxed text-black/80 font-normal bg-black/[0.02] p-3.5 rounded-xl border border-black/10 space-y-1">
                    <p className="font-bold text-slate-900 text-sm">{order.user.name}</p>
                    <p className="text-slate-700 font-medium leading-normal">{cleanAddress || "No address provided"}</p>
                  </div>
                </div>

                {/* Billing Address Card */}
                <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm p-5 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black/75">Billing Address</h3>
                  <p className="text-xs text-black/60">Same as shipping address</p>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
