"use client";
import React, { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { syncUserToDb } from "@/app/actions/user";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Additional Vital Info
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(false);

  const {
    signIn,
    isLoaded: signInLoaded,
    setActive: setSignInActive,
  } = useSignIn();
  const {
    signUp,
    isLoaded: signUpLoaded,
    setActive: setSignUpActive,
  } = useSignUp();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded || !signUpLoaded) return;

    setLoading(true);

    try {
      if (isLogin) {
        // --- SIGN IN FLOW ---
        const result = await signIn.create({ identifier: email, password });
        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
          router.push("/dashboard");
        }
      } else {
        // --- CREATE ACCOUNT FLOW ---
        const result = await signUp.create({
          emailAddress: email,
          password,
          firstName: fullName.split(" ")[0],
          lastName: fullName.split(" ").slice(1).join(" "),
        });

        if (result.status === "complete") {
          // 1. Activate the Clerk Session (Fixes the navigation issue)
          await setSignUpActive({ session: result.createdSessionId });

          // 2. Save all info to Supabase
          await syncUserToDb({
            clerkId: result.createdUserId || "",
            email,
            name: fullName,
            role,
            experience,
          });

          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      alert(err.errors?.[0]?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  // This handles both Google and LinkedIn redirects
  const handleOAuth = async (
    strategy: "oauth_google" | "oauth_linkedin_oidc",
  ) => {
    if (!signInLoaded || !signIn) {
      console.warn("Auth is not fully loaded");
      return;
    }

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard", // Send them to the dashboard after success
      });
    } catch (err) {
      console.error("OAuth Error:", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Left Side: Brand Content (Kept as is) */}
      <section className="hidden md:flex relative w-1/2 bg-[#5048e5] p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-[#5048e5]/80 to-[#6366f1]/60"></div>
        </div>
        <h1 className="relative z-10 text-3xl font-black text-white tracking-tighter">
          CareerPulse AI
        </h1>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Elevate your career with AI precision.
          </h2>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full px-4 py-3 text-black bg-slate-200 rounded-xl focus:ring-2 focus:ring-[#5048e5] outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">
                      Target Role
                    </label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full px-4 py-3 text-black bg-slate-200 rounded-xl focus:ring-2 focus:ring-[#5048e5] outline-none"
                      placeholder="e.g. Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">
                      Experience
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="block w-full px-4 py-3 bg-slate-200 text-black rounded-xl focus:ring-2 focus:ring-[#5048e5] outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="Junior">0-2 Years</option>
                      <option value="Mid">3-5 Years</option>
                      <option value="Senior">5+ Years</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-200 text-black rounded-xl focus:ring-2 focus:ring-[#5048e5] outline-none"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-200 text-black rounded-xl focus:ring-2 focus:ring-[#5048e5] outline-none"
                placeholder="••••••••"
              />
            </div>
            <div id="clerk-captcha"></div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5048e5] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4338ca] transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Get Started"}
            </button>

            <div className="relative flex items-center py-4">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink-0 mx-4 text-slate-400 text-sm font-medium">
                Or continue with
              </span>
              <div className="grow border-t border-slate-200"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleOAuth("oauth_google")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth("oauth_linkedin_oidc")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700"
              >
                <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
            </div>
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
