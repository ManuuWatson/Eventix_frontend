import React, { useState } from 'react';
// ✅ Added Navigate to imports
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import {
  LayoutDashboardIcon,
  CalendarIcon,
  UsersIcon,
  DollarSignIcon,
  SettingsIcon,
  PlusIcon,
  LogOutIcon,
  MenuIcon, 
  XIcon 
} from 'lucide-react';
import HostEventForm from './HostEventForm'; 
import HostEventsList from './HostEventsList';
import HostSalesDashboard from './HostSalesDashboard';
import HostSettings from './HostSettings';

// ✅ Updated the EventData interface to include hostId
interface EventData {
  id: number;
  name: string;
  date: string;
  location: string;
  is_approved: boolean;
  poster?: string;
  hostId?: string | number; // Added hostId to the interface
}

const HostDashboard = () => {
  const { user, logout } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  // Filter events by current host
  // This line should now work without TypeScript errors
  const hostEvents = events.filter((event) => event.hostId === user?.id);
  
  const totalEvents = hostEvents.length;
  const upcomingEvents = hostEvents.filter(
    (event) => new Date(event.date) > new Date(),
  ).length;
  const totalTicketsSold = 150; 
  const totalRevenue = 7500; 

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Define NavLink component for cleaner sidebar code
  const NavLink = ({ to, icon: Icon, children }: { to: string, icon: React.ElementType, children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-md transition duration-150 ease-in-out ${
        isActive(to) ? 'bg-indigo-900 shadow-md' : 'hover:bg-indigo-700'
      }`}
      onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on click
    >
      <Icon className="h-5 w-5 mr-3" />
      {children}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-indigo-800 text-white min-h-screen p-4 hidden md:block">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Host Dashboard</h2>
          <p className="text-indigo-200 text-sm mt-1">
            Welcome, {user?.name}
          </p>
        </div>
        <nav className="space-y-1">
          <NavLink to="/host-dashboard" icon={LayoutDashboardIcon}>Dashboard</NavLink>
          <NavLink to="/host-dashboard/events" icon={CalendarIcon}>My Events</NavLink>
          <NavLink to="/host-dashboard/sales" icon={DollarSignIcon}>Sales & Revenue</NavLink>
          <NavLink to="/host-dashboard/settings" icon={SettingsIcon}>Settings</NavLink>
          
          <button
            className="flex items-center px-4 py-3 rounded-md hover:bg-indigo-700 w-full text-left transition duration-150 ease-in-out mt-4"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-800 text-white w-full p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Host Dashboard</h2>
        <button className="p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-indigo-800 text-white p-4 z-50">
           <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button className="p-2" onClick={() => setIsMobileMenuOpen(false)}>
                <XIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-1">
            <NavLink to="/host-dashboard" icon={LayoutDashboardIcon}>Dashboard</NavLink>
            <NavLink to="/host-dashboard/events" icon={CalendarIcon}>My Events</NavLink>
            <NavLink to="/host-dashboard/sales" icon={DollarSignIcon}>Sales & Revenue</NavLink>
            <NavLink to="/host-dashboard/settings" icon={SettingsIcon}>Settings</NavLink>
             <button
              className="flex items-center px-4 py-3 rounded-md hover:bg-indigo-700 w-full text-left transition duration-150 ease-in-out mt-4"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="p-6">
          {/* NESTED ROUTES are handled here */}
          <Routes>
            <Route
              index // Matches the parent path: /host-dashboard
              element={
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                    <Link
                      to="/host-dashboard/events/new" 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create Event
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-3 rounded-full">
                            <CalendarIcon className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-gray-500 text-sm">
                              Total Events
                            </h3>
                            <p className="text-2xl font-semibold">
                              {totalEvents}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-3 rounded-full">
                            <CalendarIcon className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-gray-500 text-sm">
                              Upcoming Events
                            </h3>
                            <p className="text-2xl font-semibold">
                              {upcomingEvents}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <UsersIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-gray-500 text-sm">
                              Tickets Sold
                            </h3>
                            <p className="text-2xl font-semibold">
                              {totalTicketsSold}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                          <div className="bg-yellow-100 p-3 rounded-full">
                            <DollarSignIcon className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-gray-500 text-sm">
                              Total Revenue
                            </h3>
                            <p className="text-2xl font-semibold">
                              ${totalRevenue}
                            </p>
                          </div>
                        </div>
                      </div>
                  </div>
                  {/* You can add a recent events list here if you like */}
                </>
              }
            />
            
            {/* These routes match paths relative to /host-dashboard */}
            <Route path="events" element={<HostEventsList />} />
            <Route path="events/new" element={<HostEventForm />} />
            <Route path="sales" element={<HostSalesDashboard />} />
            <Route path="settings" element={<HostSettings />} />
            
            {/* Fallback for any other path within the dashboard */}
            <Route path="*" element={<Navigate to="/host-dashboard" replace />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
