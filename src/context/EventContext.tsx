import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface TicketType {
  id?: number;
  ticket_name: string;
  ticket_price: number;
  ticket_quantity?: number;
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
  payment_methods: string[];
  ticket_types: TicketType[];
  host_name?: string;
  host_id?: number;
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

  // ✅ Load API URL from .env (works local + deployed)
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const API_URL = `${API_BASE_URL}/events/`;

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL, { timeout: 15000 });
      const apiData = response.data;

      const normalizedEvents: EventData[] = apiData.map((event: any) => ({
        ...event,
        event_id: event.event_id ?? event.id,
        name: event.name ?? event.title ?? "Untitled Event",
        title: event.title ?? event.name,
        posterUrl: event.poster_url ?? "",
        payment_methods: event.payment_methods ?? [],
        ticket_types: event.ticket_types ?? [],
        host_name: event.host_name ?? "Unknown Host",
        host_id: event.host_id,
        status: event.is_approved ? "Approved" : "Pending Approval",
      }));

      setEvents(normalizedEvents);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
    }
  };

  const getEvent = (eventId: string) => {
    return events.find((e) => e.event_id.toString() === eventId);
  };

  useEffect(() => {
    // Initial load
    fetchEvents();

    // 🔥 Poll every 5 seconds for instant live updates
    const interval = setInterval(() => {
      fetchEvents();
    }, 5000);

    return () => clearInterval(interval);
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
