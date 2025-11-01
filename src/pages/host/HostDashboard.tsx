import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface EventData {
  id: number;
  name: string;
  date: string;
  location: string;
  is_approved: boolean;
  poster?: string;
}

const HostDashboard: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch events for logged-in host
  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('events/');
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh events
  const refreshEvents = () => {
    setLoading(true);
    fetchEvents();
  };

  // Fetch events on mount and refresh if navigation state signals it
  useEffect(() => {
    fetchEvents();

    if ((location.state as any)?.refresh) {
      refreshEvents();
      // Clear the state to avoid repeated refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Events</h1>
        <button
          onClick={() => navigate('/host/create-event')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Create New Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-600">No events found. Start by creating a new event.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <li
              key={event.id}
              className="border rounded-lg shadow-sm p-4 bg-white flex flex-col items-start"
            >
              {event.poster && (
                <img
                  src={event.poster}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="text-xl font-semibold">{event.name}</h3>
              <p className="text-gray-600">{event.date} | {event.location}</p>
              <p className="mt-1 font-medium">
                Status: {event.is_approved ? 'Approved ✅' : 'Pending ⏳'}
              </p>
              <Link
                to={`/host/edit-event/${event.id}`}
                className="mt-3 text-indigo-600 hover:text-indigo-800"
              >
                Edit Event
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HostDashboard;

 