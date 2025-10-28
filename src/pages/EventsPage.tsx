import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../components/events/EventCard";
import EventFilter from "../components/events/EventFilter";
import { useEvents } from "../context/EventContext";
import { CalendarIcon, MapPinIcon, TagIcon } from "lucide-react";

// Shared filter type
export type FilterFields = {
  search: string;
  category: string;
  date: string;
  location: string;
};

const EventsPage = () => {
  const location = useLocation();
  const { events: allEvents = [] } = useEvents();

  // Get search query from URL if present
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState<FilterFields>({
    search: searchQuery,
    category: "",
    date: "",
    location: "",
  });

  // ✅ Local filtering function (only approved events)
  const filterEvents = (f: FilterFields) => {
    if (!allEvents || !Array.isArray(allEvents)) return [];

    const q = (f.search || "").toLowerCase();

    return allEvents
      .filter((e: any) => e.is_approved === true) // ✅ show only approved events
      .filter((e: any) => {
        const title = (e.title || e.name || "").toString().toLowerCase();
        const description = (e.description || "").toString().toLowerCase();
        const locationField = (e.location || "").toString().toLowerCase();
        const categoryField = (e.category || "").toString();
        const dateField = (e.date || "").toString();

        const searchMatch =
          !q ||
          title.includes(q) ||
          description.includes(q) ||
          locationField.includes(q);

        const categoryMatch = !f.category || categoryField === f.category;
        const dateMatch = !f.date || dateField === f.date;
        const locationMatch =
          !f.location || locationField.includes(f.location.toLowerCase());

        return searchMatch && categoryMatch && dateMatch && locationMatch;
      });
  };

  // Track filtered events locally
  const [events, setEvents] = useState<any[]>(() => filterEvents(filters));

  // Update events when filters or source events change
  useEffect(() => {
    setEvents(filterEvents(filters));
  }, [filters, allEvents]);

  const carouselImages = [
    "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1500&q=80",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // Auto-slide carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name as keyof FilterFields]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🎠 Hero Section */}
      <section className="relative mb-12 h-[500px] rounded-lg overflow-hidden shadow-lg">
        <div
          className="flex w-full h-full transition-transform duration-900 ease-in-out"
          style={{
            transform: `translateX(-${currentImage * 100}%)`,
            width: `${carouselImages.length * 100}%`,
          }}
        >
          {carouselImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Overlay Text */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Find and book tickets for the best events happening near you.
          </p>
        </div>
      </section>

      {/* 🔍 Filter Section */}
      <section className="mb-12">
        <EventFilter filters={filters} onFilterChange={handleFilterChange} />
      </section>

      {/* 🎫 Events Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Upcoming Events
          </h2>
          <div className="text-sm text-gray-500">
            Showing {events.length} approved events
          </div>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No approved events found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to find more events.
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  category: "",
                  date: "",
                  location: "",
                })
              }
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* ⭐ Why Book Section */}
      <section className="mt-16 bg-indigo-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Book With EventTix?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make event ticket booking simple, secure, and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">
              Discover events of all types, from concerts to conferences, all in
              one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TagIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Find great deals and exclusive offers for all your favorite
              events.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
            <p className="text-gray-600">
              Book with confidence with our secure payment system and instant
              ticket delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
