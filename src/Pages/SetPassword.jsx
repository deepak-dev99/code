import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Urls from "../config/urls";
import http from "../lib/http";

export default function SetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const navigate = useNavigate();
  const password = watch("password");
  const { id } = useParams();

  const setPasswordMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        userid: id,
      };
      return http.post(`${Urls.baseURL}${Urls.setpassword}`, payload);
    },
    onSuccess: () => {
      toast.success("Password set successfully!");
      navigate("/auth/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to set password.");
    },
  });

  const onSubmit = (data) => {
    setPasswordMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-lg font-bold mb-4">Set Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            className={`mt-1 block w-full p-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className={`mt-1 block w-full p-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={setPasswordMutation.isLoading}
          >
            {setPasswordMutation.isLoading ? "Setting Password..." : "Set Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
