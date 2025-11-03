import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SearchIcon, MenuIcon, XIcon, UserCircleIcon } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = encodeURIComponent(searchQuery.trim());
    navigate(q ? `/?search=${q}` : '/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">🎟️ EventTix</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600"> Events </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600"> About </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600"> Contact </Link>
          </nav>
          {/* Search Bar */}
          <div className="hidden md:flex flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative flex w-full">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search events..." className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search events" />
            </form>
          </div>
          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Button toggles dropdown on click */}
                <button type="button" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600" onClick={() => setIsDropdownOpen((prev) => !prev)} >
                  <UserCircleIcon className="h-6 w-6" />
                  <span>{user.name}</span>
                </button>
                {/* Dropdown (click-to-open) */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {user.user_type === 'host' && (
                      <Link 
                        to="/host-dashboard" // <-- Fixed path
                        className="block px-4 py-2 text-gray-700 hover:bg-indigo-100" 
                        onClick={() => setIsDropdownOpen(false)}
                      > 
                        Host Dashboard 
                      </Link>
                    )}
                    {/* Removed admin link */}
                    <button type="button" onClick={() => { logout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100" > Logout </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600"> Login </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700" > Register </Link>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button type="button" className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" >
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <form onSubmit={handleSearch} className="mb-4">
              <input type="text" placeholder="Search events..." className="w-full py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search events mobile" />
            </form>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 py-2"> Events </Link>
              <Link to="/about" className="text-gray-700 hover:text-indigo-600 py-2"> About </Link>
              <Link to="/contact" className="text-gray-700 hover:text-indigo-600 py-2"> Contact </Link>
              {user ? (
                <>
                  {user.user_type === 'host' && (
                    <Link 
                      to="/host-dashboard" // <-- Fixed path
                      className="text-gray-700 hover:text-indigo-600 py-2"
                    > 
                      Host Dashboard 
                    </Link>
                  )}
                  {/* Removed admin link */}
                  <button type="button" onClick={logout} className="text-left text-gray-700 hover:text-indigo-600 py-2" > Logout </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600 py-2"> Login </Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center" > Register </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
