import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
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
  const { events, getEvent } = useEvents(); // Use events directly for reactivity

  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  // Get event from context
  // We use the function but also depend on 'events' so it updates when events are fetched
  const event = getEvent(eventId || "");

  // If event is not found immediately, it might be loading or invalid.
  // We can check if events are empty to show loading.
  const isLoading = events.length === 0;

  useEffect(() => {
    if (event) {
      console.log("🎫 Event loaded:", event.name);
      console.log("🎫 Ticket types:", event.ticket_types);
    }
  }, [event]);

  if (isLoading) {
    return <LoadingSpinner text="Loading event details..." />;
  }

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
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  const handleProceedToCheckout = () => {
    if (!selectedTicket) {
      alert("Please select a ticket type");
      return;
    }
    navigate(`/checkout/${event.event_id}?ticketType=${selectedTicket}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        {/* HEADER */}
        <div className="relative h-80 bg-gray-900">
          {event.posterUrl ? (
            <img src={event.posterUrl} alt={event.name} className="w-full h-full object-cover opacity-70" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span className="text-lg">No Poster Available</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
            <div className="flex items-center text-gray-300">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>{formattedDate} • {formattedTime}</span>
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
              <div className="flex items-center mb-4">
                <TicketIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-semibold">Get Tickets</h2>
              </div>

              <div className="space-y-4 mb-6">
                {event.ticket_types && event.ticket_types.length > 0 ? (
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
                        <span className="text-indigo-600 font-bold text-lg">
                          KES {ticket.ticket_price}
                        </span>
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

              {/* CHECKOUT */}
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
