import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MailIcon,
    LockIcon,
    EyeIcon,
    EyeOffIcon,
    Loader2Icon,
    UserIcon,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const CheckoutAuthPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Mode: 'login' or 'register'
    const [authMode, setAuthMode] = useState<"login" | "register">("login");

    // Get next URL
    const nextUrl = new URLSearchParams(location.search).get("next");
    const from = (location.state as any)?.from?.pathname || "/dashboard";

    // Form State
    const [form, setForm] = useState({
        full_name: "", // register only
        email: "",
        password: "",
        confirmPassword: "", // register only
        user_type: "user" as "user" | "host", // register only (default to ticket buyer for checkout flow usually, but let's keep it flexible)
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!form.email || !form.password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.post(
                "/users/login/",
                {
                    email: form.email.trim(),
                    password: form.password.trim(),
                }
            );

            if (response.status === 200 || response.status === 201) {
                const { user: loggedUser, token } = response.data;
                login(loggedUser, token);
                // Redirect to next URL (checkout) or fallback
                navigate(nextUrl || from, { replace: true });
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            const backendError =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Login failed. Please check your credentials.";
            setError(backendError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        // Basic validation
        if (!form.full_name || !form.email || !form.password || !form.confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.post(
                "/users/register/",
                {
                    full_name: form.full_name,
                    email: form.email,
                    password: form.password,
                    user_type: form.user_type,
                }
            );

            if (response.status === 201 || response.status === 200) {
                setSuccessMsg("🎉 Account created! Please sign in.");
                // Switch to login mode automatically
                setAuthMode("login");
                // Clear password fields logic if needed, but keeping email is nice
                setForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
            }
        } catch (err: any) {
            console.error("Registration failed:", err);
            const backendError =
                err.response?.data?.email?.[0] ||
                err.response?.data?.password?.[0] ||
                err.response?.data?.detail ||
                "Registration failed. Please try again.";
            setError(backendError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">

                {/* Header Toggle */}
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                        {authMode === "login" ? "Sign in to checkout" : "Create an account"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {authMode === "login" ? "New to Eventix? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setAuthMode(authMode === "login" ? "register" : "login");
                                setError(null);
                                setSuccessMsg(null);
                            }}
                            className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                        >
                            {authMode === "login" ? "Create an account" : "Sign in"}
                        </button>
                    </p>
                </div>

                {/* Feedback Messages */}
                {(error || successMsg) && (
                    <div
                        className={`p-4 rounded-md text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                            }`}
                    >
                        {error || successMsg}
                    </div>
                )}

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={authMode === "login" ? handleLogin : handleRegister}>
                    <div className="rounded-md shadow-sm -space-y-px">

                        {/* Register Fields */}
                        {authMode === "register" && (
                            <div className="mb-4">
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        name="full_name"
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                                        placeholder="Full Name"
                                        value={form.full_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Common Fields */}
                        <div className={`relative ${authMode === "register" ? "mb-4" : "mb-4"}`}>
                            <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10`}
                                placeholder="Email address"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative mb-4">
                            <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10 pr-10"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>

                        {authMode === "register" && (
                            <div className="relative mb-4">
                                <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                                    placeholder="Confirm Password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* User Type Selection for Register */}
                        {authMode === "register" && (
                            <div className="mt-4 flex items-center justify-between px-2">
                                <span className="text-sm text-gray-600">I am a:</span>
                                <div className="flex items-center space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio text-indigo-600"
                                            name="user_type"
                                            value="user"
                                            checked={form.user_type === "user"}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">User</span>
                                    </label>
                                    {/* Optional: Limit host registration here if desired, but user requested 'sign up' generally */}
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio text-indigo-600"
                                            name="user_type"
                                            value="host"
                                            checked={form.user_type === "host"}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Host</span>
                                    </label>
                                </div>
                            </div>
                        )}

                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2Icon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    {authMode === "login" ? "Signing in..." : "Creating account..."}
                                </>
                            ) : (
                                authMode === "login" ? "Sign in" : "Create Account"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutAuthPage;
