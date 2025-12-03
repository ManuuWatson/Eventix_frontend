import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "../api/axiosInstance";

/* ---------- Types ---------- */

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

/* ---------- Context ---------- */

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  /**  
   * 🚀 Uses your axiosInstance baseURL:
   * https://eventix-backend2.onrender.com/api
   */
  const API_URL = "/events/";

  /* ---------- Fetch Events ---------- */

  const fetchEvents = async (force = false) => {
    const now = Date.now();

    // ⏳ Cache for 5 minutes
    if (!force && lastFetched && now - lastFetched < 5 * 60 * 1000) {
      console.log("⏳ Using cached events");
      return;
    }

    try {
      console.log("🌐 Fetching events from:", API_URL);

      const response = await axiosInstance.get(API_URL, { timeout: 20000 });
      const apiEvents = response.data;

      console.log("📥 Raw backend payload:", apiEvents);

      /* Normalize backend data safely */
      const normalized: EventData[] = apiEvents.map((event: any) => ({
        ...event,

        /** 
         * 🔥 DO NOT rename backend fields, just fallback for missing values
         */
        event_id: event.event_id ?? event.id,
        name: event.name ?? event.title ?? "Untitled Event",
        title: event.title ?? event.name,
        posterUrl: event.poster_url ?? "",

        payment_methods: event.payment_methods ?? [],
        ticket_types: event.ticket_types ?? [],

        host_name: event.host_name ?? "Unknown Host",
        host_id: event.host_id ?? null,

        status: event.is_approved
          ? "Approved"
          : event.is_rejected
          ? "Rejected"
          : "Pending Approval",
      }));

      setEvents(normalized);
      setLastFetched(now);

      console.log("✅ Events loaded:", normalized.length);
    } catch (error: any) {
      console.error("❌ Event Fetch Error:", error);

      if (error?.message?.includes("Network Error")) {
        console.error("🌐 POSSIBLE CORS ISSUE");
      }

      if (error?.response?.status === 502) {
        console.error("❌ Backend sleeping (Render cold start)");
      }
    }
  };

  /* ---------- Get a Single Event ---------- */

  const getEvent = (eventId: string) => {
    return events.find((e) => e.event_id.toString() === eventId);
  };

  /* ---------- Load events on mount ---------- */
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, fetchEvents, getEvent }}>
      {children}
    </EventContext.Provider>
  );
};

/* ---------- Hook ---------- */

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context)
    throw new Error("useEvents must be used within EventProvider");
  return context;
};
