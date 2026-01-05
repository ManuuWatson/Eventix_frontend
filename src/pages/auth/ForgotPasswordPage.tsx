import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, Loader2Icon, ArrowLeftIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        try {
            await axiosInstance.post("/users/request-reset-email/", { email });
            // Navigate to ResetPasswordPage, passing email in state
            navigate("/reset-password", { state: { email, message: "Code sent! Please check your email." } });
        } catch (err: any) {
            setError("Failed to send reset code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6 py-12">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-8 transition-all duration-300">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password? 🔒</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {message && (
                    <div className="p-3 rounded-md border-l-4 bg-green-50 border-green-500 text-green-700">
                        <p className="text-sm">{message}</p>
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded-md border-l-4 bg-red-50 border-red-500 text-red-700">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                Sending...
                            </>
                        ) : (
                            "Send Code"
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        <ArrowLeftIcon className="h-4 w-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
