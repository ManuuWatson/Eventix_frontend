// src/pages/EventsPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, UseQueryResult, UseQueryOptions } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.ts";
import EventCard from "../components/events/EventCard";
import EventFilter from "../components/events/EventFilter";
import { StarIcon, UsersIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

export type FilterFields = {
  search: string;
  category: string;
  date: string;
  location: string;
};

export type EventType = {
  event_id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  category?: string;
  is_approved: boolean;
  total_likes: number;
  liked_by_user: boolean;
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

  // ------------------ LOCAL STORAGE CACHE ------------------ //
  const cachedEvents: EventType[] =
    (JSON.parse(localStorage.getItem("cached_events") || "[]") as EventType[]) || [];

  // ------------------ FETCH EVENTS USING REACT QUERY ------------------ //
  const queryOptions: UseQueryOptions<EventType[], Error, EventType[]> = {
    queryKey: ["events"],
    queryFn: async () => {
      const res = await axiosInstance.get("/events/");
      const formatted: EventType[] = res.data.map((event: any) => ({
        ...event,
        name: event.name || event.title || "Untitled Event",
        total_likes: event.total_likes || 0,
        liked_by_user:
          localStorage.getItem(`anon_liked_${event.event_id}`) === "true",
      }));

      localStorage.setItem("cached_events", JSON.stringify(formatted));
      return formatted;
    },
    initialData: cachedEvents,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  };

  const { data: events = [], isLoading, error }: UseQueryResult<EventType[], Error> =
    useQuery<EventType[], Error, EventType[]>(queryOptions);

  // ------------------ FILTER EVENTS ------------------ //
  const filteredEvents = useMemo(() => {
    return (events || [])
      .filter((e: EventType) => e.is_approved)
      .filter((e: EventType) => {
        const q = (filters.search || "").toLowerCase();
        const name = (e.name || "").toLowerCase();
        const description = (e.description || "").toLowerCase();
        const locationField = (e.location || "").toLowerCase();

        const searchMatch =
          !q || name.includes(q) || description.includes(q) || locationField.includes(q);
        const categoryMatch = !filters.category || e.category === filters.category;
        const dateMatch = !filters.date || e.date === filters.date;
        const locationMatch =
          !filters.location || locationField.includes(filters.location.toLowerCase());

        return searchMatch && categoryMatch && dateMatch && locationMatch;
      })
      .sort((a: EventType, b: EventType) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filters, events]);

  // ------------------ HANDLE LIKE UPDATE ------------------ //
  const handleLikeUpdate = (event_id: string, likes_count: number) => {
    (events || []).forEach((e: EventType) => {
      if (e.event_id === event_id) {
        e.total_likes = likes_count;
      }
    });
  };

  // ------------------ HANDLE FILTER CHANGE ------------------ //
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------ CAROUSEL ------------------ //
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
  }, []);

  // ------------------ UI ------------------ //
  return (
    <div className="container mx-auto px-4 py-8">

      {/* ================= HERO CAROUSEL ================= */}
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

      {/* ================= FILTER ================= */}
      <EventFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* ================= UPCOMING EVENTS ================= */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>

        {isLoading && events.length === 0 ? (
          <div className="text-center py-10">Loading events...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">Failed to load events.</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-10">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event: EventType) => (
              <EventCard
                key={event.event_id}
                event={event}
                onLikeUpdate={handleLikeUpdate}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="mt-16 py-12 bg-indigo-50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow">
            <StarIcon className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Best Events</h3>
            <p className="text-gray-600">
              Top-rated and handpicked events curated for quality.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow">
            <UsersIcon className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Join a vibrant community of event-goers.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow">
            <ShieldCheckIcon className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-gray-600">Your information is always protected.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow">
            <ZapIcon className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">Instant booking and smooth browsing.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
