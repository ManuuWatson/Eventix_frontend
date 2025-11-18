// src/pages/EventsPage.tsx
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.ts";
import EventCard from "../components/events/EventCard";
import EventFilter from "../components/events/EventFilter";

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
  category: string;
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

  // ------------------ READ FROM LOCAL STORAGE ------------------ //
  const localStoredEvents = JSON.parse(
    localStorage.getItem("cached_events") || "[]"
  );

  // ------------------ FETCH EVENTS USING REACT QUERY ------------------ //
  const { data: events = [] } = useQuery<EventType[]>({
    queryKey: ["events"],

    // Show cached events instantly
    initialData: localStoredEvents,

    queryFn: async () => {
      const res = await axiosInstance.get("/events/");

      const formatted = res.data.map((event: any) => ({
        ...event,
        name: event.name || event.title || "Untitled Event",
        total_likes: event.total_likes || 0,
        liked_by_user:
          localStorage.getItem(`anon_liked_${event.event_id}`) === "true",
      }));

      // SAVE NEW EVENTS TO LOCAL STORAGE
      localStorage.setItem("cached_events", JSON.stringify(formatted));

      return formatted;
    },

    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // ------------------ FILTER EVENTS ------------------ //
  const filteredEvents = useMemo(() => {
    const f = filters;
    const q = (f.search || "").toLowerCase();

    return (events || [])
      .filter((e) => e.is_approved)
      .filter((e) => {
        const name = (e.name || "").toLowerCase();
        const description = (e.description || "").toLowerCase();
        const locationField = (e.location || "").toLowerCase();

        const searchMatch =
          !q ||
          name.includes(q) ||
          description.includes(q) ||
          locationField.includes(q);

        const categoryMatch = !f.category || e.category === f.category;
        const dateMatch = !f.date || e.date === f.date;
        const locationMatch =
          !f.location ||
          locationField.includes(f.location.toLowerCase());

        return searchMatch && categoryMatch && dateMatch && locationMatch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filters, events]);

  // ------------------ HANDLE LIKE UPDATE ------------------ //
  const handleLikeUpdate = (event_id: string, likes_count: number) => {
    events.map((e: any) => {
      if (e.event_id === event_id) {
        e.total_likes = likes_count;
      }
      return e;
    });
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------ UI ------------------ //
  return (
    <div className="container mx-auto px-4 py-8">
      <EventFilter filters={filters} onFilterChange={handleFilterChange} />

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>

        {events.length === 0 ? (
          <div className="text-center py-10">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                onLikeUpdate={handleLikeUpdate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default EventsPage;
