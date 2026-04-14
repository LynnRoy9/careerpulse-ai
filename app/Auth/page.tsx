"use client";
import React from "react";
import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard clause: ensures Clerk is ready
    if (!signIn || !signUp) return;

    setLoading(true);

    try {
      if (isLogin) {
        const signInAttempt = await signIn.create({
          identifier: email,
          password,
        });

        if (signInAttempt.status === "complete") {
          await router.push("/dashboard");
        }
      } else {
        const signUpAttempt = await signUp.create({
          emailAddress: email,
          password,
        });

        // If you've disabled email verification in Clerk Dashboard:
        if (signUpAttempt.status === "complete") {
          await router.push("/dashboard");
        } else {
          // If status is "missing_requirements", you need to handle verification
          console.log("Status:", signUpAttempt.status);
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      alert(err.errors?.[0]?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Left Side: Brand Content */}
      <section className="hidden md:flex relative w-1/2 bg-[#5048e5] p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5048e5]/80 to-[#6366f1]/60"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            CareerPulse AI
          </h1>
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Elevate your career with AI-powered precision.
          </h2>
          <p className="text-white/80 text-lg">
            Join 50,000+ professionals getting 3x more interview callbacks.
          </p>
        </div>
        <div className="relative z-10 pt-12 flex items-center gap-4">
          <p className="text-white/90 text-sm font-medium italic">
            "The mock interviews were a game changer for my FAANG interview."
          </p>
        </div>
      </section>

      {/* Right Side: Dynamic Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin
                ? "Enter details to access your AI coach."
                : "Start your journey to a better career today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[#5048e5] rounded-xl transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[#5048e5] rounded-xl transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5048e5] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4338ca] transition-all"
            >
              {loading
                ? "Processing..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Add this line anywhere inside the form */}
              <div id="clerk-captcha"></div>

              {/* ... rest of your inputs ... */}
            </form>
          </form>

          <p className="text-center text-slate-500 text-sm font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#5048e5] font-bold hover:underline"
            >
              {isLogin ? "Create an account for free" : "Log in here"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
