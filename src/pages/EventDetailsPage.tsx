import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  TicketIcon
} from 'lucide-react';
import LoadingSpinner from '../components/layout/LoadingSpinner';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { events, getEvent } = useEvents();
  const { user } = useAuth();

  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const event = getEvent(eventId || "");
  const isLoading = events.length === 0;

  // Display login message if redirected from login page
  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setLoginMessage((location.state as any).message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleProceedToCheckout = () => {
    if (!selectedTicket) {
      alert("Please select a ticket type");
      return;
    }

    const checkoutUrl = `/checkout/${event?.event_id}?ticketType=${selectedTicket}`;

    if (!user) {
      navigate(`/login?next=${encodeURIComponent(checkoutUrl)}`, {
        state: {
          message: "Please login or register to complete your purchase"
        }
      });
      return;
    }

    navigate(checkoutUrl);
  };

  if (isLoading) return <LoadingSpinner text="Loading event details..." />;
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Event not found</h2>
        <p className="text-gray-600 mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Browse Events
        </button>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        {/* HEADER - Cinematic Style */}
        <div className="relative w-full h-[500px] bg-gray-950 overflow-hidden group">
          {event.posterUrl ? (
            <>
              {/* 1. Blurred Background for Ambiance */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110 transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${event.posterUrl})` }}
              />

              {/* 2. Sharp Centered Poster */}
              <div className="absolute inset-0 flex items-center justify-center py-6 px-4">
                <img
                  src={event.posterUrl}
                  alt={event.name}
                  className="max-h-full max-w-full object-contain relative z-10 shadow-2xl drop-shadow-2xl rounded-sm transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">
              <span className="text-lg">No Poster Available</span>
            </div>
          )}

          {/* 3. Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-20 pointer-events-none" />

          {/* 4. Text Content */}
          <div className="absolute bottom-0 left-0 p-8 z-30 text-white w-full max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight drop-shadow-lg leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
              {event.name}
            </h1>
            <div className="flex items-center text-gray-100 text-lg font-medium drop-shadow-md">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg flex items-center border border-white/20">
                <CalendarIcon className="h-5 w-5 mr-2 text-indigo-300" />
                <span>{formattedDate} • {formattedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{event.description}</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <CalendarIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p className="text-gray-600">{formattedDate}</p>
                  <p className="text-gray-600">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <MapPinIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>

              {event.host_name && (
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <UserIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Organizer</h3>
                    <p className="text-gray-600">{event.host_name}</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDE: TICKETS */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-6 border border-gray-200">

              {loginMessage && (
                <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 rounded-md">
                  {loginMessage}
                </div>
              )}

              <div className="flex items-center mb-4">
                <TicketIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-semibold">Get Tickets</h2>
              </div>

              <div className="space-y-4 mb-6">
                {event.ticket_types?.length > 0 ? (
                  event.ticket_types.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedTicket === ticket.id
                        ? "border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                        }`}
                      onClick={() => setSelectedTicket(ticket.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-900">{ticket.ticket_name}</h3>
                        <span className="text-indigo-600 font-bold text-lg">KES {ticket.ticket_price}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {ticket.ticket_quantity !== undefined
                          ? `Available: ${ticket.ticket_quantity}`
                          : "Available"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No tickets available for this event.</p>
                  </div>
                )}
              </div>

              <button
                className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                disabled={!selectedTicket}
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
