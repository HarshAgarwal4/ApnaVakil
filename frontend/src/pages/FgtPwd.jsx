import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "../services/axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Sparkles,
  Home,
  CheckCircle2,
  Clock,
  Zap,
  LogIn,
  Users,
  Menu,
  X
} from "lucide-react";
import { useStore } from "../zustand/store";
import ThemeToggle from "../components/ThemeToggle";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { theme } = useStore();
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    getValues,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch("password") || "";
  const isDark = theme === "dark";

  const onSubmit = async (data) => {
    if (!otpSent) {
      setError("otp", { type: "manual", message: "Please request your verification OTP first." });
      return;
    }
    try {
      const res = await axios.post("/fgtpwd", data);
      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Error resetting password. Please try again.");
        if (res.data.status === 7) toast.error("Please fill in all valid fields.");
        if (res.data.status === 10) toast.error("Invalid or expired OTP code.");
        if (res.data.status === 5) toast.error("No registered account found with this email.");
        if (res.data.status === 1) {
          toast.success("Password reset successfully! You can now log in 🔐");
          reset();
          navigate("/login");
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Internal server error. Please try later.");
    }
  };

  const handleSendOtp = async () => {
    const email = getValues("email");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", { type: "manual", message: "Please enter a valid registered email address." });
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await axios.post("/sendotp", { email });
      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Failed to send OTP. Please try again.");
        if (res.data.status === 7) toast.error("Invalid email provided.");
        if (res.data.status === 1) {
          toast.success("Verification OTP sent to your registered email! 📧");
          setOtpSent(true);
          setCurrentStep(2);
          setOtpCountdown(60);
          clearErrors("email");
          clearErrors("otp");
        }
      }
    } catch (err) {
      toast.error("Unable to dispatch OTP. Please check your connection.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden transition-colors duration-300 ${
      isDark ? "bg-[#090D16] text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-pink-600/15 via-violet-600/10 to-transparent blur-[140px]" />
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
              to="/signup"
              className="hidden sm:inline-flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-md transition-all items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-pink-300" />
              Register
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
                🔑 Return to Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileNavOpen(false)}
                className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-purple-400" : "hover:bg-slate-100 text-purple-600"}`}
              >
                ✨ Register New Account
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

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Security Overview & Verification Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center space-y-8 pr-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-400 w-fit backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Multi-Factor Identity Recovery</span>
            </div>

            <div className="space-y-3">
              <h1 className={`text-4xl xl:text-5xl font-black tracking-tight leading-[1.15] ${isDark ? "text-white" : "text-slate-900"}`}>
                Recover Your Account{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  In Minutes
                </span>
              </h1>
              <p className={`text-base xl:text-lg max-w-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                We safeguard your confidential case files and drafts. Follow the verification steps below to reset your password securely.
              </p>
            </div>

            {/* Interactive Step Progress Flow */}
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Request Verification OTP",
                  desc: "Enter your registered email address to receive a one-time cryptographic authorization code.",
                },
                {
                  step: 2,
                  title: "Authenticate Code & Set Password",
                  desc: "Enter the received code and set a strong, encrypted new password for your account.",
                },
                {
                  step: 3,
                  title: "Instant Access Restored",
                  desc: "Log right back in to continue generating drafts and consulting legal advisors.",
                },
              ].map((s) => {
                const isCurrent = currentStep === s.step;
                const isCompleted = currentStep > s.step;
                return (
                  <div
                    key={s.step}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                      isCurrent
                        ? isDark
                          ? "bg-slate-900/80 border-indigo-500/60 shadow-lg shadow-indigo-500/10"
                          : "bg-white border-indigo-500 shadow-md shadow-indigo-100"
                        : isCompleted
                        ? isDark
                          ? "bg-slate-900/40 border-emerald-500/40"
                          : "bg-emerald-50/50 border-emerald-300"
                        : isDark
                        ? "bg-slate-900/20 border-slate-800/60 opacity-60"
                        : "bg-slate-100 border-slate-200 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${
                        isCurrent
                          ? isDark ? "text-white" : "text-slate-900"
                          : isCompleted
                          ? "text-emerald-500"
                          : isDark ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {s.title}
                      </h3>
                      <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Password Recovery Card */}
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
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

              {/* Back to login shortcut */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Sign In</span>
                </Link>

                <span className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                  Step {currentStep} of 2
                </span>
              </div>

              {/* Header Title */}
              <div className="mb-6">
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  {currentStep === 1 ? "Reset Password 🔑" : "Create New Password ✨"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {currentStep === 1
                    ? "Enter your email address to receive your 4-digit verification code"
                    : "Enter your OTP code and choose your new password"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Email Address */}
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
                      disabled={otpSent}
                      {...register("email", {
                        required: "Email address is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={`w-full bg-transparent px-3.5 py-3 text-sm placeholder-slate-400 outline-none disabled:text-slate-400 disabled:cursor-not-allowed ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    />
                    {otpSent && (
                      <div className="pr-3 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium pl-1">
                      • {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Step 1: Send OTP Button */}
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="relative group w-full py-3.5 rounded-xl font-bold text-white text-sm overflow-hidden shadow-xl shadow-indigo-600/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-indigo-500 group-hover:to-pink-500 transition-all" />
                    <div className="relative flex items-center justify-center gap-2">
                      {isSendingOtp ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Dispatching OTP...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>Send Verification OTP</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                )}

                {/* Step 2: OTP & New Password */}
                <AnimatePresence>
                  {otpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-1"
                    >
                      {/* OTP Input */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                            <KeyRound className="w-3.5 h-3.5" />
                            Verification OTP Code
                          </label>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp || otpCountdown > 0}
                            className="text-[11px] font-medium text-indigo-500 dark:text-indigo-400 hover:underline disabled:text-slate-400 disabled:cursor-not-allowed"
                          >
                            {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : "Resend OTP"}
                          </button>
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
                              required: "OTP is required",
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
                      </div>

                      {/* New Password Input */}
                      <div className="space-y-1">
                        <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          New Password
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
                              required: "New password is required",
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
                      </div>

                      {/* Submit Reset Button */}
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
                              <span>Resetting password...</span>
                            </>
                          ) : (
                            <>
                              <span>Reset & Update Password</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Bottom Navigation Links */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                <Link to="/login" className="hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition-colors">
                  Remember password? Sign In
                </Link>
                <span>•</span>
                <Link to="/signup" className="hover:text-purple-500 dark:hover:text-purple-300 font-semibold transition-colors">
                  Create New Account
                </Link>
              </div>
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

export default ForgotPassword;
