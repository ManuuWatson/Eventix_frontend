// src/pages/EventsPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useQuery, UseQueryResult, UseQueryOptions } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.ts";
import EventCard from "../components/events/EventCard";
import EventFilter from "../components/events/EventFilter";
import { StarIcon, UsersIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

export type FilterFields = {
  search: string;
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
    date: "",
    location: "",
  });

  // ------------------ FETCH EVENTS USING REACT QUERY ------------------ //
  const queryOptions: UseQueryOptions<EventType[], Error, EventType[]> = {
    queryKey: ["events"],
    queryFn: async () => {
      const res = await axiosInstance.get("/events/");
      return res.data.map((event: any) => ({
        ...event,
        name: event.name || event.title || "Untitled Event",
        total_likes: event.total_likes || 0,
        liked_by_user: false, // handle likes separately
      }));
    },
    staleTime: 0, // always consider data stale to fetch fresh
    refetchOnWindowFocus: true,
    refetchInterval: 2000, // fetch fresh events every 2 seconds
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
        const dateMatch = !filters.date || e.date === filters.date;
        const locationMatch =
          !filters.location || locationField.includes(filters.location.toLowerCase());

        return searchMatch && dateMatch && locationMatch;
      })
      .sort((a: EventType, b: EventType) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filters, events]);

  // ------------------ HANDLE LIKE UPDATE ------------------ //
  const handleLikeUpdate = (event_id: string, likes_count: number) => {
    events.forEach((e: EventType) => {
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
    "/carousel/event_backgroundimg1.jpg",
    "/carousel/event_backgroundimg2.jpg",
    "/carousel/event_backgroundimg3.jpg",

  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % carouselImages.length),
      7000
    );
    return () => clearInterval(interval);
  }, []);

  // ------------------ UI ------------------ //
  return (
    <div className="container mx-auto px-4 py-8">

      {/* ================= HERO CAROUSEL ================= */}
      <section className="relative mb-12 h-[520px] md:h-[600px] rounded-xl overflow-hidden shadow-xl">

        {/* Slides */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            Discover{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Amazing Events
            </span>
          </h1>

          <p className="text-lg md:text-2xl max-w-2xl mb-10 text-gray-200 font-medium drop-shadow-lg">
            Find and book tickets for the best events happening near you.
          </p>

          <Link
            to="/register?role=host"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-xl"
          >
            Host an Event
          </Link>
        </div>
      </section>



      {/* ================= FILTER ================= */}
      <EventFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* ================= UPCOMING EVENTS ================= */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>

        {isLoading ? (
          <div className="text-center py-10">Loading events...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">Failed to load events.</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-10">No upcoming events</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
