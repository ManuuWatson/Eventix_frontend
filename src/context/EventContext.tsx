import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
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
  paymentMethods: string[];
  ticketTypes: TicketType[];
  hostName?: string;
  hostId?: number;
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

  const API_URL = "https://eventix-backend2.onrender.com/api/events/";

  const fetchEvents = async (force = false) => {
    const now = Date.now();

    if (!force && lastFetched && now - lastFetched < 5 * 60 * 1000) {
      console.log("⏳ Using cached events (not fetching again).");
      return;
    }

    try {
      console.log("🌐 Fetching events:", API_URL);

      const response = await axios.get(API_URL, {
        timeout: 15000, // 15 seconds timeout
      });

      const apiData = response.data;

      const normalizedEvents: EventData[] = apiData.map((event: any) => ({
        ...event,
        event_id: event.event_id ?? event.id,
        title: event.name ?? event.title ?? "Untitled Event",
        name: event.name ?? event.title ?? "Untitled Event",
        posterUrl: event.poster_url ?? "",
        paymentMethods: event.payment_methods ?? [],
        ticketTypes: event.ticket_types ?? [],
        hostName: event.host_name ?? "Unknown Host",
        hostId: event.host_id,
        status: event.is_approved ? "Approved" : "Pending Approval",
      }));

      setEvents(normalizedEvents);
      setLastFetched(now);

      console.log("✅ Events fetched successfully:", normalizedEvents.length);
    } catch (err: any) {
      // Detect CORS issue
      if (err?.message?.includes("Network Error")) {
        console.error("🌐 CORS ERROR: Backend is reachable but blocked.");
        console.error("❌ No Access-Control-Allow-Origin header found.");
      }

      // Detect 502 Bad Gateway
      if (err?.response?.status === 502) {
        console.error("❌ Backend responded with 502 Bad Gateway.");
        console.error("💡 Render backend is probably sleeping or restarting.");
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
