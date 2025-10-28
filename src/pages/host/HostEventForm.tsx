import React, { useState } from 'react';
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
  const { user } = useAuth();

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
        host_name: (user as any)?.name || (user as any)?.full_name || 'Unknown Host',
        ticket_types: ticketTypes.map(t => ({
          name: t.name,
          price: t.price,
        })),
      };

      const response = await axios.post('http://127.0.0.1:8000/api/events/', eventData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('✅ Event created:', response.data);

      if (response.status === 201 || response.status === 200) {
        setMessage('✅ Event created successfully! Awaiting admin approval.');
        setTimeout(() => navigate('/host-dashboard/events'), 1500);
      } else {
        setMessage('⚠️ Something went wrong. Please try again.');
      }
    } catch (err: any) {
      console.error('❌ Error saving event:', err.response?.data || err.message || err);
      setMessage('❌ Failed to create event. Check console for details.');
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

          {/* Ticket Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Types*</label>
            {ticketTypes.map((ticket, i) => (
              <div key={ticket.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={ticket.name}
                  placeholder="Ticket Name"
                  onChange={e => handleTicketChange(i, 'name', e.target.value)}
                  className="border px-2 py-1 rounded-md"
                />
                <input
                  type="number"
                  min="0"
                  value={ticket.price}
                  placeholder="Price"
                  onChange={e => handleTicketChange(i, 'price', e.target.value)}
                  className="border px-2 py-1 rounded-md"
                />
                {ticketTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTicketType(i)}
                    className="text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTicketType}
              className="flex items-center text-indigo-600 mt-2"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Ticket
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/host-dashboard/events')}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isEditMode ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostEventForm;
