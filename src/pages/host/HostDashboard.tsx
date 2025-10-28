import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventContext";
import {
  LayoutDashboardIcon,
  CalendarIcon,
  DollarSignIcon,
  SettingsIcon,
  PlusIcon,
  LogOutIcon,
  TicketIcon,
} from "lucide-react";
import HostEventForm from "./HostEventForm";
import HostEventsList from "./HostEventsList";
import HostSalesDashboard from "./HostSalesDashboard";
import HostSettings from "./HostSettings";

const HostDashboard = () => {
  const { user, logout } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    if (location.pathname.includes("events")) setActivePage("events");
    else if (location.pathname.includes("sales")) setActivePage("sales");
    else if (location.pathname.includes("settings")) setActivePage("settings");
    else setActivePage("dashboard");
  }, [location]);

  // --- Debug Logs ---
  useEffect(() => {
    console.log("Logged-in user:", user);
    console.log("All events:", events);
  }, [events, user]);

  // --- Filter events belonging to current host ---
  const hostEvents = events.filter((event) => {
    const hostIdentifier =
      event.host_name || event.host || event.organizer || event.createdBy;
    const userIdentifier = user?.email?.split("@")[0]?.toLowerCase();

    return (
      hostIdentifier?.toLowerCase() === user?.email?.toLowerCase() ||
      hostIdentifier?.toLowerCase() === userIdentifier
    );
  });

  // --- Dashboard Stats ---
  const totalEvents = hostEvents.length;
  const upcomingEvents = hostEvents.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate > new Date();
  }).length;

  // --- Temporary static placeholders ---
  const ticketsSold = 0; // Will be updated later
  const totalRevenue = 0; // Will be updated later

  useEffect(() => {
    console.log("User Email:", user?.email);
    console.log("Filtered Host Events:", hostEvents);
    console.log("Total Events:", totalEvents);
    console.log("Upcoming Events:", upcomingEvents);
  }, [hostEvents]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-indigo-800 text-white min-h-screen p-4 hidden md:block">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Host Dashboard</h2>
            <p className="text-indigo-200 text-sm mt-1">
              Welcome, {user?.email}
            </p>
          </div>

          <nav className="space-y-1">
            <Link
              to="/host-dashboard"
              className={`flex items-center px-4 py-3 rounded-md ${
                activePage === "dashboard"
                  ? "bg-indigo-900"
                  : "hover:bg-indigo-700"
              }`}
            >
              <LayoutDashboardIcon className="h-5 w-5 mr-3" />
              Dashboard
            </Link>

            <Link
              to="/host-dashboard/events"
              className={`flex items-center px-4 py-3 rounded-md ${
                activePage === "events"
                  ? "bg-indigo-900"
                  : "hover:bg-indigo-700"
              }`}
            >
              <CalendarIcon className="h-5 w-5 mr-3" />
              My Events
            </Link>

            <Link
              to="/host-dashboard/settings"
              className={`flex items-center px-4 py-3 rounded-md ${
                activePage === "settings"
                  ? "bg-indigo-900"
                  : "hover:bg-indigo-700"
              }`}
            >
              <SettingsIcon className="h-5 w-5 mr-3" />
              Settings
            </Link>

            <button
              className="flex items-center px-4 py-3 rounded-md hover:bg-indigo-700 w-full text-left"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Routes>
            {/* Dashboard Overview */}
            <Route
              index
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

                  {/* Dashboard Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                      title="Total Events"
                      value={totalEvents}
                      icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />}
                      bgColor="bg-indigo-100"
                    />
                    <StatCard
                      title="Upcoming Events"
                      value={upcomingEvents}
                      icon={<CalendarIcon className="h-6 w-6 text-green-600" />}
                      bgColor="bg-green-100"
                    />
                    <StatCard
                      title="Tickets Sold"
                      value={ticketsSold}
                      icon={<TicketIcon className="h-6 w-6 text-yellow-600" />}
                      bgColor="bg-yellow-100"
                    />
                    <StatCard
                      title="Total Revenue"
                      value={`$${totalRevenue}`}
                      icon={<DollarSignIcon className="h-6 w-6 text-red-600" />}
                      bgColor="bg-red-100"
                    />
                  </div>

                  {/* My Events Table */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                      My Events (Approved & Pending)
                    </h2>
                    {hostEvents.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <TableHeader title="Event" />
                              <TableHeader title="Date" />
                              <TableHeader title="Location" />
                              <TableHeader title="Status" />
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {hostEvents.map((event) => (
                              <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img
                                      className="h-10 w-10 rounded-md object-cover"
                                      src={
                                        event.poster ||
                                        "https://via.placeholder.com/100x100?text=Event"
                                      }
                                      alt={event.name}
                                    />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {event.name}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(event.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {event.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      (event as any).is_approved
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {(event as any).is_approved
                                      ? "Approved"
                                      : "Pending"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">
                          You haven't created any events yet.
                        </p>
                        <Link
                          to="/host-dashboard/events/new"
                          className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Create your first event
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              }
            />

            {/* Other Routes */}
            <Route path="events" element={<HostEventsList />} />
            <Route path="events/new" element={<HostEventForm />} />
            <Route path="events/:eventId/edit" element={<HostEventForm />} />
            <Route path="sales" element={<HostSalesDashboard />} />
            <Route path="settings" element={<HostSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Components ---
const StatCard = ({
  title,
  value,
  icon,
  bgColor,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
  bgColor: string;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className={`${bgColor} p-3 rounded-full`}>{icon}</div>
    <div className="ml-4">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

const TableHeader = ({ title }: { title: string }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {title}
  </th>
);

export default HostDashboard;
