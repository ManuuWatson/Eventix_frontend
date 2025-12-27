import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QrCodeIcon, ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const HostEventCheckIn: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();

    const [ticketId, setTicketId] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);

    const handleCheckIn = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!ticketId.trim()) return;

        setStatus("loading");
        setResult(null);

        try {
            const response = await axiosInstance.post("/bookings/checkin/", {
                ticket_id: ticketId,
                event_id: eventId,
            });

            const data = response.data;
            if (data.valid) {
                setStatus("success");
                setResult(data);
                // Optional: Clear input after success for rapid scanning
                // setTicketId(""); 
            } else {
                setStatus("error");
                setResult(data);
            }
        } catch (err: any) {
            console.error("Check-in error:", err);
            setStatus("error");
            setResult({
                valid: false,
                message: err.response?.data?.message || "Server Error / Invalid Request"
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Events
            </button>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-indigo-100 p-4 rounded-full inline-block mb-4">
                        <QrCodeIcon className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Ticket Check-In</h1>
                    <p className="text-gray-500">Event ID: {eventId}</p>
                </div>

                <form onSubmit={handleCheckIn} className="mb-8">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter Ticket ID / Scan Code
                        </label>
                        <input
                            type="text"
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                            placeholder="e.g. 12345"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-lg text-center tracking-widest"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === "loading" || !ticketId}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {status === "loading" ? "Verifying..." : "Validate Ticket"}
                    </button>
                </form>

                {/* Result Display */}
                {status !== "idle" && result && (
                    <div className={`p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300 ${status === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                        }`}>
                        {status === "success" ? (
                            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        ) : (
                            <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-3" />
                        )}

                        <h2 className={`text-xl font-bold mb-2 ${status === "success" ? "text-green-800" : "text-red-800"
                            }`}>
                            {status === "success" ? "Access Granted" : "Access Denied"}
                        </h2>

                        <p className="text-lg font-medium mb-1">{result.message}</p>

                        {result.attendee && (
                            <div className="mt-4 pt-4 border-t border-gray-200/50">
                                <p className="text-sm text-gray-500">Attendee</p>
                                <p className="font-semibold text-gray-900">{result.attendee}</p>
                                <p className="text-sm text-gray-500 mt-2">Ticket Type</p>
                                <p className="font-semibold text-gray-900">{result.ticket_type}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>Tip: You can use a USB QR scanner to input codes directly here.</p>
                </div>
            </div>
        </div>
    );
};

export default HostEventCheckIn;
