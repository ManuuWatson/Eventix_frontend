// src/components/layout/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SearchIcon, MenuIcon, XIcon, UserCircleIcon } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // console.log("🔄 Header rendered");
  // console.log("👤 Current user:", user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = encodeURIComponent(searchQuery.trim());
    navigate(q ? `/?search=${q}` : "/");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    // console.log("🚪 Logging out user:", user);
    logout();
    setIsDropdownOpen(false);
    navigate("/", { replace: true });
  };

  // Removed handleDashboardClick function entirely.
  // We will use a declarative Link component instead.

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">🎟️ EventTix</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600"> Events </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600"> About </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600"> Contact </Link>
          </nav>

          <div className="hidden md:flex flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                placeholder="Search events..."
                className="p-2 border border-gray-300 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700">
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition duration-150"
                >
                  <UserCircleIcon className="h-8 w-8 text-indigo-600" />
                  <span className="hidden sm:inline text-gray-700">{user.full_name || user.email}</span>
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5"
                  >
                    {/* Use Link component for dashboard navigation */}
                    <Link
                        // This link goes to the generic /dashboard route, which uses RedirectBasedOnRole
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600"> Login </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150"> Sign Up </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu toggle button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 hover:text-indigo-600">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (omitted for brevity, assume it uses Links correctly) */}
      {/* ... */}
    </header>
  );
};

export default Header;
