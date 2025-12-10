// src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
  const { login } = useAuth(); // ✅ use context
  const navigate = useNavigate();
  const location = useLocation();

  // Capture ?next=/checkout/123
  const nextUrl = new URLSearchParams(location.search).get("next");
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  const redirectMessage = (location.state as any)?.message;

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.email || !form.password) {
      setFormError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        "https://eventix-backend2.onrender.com/api/users/login/",
        {
          email: form.email.trim(),
          password: form.password.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        const { user: loggedUser, token } = response.data;

        // ✅ Store in context only
        login(loggedUser, token);

        // clear form
        setForm({ email: "", password: "" });

        // Redirect priority: next URL > from > dashboard
        navigate(nextUrl || from || "/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      const backendError =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Login failed. Check your credentials or internet connection.";
      setFormError(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-8 transition-all duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back 👋</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to={`/register${nextUrl ? `?next=${encodeURIComponent(nextUrl)}&role=user` : ''}`}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>

        {redirectMessage && (
          <div className="p-3 rounded-md border-l-4 bg-blue-50 border-blue-500 text-blue-700">
            <p className="text-sm">{redirectMessage}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {formError && (
            <div className="p-3 rounded-md border-l-4 bg-red-50 border-red-500 text-red-700">
              <p className="text-sm">{formError}</p>
            </div>
          )}

          <div className="relative">
            <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div className="relative">
            <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="animate-spin h-5 w-5" />
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
