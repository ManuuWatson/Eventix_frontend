import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const forcedRole = searchParams.get("role") as "user" | "host" | null;
  const nextUrl = searchParams.get("next");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_type: (forcedRole || "") as "user" | "host" | "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!form.user_type) {
      setFormError("Please select your account type (User or Host).");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosInstance.post("/users/register/", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        user_type: form.user_type,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage("🎉 Registration successful! Logging you in...");

        // Auto-login
        try {
          const loginResp = await axiosInstance.post("/users/login/", {
            email: form.email,
            password: form.password
          });

          if (loginResp.data.token) {
            login(loginResp.data.user, loginResp.data.token);
            // Redirect immediately to checkout (nextUrl) or dashboard
            setTimeout(() => navigate(nextUrl || "/dashboard"), 1000);
            return;
          }
        } catch (loginErr) {
          console.error("Auto-login failed:", loginErr);
          // Fallback to manual login if auto-login fails
          setTimeout(() => navigate(`/login${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ''}`), 2000);
        }
      } else {
        setFormError("Unexpected response from server. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);


      const backendError =
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.user_type?.[0] ||
        error.response?.data?.detail ||
        "Registration failed. Please check your input and try again.";

      setFormError(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {(formError || successMessage) && (
            <div
              className={`p-3 rounded-md border-l-4 ${formError
                ? "bg-red-50 border-red-500 text-red-700"
                : "bg-green-50 border-green-500 text-green-700"
                }`}
            >
              <p className="text-sm">{formError || successMessage}</p>
            </div>
          )}

          {/* Full Name */}
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Full Name"
              required
              value={form.full_name}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Account Type - Hidden if forced */}
          {!forcedRole && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Select your account type:</p>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="user_type"
                    value="user"
                    checked={form.user_type === "user"}
                    onChange={handleChange}
                    className="text-indigo-600"
                  />
                  <span>User (Ticket Buyer)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="user_type"
                    value="host"
                    checked={form.user_type === "host"}
                    onChange={handleChange}
                    className="text-indigo-600"
                  />
                  <span>Event Host</span>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
