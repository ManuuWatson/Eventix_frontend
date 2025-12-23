import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import UserTickets from './UserTickets';
import UserEvents from './UserEvents';
import UserLikedEvents from './UserLikedEvents';
import { CalendarIcon, TicketIcon, SettingsIcon, LogOutIcon, MenuIcon, XIcon, HeartIcon } from 'lucide-react';

// Summary Card Component
const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between transition-all hover:shadow-lg">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="p-3 bg-indigo-100 rounded-full">{icon}</div>
  </div>
);

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ upcomingEvents: 0, tickets: 0, likedEvents: 0 });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const NavLink = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-md text-sm md:text-base transition duration-150 ease-in-out ${isActive(to) ? 'bg-indigo-900 shadow-md' : 'hover:bg-indigo-700'
        }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon className="h-5 w-5 mr-3" />
      {children}
    </Link>
  );

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/users/dashboard/');
        const data = res.data;
        setStats({
          upcomingEvents: data.upcoming_events || 0,
          tickets: data.tickets || 0,
          likedEvents: data.liked_events || 0,
        });
        setRecentEvents(data.recent_events || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-800 text-white min-h-screen p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">User Dashboard</h2>
          <p className="text-indigo-200 text-sm mt-1">Welcome back!</p>
        </div>
        <nav className="space-y-1 flex-1">
          <NavLink to="/user/dashboard" icon={CalendarIcon}>Dashboard</NavLink>
          <NavLink to="/user/dashboard/events" icon={CalendarIcon}>My Events</NavLink>
          <NavLink to="/user/dashboard/tickets" icon={TicketIcon}>Tickets</NavLink>
          <NavLink to="/user/dashboard/liked" icon={HeartIcon}>Liked Events</NavLink>
          <NavLink to="/user/dashboard/settings" icon={SettingsIcon}>Settings</NavLink>
        </nav>
        <button
          className="flex items-center px-4 py-3 rounded-md hover:bg-indigo-700 text-left transition duration-150 ease-in-out mt-4"
          onClick={handleLogout}
        >
          <LogOutIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-800 text-white w-full p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">User Dashboard</h2>
        <button className="p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-indigo-800 text-white p-6 z-50 overflow-y-auto">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button className="p-2" onClick={() => setIsMobileMenuOpen(false)}>
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-1">
            <NavLink to="/user/dashboard" icon={CalendarIcon}>Dashboard</NavLink>
            <NavLink to="/user/dashboard/events" icon={CalendarIcon}>My Events</NavLink>
            <NavLink to="/user/dashboard/tickets" icon={TicketIcon}>Tickets</NavLink>
            <NavLink to="/user/dashboard/liked" icon={HeartIcon}>Liked Events</NavLink>
            <NavLink to="/user/dashboard/settings" icon={SettingsIcon}>Settings</NavLink>
            <button
              className="flex items-center px-4 py-3 rounded-md hover:bg-indigo-700 w-full text-left mt-4"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Routes>
          <Route
            index
            element={
              <>
                <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                  <SummaryCard
                    title="Upcoming Events"
                    value={stats.upcomingEvents}
                    icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />}
                  />
                  <SummaryCard
                    title="Tickets Purchased"
                    value={stats.tickets}
                    icon={<TicketIcon className="h-6 w-6 text-green-600" />}
                  />
                  <SummaryCard
                    title="Liked Events"
                    value={stats.likedEvents}
                    icon={<HeartIcon className="h-6 w-6 text-red-600" />}
                  />
                </div>

                {/* Recent Events */}
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                {recentEvents.length === 0 ? (
                  <p className="text-gray-500">You haven’t interacted with any events yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {recentEvents.map((event: any) => (
                      <div key={event.event_id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                          <CalendarIcon className="inline h-4 w-4 mr-2" /> {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">{event.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            }
          />
          {/* Other user routes */}
          <Route path="tickets" element={<UserTickets />} />
          <Route path="events" element={<UserEvents />} />
          <Route path="liked" element={<UserLikedEvents />} />
          <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboard;
