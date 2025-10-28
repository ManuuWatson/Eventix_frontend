import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect happens automatically inside AuthContext
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your{' '}
            <span className="text-indigo-600 font-semibold">EventTix</span> account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <MailIcon className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type="email"
              id="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <LockIcon className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
