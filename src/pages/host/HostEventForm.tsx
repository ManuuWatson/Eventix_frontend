import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, TrashIcon } from 'lucide-react';
import axios from 'axios';

type TicketType = {
  id: string;
  name: string;
  price: number;
};

const HostEventForm: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  // We need both user and authToken now
  const { user, authToken } = useAuth();

  const isEditMode = !!eventId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    poster: '',
    date: '',
    location: '',
  });

  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { id: `new-${Date.now()}`, name: 'Standard', price: 0 },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Handle input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle poster upload
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPosterPreview(result);
      setFormData(prev => ({ ...prev, poster: result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle ticket updates
  const handleTicketChange = (index: number, field: keyof TicketType, value: string | number) => {
    setTicketTypes(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'price' ? Number(value) : (value as any),
      };
      return updated;
    });
  };

  const addTicketType = () =>
    setTicketTypes(prev => [...prev, { id: `new-${Date.now()}`, name: '', price: 0 }]);

  const removeTicketType = (index: number) => {
    setTicketTypes(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.location.trim()) newErrors.location = 'Event location is required';
    if (!formData.poster) newErrors.poster = 'Poster image is required';

    ticketTypes.forEach((t, i) => {
      if (!t.name?.trim()) newErrors[`ticket-${i}-name`] = 'Ticket name is required';
      if (t.price === undefined || isNaN(t.price) || t.price < 0)
        newErrors[`ticket-${i}-price`] = 'Ticket price must be >= 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // IMPORTANT: Check if the user object and its token exist before making the API call
    // Use the separate authToken from the context
    if (!user || !authToken) {
        setMessage('❌ User not authenticated. Please log in again.');
        setIsSubmitting(false);
        return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Convert datetime-local -> YYYY-MM-DD for backend
      const dateOnly = formData.date.split('T')[0];

      const eventData = {
        name: formData.name,
        description: formData.description,
        date: dateOnly,
        location: formData.location,
        poster: formData.poster,
        host_name: user?.full_name || 'Unknown Host',
        ticket_types: ticketTypes.map(t => ({
          name: t.name,
          price: t.price,
        })),
      };
      
      // ✅ Updated axios.post call to include the Authorization header using authToken
      const response = await axios.post('http://127.0.0.1:8000/api/events/', eventData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Use authToken here
        },
      });

      console.log('✅ Event created:', response.data);

      if (response.status === 201 || response.status === 200) {
        setMessage('✅ Event created successfully! Awaiting admin approval.');

        // Redirect back to HostDashboard and pass refresh signal
        setTimeout(() => {
          navigate('/host-dashboard/events', { state: { refresh: true } });
        }, 500);
      } else {
        setMessage('⚠️ Something went wrong. Please try again.');
      }
    } catch (err: any) {
      console.error('❌ Error saving event:', err.response?.data || err.message || err);
      // More descriptive error handling if needed
      if (err.response?.status === 401 || err.response?.status === 403) {
          setMessage('❌ Authentication failed. Please log in again.');
      } else {
          setMessage('❌ Failed to create event. Check console for details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Edit Event' : 'Create New Event'}
      </h1>

      {message && (
        <p
          className={`mb-4 text-center font-semibold ${
            message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Poster */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Poster*</label>
            <input type="file" accept="image/*" onChange={handlePosterChange} />
            {posterPreview && (
              <img
                src={posterPreview}
                alt="Preview"
                className="mt-2 h-32 rounded-md object-cover"
              />
            )}
            {errors.poster && <p className="text-sm text-red-600">{errors.poster}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date*</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Ticket Types Management */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Ticket Types</h3>
            {ticketTypes.map((ticket, index) => (
              <div key={ticket.id} className="flex gap-4 mb-3 items-center">
                <input
                  type="text"
                  placeholder="Ticket Name (e.g., VIP, Early Bird)"
                  value={ticket.name}
                  onChange={e => handleTicketChange(index, 'name', e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-md ${
                    errors[`ticket-${index}-name`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={ticket.price}
                  onChange={e => handleTicketChange(index, 'price', e.target.value)}
                  className={`w-32 px-4 py-2 border rounded-md ${
                    errors[`ticket-${index}-price`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeTicketType(index)}
                  disabled={ticketTypes.length === 1}
                  className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50 transition"
                  title="Remove ticket type"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTicketType}
              className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add another ticket type
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition"
            >
              {isSubmitting ? 'Saving Event...' : (isEditMode ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostEventForm;
