import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { CalendarIcon, MapPinIcon, UserIcon, ClockIcon, TagIcon, ShareIcon, HeartIcon } from 'lucide-react';
const EventDetailsPage = () => {
  const {
    eventId
  } = useParams<{
    eventId: string;
  }>();
  const navigate = useNavigate();
  const {
    getEvent
  } = useEvents();
  const event = getEvent(eventId || '');
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  if (!event) {
    return <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Event not found</h2>
        <p className="text-gray-600 mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
          Browse Events
        </button>
      </div>;
  }
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const handleProceedToCheckout = () => {
    if (!selectedTicket) {
      alert('Please select a ticket type');
      return;
    }
    navigate(`/checkout/${event.id}?ticketType=${selectedTicket}`);
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Event Header */}
        <div className="relative h-80 bg-gray-900">
          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
              {event.category}
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center text-gray-300">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>
                {formattedDate} • {formattedTime}
              </span>
            </div>
          </div>
        </div>
        {/* Event Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Event Details - Left Column */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.description}
              </p>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
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
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <UserIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Organizer</h3>
                    <p className="text-gray-600">{event.hostName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <TagIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Category</h3>
                    <p className="text-gray-600">{event.category}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Share This Event</h2>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
                  <ShareIcon className="h-5 w-5" />
                </button>
                <button className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700">
                  <HeartIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          {/* Ticket Selection - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
              <h2 className="text-2xl font-semibold mb-4">Get Tickets</h2>
              <div className="space-y-4 mb-6">
                {event.ticketTypes.map(ticket => <div key={ticket.id} className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedTicket === ticket.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`} onClick={() => setSelectedTicket(ticket.id)}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{ticket.name}</h3>
                      <span className="text-indigo-600 font-bold">
                        ${ticket.price}
                      </span>
                    </div>
                    {ticket.description && <p className="text-sm text-gray-600">
                        {ticket.description}
                      </p>}
                  </div>)}
              </div>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Payment Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {event.paymentMethods.map(method => <div key={method} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                      {method}
                    </div>)}
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!selectedTicket} onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default EventDetailsPage;