import React, { useContext , useEffect} from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import { toast } from 'react-toastify'
import { AppContext } from "../context/GlobalContext";

const LoginForm = () => {
  const { fetchUser, user } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user])

  const onSubmit = async (data) => {
    try {
      let res = await axios.post('/login', data);
      if (res.status === 200) {
        if (res.data.status === 5 || res.data.status === 9) return toast.error("Inavlid email or password")
        if (res.data.status === 0) return toast.error("Something went wrong")
        if (res.data.status === 7) return toast.error("All fields are required")
        if (res.data.status === 1) {
          {
            toast.success("Login successful")
            await fetchUser()
          }
        }
      };
    } catch (err) {
      toast.error("server error")
    }
  }

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
      <div className="relative w-[360px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 z-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back 👋</h2>
        <p className="text-sm text-gray-200 mb-6">Please login to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
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
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}

          {/* Password */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
            <span className="text-white">🔒</span>
            <input
              type="password"
              placeholder="Password"
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

          <div className="text-right">
            <Link
              to='/forget-password'
              className="text-xs text-indigo-300 hover:underline transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link to='/signup' className="text-indigo-300 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
