import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "../../context/AuthContext"; // Ensure AuthContext exports authToken and logout

// Define the shape of a single ticket type
interface TicketType {
  id: number;
  name: string;
  price: number;
}

// Define the shape of the main event data object
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
  // Destructure only authToken and logout from useAuth(), removing 'user'
  const { authToken, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create an axios instance with the Authorization header
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
  });

  // Fetch events from the API
  const fetchEvents = useCallback(async () => {
    if (!authToken) {
      setError("User not authenticated. Please log in again.");
      setIsLoading(false);
      // logout(); // Handled by the 401 interceptor logic below
      // navigate("/login"); // Handled by the 401 interceptor logic below
      return;
    }

    setIsLoading(true);
    try {
      // The backend (ViewSet) automatically filters by host=request.user when authenticated
      const response = await api.get("events/"); 
      setEvents(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again.");
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // If 401 specifically, log out user and redirect
        logout();
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [authToken, logout, navigate]); // Dependencies for useCallback

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // We use the events state directly because the backend now filters server-side
  const hostEvents = events; 

  // Filter events based on the selected 'all', 'upcoming', or 'past' filter
  const filteredEvents = hostEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    if (filter === "upcoming") return eventDate >= now;
    if (filter === "past") return eventDate < now;
    return true;
  });

  // Handle clicking the delete button to open the confirmation modal
  const handleDeleteClick = (id: number) => setDeleteConfirmation(id);

  // Cancel the delete operation and close the modal
  const cancelDelete = () => setDeleteConfirmation(null);

  // Confirm and perform the delete operation via API call
  const confirmDelete = async (id: number) => {
    try {
      await api.delete(`events/${id}/`); 
      // Update the local state to remove the deleted event
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event.");
    }
  };

  // Helper function to format the date string without timezone issues
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

  // Get the base URL from environment variables for constructing image URLs
  const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  
  // Helper function to get the full image URL or a placeholder
  const getPosterImage = (poster?: string) =>
    poster
      ? poster.startsWith("http")
        ? poster
        : `${baseUrl}${poster.startsWith("/") ? poster : "/" + poster}`
      : "https://via.placeholder.com/600x400?text=Event+Poster";

  if (isLoading) {
    return <div className="p-8 text-center">Loading events...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🎟️ My Events</h1>
        <Link
          to="/host/events/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Create Event
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            {["all", "upcoming", "past"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as "all" | "upcoming" | "past")}
                className={`px-4 py-2 rounded-md transition ${
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
        </div>

        {/* Event List Table or Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No events found matching the filter.</p>
            <Link
              to="/host/events/new"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Create your first event
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
                  const displayStatus = event.is_approved ? "Approved" : "Pending Approval";

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
                            <CalendarIcon className="h-4 w-4 text-indigo-500" />{" "}
                            {datePart}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <ClockIcon className="h-4 w-4 text-indigo-400" />{" "}
                            {timePart}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4 text-gray-400" />
                            {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.is_approved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {displayStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.ticket_types.length} type(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            to={`/host/events/${event.id}`}
                            className="text-gray-400 hover:text-indigo-600 transition p-1 rounded-full hover:bg-indigo-100"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/host/events/edit/${event.id}`}
                            className="text-gray-400 hover:text-green-600 transition p-1 rounded-full hover:bg-green-100"
                            title="Edit Event"
                          >
                            <EditIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(event.id)}
                            className="text-gray-400 hover:text-red-600 transition p-1 rounded-full hover:bg-red-100"
                            title="Delete Event"
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirmation)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostEventsList;
