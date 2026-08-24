"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Lock,
  Package,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";

const CHECKOUT_SESSION_KEY = "xelectron-active-checkout";

function createCheckoutSessionToken() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function CheckoutContent() {
  const { items: orderItems, subtotal, clearCart, addItem } = useCart();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [productParamLoading, setProductParamLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-resolve product param if passed via URL and not already in cart
  useEffect(() => {
    if (!isMounted) return;
    const productParam = searchParams.get("product");
    if (!productParam) {
      setProductParamLoading(false);
      return;
    }

    // Skip if the product is already in the cart (Buy button already added it)
    const alreadyInCart = orderItems.some(
      (item) => item.id === productParam || item.slug === productParam
    );
    if (alreadyInCart) {
      setProductParamLoading(false);
      return;
    }

    let isSubscribed = true;
    setProductParamLoading(true);

    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (!isSubscribed || !json.success || !Array.isArray(json.data)) return;

        const matched = json.data.find(
          (p: { id: string; slug: string }) =>
            p.id === productParam || p.slug === productParam
        );

        if (matched) {
          const stillMissing = !orderItems.some((item) => item.id === matched.id);
          if (stillMissing) {
            const itemPrice =
              typeof matched.price === "number"
                ? matched.price
                : parseFloat(String(matched.price).replace(/[^0-9.]/g, "")) || 0;

            addItem({
              id: matched.id,
              name: matched.name,
              price: itemPrice,
              image: matched.mainImage || "/category-smartphone.png",
              category: matched.category?.title || "Electronics",
              slug: matched.slug,
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isSubscribed) setProductParamLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, searchParams]);

  // Auth check
  useEffect(() => {
    if (!isMounted) return;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          if (data.user.name) {
            const parts = data.user.name.split(" ");
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" ") || "");
          }
          if (data.user.email) setEmail(data.user.email);
        }
      })
      .catch(() => {})
      .finally(() => setIsAuthLoading(false));
  }, [isMounted]);

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
  const [state, setState] = useState("");

  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  // Account creation while placing order
  const [createAccountOnCheckout, setCreateAccountOnCheckout] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");

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
  const [paidTotal, setPaidTotal] = useState(0);
  const [checkoutSessionToken, setCheckoutSessionToken] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existingSession = window.sessionStorage.getItem(CHECKOUT_SESSION_KEY);
    const sessionToken = existingSession || createCheckoutSessionToken();
    if (!existingSession) window.sessionStorage.setItem(CHECKOUT_SESSION_KEY, sessionToken);
    setCheckoutSessionToken(sessionToken);
  }, []);

  const discountAmount = useMemo(() => {
    if (couponDiscount > 0) {
      return Math.round((subtotal * couponDiscount) / 100);
    }
    return 0;
  }, [subtotal, couponDiscount]);

  const shippingCost = 0; // Free shipping
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const trackCheckout = useCallback(async () => {
    if (!checkoutSessionToken || orderItems.length === 0) return;

    try {
      await fetch("/api/abandoned-checkouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: checkoutSessionToken,
          items: orderItems.map(({ id, quantity }) => ({ id, quantity })),
          customerName: [firstName, lastName].filter(Boolean).join(" "),
          email,
          phone,
        }),
      });
    } catch {
      // Tracking must not block customers from checking out.
    }
  }, [checkoutSessionToken, email, firstName, lastName, orderItems, phone]);

  useEffect(() => {
    if (orderComplete || !checkoutSessionToken || orderItems.length === 0) return;

    const timer = window.setTimeout(() => { void trackCheckout(); }, 650);
    return () => window.clearTimeout(timer);
  }, [checkoutSessionToken, orderComplete, orderItems.length, trackCheckout]);

  // Coupon Handling
  const handleApplyCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const res = await fetch("/api/discounts");
      const json = await res.json();

      let matchedDiscount: any | undefined;

      if (json.success && Array.isArray(json.data)) {
        matchedDiscount = json.data.find(
          (d: any) => d.code && d.code.toUpperCase() === code
        );
      }

      if (matchedDiscount) {
        // Check active status
        if (matchedDiscount.isActive === false) {
          setCouponError(`Coupon code "${code}" is currently disabled.`);
          return;
        }

        // Check expiration date
        if (matchedDiscount.endDate && new Date(matchedDiscount.endDate) < new Date()) {
          setCouponError(`Coupon code "${code}" has expired.`);
          return;
        }

        // Check start date
        if (matchedDiscount.startDate && new Date(matchedDiscount.startDate) > new Date()) {
          setCouponError(`Coupon code "${code}" is not active yet.`);
          return;
        }

        // Check eligible product IDs
        if (matchedDiscount.eligibleProductIds) {
          const allowedIds = matchedDiscount.eligibleProductIds.split(",").map((id: string) => id.trim()).filter(Boolean);
          const cartHasEligible = orderItems.some((item) => allowedIds.includes(item.id));
          if (!cartHasEligible) {
            setCouponError(`Coupon code "${code}" is only valid for selected products.`);
            return;
          }
        }

        setAppliedCoupon(matchedDiscount.code);
        if (matchedDiscount.type === "PERCENTAGE") {
          setCouponDiscount(matchedDiscount.value);
          setCouponSuccess(`${matchedDiscount.value}% discount applied successfully!`);
        } else if (matchedDiscount.type === "FIXED_AMOUNT") {
          const percent = subtotal > 0 ? Math.min(100, (matchedDiscount.value / subtotal) * 100) : 10;
          setCouponDiscount(percent);
          setCouponSuccess(`₹${matchedDiscount.value.toLocaleString("en-IN")} discount applied successfully!`);
        } else {
          setCouponDiscount(10);
          setCouponSuccess("Discount applied successfully!");
        }
      } else if (code === "WELCOME10" || code === "XELECTRON10") {
        setAppliedCoupon(code);
        setCouponDiscount(10);
        setCouponSuccess("10% discount applied successfully!");
      } else if (code === "SAVE20" || code === "FESTIVE20") {
        setAppliedCoupon(code);
        setCouponDiscount(20);
        setCouponSuccess("20% special discount applied!");
      } else {
        setCouponError(`Invalid or expired coupon code "${code}".`);
      }
    } catch {
      if (code === "WELCOME10" || code === "XELECTRON10" || code === "SAVE10") {
        setAppliedCoupon(code);
        setCouponDiscount(10);
        setCouponSuccess("10% discount applied successfully!");
      } else {
        setCouponError("Unable to validate coupon code. Please try again.");
      }
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

    if (orderItems.length === 0) {
      alert("Your cart is empty. Add a product before placing an order.");
      return;
    }

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

    if (createAccountOnCheckout && (!accountPassword || accountPassword.length < 6)) {
      alert("Please enter a password with at least 6 characters to create your account.");
      return;
    }

    setIsSubmitting(true);

    try {
      await trackCheckout();

      const fullAddress = [addressLine1, addressLine2, city, state, postalCode].filter(Boolean).join(", ") + ` [Payment: ${paymentMethod.toUpperCase()}]`;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          customerName: `${firstName} ${lastName}`.trim(),
          customerEmail: email,
          customerPhone: phone,
          city,
          state,
          pincode: postalCode,
          createAccount: !currentUser && createAccountOnCheckout,
          password: accountPassword || undefined,
          items: orderItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
          shippingAddress: fullAddress,
          paymentMethod: paymentMethod.toUpperCase(),
          phone,
          discountCode: appliedCoupon || undefined,
        }),
      });

      const orderData = await res.json();
      const rawId = orderData?.data?.id;
      const newOrderId = rawId
        ? `XE-${rawId.slice(-6).toUpperCase()}`
        : `XE-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(newOrderId);
      setPaidTotal(total);

      // Save order id to localStorage so guests can track their orders without logging in
      if (typeof window !== "undefined" && rawId) {
        try {
          const existing = JSON.parse(localStorage.getItem("xelectron_guest_orders") || "[]");
          if (!existing.includes(rawId)) {
            existing.unshift(rawId);
            localStorage.setItem("xelectron_guest_orders", JSON.stringify(existing.slice(0, 20)));
          }
        } catch {}
      }

      if (checkoutSessionToken) {
        await fetch("/api/abandoned-checkouts/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken: checkoutSessionToken }),
        });
        window.sessionStorage.removeItem(CHECKOUT_SESSION_KEY);
      }

      clearCart();
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
            Your order <strong className="text-slate-900 font-semibold">{orderId}</strong> has been successfully placed and is now being processed.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left text-xs sm:text-sm space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Customer:</span>
              <span className="font-medium text-slate-900">{firstName} {lastName}</span>
            </div>
            <div className="flex justify-between gap-4 py-1 border-b border-slate-200/60">
              <span className="text-slate-500 shrink-0">Shipping to:</span>
              <span className="font-medium text-slate-900 text-right">{[addressLine1, addressLine2, city, state, postalCode].filter(Boolean).join(", ")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Estimated Delivery:</span>
              <span className="font-semibold text-emerald-700">3 - 4 Business Days</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Payment:</span>
              <span className="font-medium text-slate-900 uppercase">{paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-semibold text-slate-900">
              <span>Total Paid:</span>
              <span className="text-[#0a7ae6]">₹{paidTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="flex-1 rounded-xl bg-[#0a7ae6] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-[#0a7ae6]/20 transition-all hover:bg-[#086ac9] flex items-center justify-center gap-2"
            >
              <Truck className="size-4" /> Track Shipment
            </Link>
            <Link
              href="/shop"
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart guard
  if (!productParamLoading && orderItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Package className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 mb-6">Looks like you haven&apos;t added anything yet. Browse our products to find something you love!</p>
          <Link
            href="/shop"
            className="inline-flex items-center rounded-xl bg-[#0a7ae6] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#0a7ae6]/20 hover:bg-[#086ac9] transition-all"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isMounted || productParamLoading || isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0a7ae6]" />
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
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                  >
                    <option value="" disabled>Select your state</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-3.5 size-4 text-slate-400" />
                </div>
              </div>

              {/* Account Creation Option for Guests */}
              {!currentUser && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 sm:p-5 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={createAccountOnCheckout}
                      onChange={(e) => setCreateAccountOnCheckout(e.target.checked)}
                      className="mt-0.5 size-4.5 rounded border-slate-300 text-[#0a7ae6] focus:ring-[#0a7ae6] accent-[#0a7ae6]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          Create an account while placing this order
                        </span>
                        <span className="text-[10px] font-semibold text-[#0a7ae6] bg-blue-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Track live delivery progress, access invoices, and enable instant product warranty.
                      </p>
                    </div>
                  </label>

                  {createAccountOnCheckout && (
                    <div className="pt-3 border-t border-blue-200/60 space-y-2 animate-in fade-in duration-200">
                      <label className="block text-xs font-semibold text-slate-700">
                        Set a Password for your account <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required={createAccountOnCheckout}
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        placeholder="Choose password (6+ characters)"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a7ae6] focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/15"
                      />
                      <p className="text-[11px] text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login?redirectTo=/checkout" className="font-bold text-[#0a7ae6] hover:underline">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}
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
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
                        <Image
                          src={item.image || "/category-smartphone.png"}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-500">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
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
      <Navbar />
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
