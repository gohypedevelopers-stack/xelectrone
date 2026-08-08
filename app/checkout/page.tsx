"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Lock,
  Package,
  QrCode,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
  User,
  X,
} from "lucide-react";
import { productsCatalog, type ProductDetailItem } from "@/lib/products-data";

// Top Header component matching reference design with XElectron branding
function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/xelectron-logo.png"
            alt="XElectron"
            width={220}
            height={64}
            className="h-10 sm:h-12 w-auto object-contain object-left transition-transform group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/shop"
            className="hidden items-center gap-2 text-xs font-medium text-slate-600 transition-colors hover:text-[#0a7ae6] sm:flex sm:text-sm"
          >
            <ShoppingCart className="size-4" />
            <span>Cart</span>
          </Link>

          <Link
            href="/dashboard"
            className="hidden items-center gap-2 text-xs font-medium text-slate-600 transition-colors hover:text-[#0a7ae6] sm:flex sm:text-sm"
          >
            <User className="size-4" />
            <span>My account</span>
            <ChevronDown className="size-3 text-slate-400" />
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0a7ae6] px-4 py-2 text-xs font-medium text-white shadow-sm shadow-[#0a7ae6]/20 transition-all hover:bg-[#086ac9] hover:scale-105 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <span>Shop</span>
            <ArrowUpRight className="size-3.5 sm:size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected product from query or fallback
  const productParam = searchParams.get("product") || "yuqos-neosound-flex";
  const qtyParam = Math.max(1, parseInt(searchParams.get("qty") || "1", 10));

  const [orderItems, setOrderItems] = useState<{
    product: ProductDetailItem;
    quantity: number;
    priceNumber: number;
  }[]>([]);

  // Form State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("Maharashtra");

  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardZip, setCardZip] = useState("");
  const [upiId, setUpiId] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Initialize Items
  useEffect(() => {
    const matched = productsCatalog[productParam] || productsCatalog["yuqos-neosound-flex"] || Object.values(productsCatalog)[0];
    if (matched) {
      const cleanPrice = parseInt(matched.price.replace(/[^\d]/g, ""), 10) || 4999;
      setOrderItems([
        {
          product: matched,
          quantity: qtyParam,
          priceNumber: cleanPrice,
        },
      ]);
    }
  }, [productParam, qtyParam]);

  // Calculations
  const subtotal = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.priceNumber * item.quantity, 0);
  }, [orderItems]);

  const discountAmount = useMemo(() => {
    if (couponDiscount > 0) {
      return Math.round((subtotal * couponDiscount) / 100);
    }
    return 0;
  }, [subtotal, couponDiscount]);

  const shippingCost = 0; // Free shipping
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  // Apply Coupon Handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (code === "WELCOME10" || code === "XELECTRON10") {
      setAppliedCoupon(code);
      setCouponDiscount(10);
      setCouponSuccess("10% discount applied successfully!");
    } else if (code === "SAVE20" || code === "FESTIVE20") {
      setAppliedCoupon(code);
      setCouponDiscount(20);
      setCouponSuccess("20% special discount applied!");
    } else {
      setCouponError("Invalid coupon code. Try WELCOME10 or SAVE20");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  // Place Order Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !phone || !email || !addressLine1 || !city || !postalCode) {
      alert("Please fill in all required billing and address fields (*)");
      return;
    }

    if (paymentMethod === "card" && (!cardName || !cardNumber || !cardExpiry || !cardCvv)) {
      alert("Please enter all card details to proceed with payment.");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter a valid UPI ID (e.g., name@okhdfcbank).");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mock or real order via API
      const randomOrderId = `XE-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(randomOrderId);

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setOrderComplete(true);
    } catch {
      alert("Something went wrong while placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (orderComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl sm:p-10">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <Check className="size-10 stroke-[2.5]" />
          </div>

          <span className="inline-block rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Order Confirmed
          </span>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Thank you for your order!
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Your order <strong className="text-slate-900 font-semibold">#{orderId}</strong> has been successfully placed and is now being processed.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Customer:</span>
              <span className="font-medium text-slate-900">{firstName} {lastName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Shipping to:</span>
              <span className="font-medium text-slate-900 truncate max-w-[200px]">{addressLine1}, {city}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Payment:</span>
              <span className="font-medium text-slate-900 uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-semibold text-slate-900">
              <span>Total Paid:</span>
              <span className="text-[#0a7ae6]">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="flex-1 rounded-xl bg-[#0a7ae6] py-3 text-center text-sm font-medium text-white shadow-md shadow-[#0a7ae6]/20 transition-all hover:bg-[#086ac9]"
            >
              Continue Shopping
            </Link>
            <Link
              href="/shop"
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 items-start">
          {/* ─── LEFT COLUMN: BILLING & ADDRESS DETAILS ─── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Heading */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[32px]">
                Billing details
              </h1>
            </div>

            {/* Coupon Card (Reference UI) */}
            <div className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 sm:p-5">
              <label htmlFor="coupon-input" className="block text-xs sm:text-sm font-medium text-slate-600 mb-2.5">
                If you have a coupon code, please apply it below
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <input
                    id="coupon-input"
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={Boolean(appliedCoupon)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15 disabled:bg-slate-100"
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    <X className="size-3.5" /> Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="inline-flex items-center justify-center rounded-xl bg-[#0a7ae6] px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#0a7ae6]/15 transition-all hover:bg-[#086ac9] active:scale-98"
                  >
                    Apply coupon
                  </button>
                )}
              </div>

              {couponSuccess && (
                <p className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Check className="size-3.5" /> {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {couponError}
                </p>
              )}
            </div>

            {/* Billing Fields */}
            <div className="space-y-4">
              {/* First & Last Name - 2 per line */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  />
                </div>
              </div>

              {/* Phone & Email - 2 per line */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@gmail.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  />
                </div>
              </div>

              {/* State / Region Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State / Region <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Kerala">Kerala</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-3.5 size-4 text-slate-400" />
                </div>
              </div>
            </div>

            <hr className="border-slate-200/80" />

            {/* Address Information Section */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl mb-4">
                Address information
              </h2>

              {/* Ship to a different address checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group mb-5">
                <input
                  type="checkbox"
                  checked={shipToDifferent}
                  onChange={(e) => setShipToDifferent(e.target.checked)}
                  className="size-4.5 rounded border-slate-300 text-[#0a7ae6] focus:ring-[#0a7ae6] accent-[#0a7ae6]"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Ship to a different address
                </span>
              </label>

              <div className="space-y-4">
                {/* Street Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Street Address / House No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House number, apartment name, street"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  />
                </div>

                {/* Apartment / Landmark */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Apartment, suite, landmark (optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Near landmark or building wing"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  />
                </div>

                {/* City & PIN Code - 2 per line */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Town / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 400001"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                    />
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Order notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Notes about your order, e.g. special delivery instructions."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: YOUR ORDER & PAYMENT METHOD ─── */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-slate-200/80 bg-[#f8fafc] p-6 sm:p-8 shadow-xs">
              {/* Order Heading */}
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl mb-6">
                Your order
              </h2>

              {/* Order Items */}
              <div className="divide-y divide-slate-200/80">
                {orderItems.map(({ product, quantity, priceNumber }) => (
                  <div key={product.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
                        <Image
                          src={product.mainImage || "/category-smartphone.png"}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                          {product.name}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-500">
                          Qty: {quantity}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      ₹{(priceNumber * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="mt-4 border-t border-slate-200/80 pt-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({couponDiscount}%)</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600">Free shipping</span>
                </div>

                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>GST (18% included)</span>
                  <span>₹{Math.round((total * 0.18) / 1.18).toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between border-t border-slate-200/80 pt-3 text-base sm:text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-[#0a7ae6]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment Method Section (Reference UI) */}
              <div className="mt-8 border-t border-slate-200/80 pt-6">
                <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-4">
                  Payment method
                </h3>

                {/* Radio Selector - 3 on one line */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer rounded-full border px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold transition-all ${
                      paymentMethod === "card"
                        ? "border-[#0a7ae6] bg-blue-50/50 text-[#0a7ae6] shadow-xs ring-1 ring-[#0a7ae6]/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className={`size-3 sm:size-3.5 shrink-0 rounded-full border flex items-center justify-center ${
                      paymentMethod === "card" ? "border-[#0a7ae6] bg-[#0a7ae6]" : "border-slate-300"
                    }`}>
                      {paymentMethod === "card" && <span className="size-1 sm:size-1.5 rounded-full bg-white" />}
                    </span>
                    <CreditCard className="size-3 sm:size-3.5 shrink-0" />
                    <span className="truncate">Credit card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer rounded-full border px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold transition-all ${
                      paymentMethod === "upi"
                        ? "border-[#0a7ae6] bg-blue-50/50 text-[#0a7ae6] shadow-xs ring-1 ring-[#0a7ae6]/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className={`size-3 sm:size-3.5 shrink-0 rounded-full border flex items-center justify-center ${
                      paymentMethod === "upi" ? "border-[#0a7ae6] bg-[#0a7ae6]" : "border-slate-300"
                    }`}>
                      {paymentMethod === "upi" && <span className="size-1 sm:size-1.5 rounded-full bg-white" />}
                    </span>
                    <QrCode className="size-3 sm:size-3.5 shrink-0" />
                    <span className="truncate">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer rounded-full border px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#0a7ae6] bg-blue-50/50 text-[#0a7ae6] shadow-xs ring-1 ring-[#0a7ae6]/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className={`size-3 sm:size-3.5 shrink-0 rounded-full border flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-[#0a7ae6] bg-[#0a7ae6]" : "border-slate-300"
                    }`}>
                      {paymentMethod === "cod" && <span className="size-1 sm:size-1.5 rounded-full bg-white" />}
                    </span>
                    <Truck className="size-3 sm:size-3.5 shrink-0" />
                    <span className="truncate">Cash on delivery</span>
                  </button>
                </div>

                {/* Conditional Fields: Card */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Name on card <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-1 focus:ring-[#0a7ae6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Card number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                            setCardNumber(val);
                          }}
                          placeholder="4532 •••• •••• 8921"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-1 focus:ring-[#0a7ae6]"
                        />
                        <CreditCard className="pointer-events-none absolute right-3.5 top-2.5 size-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                          Expiry date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM / YY"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-1 focus:ring-[#0a7ae6]"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                            CVV <span className="text-red-500">*</span>
                          </label>
                          <span title="3 digits on back of card">
                            <HelpCircle className="size-3 text-slate-400" />
                          </span>
                        </div>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-1 focus:ring-[#0a7ae6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        placeholder="Postal code"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-1 focus:ring-[#0a7ae6]"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields: UPI */}
                {paymentMethod === "upi" && (
                  <div className="space-y-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Enter UPI ID / VPA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile-number@paytm / name@okhdfcbank"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-1 focus:ring-[#0a7ae6]"
                    />
                    <p className="text-[11px] text-slate-500">
                      Supports Google Pay, PhonePe, Paytm, CRED & all UPI apps.
                    </p>
                  </div>
                )}

                {/* Conditional Fields: COD */}
                {paymentMethod === "cod" && (
                  <div className="rounded-2xl bg-white p-4 border border-slate-200/80 text-xs text-slate-600 space-y-1.5 shadow-xs">
                    <p className="font-semibold text-slate-900">Cash on Delivery Available</p>
                    <p>Pay with cash or scan delivery QR code at the time of delivery.</p>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a7ae6] py-3.5 text-center text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#0a7ae6]/25 transition-all hover:bg-[#086ac9] hover:shadow-xl active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Lock className="size-4" />
                    <span>Place order • ₹{total.toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-200/80 pt-4 text-center text-[10px] sm:text-[11px] text-slate-500">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="size-4 text-slate-600 mb-1" />
                  <span>256-Bit SSL</span>
                </div>
                <div className="flex flex-col items-center">
                  <Package className="size-4 text-slate-600 mb-1" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="size-4 text-slate-600 mb-1" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <CheckoutHeader />
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-[#0a7ae6] border-t-transparent" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </>
  );
}
