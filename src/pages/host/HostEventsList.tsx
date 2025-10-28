import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface TicketType {
  id: number;
  name: string;
  price: number;
}

interface EventData {
  id: number;
  name: string;
  description: string;
  poster?: string;
  date: string; // ISO string from backend
  location: string;
  category: string;
  payment_methods: string[];
  ticket_types: TicketType[];
  host_name: string;
  host_id: number;
  is_approved?: boolean;
}

const HostEventsList: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/events/");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const hostEvents = events.filter((event) => event.host_id === (user as any)?.id);

  const filteredEvents = hostEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    if (filter === "upcoming") return eventDate >= now;
    if (filter === "past") return eventDate < now;
    return true;
  });

  const handleDeleteClick = (id: number) => setDeleteConfirmation(id);
  const cancelDelete = () => setDeleteConfirmation(null);

  const confirmDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${id}/`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // ✅ FIXED: Display time exactly as saved (no timezone drift)
  const formatDateTime = (dateString: string) => {
    if (!dateString) return { datePart: "N/A", timePart: "" };
    try {
      // If the date string doesn't have a timezone, treat it as local
      const hasTZ = /[zZ]|([+-]\d{2}:?\d{2})$/.test(dateString);
      const parsedDate = hasTZ ? new Date(dateString) : new Date(dateString + "Z");

      const datePart = parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const timePart = parsedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return { datePart, timePart };
    } catch {
      return { datePart: dateString, timePart: "" };
    }
  };

  const baseUrl =
    (import.meta as any).env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const getPosterImage = (poster?: string) =>
    poster
      ? poster.startsWith("http")
        ? poster
        : `${baseUrl}${poster.startsWith("/") ? poster : "/" + poster}`
      : "https://via.placeholder.com/600x400?text=Event+Poster";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🎟️ My Events</h1>
        <Link
          to="/host/events/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Event
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Filter */}
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            {["all", "upcoming", "past"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as "all" | "upcoming" | "past")}
                className={`px-4 py-2 rounded-md transition ${
                  filter === type
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type === "all"
                  ? "All Events"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No events found</p>
            <Link
              to="/host/events/new"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => {
                  const { datePart, timePart } = formatDateTime(event.date);
                  const displayStatus = event.is_approved
                    ? "Approved"
                    : "Pending Approval";

                  return (
                    <tr key={event.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-md object-cover shadow-sm"
                            src={getPosterImage(event.poster)}
                            alt={event.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {event.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-gray-700">
                            <CalendarIcon className="h-4 w-4 text-indigo-500" />
                            {datePart}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <ClockIcon className="h-4 w-4 text-indigo-400" />
                            {timePart}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4 text-indigo-400" />
                        {event.location}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            displayStatus === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.ticket_types?.length || 0} types
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {deleteConfirmation === event.id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => confirmDelete(event.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-3">
                            {event.is_approved && (
                              <Link
                                to={`/events/${event.id}`}
                                className="text-green-600 hover:text-green-900"
                                title="View Public Page"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Link>
                            )}
                            <Link
                              to={`/host/events/${event.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit Event"
                            >
                              <EditIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(event.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Event"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostEventsList;
