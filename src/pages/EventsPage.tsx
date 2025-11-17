// src/pages/EventsPage.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../components/events/EventCard";
import EventFilter from "../components/events/EventFilter";
import axiosInstance from "../api/axiosInstance";
import { StarIcon, UsersIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

export type FilterFields = {
  search: string;
  category: string;
  date: string;
  location: string;
};

const EventsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const [filters, setFilters] = useState<FilterFields>({
    search: searchQuery,
    category: "",
    date: "",
    location: "",
  });
  const [events, setEvents] = useState<any[]>([]);

 const fetchEvents = async () => {
  try {
    // baseURL already includes /api, so just call /events/
    const res = await axiosInstance.get("/events/");
    const data = res.data;
    const updatedEvents = data.map((event: any) => ({
      ...event,
      total_likes: event.total_likes || 0,
      liked_by_user:
        event.liked_by_user ||
        localStorage.getItem(`anon_liked_${event.event_id}`) === "true",
    }));
    setEvents(updatedEvents);
  } catch (err) {
    console.error("Failed to fetch events:", err);
  }
};


  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLikeUpdate = (event_id: string, likes_count: number) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.event_id === event_id ? { ...e, total_likes: likes_count } : e
      )
    );
  };

  const filterEvents = (f: FilterFields) => {
    const q = (f.search || "").toLowerCase();
    return events
      .filter((e) => e.is_approved === true)
      .filter((e) => {
        const title = (e.title || e.name || "").toLowerCase();
        const description = (e.description || "").toLowerCase();
        const locationField = (e.location || "").toLowerCase();
        const categoryField = (e.category || "").toString();
        const dateField = (e.date || "").toString();

        const searchMatch =
          !q || title.includes(q) || description.includes(q) || locationField.includes(q);
        const categoryMatch = !f.category || categoryField === f.category;
        const dateMatch = !f.date || dateField === f.date;
        const locationMatch = !f.location || locationField.includes(f.location.toLowerCase());

        return searchMatch && categoryMatch && dateMatch && locationMatch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const [filteredEvents, setFilteredEvents] = useState<any[]>(() =>
    filterEvents(filters)
  );

  useEffect(() => {
    setFilteredEvents(filterEvents(filters));
  }, [filters, events]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name as keyof FilterFields]: value }));
  };

  const carouselImages = [
    "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1500&q=80",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % carouselImages.length),
      4000
    );
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
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
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Find and book tickets for the best events happening near you.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="mb-12">
        <EventFilter filters={filters} onFilterChange={handleFilterChange} />
      </section>

      {/* Events */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
          <div className="text-sm text-gray-500">
            Showing {filteredEvents.length} approved events
          </div>
        </div>
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No approved events found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to find more events.
            </p>
            <button
              onClick={() =>
                setFilters({ search: "", category: "", date: "", location: "" })
              }
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.event_id} event={event} onLikeUpdate={handleLikeUpdate} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="mt-16 py-12 bg-indigo-50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <StarIcon className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Best Events</h3>
            <p className="text-gray-600">
              We feature top-rated and handpicked events so you always enjoy quality experiences.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <UsersIcon className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Join a vibrant community of event-goers and hosts for unforgettable moments.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <ShieldCheckIcon className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-gray-600">
              Your transactions and personal information are always protected with us.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <ZapIcon className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">
              Book tickets instantly and access event information seamlessly on our platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
