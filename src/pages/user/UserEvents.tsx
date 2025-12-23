
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { CalendarIcon, MapPinIcon, InfoIcon } from 'lucide-react';

const UserEvents: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get('/bookings/my_bookings/');
                const bookings = response.data;

                // Deduplicate events based on event_id
                const uniqueEventsMap = new Map();
                bookings.forEach((booking: any) => {
                    if (!uniqueEventsMap.has(booking.event_id)) {
                        uniqueEventsMap.set(booking.event_id, {
                            id: booking.event_id,
                            name: booking.event_name,
                            date: booking.event_date,
                            location: booking.event_location,
                            // You might want to pull an image if available in the future
                        });
                    }
                });

                setEvents(Array.from(uniqueEventsMap.values()));
            } catch (error) {
                console.error("Failed to fetch my events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading your events...</div>;
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <CalendarIcon className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No upcoming events</h3>
                <p className="text-gray-500 mb-6">You haven't purchased tickets for any events yet.</p>
                <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    Explore Events
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Browse more events
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                        {/* Placeholder for event image or a nice gradient header */}
                        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></div>
                            <CalendarIcon className="h-12 w-12 text-white opacity-50 transform group-hover:scale-110 transition-transform duration-300" />
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                {event.name}
                            </h3>

                            <div className="space-y-2 mb-4 flex-1">
                                <div className="flex items-start text-sm text-gray-600">
                                    <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-indigo-500 flex-shrink-0" />
                                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-start text-sm text-gray-600">
                                    <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-indigo-500 flex-shrink-0" />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2">
                                <Link
                                    to={`/events/${event.id}`}
                                    className="flex-1 text-center py-2 px-4 border border-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium text-sm transition-colors"
                                >
                                    Event Details
                                </Link>
                                <Link
                                    to="/user/dashboard/tickets"
                                    className="flex-1 text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
                                >
                                    View Tickets
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserEvents;
