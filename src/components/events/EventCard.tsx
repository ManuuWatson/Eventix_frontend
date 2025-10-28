import React from "react";

interface TicketType {
  id: string;
  name: string;
  price: number;
}

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    poster?: string;
    date: string;
    location: string;
    category?: string;
    ticketTypes?: TicketType[];
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { name, description, poster, date, location, category, ticketTypes = [] } = event;

  // Handle image URLs
  const baseUrl =
    (import.meta as any).env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const imageSrc = poster
    ? poster.startsWith("http")
      ? poster
      : `${baseUrl}${poster.startsWith("/") ? poster : "/" + poster}`
    : "https://via.placeholder.com/1200x800?text=Event+Poster"; // higher resolution placeholder

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image container with aspect ratio for crisp display */}
      <div className="relative w-full aspect-video">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/1200x800?text=Event+Poster"; // high-res fallback
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-3 line-clamp-3">
          {description || "No description provided."}
        </p>

        <div className="text-gray-500 text-sm mb-1 flex justify-between flex-wrap gap-2">
          <span><strong>Date:</strong> {new Date(date).toDateString()}</span>
          <span><strong>Location:</strong> {location}</span>
        </div>

        {category && (
          <p className="text-gray-500 text-sm mb-2">
            <strong>Category:</strong> {category}
          </p>
        )}

        {ticketTypes.length > 0 && (
          <div className="mt-auto">
            <h4 className="font-medium text-gray-800 mb-1 text-sm md:text-base">Tickets:</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              {ticketTypes.map((ticket) => (
                <li key={ticket.id}>
                  🎟️ {ticket.name} — KES {ticket.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
