import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
// import axiosInstance from "../../api/axiosInstance"; // Not needed here anymore if using context login
import { useAuth } from "../../context/AuthContext"; // ✅ Import useAuth

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false); // Use isLoading from context
  const navigate = useNavigate();
  const { login, isLoading } = useAuth(); // ✅ Destructure login and isLoading from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // setIsLoading(true); // Handled by context's internal state

    try {
      // ✅ Call the context's login function
      await login(email, password);

      // We removed navigation from the context, so we handle it here:
      // Read the user type from localStorage immediately after successful login
      const userType = localStorage.getItem('user_type') || (JSON.parse(localStorage.getItem('user') || '{}')).user_type;

      if (userType === "host") {
          navigate("/host-dashboard", { replace: true });
      } else if (userType === "user") {
          navigate("/user-dashboard", { replace: true });
      } else {
          // Fallback if user type isn't clear
          navigate("/", { replace: true });
      }


    } catch (err: any) {
      console.error("Login error:", err);
      // The context login function throws an error object
      setError(err.message || "Invalid email or password.");
    } 
    // finally {
    //   setIsLoading(false); // Handled by context's internal state
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your{" "}
            <span className="text-indigo-600 font-semibold">EventTix</span> account
          </p>
        </div>

        {(error || useAuth().error) && ( // Check local error or context error
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md text-sm text-red-700">
            {error || useAuth().error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <MailIcon className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <LockIcon className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full py-2 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
