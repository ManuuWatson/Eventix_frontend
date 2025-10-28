import React, { useState } from 'react';
const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'EventTix',
    siteDescription: 'Your ultimate event ticketing platform',
    supportEmail: 'support@eventtix.com',
    contactPhone: '+1 (555) 123-4567'
  });
  const [paymentSettings, setPaymentSettings] = useState({
    platformFeePercentage: 2.5,
    stripeEnabled: true,
    paypalEnabled: true,
    bankTransferEnabled: false
  });
  const [emailSettings, setEmailSettings] = useState({
    emailNotifications: true,
    adminAlerts: true,
    marketingEmails: false
  });
  const handleGeneralSubmit = e => {
    e.preventDefault();
    // In a real app, this would save to a backend
    alert('General settings updated successfully!');
  };
  const handlePaymentSubmit = e => {
    e.preventDefault();
    // In a real app, this would save to a backend
    alert('Payment settings updated successfully!');
  };
  const handleEmailSubmit = e => {
    e.preventDefault();
    // In a real app, this would save to a backend
    alert('Email settings updated successfully!');
  };
  return <div>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <form onSubmit={handleGeneralSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={generalSettings.siteName} onChange={e => setGeneralSettings({
                ...generalSettings,
                siteName: e.target.value
              })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={generalSettings.supportEmail} onChange={e => setGeneralSettings({
                ...generalSettings,
                supportEmail: e.target.value
              })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} value={generalSettings.siteDescription} onChange={e => setGeneralSettings({
                ...generalSettings,
                siteDescription: e.target.value
              })}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={generalSettings.contactPhone} onChange={e => setGeneralSettings({
                ...generalSettings,
                contactPhone: e.target.value
              })} />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Save General Settings
              </button>
            </div>
          </form>
        </div>
        {/* Payment Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Fee Percentage
                </label>
                <div className="flex items-center">
                  <input type="number" step="0.1" min="0" max="100" className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={paymentSettings.platformFeePercentage} onChange={e => setPaymentSettings({
                  ...paymentSettings,
                  platformFeePercentage: parseFloat(e.target.value)
                })} />
                  <span className="ml-2 text-gray-700">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Methods
                </label>
                <div className="flex items-center">
                  <input type="checkbox" id="stripeEnabled" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={paymentSettings.stripeEnabled} onChange={e => setPaymentSettings({
                  ...paymentSettings,
                  stripeEnabled: e.target.checked
                })} />
                  <label htmlFor="stripeEnabled" className="ml-2 text-sm text-gray-700">
                    Enable Stripe Payments
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="paypalEnabled" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={paymentSettings.paypalEnabled} onChange={e => setPaymentSettings({
                  ...paymentSettings,
                  paypalEnabled: e.target.checked
                })} />
                  <label htmlFor="paypalEnabled" className="ml-2 text-sm text-gray-700">
                    Enable PayPal Payments
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="bankTransferEnabled" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={paymentSettings.bankTransferEnabled} onChange={e => setPaymentSettings({
                  ...paymentSettings,
                  bankTransferEnabled: e.target.checked
                })} />
                  <label htmlFor="bankTransferEnabled" className="ml-2 text-sm text-gray-700">
                    Enable Bank Transfer
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Save Payment Settings
              </button>
            </div>
          </form>
        </div>
        {/* Email Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
          <form onSubmit={handleEmailSubmit}>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="emailNotifications" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={emailSettings.emailNotifications} onChange={e => setEmailSettings({
                ...emailSettings,
                emailNotifications: e.target.checked
              })} />
                <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                  Send email notifications to users
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="adminAlerts" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={emailSettings.adminAlerts} onChange={e => setEmailSettings({
                ...emailSettings,
                adminAlerts: e.target.checked
              })} />
                <label htmlFor="adminAlerts" className="ml-2 text-sm text-gray-700">
                  Send admin alerts for important events
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="marketingEmails" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={emailSettings.marketingEmails} onChange={e => setEmailSettings({
                ...emailSettings,
                marketingEmails: e.target.checked
              })} />
                <label htmlFor="marketingEmails" className="ml-2 text-sm text-gray-700">
                  Send marketing emails to users
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Save Email Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default AdminSettings;