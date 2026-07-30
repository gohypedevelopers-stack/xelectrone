"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import { ArrowUpRight } from "lucide-react";

function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert(
        mode === "login"
          ? "Successfully signed in to your XElectron account!"
          : "Account created successfully! Welcome to XElectron."
      );
    }, 600);
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
                    <input
                      type="password"
                      required
                      placeholder="8+ characters"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full rounded-none border border-slate-900 bg-white py-3 px-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5 truncate">
                      CONFIRM PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-none border border-slate-900 bg-white py-3 px-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                    />
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
                  <input
                    type="password"
                    required
                    placeholder="8+ characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full rounded-none border border-slate-900 bg-white py-3 px-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                  />
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
                  disabled={submitted}
                  className="group relative flex w-full items-center justify-between rounded-none bg-black py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-slate-800 disabled:opacity-70"
                >
                  <span className="mx-auto pl-4">
                    {mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
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
