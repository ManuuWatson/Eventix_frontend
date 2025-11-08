import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  poster_url?: string;
  date: string;
  location: string;
  category: string;
  payment_methods: string[];
  ticket_types: TicketType[];
  host_name: string;
  host_id: number;
  is_approved?: boolean;
}

const HostEventsList: React.FC = () => {
  const { authToken, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventData[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
  });

  const fetchEvents = useCallback(async () => {
    if (!authToken) {
      setError("User not authenticated. Please log in again.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get("events/my_events/");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.host_id;
      const myEvents = response.data.filter((event: EventData) => event.host_id === userId);
      setEvents(myEvents);
      setError(null);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again.");
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [authToken, logout, navigate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter((event) => {
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
      await api.delete(`events/${id}/`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event.");
    }
  };

  const handleEdit = (id: number) => navigate(`/host/events/edit/${id}`);
  const handleView = (id: number) => navigate(`/host/events/${id}`);
  const handleCreate = () => navigate("/host-dashboard/events/new");

  const formatDateTime = (dateString: string) => {
    if (!dateString) return { datePart: "N/A", timePart: "" };
    try {
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

  if (isLoading) return <div className="p-8 text-center">Loading events...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">🎟️ My Events</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Create Event
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b flex flex-wrap gap-2 justify-center sm:justify-start">
          {["all", "upcoming", "past"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as "all" | "upcoming" | "past")}
              className={`px-4 py-2 rounded-md text-sm sm:text-base transition ${
                filter === type
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type === "all"
                ? "All Events"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Event List */}
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No events found.</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Create your first event
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => {
                    const { datePart, timePart } = formatDateTime(event.date);
                    return (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center space-x-4">
                          <img
                            src={getPosterImage(event.poster_url || event.poster)}
                            alt={event.name}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{event.name}</p>
                            <p className="text-sm text-gray-500">{event.category}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-600 text-sm space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{datePart}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{timePart}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              event.is_approved
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {event.is_approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleView(event.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(event.id)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <EditIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(event.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {filteredEvents.map((event) => {
                const { datePart, timePart } = formatDateTime(event.date);
                return (
                  <div
                    key={event.id}
                    className="border rounded-lg shadow-sm overflow-hidden bg-white"
                  >
                    <img
                      src={getPosterImage(event.poster_url || event.poster)}
                      alt={event.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-900 truncate">{event.name}</h3>
                      <p className="text-sm text-gray-500">{event.category}</p>
                      <div className="flex items-center text-gray-600 text-sm space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{datePart}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{timePart}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.is_approved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {event.is_approved ? "Approved" : "Pending"}
                        </span>
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          onClick={() => handleView(event.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(event.id)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <EditIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this event?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => confirmDelete(deleteConfirmation)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostEventsList;
