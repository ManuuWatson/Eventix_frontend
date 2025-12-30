// src/pages/MpesaPaymentPage.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PhoneIcon, CheckIcon, ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

interface PaymentLocationState {
  amount: number;
  phone: string;
  eventId: number;
  eventName: string;
  ticketTypeId: number;
  ticketType: string;
  quantity: number;
}

const MpesaPaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const state = location.state as PaymentLocationState;

  const [phoneNumber, setPhoneNumber] = useState(state?.phone || "");
  const [paymentStatus, setPaymentStatus] =
    useState<"idle" | "processing" | "success" | "failed">("idle");
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    // If no state or user not logged in, redirect to login
    if (!state) navigate("/");
    if (!user || !token) navigate(`/login?next=/checkout`);
  }, [state, user, token, navigate]);



  const handlePayment = async () => {
    if (!state || !token || !user) return;

    setPaymentStatus("processing");
    setPaymentMessage(`Initiating booking...`);

    try {
      // Step 1: Create Booking
      const bookingRes = await axiosInstance.post("/bookings/create/", {
        event: state.eventId,
        ticket_type: state.ticketTypeId,
        quantity: state.quantity,
      });

      const { booking_id } = bookingRes.data;

      if (!booking_id) {
        throw new Error("Failed to create booking ID.");
      }

      setPaymentMessage(`Sending STK Push to ${phoneNumber}...`);

      // Step 2: Initiate Payment
      const response = await axiosInstance.post("/payments/initiate-payment/", {
        booking_id: booking_id,
        phone: phoneNumber,
      });

      const data = response.data;

      if (!data.checkout_request_id) {
        setPaymentStatus("failed");
        setPaymentMessage(data.error || "Failed to initiate payment.");
        return;
      }

      setPaymentMessage(
        "STK Push sent! Enter your M-Pesa PIN on your phone."
      );

      // Poll for payment status
      const poll = setInterval(async () => {
        try {
          const res = await axiosInstance.get(
            `/payments/status/${booking_id}/`
          );

          const statusData = res.data;

          if (statusData.status === "completed") {
            clearInterval(poll);
            setPaymentStatus("success");
            setPaymentMessage(
              "Payment confirmed! Your e-ticket is being generated…"
            );

            setTimeout(() => {
              navigate(`/confirmation/${booking_id}`);
            }, 1500);
          }

          if (statusData.status === "failed") {
            clearInterval(poll);
            setPaymentStatus("failed");

            if (statusData.result_code === "1032") {
              setPaymentMessage("Request cancelled by user.");
            } else {
              setPaymentMessage(statusData.result_desc || "Payment failed. Please try again.");
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setPaymentStatus("failed");
      setPaymentMessage(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Unexpected error occurred."
      );
    }
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 px-6 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="text-white mr-4">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-white text-lg font-bold">M-Pesa Payment</h1>
        </div>

        <div className="p-8">
          {/* Event Info */}
          <div className="text-center mb-8">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <PhoneIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Lipa na M-Pesa</h2>
            <p className="text-gray-500 mt-2">To complete your purchase for</p>
            <p className="font-semibold text-gray-800">{state.eventName}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Ticket Type</span>
              <span className="font-medium">{state.ticketType}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Quantity</span>
              <span className="font-medium">{state.quantity}</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-lg text-gray-900">
              <span>Amount to Pay</span>
              <span>KES {state.amount}</span>
            </div>
          </div>

          {/* Payment Form */}
          {paymentStatus === "idle" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-medium">
                    +254
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-16 pr-4 py-3 border rounded-lg"
                    placeholder="7XXXXXXXX"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!phoneNumber}
                className="w-full py-4 bg-green-600 text-white rounded-lg font-bold"
              >
                Pay KES {state.amount}
              </button>
            </div>
          )}

          {/* PROCESSING */}
          {paymentStatus === "processing" && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-bold">Processing Payment</h3>
              <p className="text-green-700 mt-2">{paymentMessage}</p>
            </div>
          )}

          {/* SUCCESS */}
          {paymentStatus === "success" && (
            <div className="text-center py-6">
              <div className="rounded-full h-20 w-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold">Payment Successful!</h3>
              <p className="text-gray-600">{paymentMessage}</p>
            </div>
          )}

          {/* FAILED */}
          {paymentStatus === "failed" && (
            <div className="text-center py-6 text-red-600">
              <h3 className="text-2xl font-bold">Payment Failed</h3>
              <p>{paymentMessage}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t">
          <p className="text-xs text-gray-400">Secured by M-Pesa & Eventix</p>
        </div>
      </div>

      {/* CANCELLED MODAL */}
      {paymentStatus === "failed" && paymentMessage.toLowerCase().includes("cancelled") && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center animate-in scale-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Cancelled</h3>
            <p className="text-gray-600 mb-6">
              You cancelled the payment request. Please try again if you want to proceed.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MpesaPaymentPage;
