import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PlusIcon, TrashIcon } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

type TicketType = {
  id: string;
  name: string;
  price: number;
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
    { id: `new-${Date.now()}`, name: "Standard", price: 0 },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing event when editing
  useEffect(() => {
    if (!isEditMode) return;

    axiosInstance
      .get(`/events/${eventId}/`)
      .then((res) => {
        const event = res.data;

        setFormData({
          name: event.name || "",
          description: event.description || "",
          date: event.date || "",
          location: event.location || "",
          poster: null,
        });

        setPosterPreview(event.poster || null);

        if (event.ticket_types) {
          setTicketTypes(
            event.ticket_types.map((t: any, i: number) => ({
              id: `existing-${i}`,
              name: t.name,
              price: t.price,
            }))
          );
        }
      })
      .catch(() => setMessage("⚠️ Failed to load event details."));
  }, [isEditMode, eventId]);

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
      prev.map((t, i) =>
        i === index
          ? { ...t, [field]: field === "price" ? Number(value) : value }
          : t
      )
    );
  };

  const addTicketType = () =>
    setTicketTypes((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, name: "", price: 0 },
    ]);

  const removeTicketType = (index: number) =>
    setTicketTypes((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );

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
      if (!t.name.trim())
        newErrors[`ticket-${i}-name`] = "Ticket name is required";
      if (t.price < 0)
        newErrors[`ticket-${i}-price`] = "Price must be >= 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      formPayload.append("host_name", user.full_name || "Unknown");

      if (formData.poster) {
        formPayload.append("poster", formData.poster);
      }

      // ✅ Ticket types as JSON string
      formPayload.append("ticket_types", JSON.stringify(ticketTypes));

      const endpoint = isEditMode ? `/events/${eventId}/` : `/events/`;

      const response = isEditMode
        ? await axiosInstance.put(endpoint, formPayload)
        : await axiosInstance.post(endpoint, formPayload);

      if (response.status === 200 || response.status === 201) {
        setMessage(
          isEditMode
            ? "✅ Event updated successfully!"
            : "✅ Event created successfully! Awaiting admin approval."
        );
        setTimeout(
          () => navigate("/host/dashboard/", { state: { refresh: true } }),
          900
        );
      } else {
        setMessage("⚠️ Something went wrong.");
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
          className={`mb-4 text-center font-semibold ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Event Name */}
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
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
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
            <label className="font-medium">Event Poster*</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
              className={`w-full px-4 py-2 border rounded ${
                errors.poster ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.poster && (
              <p className="text-red-600">{errors.poster}</p>
            )}
            {posterPreview && (
              <img
                src={posterPreview}
                alt="Preview"
                className="h-48 w-auto rounded mt-4 shadow"
              />
            )}
          </div>

          {/* Ticket Types */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Ticket Types</h2>

            {ticketTypes.map((ticket, index) => (
              <div key={ticket.id} className="flex gap-4 mb-4 items-center">
                <input
                  type="text"
                  placeholder="Ticket Name"
                  value={ticket.name}
                  onChange={(e) =>
                    handleTicketChange(index, "name", e.target.value)
                  }
                  className={`flex-grow px-4 py-2 border rounded ${
                    errors[`ticket-${index}-name`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={ticket.price}
                  onChange={(e) =>
                    handleTicketChange(index, "price", e.target.value)
                  }
                  className={`w-32 px-4 py-2 border rounded ${
                    errors[`ticket-${index}-price`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <button
                  type="button"
                  disabled={ticketTypes.length === 1}
                  onClick={() => removeTicketType(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addTicketType}
              className="text-indigo-600 hover:text-indigo-800 flex items-center mt-2"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Ticket Type
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Event"
              : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostEventForm;
