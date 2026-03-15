import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { useStore } from "../zustand/store";

const SignupForm = () => {
  const { user } = useStore();
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

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

  const onSubmit = async (data) => {
    if (!otpSent) {
      setError("otp", { type: "manual", message: "Please send OTP first." });
      return;
    }

    try {
      let res = await axios.post("/register", data);

      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Error in creating user");
        if (res.data.status === 6) toast.error("Email already exists");
        if (res.data.status === 7) toast.error("Invalid fields");
        if (res.data.status === 10) toast.error("Invalid OTP");

        if (res.data.status === 1) {
          toast.success("User created successfully");
          reset();
          navigate("/login");
        }
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("email", { type: "manual", message: "Enter email first." });
      return;
    }

    setIsSendingOtp(true);

    try {
      let res = await axios.post("/sendotp", { email });

      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Error in sending OTP");
        if (res.data.status === 7) toast.error("Invalid fields");

        if (res.data.status === 1) {
          toast.success("OTP sent successfully");
          setOtpSent(true);
          clearErrors("email");
        }
      }
    } catch {
      toast.error("Server error");
    }

    setIsSendingOtp(false);
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 bg-cover bg-center font-sans overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/70 to-purple-600/70"></div>

      {/* Card */}
      <div className="relative w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 z-10 text-center">

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Create Account ✨
        </h2>

        <p className="text-sm text-gray-200 mb-6">
          Please fill in the details
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
            <span className="text-white">👤</span>

            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Full name is required" })}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-sm sm:text-base"
            />
          </div>

          {errors.name && (
            <p className="text-red-400 text-sm">{errors.name.message}</p>
          )}

          {/* Email + OTP */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">

            <span className="text-white">✉️</span>

            <input
              type="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-sm sm:text-base"
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className={`text-xs px-3 py-1 rounded-md text-white transition
                ${
                  isSendingOtp
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 to-orange-400 hover:opacity-90"
                }`}
            >
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>

          </div>

          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}

          {/* OTP */}
          {otpSent && (
            <div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">

                <span className="text-white">📩</span>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 4,
                      message: "OTP must be at least 4 digits",
                    },
                  })}
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-sm sm:text-base"
                />

              </div>

              {errors.otp && (
                <p className="text-red-400 text-sm">{errors.otp.message}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">

            <span className="text-white">🔒</span>

            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-sm sm:text-base"
            />

          </div>

          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 py-3 rounded-lg font-semibold text-white transition
              ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
              }`}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        {/* Footer */}
        <p className="mt-5 text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-300 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignupForm;