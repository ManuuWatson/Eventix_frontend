import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PlusIcon, TrashIcon, CheckCircleIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

type TicketType = {
  id: string;
  ticket_name: string;
  ticket_price: number | string;
  ticket_quantity?: number | string;
};

const HostEventForm: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEditMode = !!eventId;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    poster: null as File | null,
    date: "",
    location: "",
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      id: `new-${Date.now()}`,
      ticket_name: "",
      ticket_price: "",
      ticket_quantity: "",
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // LOAD EVENT WHEN EDITING
  useEffect(() => {
    if (!isEditMode) return;

    axiosInstance
      .get(`/events/${eventId}/`)
      .then((res) => {
        const event = res.data;

        setFormData({
          name: event.name,
          description: event.description,
          date: event.date,
          location: event.location,
          poster: null,
        });

        setPosterPreview(event.poster_url);

        if (event.ticket_types?.length > 0) {
          setTicketTypes(
            event.ticket_types.map((t: any, i: number) => ({
              id: `existing-${i}`,
              ticket_name: t.ticket_name,
              ticket_price: t.ticket_price,
              ticket_quantity: t.ticket_quantity ?? "", // Use empty string for unlimited
            }))
          );
        }
      })
      .catch(() => setMessage("⚠️ Failed to load event details."));
  }, [isEditMode, eventId]);

  // INPUT HANDLERS
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, poster: file }));
  };

  const handleTicketChange = (
    index: number,
    field: keyof TicketType,
    value: string | number
  ) => {
    setTicketTypes((prev) =>
      prev.map((ticket, i) =>
        i === index
          ? {
            ...ticket,
            [field]: value,
          }
          : ticket
      )
    );
  };

  const addTicketType = () =>
    setTicketTypes((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        ticket_name: "",
        ticket_price: "",
        ticket_quantity: "",
      },
    ]);

  const removeTicketType = (index: number) =>
    setTicketTypes((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );

  // VALIDATION
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.description.trim())
      newErrors.description = "Event description is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.location.trim())
      newErrors.location = "Event location is required";
    if (!formData.poster && !isEditMode) newErrors.poster = "Poster is required";

    ticketTypes.forEach((t, i) => {
      if (!t.ticket_name.trim())
        newErrors[`ticket-${i}-name`] = "Ticket name is required";

      const price = Number(t.ticket_price);
      if (t.ticket_price === "" || isNaN(price) || price < 0)
        newErrors[`ticket-${i}-price`] = "Price must be >= 0";

      // For quantity: empty string is valid (unlimited). Only number < 0 is invalid.
      if (t.ticket_quantity !== "") {
        const qty = Number(t.ticket_quantity);
        if (isNaN(qty) || qty < 0) {
          newErrors[`ticket-${i}-quantity`] = "Quantity must be >= 0";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) {
      setMessage("❌ User not authenticated.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("description", formData.description);
      formPayload.append("date", formData.date);
      formPayload.append("location", formData.location);
      formPayload.append("host_name", user.full_name);
      if (formData.poster) formPayload.append("poster", formData.poster);

      const backendTickets = ticketTypes.map((t) => ({
        ticket_name: t.ticket_name,
        ticket_price: String(t.ticket_price),
        // If empty string, send null for unlimited
        ticket_quantity: t.ticket_quantity === "" ? null : Number(t.ticket_quantity),
      }));

      formPayload.append("ticket_types", JSON.stringify(backendTickets));

      const endpoint = isEditMode ? `/events/${eventId}/` : `/events/`;

      if (isEditMode) {
        await axiosInstance.put(endpoint, formPayload);
      } else {
        await axiosInstance.post(endpoint, formPayload);
      }

      if (isEditMode) {
        setMessage("✅ Event updated successfully!");
        setTimeout(
          () => navigate("/host/dashboard/", { state: { refresh: true } }),
          900
        );
      } else {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setMessage(
        err.response?.data?.detail ||
        "❌ Failed to save event. Check console for details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Event" : "Create Event"}
      </h1>

      {message && (
        <p
          className={`mb-4 text-center font-semibold ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
        >
          {message}
        </p>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Event Details */}
          {(["name", "description", "date", "location"] as const).map((field) => (
            <div key={field}>
              <label className="font-medium">
                {field === "name" ? "Event Name" : field.charAt(0).toUpperCase() + field.slice(1)}*
              </label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded ${errors[field] ? "border-red-500" : "border-gray-300"
                    }`}
                />
              ) : (
                <input
                  type={field === "date" ? "date" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded ${errors[field] ? "border-red-500" : "border-gray-300"
                    }`}
                />
              )}
              {errors[field] && <p className="text-red-600">{errors[field]}</p>}
            </div>
          ))}

          {/* Poster */}
          <div>
            <label className="font-medium">
              Poster {isEditMode ? "(optional update)" : "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
              className={`w-full px-4 py-2 border rounded ${errors.poster ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.poster && <p className="text-red-600">{errors.poster}</p>}
            {posterPreview && (
              <img
                src={posterPreview}
                alt="Poster preview"
                className="mt-4 h-32 object-cover"
              />
            )}
          </div>

          {/* Ticket Types */}
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-3">Ticket Types</h2>

            {ticketTypes.map((ticket, index) => (
              <div
                key={ticket.id}
                className="flex flex-col md:flex-row gap-4 mb-4 p-4 border rounded shadow-sm md:items-end"
              >
                {/* Ticket Name */}
                <div className="w-full md:flex-1 flex flex-col">
                  <label className="font-medium mb-1">Ticket Name*</label>
                  <input
                    type="text"
                    value={ticket.ticket_name}
                    onChange={(e) =>
                      handleTicketChange(index, "ticket_name", e.target.value)
                    }
                    className={`px-3 py-2 border rounded ${errors[`ticket-${index}-name`]
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />
                  {errors[`ticket-${index}-name`] && (
                    <p className="text-red-600">{errors[`ticket-${index}-name`]}</p>
                  )}
                </div>

                {/* Ticket Price */}
                <div className="w-full md:w-32 flex flex-col">
                  <label className="font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    value={ticket.ticket_price}
                    onChange={(e) =>
                      handleTicketChange(index, "ticket_price", e.target.value)
                    }
                    className={`px-3 py-2 border rounded ${errors[`ticket-${index}-price`]
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />
                  {errors[`ticket-${index}-price`] && (
                    <p className="text-red-600">{errors[`ticket-${index}-price`]}</p>
                  )}
                </div>

                {/* Ticket Number */}
                <div className="w-full md:w-32 flex flex-col">
                  <label className="font-medium mb-1">Ticket Number (Optional)</label>
                  <input
                    type="number"
                    value={ticket.ticket_quantity ?? ""}
                    onChange={(e) =>
                      handleTicketChange(index, "ticket_quantity", e.target.value)
                    }
                    className={`px-3 py-2 border rounded ${errors[`ticket-${index}-quantity`]
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />
                  {errors[`ticket-${index}-quantity`] && (
                    <p className="text-red-600">
                      {errors[`ticket-${index}-quantity`]}
                    </p>
                  )}
                </div>

                {/* Total Price */}
                <div className="w-full md:w-32 flex flex-col">
                  <label className="font-medium mb-1">Total Amount</label>
                  <input
                    type="text"
                    value={(Number(ticket.ticket_price) * (Number(ticket.ticket_quantity) || 0)).toFixed(2)}
                    disabled
                    className="px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Remove Ticket */}
                <button
                  type="button"
                  onClick={() => removeTicketType(index)}
                  disabled={ticketTypes.length === 1}
                  className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400 self-end md:self-auto"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addTicketType}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-5 w-5 mr-1" /> Add Ticket Type
            </button>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Event"
                  : "Create Event"}
            </button>
          </div>
        </form>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Event Created Successfully!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Your event has been submitted. Please navigate to 'My Events' to view it.
              It will be visible to the public once approved by an admin.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/host/dashboard/events", { state: { refresh: true } })}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Go to My Events
              </button>
              <button
                onClick={() => navigate("/host/dashboard", { state: { refresh: true } })}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostEventForm;
