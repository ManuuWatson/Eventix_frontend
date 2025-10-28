import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface TicketType {
  id: number;
  name: string;
  price: number;
}

interface EventData {
  id: number;
  name: string;
  description: string;
  poster: string;
  date: string;
  location: string;
  category: string;
  payment_methods: string[];
  ticket_types: TicketType[];
  host_name: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
}

interface EventContextType {
  events: EventData[];
  fetchEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventData[]>([]);

  // ✅ Fetch events from Django API
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/events/');
      setEvents(response.data);
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

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within EventProvider');
  return context;
};
