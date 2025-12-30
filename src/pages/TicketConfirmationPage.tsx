import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DownloadIcon, PrinterIcon, MailIcon, CheckCircleIcon, ShareIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axiosInstance from '../api/axiosInstance';

const TicketConfirmationPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  const [emailSent, setEmailSent] = useState(false);
  const [shareSuccess, setShareSuccess] = useState("");

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${ticketId}/`);
        setTicket(response.data);
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
        setError("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  if (loading) return <div className="text-center py-10">Loading ticket...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!ticket) return <div className="text-center py-10">Ticket not found.</div>;

  const ticketDetails = {
    id: ticket.id,
    eventTitle: ticket.event ? ticket.event.name : "Unknown Event",
    eventDate: ticket.event ? ticket.event.date : "TBA",
    eventTime: "TBA",
    eventLocation: ticket.event ? ticket.event.location : "TBA",
    ticketType: ticket.ticket_type ? ticket.ticket_type : "Standard",
    quantity: ticket.quantity,
    buyerName: ticket.user_name,
    buyerEmail: ticket.user_email,
    totalPaid: ticket.total_price,
    purchaseDate: new Date(ticket.created_at).toLocaleDateString(),
    qrValue: `TICKET-${ticket.id}-${ticket.created_at}`
  };

  const generateTicketCanvas = async () => {
    const input = document.getElementById('ticket-content');
    if (!input) return null;

    return await html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: '#ffffff',
      scrollY: -window.scrollY
    });
  };

  const handleDownloadPDF = async () => {
    try {
      const canvas = await generateTicketCanvas();
      if (!canvas) return;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate ratio to fit width
      const ratioWidth = pageWidth / imgWidth;
      // Calculate ratio to fit height
      const ratioHeight = pageHeight / imgHeight;

      // Use the smaller ratio to ensure it fits both dimensions
      const ratio = Math.min(ratioWidth, ratioHeight);

      const pdfWidth = imgWidth * ratio;
      const pdfHeight = imgHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket-${ticketDetails.id}.pdf`);
    } catch (err) {
      console.error("PDF Download failed", err);
      alert("Failed to download PDF");
    }
  };

  const handleSendEmail = async () => {
    try {
      await axiosInstance.post(`/bookings/${ticket.id}/email_ticket/`);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000); // Reset after 3s
    } catch (err) {
      console.error("Email send failed", err);
      alert("Failed to send email. Please try again.");
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      const canvas = await generateTicketCanvas();
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Failed to generate ticket image for sharing.');
          return;
        }

        const file = new File([blob], `ticket-${ticketDetails.id}.png`, { type: 'image/png' });
        const shareData = {
          files: [file],
          title: `Ticket for ${ticketDetails.eventTitle}`,
          text: `Check out my ticket for ${ticketDetails.eventTitle}!`
        };

        // Try Web Share API (Mobile/Standard)
        if (navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            console.warn("Share API cancelled or failed:", err);
          }
        } else {
          // Fallback to Clipboard (Desktop)
          try {
            const clipboardItem = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([clipboardItem]);
            setShareSuccess("Image copied! Paste in WhatsApp Web.");
            setTimeout(() => setShareSuccess(""), 4000);

            // Open WhatsApp Web in a new tab for convenience
            window.open('https://web.whatsapp.com', '_blank');
          } catch (clipboardErr) {
            console.error("Clipboard failed:", clipboardErr);
            fallbackWhatsAppShare();
          }
        }
      }, 'image/png');

    } catch (err) {
      console.error("Error sharing:", err);
      fallbackWhatsAppShare();
    }
  };

  const fallbackWhatsAppShare = () => {
    const text = `Check out my ticket for ${ticketDetails.eventTitle}!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
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
      <div id="ticket-content" className="bg-white rounded-lg shadow-md overflow-hidden mb-8 pb-24">
        {/* Ticket Header */}
        <div className="bg-indigo-600 text-white p-6">
          <h2 className="text-2xl font-bold">{ticketDetails.eventTitle}</h2>
          <p className="text-lg">
            {ticketDetails.eventDate} • {ticketDetails.eventTime}
          </p>
        </div>
        {/* Ticket Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
                        KSh {ticketDetails.totalPaid}
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
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl shadow-sm">
                <QRCodeCanvas value={ticketDetails.qrValue} size={200} level="H" includeMargin={true} />
              </div>
              <p className="text-sm font-medium text-gray-500 text-center uppercase tracking-wide">
                Scan for Entry
              </p>
              {/* Extra spacer to ensure capture tool includes bottom area */}
              <div className="h-8"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Get Your Ticket</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={handleDownloadPDF} className="flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors">
            <DownloadIcon className="h-5 w-5 mr-2" />
            Download PDF Ticket
          </button>
          <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors">
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Ticket
          </button>
        </div>
      </div>
      {/* Send Ticket */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Share Ticket</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <button className={`flex items-center justify-center py-3 px-4 rounded-md transition-colors ${emailSent ? 'bg-green-100 text-green-800 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`} onClick={handleSendEmail} disabled={emailSent}>
            {emailSent ? <>
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Email Sent
            </> : <>
              <MailIcon className="h-5 w-5 mr-2" />
              Send via Email
            </>}
          </button>

          <button className={`flex items-center justify-center py-3 px-4 rounded-md transition-colors ${shareSuccess ? 'bg-green-600 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`} onClick={handleWhatsAppShare}>
            <ShareIcon className="h-5 w-5 mr-2" />
            {shareSuccess || "Share via WhatsApp"}
          </button>
        </div>
        {shareSuccess && <p className="text-sm text-green-600 mt-2 text-center animate-pulse">{shareSuccess}</p>}
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