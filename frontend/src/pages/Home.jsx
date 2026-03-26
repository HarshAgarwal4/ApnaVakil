import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingPage from '../components/Loading';
import { useForm } from 'react-hook-form';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { useStore } from '../zustand/store';
import { HashLink } from "react-router-hash-link";

const PlayIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M9 11l3 3L22 4" />
  </svg>
);

const ZapIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const GlobeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const DollarSignIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign">
    <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const MailIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.83 1.83 0 0 1-2.06 0L2 7" />
  </svg>
);

const ClockIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const { user, loading } = useStore()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
    reset
  } = useForm();

  useEffect(() => {
    if (user && (loading === false)) {
      navigate('/dashboard');
    }
  }, [user, loading]);

  if (loading) return <LoadingPage />;

  const features = [
    {
      icon: <ZapIcon className="h-8 w-8" />,
      title: "Fast Response AI",
      description: "Get immediate, AI-driven answers to your complex legal questions, anytime.",
    },
    {
      icon: <GlobeIcon className="h-8 w-8" />,
      title: "Multi-Language Support",
      description: "Communicate your concerns in the language you're most comfortable with.",
    },
    {
      icon: <LockIcon className="h-8 w-8" />,
      title: "Secure & Confidential",
      description: "With end-to-end encryption, your conversations and data are always private.",
    },
    {
      icon: <DollarSignIcon className="h-8 w-8" />,
      title: "Low Pricing",
      description: "Access premium legal guidance and tools at a fraction of the traditional cost.",
    },
  ];

  const onSubmit = async (data) => {
    try {
      let res = await axios.post('/contact', data)
      if (res.status === 200) {
        if (res.data.status === 1) {
          toast.success("You message has been submitted sucesfully")
        }
        if (res.data.status === 7) {
          toast.success("please enter all valid fields")
        }
        if (res.data.status === 0) {
          toast.success("error in submitting message")
        }
      }
    } catch (err) {
      toast.error("internal server error")
    }
  }

  return (
    <div className="font-sans text-slate-900 overflow-x-hidden bg-slate-50">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" className='w-10 sm:w-14 md:w-16 aspect-square' alt="logo" />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              ApnaVakil
            </span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10 text-sm font-medium text-slate-700">
            <a className="hover:text-indigo-600 transition" href="#Home">Home</a>
            <a className="hover:text-indigo-600 transition" href="#Features">Features</a>
            <a className="hover:text-indigo-600 transition" href="#working">How it works</a>
            <a className="hover:text-indigo-600 transition" href="#mission">About Us</a>
            <a className="hover:text-indigo-600 transition" href="#contact">Contact Us</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Attractive Login */}
            <button onClick={() => { navigate('/login') }} className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold 
    text-indigo-700 bg-indigo-100/70 backdrop-blur 
    hover:bg-indigo-200 transition">
              Login
            </button>


            {/* Primary CTA */}
            <button onClick={() => { navigate('/dashboard') }} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-xl text-xs sm:text-lg shadow-lg hover:scale-105 transition">
              Try AI
            </button>
          </div>

        </div>
      </nav>
      {/* ================= HERO ================= */}
      <section
        id="Home"
        className="relative pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-32 md:pb-40 overflow-hidden bg-slate-50"
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]" />

        {/* Decorative blur */}
        <div className="absolute -top-16 sm:-top-24 -left-16 sm:-left-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-indigo-300 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 -right-16 sm:-right-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-pink-300 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* BADGE */}
          <span className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 sm:px-6 py-2 rounded-full bg-white/70 backdrop-blur border border-indigo-200 text-xs sm:text-sm font-medium text-indigo-700 shadow">
            ⚖️ AI Legal Intelligence Platform
          </span>

          {/* HEADING */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 sm:mb-8">
            <span className="block text-slate-900">Legal Answers.</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Powered by AI.
            </span>
          </h1>

          {/* SUBTEXT */}
          <p className="max-w-lg sm:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 mb-10 sm:mb-14">
            ApnaVakil helps you explore Indian laws, understand legal
            procedures, and decode documents using AI — instantly.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold shadow-xl shadow-indigo-500/30 hover:scale-105 hover:bg-indigo-700 transition-all duration-300"
            >
              Start Exploring
            </button>

            <button
              className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-indigo-700 border border-indigo-300 bg-white/60 backdrop-blur hover:bg-white transition-all duration-300"
            >
              Watch Demo
            </button>

          </div>

        </div>
      </section>

      {/* ================= DRAFT & LAWYERS SECTION ================= */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 bg-slate-50 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]" />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* ================= LEFT : DRAFT ================= */}
          <div className="bg-white/70 backdrop-blur rounded-2xl border border-indigo-200 shadow-lg p-4 sm:p-5">

            {/* Preview */}
            <div className="bg-white rounded-xl border h-44 sm:h-52 p-3 mb-4 sm:mb-5 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-700">
                  Draft Preview
                </h3>

                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  AI
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 space-y-2 overflow-y-auto h-full pr-1">

                {!showPreview ? (
                  <p className="text-center text-slate-400 pt-10 sm:pt-14">
                    Generate draft to preview
                  </p>
                ) : (
                  <>
                    <p className="font-semibold text-center">LEGAL DRAFT</p>
                    <p>Generated using Indian laws.</p>
                    <p>Terms and obligations apply.</p>
                    <p>Jurisdiction: Indian Courts.</p>
                    <p className="text-slate-400">Scroll for more…</p>
                  </>
                )}

              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => setShowPreview(p => !p)}
              className="w-full bg-indigo-600 text-white text-sm sm:text-base py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Generate Draft
            </button>
          </div>


          {/* ================= RIGHT : LAWYERS ================= */}
          <div className="bg-white/70 backdrop-blur rounded-2xl border border-purple-200 shadow-lg p-4 sm:p-5">

            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              Verified Lawyers
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-5">
              Connect with legal experts instantly
            </p>

            {/* Lawyer Card */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 border mb-5 sm:mb-6">

              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Lawyer"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border"
              />

              <div>
                <p className="text-sm font-semibold">Adv. Rahul Sharma</p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Criminal & Civil • 10+ yrs
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="space-y-3">

              <button className="w-full bg-indigo-600 text-white text-sm sm:text-base py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                Consult Lawyer
              </button>

              <button className="w-full border border-indigo-300 text-indigo-700 text-sm sm:text-base py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-indigo-50 transition">
                Ask AI First
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id='Features' className="relative py-16 sm:py-20 md:py-28 overflow-hidden">

        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
        <div className="absolute -top-32 sm:-top-40 -left-32 sm:-left-40 h-72 sm:h-96 w-72 sm:w-96 bg-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 sm:-bottom-40 -right-32 sm:-right-40 h-72 sm:h-96 w-72 sm:w-96 bg-pink-300/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Powerful Features Built for Trust & Speed
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-xl sm:max-w-2xl mx-auto">
              A comprehensive suite of AI-driven tools designed to deliver secure,
              fast, and reliable legal information.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12">

            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-xl transition">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow mb-3 sm:mb-4 text-lg">
                ⚡
              </div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Fast Response AI</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Get immediate AI-powered responses to complex legal questions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-xl transition">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow mb-3 sm:mb-4 text-lg">
                🌐
              </div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Multi-Language Support</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Communicate in the language you are most comfortable with.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-xl transition">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow mb-3 sm:mb-4 text-lg">
                🔐
              </div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Secure & Confidential</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                End-to-end encryption keeps your data private and protected.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-xl transition">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow mb-3 sm:mb-4 text-lg">
                💰
              </div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Low Pricing</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Premium legal tools at a fraction of traditional costs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-xl transition">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow mb-3 sm:mb-4 text-lg">
                🤖
              </div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">AI-Powered Insights</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Intelligent legal insights driven by advanced AI models.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-xl transition">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow mb-3 sm:mb-4 text-lg">
                🇮🇳
              </div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">India-Focused</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Tailored specifically for Indian laws and regulations.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-xl transition">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow mb-3 sm:mb-4 text-lg">
                🛡️
              </div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Privacy First</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                No data misuse. Your conversations remain confidential.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-xl transition">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow mb-3 sm:mb-4 text-lg">
                ⚖️
              </div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Informational Use</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Provides legal information, not a replacement for a lawyer.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (REFINED – SAME STRUCTURE) ================= */}
      <section id='working' className="py-20 mt-2 sm:py-24 md:py-36 bg-white relative overflow-hidden">

        {/* Subtle Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-14 sm:mb-20 md:mb-24 text-slate-900">
            How ApnaVakil Works
          </h2>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 text-center">

            {/* Connector Line */}
            <div className="hidden md:block absolute top-[56px] left-1/2 -translate-x-1/2 w-[85%] h-[3px] rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>

            {/* Step 1 */}
            <div className="relative z-10">
              <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-extrabold shadow-[0_18px_36px_rgba(79,70,229,0.35)]">
                01
              </div>

              <h3 className="mt-6 sm:mt-8 md:mt-10 text-lg sm:text-xl font-semibold text-slate-900">
                Login / Sign Up
              </h3>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 max-w-xs mx-auto leading-relaxed">
                Securely access the ApnaVakil platform.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10">
              <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-extrabold shadow-[0_18px_36px_rgba(147,51,234,0.35)]">
                02
              </div>

              <h3 className="mt-6 sm:mt-8 md:mt-10 text-lg sm:text-xl font-semibold text-slate-900">
                Choose Legal Domain
              </h3>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 max-w-xs mx-auto leading-relaxed">
                Select the legal category relevant to your issue.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10">
              <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-extrabold shadow-[0_18px_36px_rgba(225,29,72,0.35)]">
                03
              </div>

              <h3 className="mt-6 sm:mt-8 md:mt-10 text-lg sm:text-xl font-semibold text-slate-900">
                Get AI Insights
              </h3>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 max-w-xs mx-auto leading-relaxed">
                Instantly understand legal information powered by AI.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= DEMO SECTION ================= */}
      <section id='demo' className="relative -mt-16 sm:-mt-24 md:-mt-32 pb-20 sm:pb-28 md:pb-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6">
            Experience ApnaVakil in Action
          </h2>

          <p className="max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 mb-10 sm:mb-16">
            A quick walkthrough showing how AI transforms complex legal
            information into clear insights.
          </p>

          <div className="relative max-w-5xl mx-auto rounded-2xl sm:rounded-[32px] p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
            <div className="relative rounded-2xl sm:rounded-[30px] bg-white/10 backdrop-blur overflow-hidden">

              <iframe
                className="w-full h-[200px] sm:h-[280px] md:h-[360px] lg:h-[480px]"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="ApnaVakil Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              <div className="absolute top-3 left-3 sm:top-6 sm:left-6 px-3 sm:px-4 py-1 rounded-full bg-white/90 text-slate-800 text-[10px] sm:text-xs font-semibold shadow">
                ▶ Product Demo
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR MISSION ================= */}
      <section id='mission' className="relative py-16 sm:py-24 md:py-36 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
        <div className="absolute -top-32 sm:-top-40 -left-32 sm:-left-40 h-72 sm:h-96 w-72 sm:w-96 bg-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 sm:-bottom-40 -right-32 sm:-right-40 h-72 sm:h-96 w-72 sm:w-96 bg-pink-300/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* LEFT CONTENT */}
            <div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 text-slate-900">
                Our Mission: Legal Clarity for All
              </h2>

              <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10">
                Navigating the legal world can be intimidating and expensive.
                <span className="font-semibold text-slate-800"> ApnaVakil </span>
                was founded on a simple principle: everyone deserves access to clear,
                reliable, and affordable legal information. We leverage the power of
                artificial intelligence to break down barriers.
              </p>

              <div className="space-y-5 sm:space-y-6">

                {/* Point 1 */}
                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <p className="text-sm sm:text-base text-slate-700">
                    <span className="font-semibold">Accessibility:</span> Making legal
                    help available to anyone, anywhere, at any time.
                  </p>
                </div>

                {/* Point 2 */}
                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <p className="text-sm sm:text-base text-slate-700">
                    <span className="font-semibold">Affordability:</span> Disrupting the
                    high cost of legal services with a transparent, low-cost model.
                  </p>
                </div>

                {/* Point 3 */}
                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <p className="text-sm sm:text-base text-slate-700">
                    <span className="font-semibold">Empowerment:</span> Giving you the
                    tools and knowledge to handle your legal matters confidently.
                  </p>
                </div>

              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative">

              <div className="
          rounded-2xl sm:rounded-3xl
          min-h-[240px] sm:min-h-[300px] md:h-[420px]
          bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600
          shadow-[0_40px_90px_rgba(59,130,246,0.45)]
          flex items-center justify-center text-center px-6
        ">
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  Trusted Guidance
                </h3>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 sm:-bottom-6 right-4 sm:right-6 bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg text-xs sm:text-sm font-semibold">
                OUR VISION
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id='contact' className="relative py-16 sm:py-24 md:py-36 overflow-hidden bg-slate-50">

        {/* Light Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"></div>
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 md:gap-16 items-center">

            {/* Left Content */}
            <div className="text-slate-900">

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6">
                Get in Touch
              </h2>

              <p className="text-sm sm:text-base text-slate-600 max-w-md mb-8 sm:mb-10">
                Have a question, feedback, or partnership idea?
                Reach out to ApnaVakil — our team will respond quickly.
              </p>

              <div className="space-y-5 sm:space-y-6 text-sm sm:text-base text-slate-700">

                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    📧
                  </span>
                  <a
                    href="mailto:apnavakilsupport@gmail.com"
                    target="_blank"
                    className="text-blue-600 underline break-all"
                  >
                    apnavakilsupport@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    📞
                  </span>
                  +91 8949841606
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    📍
                  </span>
                  <p className="text-sm sm:text-base">
                    Office Address : C/O Dhakar Samachar,P.N.5 ,Tatkaleswer Puri,Hida Ki Mori,Galta Road,Jaipur
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    📍
                  </span>
                  India
                </div>

              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">

              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-slate-900">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

                <input
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters long",
                    },
                  })}
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters long",
                    },
                  })}
                  rows="4"
                  placeholder="Your Message"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                >
                  Send Message
                </button>

              </form>

            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10 border-b border-slate-700 pb-10">
            {/* Branding */}
            <div className='col-span-2'>
              <h3 className="font-extrabold text-blue-400 text-2xl mb-3 tracking-wider">Apna Vakil</h3>
              <p className="text-slate-400 max-w-xs">Empowering millions with accessible, AI-driven legal clarity worldwide.</p>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <HashLink smooth to="/#Features" className="text-slate-400 hover:text-blue-400 transition">
                    Features
                  </HashLink>
                </li>

                <li>
                  <HashLink smooth to="/#demo" className="text-slate-400 hover:text-blue-400 transition">
                    Demo
                  </HashLink>
                </li>

                <li>
                  <HashLink smooth to="/#Home" className="text-slate-400 hover:text-blue-400 transition">
                    Home
                  </HashLink>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">
                Company
              </h4>

              <ul className="space-y-3">
                <li>
                  <HashLink smooth to="/#mission" className="text-slate-400 hover:text-blue-400 transition">
                    About Us
                  </HashLink>
                </li>

                <li>
                  <HashLink smooth to="/#contact" className="text-slate-400 hover:text-blue-400 transition">
                    Contact
                  </HashLink>
                </li>

                <li>
                  <HashLink smooth to="/#contact" className="text-slate-400 hover:text-blue-400 transition">
                    Administrators
                  </HashLink>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">
                Legal
              </h4>

              <ul className="space-y-3">
                <li>
                  <Link to="/terms-and-conditions" className="text-slate-400 hover:text-blue-400 transition">
                    Terms of Service
                  </Link>
                </li>

                <li>
                  <Link to="/privacy-policy" className="text-slate-400 hover:text-blue-400 transition">
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link to="/disclaimer" className="text-slate-400 hover:text-blue-400 transition">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Apna Vakil. All Rights Reserved. Not a substitute for licensed legal counsel.</p>
          </div>
        </div>
      </footer>
      {/* ===== FIXED CONTINUOUS MOVING DISCLAIMER ===== */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "70px",
          background: "#020617",
          color: "yellow",
          overflow: "hidden",
          zIndex: 99999,
          fontSize: "clamp(12px, 3vw, 20px)", // responsive font
          display: "flex",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            width: "max-content",
            whiteSpace: "nowrap",
            animation: "moveText 20s linear infinite"
          }}
        >
          <span style={{ paddingRight: "60px" }}>
            <b>
              ⚠️ Disclaimer: The information provided on the Apna Vakil website and through its services,
              including any content generated using automated or AI-powered tools, is intended solely for
              general informational purposes. Apna Vakil does not provide legal advice. Users are advised
              to consult a qualified and licensed legal practitioner before taking any legal action.
            </b>
          </span>

          <span style={{ paddingRight: "60px" }}>
            <b>
              ⚠️ Disclaimer: The information provided on the Apna Vakil website and through its services,
              including any content generated using automated or AI-powered tools, is intended solely for
              general informational purposes. Apna Vakil does not provide legal advice. Users are advised
              to consult a qualified and licensed legal practitioner before taking any legal action.
            </b>
          </span>
        </div>
      </div>

      <style>
        {`
@keyframes moveText {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
`}
      </style>

    </div>
  );
};

export default Home;