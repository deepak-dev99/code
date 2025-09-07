import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Urls from "../config/urls";
import http from "../lib/http";

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: (data) => http.post(Urls.signup, data),
    onSuccess: (data) => {
      navigate("/auth/login");
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
   

        <form
          onSubmit={handleSubmit((data) => signUpMutation.mutate(data))}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              {...register("full_name", { required: "Name is required" })}
              placeholder="Enter your full full_name"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.full_name ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.full_name && (
              <p className="mt-2 text-sm text-red-600">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full px-4 py-3 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signUpMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:text-blue-500 font-medium hover:underline focus:outline-none transition duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;