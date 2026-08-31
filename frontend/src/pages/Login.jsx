import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Home,
  CheckCircle2,
  FileText,
  Gavel,
  Zap,
  ArrowLeft,
  Users,
  Menu,
  X
} from "lucide-react";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { useStore } from "../zustand/store";
import ThemeToggle from "../components/ThemeToggle";

const LoginForm = () => {
  const { fetchUser, user, theme } = useStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/login", data);

      if (res.status === 200) {
        if (res.data.status === 5 || res.data.status === 9)
          return toast.error("Invalid email or password");

        if (res.data.status === 0)
          return toast.error("Something went wrong. Please try again.");

        if (res.data.status === 7)
          return toast.error("Please fill in all required fields.");

        if (res.data.status === 1) {
          toast.success("Welcome back! Login successful ✨");
          await fetchUser();
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Internal server error. Please try later.");
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden transition-colors duration-300 ${
      isDark ? "bg-[#090D16] text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/20 to-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-purple-600/20 via-pink-600/10 to-transparent blur-[140px]" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(120,120,120,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Floating Glass Navigation Bar */}
      <header className="relative z-20 w-full px-3 sm:px-8 pt-3 sm:pt-5 pb-2">
        <div className={`max-w-7xl mx-auto flex items-center justify-between backdrop-blur-xl rounded-2xl px-3.5 sm:px-6 py-2.5 sm:py-3 shadow-2xl transition-all duration-300 ${
          isDark
            ? "bg-slate-900/80 border border-slate-800/80 shadow-black/40"
            : "bg-white/90 border border-slate-200 shadow-slate-200/50"
        }`}>
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <img
                src="/logo.png"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform"
                alt="ApnaVakil Logo"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-[#090D16] rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className={`text-base sm:text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Apna<span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Vakil</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Legal Intelligence Platform</span>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Switcher */}
            <ThemeToggle />

            <Link
              to="/"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isDark
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Home className="w-4 h-4 text-indigo-500" />
              <span>Home</span>
            </Link>

            <Link
              to="/signup"
              className={`hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all items-center gap-1 ${
                isDark
                  ? "text-slate-200 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60"
                  : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-500 hidden sm:inline" />
              Sign Up
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex relative group px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white overflow-hidden shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:opacity-90 transition-opacity" />
              <div className="relative flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span>Try AI</span>
              </div>
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className={`sm:hidden p-2 rounded-xl border transition-colors ${
                isDark
                  ? "bg-slate-800/80 border-slate-700 text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`sm:hidden mt-2 border rounded-2xl p-3 space-y-1.5 shadow-2xl backdrop-blur-2xl ${
                isDark ? "bg-slate-900/95 border-slate-800 text-slate-200" : "bg-white/95 border-slate-200 text-slate-800"
              }`}
            >
              <Link
                to="/"
                onClick={() => setMobileNavOpen(false)}
                className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
              >
                🏠 Home
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileNavOpen(false)}
                className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-indigo-400" : "hover:bg-slate-100 text-indigo-600"}`}
              >
                ✨ Create Free Account (Sign Up)
              </Link>
              <Link
                to="/forget-password"
                onClick={() => setMobileNavOpen(false)}
                className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
              >
                🔒 Forgot Password?
              </Link>
              <Link
                to="/disclaimer"
                onClick={() => setMobileNavOpen(false)}
                className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
              >
                📜 Legal Disclaimer
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive LegalTech Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center space-y-8 pr-4"
          >
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-400 w-fit backdrop-blur-md">
              <Scale className="w-3.5 h-3.5 text-indigo-500" />
              <span>India's #1 AI-Powered Legal Assistant</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className={`text-4xl xl:text-5xl font-black tracking-tight leading-[1.15] ${isDark ? "text-white" : "text-slate-900"}`}>
                Welcome Back to{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  ApnaVakil
                </span>
              </h1>
              <p className={`text-base xl:text-lg max-w-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Log in to resume case analysis, instant legal drafting under Bharatiya Nyaya Sanhita (BNS), and verified lawyer consultations.
              </p>
            </div>

            {/* Interactive Live AI Demo Preview Card */}
            <div className={`relative rounded-2xl p-5 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
              isDark
                ? "bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-700/60 shadow-indigo-950/40"
                : "bg-white/90 border border-slate-200 shadow-slate-300/40"
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">ApnaVakil AI Legal Assistant</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Active System
                </span>
              </div>

              {/* Simulated Query & Response */}
              <div className="space-y-3 font-sans text-xs">
                <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700/40 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}>
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-500 shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px]">Recent Draft Request</p>
                    <p className="font-medium">"Non-Disclosure Agreement under Indian Contract Act 1872"</p>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  isDark
                    ? "bg-indigo-950/30 border-indigo-500/30 text-indigo-200"
                    : "bg-indigo-50/70 border-indigo-200 text-indigo-900"
                }`}>
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">AI Legal Verification</p>
                    <p className="text-[11px]">
                      Jurisdiction: Indian Courts • Stamp Duty Compliant • 99.8% Accuracy Score
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights below preview */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/40">
                <div className="text-center">
                  <p className={`font-extrabold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>50,000+</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Legal Inquiries</p>
                </div>
                <div className="text-center border-x border-slate-200 dark:border-slate-700/40">
                  <p className="text-indigo-500 font-extrabold text-lg">256-Bit</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Bank-Grade SSL</p>
                </div>
                <div className="text-center">
                  <p className="text-pink-500 font-extrabold text-lg">Instant</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">AI Drafting</p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Advocate avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Lawyer avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Client avatar" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Rated 4.9/5</span> by legal practitioners & citizens across India.
              </div>
            </div>
          </motion.div>

          {/* Right Column: Modern Glassmorphic Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:col-span-6 xl:col-span-5"
          >
            <div className={`relative rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
              isDark
                ? "bg-slate-900/80 border border-slate-800 shadow-black/80"
                : "bg-white/95 border border-slate-200 shadow-xl shadow-slate-200/80"
            }`}>
              
              {/* Subtle top border gradient accent */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

              {/* Form Navigation Tabs */}
              <div className={`flex rounded-xl p-1 border mb-8 ${
                isDark
                  ? "bg-slate-950/70 border-slate-800/80"
                  : "bg-slate-100 border-slate-200"
              }`}>
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md transition-all"
                >
                  Sign In
                </button>
                <Link
                  to="/signup"
                  className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center ${
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Create Account
                </Link>
              </div>

              {/* Header Titles */}
              <div className="mb-6">
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Sign in to your account
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
                  Enter your credentials to access your legal dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Email Address
                  </label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    isDark ? "bg-slate-950/60" : "bg-slate-50"
                  } ${
                    errors.email
                      ? "border-red-500/80 ring-2 ring-red-500/20"
                      : "border-slate-300 dark:border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
                  }`}>
                    <div className="pl-4 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      {...register("email", {
                        required: "Email address is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={`w-full bg-transparent px-3.5 py-3 text-sm placeholder-slate-400 outline-none ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium pl-1 flex items-center gap-1">
                      <span>•</span> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Password
                    </label>
                    <Link
                      to="/forget-password"
                      className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    isDark ? "bg-slate-950/60" : "bg-slate-50"
                  } ${
                    errors.password
                      ? "border-red-500/80 ring-2 ring-red-500/20"
                      : "border-slate-300 dark:border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
                  }`}>
                    <div className="pl-4 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={`w-full bg-transparent px-3.5 py-3 text-sm placeholder-slate-400 outline-none pr-10 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs font-medium pl-1 flex items-center gap-1">
                      <span>•</span> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative group w-full py-3.5 rounded-xl font-bold text-white text-sm overflow-hidden shadow-xl shadow-indigo-600/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-indigo-500 group-hover:to-pink-500 transition-all" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in securely...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Bottom Switch Link */}
              <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-5">
                Don't have an account yet?{" "}
                <Link to="/signup" className="text-indigo-500 dark:text-indigo-400 font-bold hover:underline transition-colors">
                  Create one for free
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/60 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} ApnaVakil AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/disclaimer" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Disclaimer</Link>
            <Link to="/privacy-policy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginForm;