"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  // Auto-redirect if already authenticated
  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.user) {
          const paramRedirect = searchParams.get("redirectTo");
          if (paramRedirect) {
            router.replace(paramRedirect);
          } else if (data.user.role === "ADMIN") {
            router.replace("/dashboard");
          } else {
            router.replace("/orders");
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();

        const paramRedirect = searchParams.get("redirectTo");
        const targetUrl = paramRedirect || data.redirectTo || "/";

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Login failed. Please check your credentials.");
        }

        router.replace(targetUrl);
        router.refresh();
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();

        const paramRedirect = searchParams.get("redirectTo");
        const targetUrl = paramRedirect || data.redirectTo || "/";

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create account.");
        }

        router.replace(targetUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex bg-white">
      <div className="grid w-full min-h-[calc(100vh-70px)] lg:grid-cols-12">
        {/* Left Side: Editorial Lifestyle Photo (50% Width, 100% Height) */}
        <div className="relative hidden lg:block lg:col-span-6 bg-slate-100 min-h-[650px] lg:min-h-full overflow-hidden">
          <Image
            src="/auth-editorial.png"
            alt="XElectron Editorial Lifestyle"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
        </div>

        {/* Right Side: Editorial Form (50% Width, Centered) */}
        <div className="lg:col-span-6 min-h-[650px] lg:min-h-full flex flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 bg-white">
          <div className="w-full max-w-[460px] my-auto py-6">
            {/* Mode Subtitle & Info */}
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-wider text-slate-900">
                {mode === "signup" ? "CREATE YOUR ACCOUNT" : "SIGN IN TO YOUR ACCOUNT"}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 font-normal">
                {mode === "signup"
                  ? "Save your favourites, follow your orders, and receive access to our latest edits."
                  : "Access your saved products, track your orders, and manage your member profile."}
              </p>

              {errorMsg && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full rounded-none border border-slate-900 bg-white py-3 px-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-none border border-slate-900 bg-white py-3 px-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

              {mode === "signup" ? (
                /* 2-Column Password Grid for Signup */
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="8+ characters"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full rounded-none border border-slate-900 bg-white py-3 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5 truncate">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full rounded-none border border-slate-900 bg-white py-3 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Password for Login */
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900">
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("Password reset instructions sent.")}
                      className="text-[11px] font-normal text-slate-500 hover:text-slate-900 underline underline-offset-2"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="8+ characters"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full rounded-none border border-slate-900 bg-white py-3 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4 stroke-[1.8]" />
                      ) : (
                        <Eye className="size-4 stroke-[1.8]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Checkbox */}
              <div className="pt-1">
                {mode === "signup" ? (
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeTerms}
                      onChange={(e) =>
                        setFormData({ ...formData, agreeTerms: e.target.checked })
                      }
                      className="mt-0.5 size-3.5 rounded-none border-slate-900 text-black focus:ring-slate-900"
                    />
                    <span className="text-[11px] leading-snug text-slate-600 font-normal">
                      I agree to the{" "}
                      <span className="text-slate-900 underline cursor-pointer">
                        Terms & Conditions
                      </span>{" "}
                      and{" "}
                      <span className="text-slate-900 underline cursor-pointer">
                        Privacy Policy
                      </span>
                      .
                    </span>
                  </label>
                ) : (
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        setFormData({ ...formData, rememberMe: e.target.checked })
                      }
                      className="size-3.5 rounded-none border-slate-900 text-black focus:ring-slate-900"
                    />
                    <span className="text-[11px] text-slate-600 font-normal">
                      Keep me signed in on this device
                    </span>
                  </label>
                )}
              </div>

              {/* Full-width Black Button with Diagonal Arrow */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-between rounded-none bg-black py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-slate-800 disabled:opacity-70"
                >
                  <span className="mx-auto pl-4">
                    {loading ? "VERIFYING..." : mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </form>

            {/* Footer Mode Switcher Link */}
            <div className="mt-10 text-center pt-5 border-t border-slate-100">
              {mode === "signup" ? (
                <p className="text-xs text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-slate-900 hover:underline uppercase tracking-wider ml-1"
                  >
                    SIGN IN HERE
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-bold text-slate-900 hover:underline uppercase tracking-wider ml-1"
                  >
                    CREATE ONE
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading authentication form...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
