import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { CreditCardIcon, PhoneIcon, WalletIcon, CheckIcon } from 'lucide-react';
const CheckoutPage = () => {
  const {
    eventId
  } = useParams<{
    eventId: string;
  }>();
  const [searchParams] = useSearchParams();
  const ticketTypeId = searchParams.get('ticketType') || '';
  const navigate = useNavigate();
  const {
    getEvent
  } = useEvents();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    quantity: 1,
    promoCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const event = getEvent(eventId || '');
  const ticketType = event?.ticket_types.find(ticket => ticket.id?.toString() === ticketTypeId);
  useEffect(() => {
    // Redirect if event or ticket type doesn't exist
    if (!event || !ticketType) {
      navigate('/');
    }
  }, [event, ticketType, navigate]);
  if (!event || !ticketType) {
    return null;
  }
  const subtotal = (ticketType?.ticket_price || 0) * formData.quantity;
  const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
  const total = subtotal + serviceFee;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) : value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Generate a random ticket ID
    const ticketId = Math.random().toString(36).substring(2, 15);
    setIsProcessing(false);
    // Redirect to confirmation page
    navigate(`/confirmation/${ticketId}`);
  };
  return <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <select id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>
                    {num}
                  </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code (Optional)
                </label>
                <input type="text" id="promoCode" name="promoCode" value={formData.promoCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-4">
            {event.payment_methods.includes('Stripe') && <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'Stripe' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`} onClick={() => setSelectedPaymentMethod('Stripe')}>
              <div className="flex items-center">
                <CreditCardIcon className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <h3 className="font-medium">
                    Credit/Debit Card (Stripe)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pay securely with your card
                  </p>
                </div>
                {selectedPaymentMethod === 'Stripe' && <CheckIcon className="h-5 w-5 ml-auto text-indigo-600" />}
              </div>
            </div>}
            {event.payment_methods.includes('PayPal') && <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'PayPal' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`} onClick={() => setSelectedPaymentMethod('PayPal')}>
              <div className="flex items-center">
                <WalletIcon className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <h3 className="font-medium">PayPal</h3>
                  <p className="text-sm text-gray-600">
                    Pay with your PayPal account
                  </p>
                </div>
                {selectedPaymentMethod === 'PayPal' && <CheckIcon className="h-5 w-5 ml-auto text-indigo-600" />}
              </div>
            </div>}
            {event.payment_methods.includes('M-Pesa') && <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'M-Pesa' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`} onClick={() => setSelectedPaymentMethod('M-Pesa')}>
              <div className="flex items-center">
                <PhoneIcon className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <h3 className="font-medium">M-Pesa</h3>
                  <p className="text-sm text-gray-600">
                    Pay with M-Pesa mobile money
                  </p>
                </div>
                {selectedPaymentMethod === 'M-Pesa' && <CheckIcon className="h-5 w-5 ml-auto text-indigo-600" />}
              </div>
            </div>}
          </div>
        </div>
      </div>
      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">{event.location}</p>
          </div>
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between mb-2">
              <span>Ticket Type:</span>
              <span>{ticketType.ticket_name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Price per ticket:</span>
              <span>${ticketType.ticket_price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Quantity:</span>
              <span>{formData.quantity}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Service Fee:</span>
              <span>${serviceFee}</span>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center" onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </> : 'Complete Purchase'}
          </button>
        </div>
      </div>
    </div>
  </div>;
};
export default CheckoutPage;