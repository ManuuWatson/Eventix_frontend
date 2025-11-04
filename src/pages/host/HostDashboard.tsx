import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
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

interface TicketType {
  price: number;
  quantity: number;
  name: string;
}

interface EventData {
  id: number;
  name: string;
  date: string;
  location: string;
  status: 'Approved' | 'Pending';
  poster?: string;
  host_id: number; // ✅ matches backend key
  ticket_types: TicketType[];
}

const HostDashboard = () => {
  const { user, logout } = useAuth();
  const { events } = useEvents() as unknown as { events: EventData[] };
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Fix: use host_id instead of hostId
  const hostEvents = events?.filter((event) => event.host_id === user?.id) || [];
  console.log("🧑 User data:", user);
console.log("🎟️ All events fetched:", events);

console.log("✅ Host-specific events:", hostEvents);
if (events.length > 0) {
  console.log("Example event object:", events[0]);
}


  const totalEvents = hostEvents.length;
  const upcomingEvents = hostEvents.filter(
    (event) => new Date(event.date) > new Date()
  ).length;

  const totalTicketsSold = hostEvents.reduce(
    (acc, event) =>
      acc +
      event.ticket_types.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0),
    0
  );

  const totalRevenue = hostEvents.reduce(
    (acc, event) =>
      acc +
      event.ticket_types.reduce(
        (sum, ticket) => sum + (ticket.price * (ticket.quantity || 0)),
        0
      ),
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
            Welcome, {user?.full_name}
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
        <button
          className="p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-indigo-800 text-white p-4 z-50">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
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

      {/* Main Content Area */}
      <div className="flex-1 p-6">
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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <SummaryCard
                    title="Total Events"
                    value={totalEvents}
                    icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />}
                  />
                  <SummaryCard
                    title="Upcoming Events"
                    value={upcomingEvents}
                    icon={<LayoutDashboardIcon className="h-6 w-6 text-green-600" />}
                  />
                  <SummaryCard
                    title="Total Tickets Sold"
                    value={totalTicketsSold}
                    icon={<UsersIcon className="h-6 w-6 text-orange-600" />}
                  />
                  <SummaryCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={<DollarSignIcon className="h-6 w-6 text-yellow-600" />}
                  />
                </div>

                {/* Recent Events */}
                <h2 className="text-lg font-semibold mb-4">Your Recent Events</h2>
                {recentEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                      >
                        <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                        <p className="text-gray-600 text-sm">{event.location}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p
                          className={`mt-2 text-sm font-medium ${
                            event.status === 'Approved'
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {event.status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    You haven’t created any events yet.
                  </p>
                )}
              </>
            }
          />
          <Route path="events/*" element={<HostEventsList />} />
          <Route path="events/new" element={<HostEventForm />} />
          <Route path="sales" element={<HostSalesDashboard />} />
          <Route path="settings" element={<HostSettings />} />
        </Routes>
      </div>
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className="bg-indigo-100 p-3 rounded-full">{icon}</div>
    <div className="ml-4">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

export default HostDashboard;
