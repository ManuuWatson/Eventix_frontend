import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents, EventContextType } from '../../context/EventContext';
import {
  LayoutDashboardIcon,
  CalendarIcon,
  DollarSignIcon,
  SettingsIcon,
  PlusIcon,
  LogOutIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import HostEventForm from './HostEventForm';
import HostEventsList from './HostEventsList';
import HostSalesDashboard from './HostSalesDashboard';
import HostSettings from './HostSettings';

// ✅ SummaryCard component
const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="p-3 bg-indigo-100 rounded-full">{icon}</div>
  </div>
);

const HostDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { events } = useEvents() as EventContextType;
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Ensure events array is always valid
  const safeEvents = Array.isArray(events) ? events : [];

  // ✅ Filter events by host_id
  const hostEvents = safeEvents.filter(
    (event) => Number(event.host_id) === Number(user?.id)
  );

  // 🧠 Debugging logs
  console.log('🧑 Current User ID:', user?.id);
  console.log('🎟️ All Events:', safeEvents);
  console.log('✅ Host Events:', hostEvents);
  if (safeEvents.length > 0) {
    console.log('🔍 Example event host_id:', safeEvents[0].host_id);
  }

  // ✅ Summary calculations
  const totalEvents = hostEvents.length;
  const upcomingEvents = hostEvents.filter(
    (event) => new Date(event.date) > new Date()
  ).length;

  const totalTicketsAvailable = hostEvents.reduce(
    (acc, event) =>
      acc +
      (Array.isArray(event.ticket_types)
        ? event.ticket_types.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0)
        : 0),
    0
  );

  // 🧮 Placeholder for total tickets sold (to be updated when ticket purchases are implemented)
  const totalTicketsSold = 0;

  const totalRevenue = hostEvents.reduce(
    (acc, event) =>
      acc +
      (Array.isArray(event.ticket_types)
        ? event.ticket_types.reduce(
            (sum, ticket) => sum + ticket.price * (ticket.quantity || 0),
            0
          )
        : 0),
    0
  );

  const recentEvents = hostEvents.slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const NavLink = ({
    to,
    icon: Icon,
    children,
  }: {
    to: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-md transition duration-150 ease-in-out ${
        isActive(to) ? 'bg-indigo-900 shadow-md' : 'hover:bg-indigo-700'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
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
            Welcome, {user?.full_name || 'Host'}
          </p>
        </div>
        <nav className="space-y-1">
          <NavLink to="/host-dashboard" icon={LayoutDashboardIcon}>
            Dashboard
          </NavLink>
          <NavLink to="/host-dashboard/events" icon={CalendarIcon}>
            My Events
          </NavLink>
          <NavLink to="/host-dashboard/sales" icon={DollarSignIcon}>
            Sales & Revenue
          </NavLink>
          <NavLink to="/host-dashboard/settings" icon={SettingsIcon}>
            Settings
          </NavLink>
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
            <NavLink to="/host-dashboard" icon={LayoutDashboardIcon}>
              Dashboard
            </NavLink>
            <NavLink to="/host-dashboard/events" icon={CalendarIcon}>
              My Events
            </NavLink>
            <NavLink to="/host-dashboard/sales" icon={DollarSignIcon}>
              Sales & Revenue
            </NavLink>
            <NavLink to="/host-dashboard/settings" icon={SettingsIcon}>
              Settings
            </NavLink>
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

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route
            index
            element={
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                  <Link
                    to="events/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Event
                  </Link>
                </div>

                {/* ✅ Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <SummaryCard
                    title="Total Events"
                    value={totalEvents || 0}
                    icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />}
                  />
                  <SummaryCard
                    title="Upcoming Events"
                    value={upcomingEvents || 0}
                    icon={<LayoutDashboardIcon className="h-6 w-6 text-green-600" />}
                  />
                  <SummaryCard
                    title="Total Tickets Available"
                    value={totalTicketsAvailable || 0}
                    icon={<UsersIcon className="h-6 w-6 text-orange-600" />}
                  />
                  <SummaryCard
                    title="Total Tickets Sold"
                    value={totalTicketsSold}
                    icon={<UsersIcon className="h-6 w-6 text-red-600" />}
                  />
                  <SummaryCard
                    title="Total Revenue (Est.)"
                    value={`$${(totalRevenue || 0).toFixed(2)}`}
                    icon={<DollarSignIcon className="h-6 w-6 text-yellow-600" />}
                  />
                </div>

                {/* ✅ Recent Events */}
                <h2 className="text-lg font-semibold mb-4">Your Recent Events</h2>
                {recentEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentEvents.map((event) => (
                      <div
                        key={event.event_id} // ✅ fixed here
                        className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                      >
                        <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <CalendarIcon className="inline h-4 w-4 mr-2" />
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">{event.location}</p>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            event.status === 'Approved'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">You haven't created any events yet.</p>
                )}
              </>
            }
          />
          <Route path="events/new" element={<HostEventForm />} />
          <Route path="events/*" element={<HostEventsList />} />
          <Route path="sales" element={<HostSalesDashboard />} />
          <Route path="settings" element={<HostSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default HostDashboard;
