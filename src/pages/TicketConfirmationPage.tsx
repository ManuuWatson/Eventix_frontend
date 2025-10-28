import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DownloadIcon, PrinterIcon, MailIcon, PhoneIcon, CheckCircleIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
const TicketConfirmationPage = () => {
  const {
    ticketId
  } = useParams<{
    ticketId: string;
  }>();
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  // In a real app, we would fetch the ticket details from the API
  // For this demo, we'll use mock data
  const ticketDetails = {
    id: ticketId,
    eventTitle: 'Summer Music Festival',
    eventDate: 'July 15, 2023',
    eventTime: '6:00 PM',
    eventLocation: 'Central Park, New York',
    ticketType: 'VIP',
    quantity: 1,
    buyerName: 'John Doe',
    buyerEmail: 'john.doe@example.com',
    totalPaid: 150,
    purchaseDate: new Date().toLocaleDateString(),
    qrValue: `TICKET-${ticketId}-${Date.now()}`
  };
  const handleSendEmail = () => {
    // Simulate sending email
    setTimeout(() => {
      setEmailSent(true);
    }, 1000);
  };
  const handleSendSMS = () => {
    // Simulate sending SMS
    setTimeout(() => {
      setSmsSent(true);
    }, 1000);
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your tickets have been successfully purchased.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Ticket Header */}
          <div className="bg-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold">{ticketDetails.eventTitle}</h2>
            <p className="text-lg">
              {ticketDetails.eventDate} • {ticketDetails.eventTime}
            </p>
          </div>
          {/* Ticket Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Ticket Info */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Ticket Details</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-600">Ticket ID:</td>
                        <td className="py-2 font-medium">{ticketDetails.id}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Ticket Type:</td>
                        <td className="py-2 font-medium">
                          {ticketDetails.ticketType}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Quantity:</td>
                        <td className="py-2 font-medium">
                          {ticketDetails.quantity}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Attendee:</td>
                        <td className="py-2 font-medium">
                          {ticketDetails.buyerName}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Purchase Date:</td>
                        <td className="py-2 font-medium">
                          {ticketDetails.purchaseDate}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Amount Paid:</td>
                        <td className="py-2 font-medium">
                          ${ticketDetails.totalPaid}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Event Location</h3>
                  <p className="text-gray-700 mb-1">
                    {ticketDetails.eventLocation}
                  </p>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm">
                    View on map
                  </a>
                </div>
              </div>
              {/* Right Column - QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 p-4 bg-white border border-gray-200 rounded-md">
                  <QRCodeSVG value={ticketDetails.qrValue} size={180} level="H" includeMargin={true} />
                </div>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Present this QR code at the event entrance for validation
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Get Your Ticket</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700">
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download PDF Ticket
            </button>
            <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300">
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print Ticket
            </button>
          </div>
        </div>
        {/* Send Ticket */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Send Ticket</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className={`flex items-center justify-center py-3 px-4 rounded-md ${emailSent ? 'bg-green-100 text-green-800 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`} onClick={handleSendEmail} disabled={emailSent}>
              {emailSent ? <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Email Sent
                </> : <>
                  <MailIcon className="h-5 w-5 mr-2" />
                  Send via Email
                </>}
            </button>
            <button className={`flex items-center justify-center py-3 px-4 rounded-md ${smsSent ? 'bg-green-100 text-green-800 cursor-default' : 'bg-gray-800 text-white hover:bg-gray-900'}`} onClick={handleSendSMS} disabled={smsSent}>
              {smsSent ? <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  SMS Sent
                </> : <>
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Send via SMS
                </>}
            </button>
          </div>
        </div>
        <div className="text-center">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Browse More Events
          </Link>
        </div>
      </div>
    </div>;
};
export default TicketConfirmationPage;