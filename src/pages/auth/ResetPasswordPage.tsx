import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LockIcon, EyeIcon, EyeOffIcon, Loader2Icon, CheckCircleIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const ResetPasswordPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get email from previous page (ForgotPasswordPage), or default to empty
    const initialEmail = location.state?.email || "";
    const initialMessage = location.state?.message || null;

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(initialMessage);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 4) {
            setError("Password must be at least 4 characters.");
            return;
        }

        if (otp.length !== 4) {
            setError("Please enter a valid 4-digit code.");
            return;
        }

        try {
            setIsLoading(true);
            await axiosInstance.patch("/users/password-reset-complete/", {
                email,
                otp,
                password,
                confirm_password: confirmPassword,
            });
            setSuccess(true);
            setMessage("Password reset successfully! You can now login.");
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            const backendMsg = err.response?.data?.error || "Failed to reset password. The code may be invalid or expired.";
            setError(backendMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6 py-12">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 text-center transition-all duration-300">
                    <div className="flex justify-center">
                        <CheckCircleIcon className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">All Set! 🎉</h2>
                    <p className="text-gray-600">Your password has been reset successfully.</p>
                    <Link
                        to="/login"
                        className="inline-block w-full py-2 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6 py-12">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-8 transition-all duration-300">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Enter Code 🔑</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We sent a code to your email. Enter it below to reset your password.
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded-md border-l-4 bg-red-50 border-red-500 text-red-700">
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {message && !success && (
                    <div className="p-3 rounded-md border-l-4 bg-green-50 border-green-500 text-green-700">
                        <p className="text-sm">{message}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email Field (Editable if needed, but usually strictly from previous step. Making it editable for flexibility) */}
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>

                    {/* OTP Field */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="4-Digit Verification Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-center tracking-widest font-mono text-lg"
                        />
                    </div>

                    <div className="relative">
                        <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="relative">
                        <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-indigo-400"
                    >
                        {isLoading ? (
                            <>
                                <Loader2Icon className="animate-spin h-5 w-5" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
