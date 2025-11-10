import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// ✅ Ticket type interface
export interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// ✅ Event data interface
export interface EventData {
  event_id: number;
  name: string;
  description: string;
  poster: string;
  date: string;
  location: string;
  category: string;
  payment_methods: string[];
  ticket_types: TicketType[];
  host_name: string;
  host_id: number;
  status: "Pending Approval" | "Approved" | "Rejected";
}

// ✅ Context type
export interface EventContextType {
  events: EventData[];
  fetchEvents: (force?: boolean) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  // ✅ Real production API
  const API_URL = "https://eventix-backend2.onrender.com/api/events/";

  // ✅ Optimized fetch with caching (avoids repeated calls)
  const fetchEvents = async (force = false) => {
    const now = Date.now();

    // 🧠 Skip fetch if data was fetched within last 5 minutes (unless forced)
    if (!force && lastFetched && now - lastFetched < 5 * 60 * 1000) {
      console.log("⏳ Using cached events data to reduce API load");
      return;
    }

    try {
      const response = await axios.get(API_URL);
      const apiData = response.data;

      // ✅ Normalize event_id if backend sends "id"
      const normalizedEvents = apiData.map((event: any) => ({
        ...event,
        event_id: event.event_id ?? event.id,
      }));

      setEvents(normalizedEvents);
      setLastFetched(now);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
    }
  };

  // ✅ Fetch events once on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, fetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};

// ✅ Custom hook
export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
};
