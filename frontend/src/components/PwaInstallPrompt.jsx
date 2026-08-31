import React, { useState, useEffect } from "react";
import { X, Download, ShieldCheck, Sparkles, Smartphone } from "lucide-react";
import { useStore } from "../zustand/store";

export default function PwaInstallPrompt() {
  const { theme } = useStore();
  const isDark = theme === "dark";

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone/PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      return;
    }

    // Check if user dismissed it in this session
    const isDismissed = sessionStorage.getItem("pwa_prompt_dismissed");
    if (isDismissed) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt event (Chromium, Android, Edge, Desktop Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If it's iOS or event hasn't fired yet after 3 seconds, show prompt anyway for installation guidance
    const timer = setTimeout(() => {
      if (!isStandalone && !sessionStorage.getItem("pwa_prompt_dismissed")) {
        setIsVisible(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback instruction
      alert("To install, tap your browser's menu (⋮) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 sm:p-5 rounded-3xl border shadow-2xl backdrop-blur-md relative transition-all ${
        isDark
          ? "bg-slate-900/95 border-slate-700/80 text-white shadow-black/70"
          : "bg-[#f0f6fc]/95 border-blue-300 text-blue-950 shadow-blue-950/20"
      }`}>

        {/* Dismiss Cross Button */}
        <button
          onClick={handleDismiss}
          className={`absolute top-3.5 right-3.5 p-1 rounded-xl transition cursor-pointer ${
            isDark
              ? "text-slate-400 hover:text-white hover:bg-slate-800"
              : "text-blue-900/60 hover:text-blue-950 hover:bg-[#dcebf6]"
          }`}
          aria-label="Close Install Prompt"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="relative shrink-0 mt-0.5">
            <img
              src="/logo.png"
              alt="Apna Vakil Logo"
              className="w-12 h-12 rounded-2xl object-contain p-1 bg-white border border-blue-200 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm sm:text-base tracking-tight text-blue-950 dark:text-white">
                Install Apna Vakil App
              </h3>
              <span className="px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-indigo-950/80 text-blue-800 dark:text-indigo-300 font-bold text-[9px]">
                PRO
              </span>
            </div>

            <p className="text-xs text-blue-900/70 dark:text-slate-300 font-semibold mt-0.5 leading-snug">
              Instant 1-tap legal consultation, live document drafting, and faster AI performance.
            </p>
          </div>
        </div>

        {/* iOS Install Instruction Modal or Expansion */}
        {showIOSGuide && (
          <div className="mt-3 p-2.5 rounded-xl bg-blue-100/60 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 text-xs text-blue-950 dark:text-slate-200 font-medium">
            <p>
              Tap the <strong>Share button</strong> in Safari, then scroll down and select <strong>"Add to Home Screen" 📲</strong>.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-blue-900/20 text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>

          <button
            onClick={handleDismiss}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
              isDark
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-blue-300 text-blue-950 hover:bg-[#dcebf6]"
            }`}
          >
            Maybe Later
          </button>
        </div>

      </div>
    </div>
  );
}
