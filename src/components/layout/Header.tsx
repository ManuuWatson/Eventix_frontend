// src/components/layout/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SearchIcon, MenuIcon, XIcon, UserCircleIcon } from "lucide-react";

// Import logo from assets folder
import logo from "../../assets/EventTix_logo.jpeg"; // Correct filename

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    logout();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="EventTix Logo" className="h-10 w-auto mr-2" />
            <span className="text-2xl font-bold text-indigo-600">EventTix</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Events</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600">Contact</Link>
          </nav>

          {/* Desktop Search Bar */}
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

          {/* User Profile & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition duration-150"
                >
                  <UserCircleIcon className="h-8 w-8 text-indigo-600" />
                  <span className="text-gray-700">{user.full_name || user.email}</span>
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5"
                  >
                    <Link
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
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 hover:text-indigo-600">
                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex w-full mb-4">
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

            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-indigo-600" onClick={handleLinkClick}>Events</Link>
              <Link to="/about" className="text-gray-700 hover:text-indigo-600" onClick={handleLinkClick}>About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-indigo-600" onClick={handleLinkClick}>Contact</Link>

              {!user && (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600" onClick={handleLinkClick}>Login</Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 text-center" onClick={handleLinkClick}>Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
 