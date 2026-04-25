"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth, GoogleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Link from "next/link";

// Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.167-2.676-6.735-2.676-5.521 0-10 4.479-10 10s4.479 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.955h-9.811z" />
  </svg>
);

// Bar Chart Icon
const BarChartIcon = () => (
  <svg
    className="w-10 h-10 text-indigo-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<string>("jobseeker");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const getRedirectPath = (): string => {
    return selectedRole === "/" ? "/dashboard" : "/dashboard";
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, GoogleProvider);
      router.push(getRedirectPath());
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Failed to sign in with Google.");
      setLoading(false);
    }
  };

  const handleEmailPasswordLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(getRedirectPath());
    } catch (err: any) {
      console.error("Email/Password Login Error:", err);
      let msg = "Invalid email or password.";
      if (err.code === "auth/user-not-found") {
        msg = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        msg = "Incorrect password.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many login attempts. Try again later.";
      }
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Pane */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-700 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="z-10 space-y-8">
          <div className="flex items-center space-x-3">
            <svg
              className="h-10 w-auto text-white"
              fill="currentColor"
              viewBox="0 0 201 42"
            >
              <text
                x="0"
                y="32"
                fontFamily="Arial, sans-serif"
                fontSize="35"
                fontWeight="bold"
              >
                SkillLink
              </text>
            </svg>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4">
              <BarChartIcon />
              <div>
                <h2 className="text-4xl font-bold">100K+</h2>
                <p className="text-indigo-200">People got hired</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl text-gray-800 max-w-md">
            <p className="text-lg font-medium leading-relaxed">
              &ldquo;Great platform for the job seeker searching for new career
              heights.&rdquo;
            </p>
            <div className="mt-6 flex items-center">
              <Image
                src="/login.jpg"
                alt="Adam Sandler"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Adam Sandler</p>
                <p className="text-sm text-gray-600">Lead Engineer at Canva</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Role Toggle */}
          <div className="flex justify-end mb-6 space-x-2">
            <button
              onClick={() => setSelectedRole("jobseeker")}
              className={`px-4 py-2 text-sm font-semibold rounded-md focus:outline-none focus:ring-2 ${
                selectedRole === "jobseeker"
                  ? "bg-indigo-600 text-white ring-indigo-500"
                  : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setSelectedRole("company")}
              className={`px-4 py-2 text-sm font-semibold rounded-md focus:outline-none focus:ring-2 ${
                selectedRole === "company"
                  ? "bg-indigo-600 text-white ring-indigo-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Company
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-8">
            Please enter your details to sign in.
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 mb-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <GoogleIcon />
            Login with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500">
                Or login with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailPasswordLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRememberMe(e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
