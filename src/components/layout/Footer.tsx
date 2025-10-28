import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🎟️ EventTix</h3>
            <p className="text-gray-400">
              The best platform for event ticket booking and management.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Organizers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link to="/host" className="text-gray-400 hover:text-white">
                  Host Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-white">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <LinkedinIcon className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-400">
              Subscribe to our newsletter for updates
            </p>
            <form className="mt-2">
              <div className="flex">
                <input type="email" placeholder="Your email" className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" />
                <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-r-md hover:bg-indigo-700">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} EventTix. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;