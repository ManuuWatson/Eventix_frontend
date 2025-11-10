import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEvents, EventContextType } from "../../context/EventContext";
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
} from "lucide-react";
import HostEventForm from "./HostEventForm";
import HostEventsList from "./HostEventsList";
import HostSalesDashboard from "./HostSalesDashboard";
import HostSettings from "./HostSettings";

// ✅ SummaryCard Component
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

const HostDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { events, fetchEvents } = useEvents() as EventContextType;
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Ensure valid events
  const safeEvents = Array.isArray(events) ? events : [];
  const hostEvents = safeEvents.filter((event) => Number(event.host_id) === Number(user?.id));

  // ✅ Dashboard summaries
  const totalEvents = hostEvents.length;
  const upcomingEvents = hostEvents.filter((event) => new Date(event.date) > new Date()).length;

  const totalTicketsAvailable = hostEvents.reduce(
    (acc, event) =>
      acc +
      (Array.isArray(event.ticket_types)
        ? event.ticket_types.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0)
        : 0),
    0
  );

  const totalTicketsSold = hostEvents.reduce(
    (acc, event) =>
      acc +
      (Array.isArray(event.ticket_types)
        ? event.ticket_types.reduce((sum, ticket) => sum + (ticket.sold || 0), 0)
        : 0),
    0
  );

  const totalRevenue = hostEvents.reduce(
    (acc, event) =>
      acc +
      (Array.isArray(event.ticket_types)
        ? event.ticket_types.reduce(
            (sum, ticket) => sum + ticket.price * (ticket.sold || ticket.quantity || 0),
            0
          )
        : 0),
    0
  );

  const recentEvents = hostEvents.slice(0, 4);

  // ✅ Refetch events when dashboard mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
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
      className={`flex items-center px-4 py-3 rounded-md text-sm md:text-base transition duration-150 ease-in-out ${
        isActive(to) ? "bg-indigo-900 shadow-md" : "hover:bg-indigo-700"
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon className="h-5 w-5 mr-3" />
      {children}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-800 text-white min-h-screen p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Host Dashboard</h2>
          <p className="text-indigo-200 text-sm mt-1">Welcome, {user?.full_name || "Host"}</p>
        </div>
        <nav className="space-y-1 flex-1">
          <NavLink to="/host/dashboard" icon={LayoutDashboardIcon}>
            Dashboard
          </NavLink>
          <NavLink to="/host/dashboard/events" icon={CalendarIcon}>
            My Events
          </NavLink>
          <NavLink to="/host/dashboard/sales" icon={DollarSignIcon}>
            Sales & Revenue
          </NavLink>
          <NavLink to="/host/dashboard/settings" icon={SettingsIcon}>
            Settings
          </NavLink>
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
        <h2 className="text-lg font-bold">Host Dashboard</h2>
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
            <NavLink to="/host/dashboard" icon={LayoutDashboardIcon}>
              Dashboard
            </NavLink>
            <NavLink to="/host/dashboard/events" icon={CalendarIcon}>
              My Events
            </NavLink>
            <NavLink to="/host/dashboard/sales" icon={DollarSignIcon}>
              Sales & Revenue
            </NavLink>
            <NavLink to="/host/dashboard/settings" icon={SettingsIcon}>
              Settings
            </NavLink>
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
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                  <h1 className="text-2xl font-bold text-center sm:text-left">Dashboard Overview</h1>
                  <Link
                    to="events/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-indigo-700 w-full sm:w-auto"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Event
                  </Link>
                </div>

                {/* ✅ Responsive Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
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
                    title="Tickets Available"
                    value={totalTicketsAvailable || 0}
                    icon={<UsersIcon className="h-6 w-6 text-orange-600" />}
                  />
                  <SummaryCard
                    title="Tickets Sold"
                    value={totalTicketsSold}
                    icon={<UsersIcon className="h-6 w-6 text-red-600" />}
                  />
                  <SummaryCard
                    title="Revenue (Est.)"
                    value={`$${(totalRevenue || 0).toFixed(2)}`}
                    icon={<DollarSignIcon className="h-6 w-6 text-yellow-600" />}
                  />
                </div>

                {/* ✅ Recent Events */}
                <h2 className="text-lg font-semibold mb-4">Your Recent Events</h2>
                {recentEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {recentEvents.map((event) => (
                      <div
                        key={event.event_id}
                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                          <CalendarIcon className="inline h-4 w-4 mr-2" />
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">{event.location}</p>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            event.status === "Approved"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center md:text-left">
                    You haven't created any events yet.
                  </p>
                )}
              </>
            }
          />
          <Route path="events/new" element={<HostEventForm />} />
          <Route path="events/*" element={<HostEventsList />} />
          <Route path="sales" element={<HostSalesDashboard />} />
          <Route path="settings" element={<HostSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default HostDashboard;
