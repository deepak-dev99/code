import React from "react";
import { useForm } from "react-hook-form";
import http from "../lib/http";
import { useMutation } from "@tanstack/react-query";
import Urls from "../config/urls";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: (data) => http.post(Urls.signin, data),
    onSuccess: (res, variables) => {      
      const { email, role, access_token } = res?.data;

      localStorage.setItem("authData", JSON.stringify({
        user: { email, role },
        access_token,
      }));

      dispatch(login({ user: { email, role }, access_token }));
      navigate('/app/dashboard');
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 bg-slate-800 shadow-2xl rounded-xl border border-slate-700">
        {/* Logo section */}
        <div className="flex justify-center mb-6">
          <img 
            src="/download.png" 
            alt="Company Logo"
            className="h-16 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        <h2 className="text-2xl font-semibold text-center text-slate-100 mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
         
          {loginMutation.error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg backdrop-blur-sm">
              {loginMutation.error.message || "Login failed. Please try again."}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 text-slate-300 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-100 placeholder-slate-400 transition-all duration-200 ${
                errors.email 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-slate-600 hover:border-slate-500"
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block mb-2 text-slate-300 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-100 placeholder-slate-400 transition-all duration-200 ${
                errors.password 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-slate-600 hover:border-slate-500"
              }`}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <a
              href="/forgot-password"
              className="text-sm text-orange-400 hover:text-orange-300 hover:underline focus:outline-none transition-colors duration-200"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full px-4 py-3 text-white font-semibold bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loginMutation.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-orange-400 hover:text-orange-300 hover:underline focus:outline-none transition-colors duration-200 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;