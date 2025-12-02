import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

/* ✅ Use EXACT backend structure */
export interface TicketType {
  id?: number;
  ticket_name: string;
  ticket_price: number;
  ticket_quantity?: number; // optional
}

export interface EventData {
  event_id: number | string;
  name: string;
  title?: string;
  description: string;
  posterUrl?: string;
  date: string;
  location: string;
  category?: string;

  /* ✅ Use backend naming exactly */
  payment_methods: string[];
  ticket_types: TicketType[];

  host_name?: string;
  host_id?: number;

  /* derived field */
  status: "Pending Approval" | "Approved" | "Rejected";
}

export interface EventContextType {
  events: EventData[];
  fetchEvents: (force?: boolean) => Promise<void>;
  getEvent: (eventId: string) => EventData | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const API_URL = "http://127.0.0.1:8000/api/events/";

  const fetchEvents = async (force = false) => {
    const now = Date.now();

    if (!force && lastFetched && now - lastFetched < 5 * 60 * 1000) {
      console.log("⏳ Using cached events (not fetching again).");
      return;
    }

    try {
      console.log("🌐 Fetching events:", API_URL);

      const response = await axios.get(API_URL, { timeout: 15000 });
      const apiData = response.data;

      const normalizedEvents: EventData[] = apiData.map((event: any) => ({
        ...event,

        /* Normalize missing fields ONLY, not renaming backend fields */
        event_id: event.event_id ?? event.id,
        name: event.name ?? event.title ?? "Untitled Event",
        title: event.title ?? event.name,
        posterUrl: event.poster_url ?? "",

        /* ❗ backend fields kept EXACTLY */
        payment_methods: event.payment_methods ?? [],
        ticket_types: event.ticket_types ?? [],

        host_name: event.host_name ?? "Unknown Host",
        host_id: event.host_id,
        status: event.is_approved ? "Approved" : "Pending Approval",
      }));

      setEvents(normalizedEvents);
      setLastFetched(now);

      console.log("✅ Events fetched successfully:", normalizedEvents.length);
    } catch (err: any) {
      if (err?.message?.includes("Network Error")) {
        console.error("🌐 CORS ERROR: Backend is reachable but blocked.");
      }

      if (err?.response?.status === 502) {
        console.error("❌ Backend responded with 502 (Render sleeping?)");
      }

      console.error("❌ Full error:", err);
    }
  };

  const getEvent = (eventId: string) => {
    return events.find((e) => e.event_id.toString() === eventId);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, fetchEvents, getEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
};