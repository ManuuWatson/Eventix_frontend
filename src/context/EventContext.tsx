import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// ✅ Ticket type interface
export interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// ✅ Event data interface (renamed `id` → `event_id`)
export interface EventData {
  event_id: number; // ✅ clearer naming for event
  name: string;
  description: string;
  poster: string;
  date: string;
  location: string;
  category: string;
  payment_methods: string[];
  ticket_types: TicketType[];
  host_name: string;
  host_id: number; // ✅ consistent naming
  status: 'Pending Approval' | 'Approved' | 'Rejected';
}

// ✅ Context type
export interface EventContextType {
  events: EventData[];
  fetchEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventData[]>([]);

  // ✅ Fetch events from Django API
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/events/');
      const apiData = response.data;

      // ✅ Normalize data in case backend still sends 'id' instead of 'event_id'
      const normalizedEvents = apiData.map((event: any) => ({
        ...event,
        event_id: event.event_id ?? event.id, // fallback
      }));

      setEvents(normalizedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // ✅ Fetch events on mount
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
  if (!context) throw new Error('useEvents must be used within EventProvider');
  return context;
};
