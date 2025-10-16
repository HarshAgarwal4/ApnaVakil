import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        if (!otpSent) {
            setError("otp", { type: "manual", message: "Please send OTP first." });
            return;
        }

        try {
            let res = await axios.post("/fgtpwd", data);
            if (res.status === 200) {
                if (res.data.status === 0) toast.error("Error in resetting password");
                if (res.data.status === 7) toast.error("Invalid fields");
                if (res.data.status === 10) toast.error("Invalid OTP");
                if (res.data.status === 5) toast.error("user not found")
                if (res.data.status === 1) {
                    toast.success("Password reset successfully");
                    reset();
                    navigate("/login");
                }
            }
        } catch (err) {
            console.log(err);
            toast.error("Server error");
        }
    };

    // ✅ Send OTP handler
    const handleSendOtp = async () => {
        const email = getValues("email"); // <-- FIXED
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
        } catch (err) {
            console.log(err);
            toast.error("Server error");
        }
        setIsSendingOtp(false);
    };

    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-cover bg-center font-sans overflow-hidden"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80')",
            }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/70 to-purple-600/70"></div>

            {/* Card */}
            <div className="relative w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 z-10 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Reset Password 🔑</h2>
                <p className="text-sm text-gray-200 mb-6">
                    Enter your email, request OTP, and set a new password
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Email + Send OTP */}
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                            <span className="text-white">✉️</span>
                            <input
                                type="email"
                                placeholder="Email address"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                className="flex-1 bg-transparent outline-none text-white placeholder-gray-300"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp}
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition"
                        >
                            {isSendingOtp ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                    {errors.email && (
                        <p className="text-red-400 text-sm">{errors.email.message}</p>
                    )}

                    {/* OTP */}
                    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                        <span className="text-white">🔢</span>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            {...register("otp", { required: "OTP is required" })}
                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-300"
                        />
                    </div>
                    {errors.otp && (
                        <p className="text-red-400 text-sm">{errors.otp.message}</p>
                    )}

                    {/* New Password */}
                    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                        <span className="text-white">🔒</span>
                        <input
                            type="password"
                            placeholder="New Password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Min 6 characters required" },
                            })}
                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-300"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-400 text-sm">{errors.password.message}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!otpSent || isSubmitting}
                        className={`mt-2 py-3 rounded-lg font-semibold text-white transition ${otpSent
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
                                : "bg-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
