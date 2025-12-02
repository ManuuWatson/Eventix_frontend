import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PlusIcon, TrashIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

type TicketType = {
  id: string;
  ticket_name: string;
  ticket_price: number;
  ticket_quantity?: number;
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
      ticket_name: "Standard",
      ticket_price: 0,
      ticket_quantity: 0,
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              ticket_price: Number(t.ticket_price),
              ticket_quantity: t.ticket_quantity ?? 0,
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
              [field]:
                field === "ticket_price" || field === "ticket_quantity"
                  ? Number(value)
                  : String(value),
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
        ticket_price: 0,
        ticket_quantity: 0,
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

    if (!formData.poster && !isEditMode)
      newErrors.poster = "Poster is required";

    ticketTypes.forEach((t, i) => {
      if (!t.ticket_name.trim())
        newErrors[`ticket-${i}-name`] = "Ticket name is required";

      if (t.ticket_price < 0)
        newErrors[`ticket-${i}-price`] = "Price must be >= 0";

      if ((t.ticket_quantity ?? 0) < 0)
        newErrors[`ticket-${i}-quantity`] = "Quantity must be >= 0";
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
        ticket_quantity: Number(t.ticket_quantity) || 0,
      }));

      formPayload.append("ticket_types", JSON.stringify(backendTickets));

      const endpoint = isEditMode ? `/events/${eventId}/` : `/events/`;

      if (isEditMode) {
        await axiosInstance.put(endpoint, formPayload);
      } else {
        await axiosInstance.post(endpoint, formPayload);
      }

      setMessage(
        isEditMode
          ? "✅ Event updated successfully!"
          : "✅ Event created successfully! Awaiting approval."
      );

      setTimeout(
        () => navigate("/host/dashboard/", { state: { refresh: true } }),
        900
      );
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
          className={`mb-4 text-center font-semibold ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Name */}
          <div>
            <label className="font-medium">Event Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="font-medium">Date*</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && <p className="text-red-600">{errors.date}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="font-medium">Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.location && (
              <p className="text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Poster */}
          <div>
            <label className="font-medium">
              Poster {isEditMode ? "(optional update)" : "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
              className={`w-full px-4 py-2 border rounded ${
                errors.poster ? "border-red-500" : "border-gray-300"
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
                className="flex gap-4 mb-4 p-4 border rounded shadow-sm"
              >
                <input
                  type="text"
                  placeholder="Ticket Name*"
                  value={ticket.ticket_name}
                  onChange={(e) =>
                    handleTicketChange(index, "ticket_name", e.target.value)
                  }
                  className={`flex-1 px-3 py-2 border rounded ${
                    errors[`ticket-${index}-name`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <input
                  type="number"
                  placeholder="Price*"
                  value={ticket.ticket_price}
                  onChange={(e) =>
                    handleTicketChange(index, "ticket_price", e.target.value)
                  }
                  className={`w-32 px-3 py-2 border rounded ${
                    errors[`ticket-${index}-price`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={ticket.ticket_quantity ?? ""}
                  onChange={(e) =>
                    handleTicketChange(index, "ticket_quantity", e.target.value)
                  }
                  className={`w-32 px-3 py-2 border rounded ${
                    errors[`ticket-${index}-quantity`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => removeTicketType(index)}
                  disabled={ticketTypes.length === 1}
                  className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400"
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
    </div>
  );
};

export default HostEventForm;
