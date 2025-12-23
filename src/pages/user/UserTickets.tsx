import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { CalendarIcon, MapPinIcon, TicketIcon } from 'lucide-react';

const UserTickets: React.FC = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axiosInstance.get('/bookings/my_bookings/');
                setTickets(response.data);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading tickets...</div>;
    }

    if (tickets.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl shadow-md">
                <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No tickets yet</h3>
                <p className="text-gray-500 mb-6">You haven't purchased any tickets yet.</p>
                <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Browse Events
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
            <div className="space-y-4">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 md:flex">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-indigo-900 mb-2">{ticket.event_name}</h3>
                                    <div className="flex items-center text-gray-600 mb-1 text-sm">
                                        <CalendarIcon className="h-4 w-4 mr-2" />
                                        {new Date(ticket.event_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-3 text-sm">
                                        <MapPinIcon className="h-4 w-4 mr-2" />
                                        {ticket.event_location}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                    </span>
                                    <p className="mt-2 text-lg font-bold text-gray-900">${ticket.total_price}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-700">Type:</span> {ticket.ticket_type} • <span className="font-medium text-gray-700">Qty:</span> {ticket.quantity}
                                </div>
                                <Link to={`/confirmation/${ticket.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center">
                                    View Ticket <TicketIcon className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                        {/* Decorative Side Strip */}
                        <div className={`md:w-4 ${ticket.status === 'confirmed' ? 'bg-green-500' : ticket.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserTickets;
