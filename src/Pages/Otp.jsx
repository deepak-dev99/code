import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import Urls from "@/config/urls";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

export default function Otp() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get("email") || "";
    const otpFromQuery = params.get("otp") || "";
    const [otp, setOtp] = useState(otpFromQuery);
    const email = location.state?.email || emailFromQuery;
    const dispatch = useDispatch();

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${Urls.baseURL}${Urls.verify}`, { 
                otp,  
            });
            const { user, access_token, refresh_token } = response.data.data;            
            localStorage.setItem("authData", JSON.stringify({
                user,
                access_token,
                refresh_token  
            }));
            dispatch(login({ 
                user, 
                access_token, 
                refresh_token: refresh_token || null 
            }));
            
            toast.success("OTP verified successfully!");
            
            navigate("/app/dashboard", { 
                state: { otp },
                replace: true 
            });

        } catch (error) {
            console.error("OTP Verification Error:", error);
            toast.error(error.response?.data?.message || "Failed to verify OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await axios.post(`${Urls.baseURL}/api/forgot-password`, { email });
            toast.success("New OTP sent successfully!");
        } catch (error) {
            console.error("Resend OTP Error:", error);
            toast.error(error.response?.data?.message || "Failed to send new OTP. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                    <div className="bg-blue-600 px-6 py-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Verify OTP
                        </h2>
                        <p className="mt-2 text-blue-100">
                            Enter the 6-digit code sent to{" "}
                            <span className="font-medium text-white">{email}</span>
                        </p>
                    </div>

                    <div className="px-6 py-8">
                        {/* OTP Input using ShadCN UI */}
                        <div className="flex flex-col items-center space-y-6">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => {
                                    if (/^\d*$/.test(value) && value.length <= 6) setOtp(value);
                                }}
                                className="gap-2 sm:gap-4"
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot
                                        index={0}
                                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                    />
                                    <InputOTPSlot
                                        index={1}
                                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                    />
                                    <InputOTPSlot
                                        index={2}
                                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                    />
                                    <InputOTPSlot
                                        index={3}
                                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                    />
                                    <InputOTPSlot
                                        index={4}
                                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                    />
                                    <InputOTPSlot
                                        index={5}
                                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                    />
                                </InputOTPGroup>
                            </InputOTP>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading || otp.length !== 6}
                                className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:hover:bg-blue-400"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="h-5 w-5 animate-spin"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    "Verify OTP"
                                )}
                            </button>
                        </div>

                        {/* Resend OTP */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="text-sm font-medium text-blue-600 transition hover:text-blue-700 focus:outline-none focus:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Didn&lsquo;t receive a code? Resend OTP
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">
                    Having trouble? Contact our support team
                </div>
            </div>
        </div>
    );
}