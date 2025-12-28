import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, TicketIcon, UsersIcon, CheckCircleIcon, XCircleIcon, QrCodeIcon, BanknoteIcon, LayersIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const HostEventDetails: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Check-in state
    const [ticketId, setTicketId] = useState("");
    const [checkInStatus, setCheckInStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [checkInResult, setCheckInResult] = useState<any>(null);

    const fetchEventDetails = () => {
        setLoading(true);
        axiosInstance.get(`/events/${eventId}/`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const handleCheckIn = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!ticketId.trim()) return;

        setCheckInStatus("loading");
        setCheckInResult(null);

        try {
            const response = await axiosInstance.post("/bookings/checkin/", {
                ticket_id: ticketId,
                event_id: eventId,
            });

            const data = response.data;
            if (data.valid) {
                setCheckInStatus("success");
                setCheckInResult(data);
                setTicketId(""); // Clear input on success

                // Optimistic Update: Manually increment attendee count instantly
                setEvent((prev: any) => ({
                    ...prev,
                    attendees_count: (prev?.attendees_count || 0) + 1
                }));

                // Helper: Refresh event details to ensure consistency (background)
                fetchEventDetails();
            } else {
                setCheckInStatus("error");
                setCheckInResult(data);
            }
        } catch (err: any) {
            console.error("Check-in error:", err);
            setCheckInStatus("error");
            setCheckInResult({
                valid: false,
                message: err.response?.data?.message || "Server Error / Invalid Request"
            });
        }
    };

    if (loading) return <div className="p-8 text-center">Loading details...</div>;
    if (!event) return <div className="p-8 text-center text-red-500">Event not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button
                onClick={() => navigate("/host/dashboard/events")}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to My Events
            </button>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Event Title */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
                    <p className="text-gray-500">{new Date(event.date).toDateString()} • {event.location}</p>
                </div>
            </div>

            {/* Stats Cards */}
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md border border-gray-100 flex items-center">
                    <div className="p-2 sm:p-3 bg-blue-100 rounded-full mr-2 sm:mr-4">
                        <TicketIcon className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Sold</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">{event.sold_count || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md border border-gray-100 flex items-center">
                    <div className="p-2 sm:p-3 bg-green-100 rounded-full mr-2 sm:mr-4">
                        <UsersIcon className="h-5 w-5 sm:h-8 sm:w-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Checked-In</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">{event.attendees_count || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md border border-gray-100 flex items-center">
                    <div className="p-2 sm:p-3 bg-yellow-100 rounded-full mr-2 sm:mr-4">
                        <BanknoteIcon className="h-5 w-5 sm:h-8 sm:w-8 text-yellow-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Revenue</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                            {event.revenue?.toLocaleString() || 0}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md border border-gray-100 flex items-center">
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-full mr-2 sm:mr-4">
                        <LayersIcon className="h-5 w-5 sm:h-8 sm:w-8 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Available</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">{event.tickets_available || 0}</p>
                    </div>
                </div>
            </div>

            {/* Check-In Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <QrCodeIcon className="h-6 w-6 mr-2 text-indigo-600" />
                        Ticket Check-In
                    </h2>
                </div>

                <div className="p-8">
                    <div className="max-w-md mx-auto">
                        <form onSubmit={handleCheckIn} className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                Scan QR Code or Enter Ticket ID
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                    placeholder="Ticket ID"
                                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-lg text-center"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={checkInStatus === "loading" || !ticketId}
                                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                                >
                                    {checkInStatus === "loading" ? "..." : "Validate"}
                                </button>
                            </div>
                        </form>

                        {/* Result Display */}
                        {checkInStatus !== "idle" && checkInResult && (
                            <div className={`p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300 ${checkInStatus === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                                }`}>
                                {checkInStatus === "success" ? (
                                    <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                ) : (
                                    <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-3" />
                                )}

                                <h2 className={`text-xl font-bold mb-2 ${checkInStatus === "success" ? "text-green-800" : "text-red-800"
                                    }`}>
                                    {checkInStatus === "success" ? "Access Granted" : "Access Denied"}
                                </h2>

                                <p className="text-lg font-medium mb-1">{checkInResult.message}</p>

                                {checkInResult.attendee && (
                                    <div className="mt-4 pt-4 border-t border-gray-200/50">
                                        <p className="text-sm text-gray-500">Attendee</p>
                                        <p className="font-semibold text-gray-900">{checkInResult.attendee}</p>
                                        <p className="text-sm text-gray-500 mt-2">Ticket Type</p>
                                        <p className="font-semibold text-gray-900">{checkInResult.ticket_type}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostEventDetails;
