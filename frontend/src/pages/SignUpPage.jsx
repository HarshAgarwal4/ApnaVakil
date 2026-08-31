import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
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
  KeyRound,
  Zap,
  LogIn,
  FileCheck2,
  Clock,
  Menu,
  X
} from "lucide-react";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { useStore } from "../zustand/store";
import ThemeToggle from "../components/ThemeToggle";

const SignupForm = () => {
  const { user, fetchUser, theme } = useStore();
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
    reset,
  } = useForm();

  const email = watch("email");
  const password = watch("password") || "";

  const onSubmit = async (data) => {
    if (!otpSent) {
      setError("otp", { type: "manual", message: "Please request and verify your OTP first." });
      return;
    }

    try {
      const res = await axios.post("/register", data);

      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Error creating account. Please try again.");
        if (res.data.status === 6) toast.error("An account with this email already exists.");
        if (res.data.status === 7) toast.error("Please fill in all valid fields.");
        if (res.data.status === 10) toast.error("Invalid or expired OTP. Please verify.");

        if (res.data.status === 1) {
          toast.success("Account created successfully! Welcome to ApnaVakil 🎉");
          reset();
          await fetchUser();
          if (data.isLawyer) {
            navigate("/lawyer/dashboard");
          } else {
            navigate("/dashboard");
          }
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Internal server error. Please try later.");
    }
  };

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", { type: "manual", message: "Please enter a valid email address first." });
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await axios.post("/sendotp", { email });

      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Failed to send verification code. Please retry.");
        if (res.data.status === 7) toast.error("Invalid email provided.");

        if (res.data.status === 1) {
          toast.success("Verification OTP dispatched to your inbox! 📧");
          setOtpSent(true);
          setOtpCountdown(60);
          clearErrors("email");
          clearErrors("otp");
        }
      }
    } catch (err) {
      toast.error("Unable to dispatch OTP. Please check your network.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden transition-colors duration-300 ${
      isDark ? "bg-[#090D16] text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-purple-600/20 via-indigo-600/10 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-600/15 via-violet-600/10 to-transparent blur-[130px]" />
        <div className="absolute top-[35%] right-[25%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[110px]" />
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
            {/* Theme Toggle */}
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
              to="/login"
              className={`hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all items-center gap-1 ${
                isDark
                  ? "text-slate-200 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60"
                  : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-500 hidden sm:inline" />
              Sign In
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
                to="/login"
                onClick={() => setMobileNavOpen(false)}
                className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-indigo-400" : "hover:bg-slate-100 text-indigo-600"}`}
              >
                🔑 Already have an account? (Sign In)
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

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Onboarding & Legal Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center space-y-8 pr-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-400 w-fit backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant AI Legal Access Across India</span>
            </div>

            <div className="space-y-3">
              <h1 className={`text-4xl xl:text-5xl font-black tracking-tight leading-[1.15] ${isDark ? "text-white" : "text-slate-900"}`}>
                Get Empowered With{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Next-Gen AI Law
                </span>
              </h1>
              <p className={`text-base xl:text-lg max-w-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Join over 50,000+ Indian citizens, legal professionals, and startups simplifying legal work with cutting-edge intelligence.
              </p>
            </div>

            {/* Step-by-Step Onboarding Interactive Flow */}
            <div className="space-y-3.5">
              {[
                {
                  icon: User,
                  title: "1. Create Free Profile",
                  desc: "Set up your legal identity in under 60 seconds with no credit card required.",
                },
                {
                  icon: KeyRound,
                  title: "2. Verify Email via Secure OTP",
                  desc: "Ensure authenticated, private case storage and end-to-end encrypted drafts.",
                },
                {
                  icon: FileCheck2,
                  title: "3. Access AI Drafter & Advocates",
                  desc: "Generate rental agreements, NDAs, consumer notices, and consult verified advocates.",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 p-3.5 rounded-2xl border backdrop-blur-md transition-colors ${
                    isDark
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80"
                      : "bg-white/80 border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{step.title}</h3>
                    <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Assurance */}
            <div className="flex items-center gap-6 pt-2 border-t border-slate-200 dark:border-slate-800/70 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free Signup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>BNS 2023 Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>Confidential Data</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:col-span-6 xl:col-span-5"
          >
            <div className={`relative rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
              isDark
                ? "bg-slate-900/80 border border-slate-800 shadow-black/80"
                : "bg-white/95 border border-slate-200 shadow-xl shadow-slate-200/80"
            }`}>
              
              {/* Top Border Glow Accent */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

              {/* Form Navigation Tabs */}
              <div className={`flex rounded-xl p-1 border mb-7 ${
                isDark
                  ? "bg-slate-950/70 border-slate-800/80"
                  : "bg-slate-100 border-slate-200"
              }`}>
                <Link
                  to="/login"
                  className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center ${
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-md transition-all"
                >
                  Create Account
                </button>
              </div>

              {/* Header Titles */}
              <div className="mb-6">
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Create your account ✨
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
                  Get instant access to AI drafting and legal advisory
                </p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Full Name
                  </label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    isDark ? "bg-slate-950/60" : "bg-slate-50"
                  } ${
                    errors.name
                      ? "border-red-500/80 ring-2 ring-red-500/20"
                      : "border-slate-300 dark:border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
                  }`}>
                    <div className="pl-4 text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Adv. Rahul Sharma"
                      {...register("name", { required: "Full name is required" })}
                      className={`w-full bg-transparent px-3.5 py-3 text-sm placeholder-slate-400 outline-none ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs font-medium pl-1">
                      • {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Address with Integrated Send OTP Button */}
                <div className="space-y-1">
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
                      className={`w-full bg-transparent px-3.5 py-3 text-sm placeholder-slate-400 outline-none pr-28 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    />
                    
                    {/* Inline Send OTP Button */}
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || otpCountdown > 0}
                      className={`absolute right-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm ${
                        otpSent && otpCountdown > 0
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed"
                          : isSendingOtp
                          ? "bg-indigo-600/50 text-white cursor-wait"
                          : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 active:scale-95"
                      }`}
                    >
                      {isSendingOtp ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : otpCountdown > 0 ? (
                        <>
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>Resend ({otpCountdown}s)</span>
                        </>
                      ) : otpSent ? (
                        <span>Resend OTP</span>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>Send OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium pl-1">
                      • {errors.email.message}
                    </p>
                  )}
                </div>

                {/* OTP Field */}
                <AnimatePresence>
                  {otpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                          <KeyRound className="w-3.5 h-3.5" />
                          Verification OTP Code
                        </label>
                        <span className="text-[11px] text-slate-400">Check spam folder if needed</span>
                      </div>
                      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                        isDark ? "bg-slate-950/80" : "bg-emerald-50/40"
                      } ${
                        errors.otp
                          ? "border-red-500/80 ring-2 ring-red-500/20"
                          : "border-emerald-500/60 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20"
                      }`}>
                        <div className="pl-4 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Enter 4-digit code"
                          maxLength={6}
                          {...register("otp", {
                            required: "OTP is required for verification",
                            minLength: {
                              value: 4,
                              message: "OTP must be at least 4 digits",
                            },
                          })}
                          className={`w-full bg-transparent px-3.5 py-3 text-sm placeholder-slate-400 outline-none tracking-[0.25em] font-mono ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        />
                      </div>
                      {errors.otp && (
                        <p className="text-red-500 text-xs font-medium pl-1">
                          • {errors.otp.message}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Password
                  </label>
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
                      placeholder="Min. 6 characters"
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
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs font-medium pl-1">
                      • {errors.password.message}
                    </p>
                  )}

                  {/* Password Strength Indicators */}
                  {password.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 pl-1 text-[11px] text-slate-400">
                      <span className={`inline-flex items-center gap-1 ${hasMinLength ? "text-emerald-500" : "text-slate-400"}`}>
                        ✓ 6+ chars
                      </span>
                      <span className={`inline-flex items-center gap-1 ${hasNumber ? "text-emerald-500" : "text-slate-400"}`}>
                        ✓ Number
                      </span>
                      <span className={`inline-flex items-center gap-1 ${hasLetter ? "text-emerald-500" : "text-slate-400"}`}>
                        ✓ Letter
                      </span>
                    </div>
                  )}
                </div>

                {/* Apply as Lawyer Checkbox */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  watch("isLawyer")
                    ? isDark
                      ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/40"
                      : "bg-blue-50 border-blue-400 shadow-sm"
                    : isDark
                    ? "bg-slate-950/40 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("isLawyer")}
                      className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          ⚖️ Register as Legal Advocate / Lawyer
                        </span>
                        {watch("isLawyer") && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                            Lawyer Role
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Gain access to the exclusive Lawyer Panel, complete your advocate profile, and receive direct client consultation requests.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Terms & Privacy Policy Mandatory Agreement Checkbox */}
                <div className="space-y-1 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("agree", {
                        required: "You must agree to the Terms & Conditions and Privacy Policy to proceed.",
                      })}
                      className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 shrink-0"
                    />
                    <span className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      I have read and agree to the{" "}
                      <Link
                        to="/terms-and-conditions"
                        target="_blank"
                        className="font-bold text-indigo-500 hover:text-indigo-400 underline decoration-indigo-400/40"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy-policy"
                        target="_blank"
                        className="font-bold text-indigo-500 hover:text-indigo-400 underline decoration-indigo-400/40"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.agree && (
                    <p className="text-red-500 text-xs font-medium pl-1">
                      • {errors.agree.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative group w-full py-3.5 rounded-xl font-bold text-white text-sm overflow-hidden shadow-xl shadow-indigo-600/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-indigo-500 group-hover:to-pink-500 transition-all" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating your account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>
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

export default SignupForm;