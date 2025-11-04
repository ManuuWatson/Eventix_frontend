import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Export the interfaces so they can be imported elsewhere
export interface TicketType {
  id: number;
  name: string;
  price: number;
  // Based on previous errors, we assume quantity might also exist here or is added dynamically later
  // If you store quantity sold here, ensure it's optional if not always present:
  quantity?: number; 
}

// ✅ Export the interfaces so they can be imported elsewhere
export interface EventData {
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
  hostId?: string | number;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  // Note: Based on previous errors, your backend likely uses 'hostId' not 'host_id'.
  // If your API returns 'host_id', you should update this interface to match your API response.
  // For now, I'm keeping 'hostId' as that fixed the previous error in HostDashboard.
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
