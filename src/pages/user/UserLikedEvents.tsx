
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { CalendarIcon, MapPinIcon, HeartIcon } from 'lucide-react';

const UserLikedEvents: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedEvents = async () => {
            try {
                // The endpoint is exposed via the router as /events/liked/
                const response = await axiosInstance.get('/events/liked/');
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch liked events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLikedEvents();
    }, []);

    const handleUnlike = async (eventId: number) => {
        try {
            await axiosInstance.post(`/events/${eventId}/like/`);
            // Remove from list immediately
            setEvents(prev => prev.filter(e => e.event_id !== eventId));
        } catch (error) {
            console.error("Failed to unlike event:", error);
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading liked events...</div>;
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <HeartIcon className="h-16 w-16 text-red-200 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No liked events</h3>
                <p className="text-gray-500 mb-6">You haven't liked any events yet.</p>
                <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    Explore Events
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Liked Events</h1>
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Browse more events
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.event_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                        <div className="h-32 bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></div>
                            <HeartIcon className="h-12 w-12 text-white opacity-50 transform group-hover:scale-110 transition-transform duration-300" />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleUnlike(event.event_id);
                                }}
                                className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
                                title="Unlike Event"
                            >
                                <HeartIcon className="h-5 w-5 text-white fill-current" />
                            </button>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                                {event.name}
                            </h3>

                            <div className="space-y-2 mb-4 flex-1">
                                <div className="flex items-start text-sm text-gray-600">
                                    <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-pink-500 flex-shrink-0" />
                                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-start text-sm text-gray-600">
                                    <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-pink-500 flex-shrink-0" />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-50">
                                <Link
                                    to={`/events/${event.event_id}`}
                                    className="block w-full text-center py-2 px-4 border border-pink-100 text-pink-600 rounded-lg hover:bg-pink-50 font-medium text-sm transition-colors"
                                >
                                    Event Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserLikedEvents;
