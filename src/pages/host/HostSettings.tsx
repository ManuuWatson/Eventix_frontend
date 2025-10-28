import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
const HostSettings = () => {
  const {
    user
  } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '123-456-7890',
    companyName: 'Event Organizers Ltd',
    bio: 'Professional event organizer with over 5 years of experience in music and cultural events.' // Mock data
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    accountName: 'John Doe',
    accountNumber: '****1234',
    bankName: 'National Bank',
    swiftCode: 'NTBNK123',
    mpesaNumber: '254712345678',
    paypalEmail: 'john@example.com'
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setPaymentForm({
      ...paymentForm,
      [name]: value
    });
  };
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormSuccess('Profile updated successfully');
    setIsSubmitting(false);
    // Clear success message after 3 seconds
    setTimeout(() => {
      setFormSuccess(null);
    }, 3000);
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormSuccess('Password updated successfully');
    setIsSubmitting(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    // Clear success message after 3 seconds
    setTimeout(() => {
      setFormSuccess(null);
    }, 3000);
  };
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormSuccess('Payment details updated successfully');
    setIsSubmitting(false);
    // Clear success message after 3 seconds
    setTimeout(() => {
      setFormSuccess(null);
    }, 3000);
  };
  return <div>
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      {formSuccess && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{formSuccess}</p>
            </div>
          </div>
        </div>}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button className={`px-6 py-3 font-medium text-sm ${activeTab === 'profile' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`} onClick={() => setActiveTab('profile')}>
              Profile
            </button>
            <button className={`px-6 py-3 font-medium text-sm ${activeTab === 'password' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`} onClick={() => setActiveTab('password')}>
              Change Password
            </button>
            <button className={`px-6 py-3 font-medium text-sm ${activeTab === 'payment' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`} onClick={() => setActiveTab('payment')}>
              Payment Details
            </button>
          </div>
        </div>
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-indigo-100 rounded-full h-16 w-16 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="name" name="name" value={profileForm.name} onChange={handleProfileChange} className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="email" id="email" name="email" value={profileForm.email} onChange={handleProfileChange} className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input type="tel" id="phone" name="phone" value={profileForm.phone} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Organization Name
                  </label>
                  <input type="text" id="companyName" name="companyName" value={profileForm.companyName} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio/Description
                  </label>
                  <textarea id="bio" name="bio" rows={4} value={profileForm.bio} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tell attendees about yourself or your organization"></textarea>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 flex items-center">
                    {isSubmitting ? <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </> : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>}
          {/* Password Settings */}
          {activeTab === 'password' && <form onSubmit={handlePasswordSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type={showPassword.current ? 'text' : 'password'} id="currentPassword" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button type="button" onClick={() => setShowPassword({
                    ...showPassword,
                    current: !showPassword.current
                  })} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        {showPassword.current ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type={showPassword.new ? 'text' : 'password'} id="newPassword" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button type="button" onClick={() => setShowPassword({
                    ...showPassword,
                    new: !showPassword.new
                  })} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        {showPassword.new ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type={showPassword.confirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button type="button" onClick={() => setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm
                  })} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        {showPassword.confirm ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 flex items-center">
                    {isSubmitting ? <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </> : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>}
          {/* Payment Settings */}
          {activeTab === 'payment' && <form onSubmit={handlePaymentSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <h3 className="text-lg font-medium">Bank Account Details</h3>
                <div>
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="accountName" name="accountName" value={paymentForm.accountName} onChange={handlePaymentChange} className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input type="text" id="accountNumber" name="accountNumber" value={paymentForm.accountNumber} onChange={handlePaymentChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="bankName" name="bankName" value={paymentForm.bankName} onChange={handlePaymentChange} className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700 mb-1">
                      SWIFT/BIC Code
                    </label>
                    <input type="text" id="swiftCode" name="swiftCode" value={paymentForm.swiftCode} onChange={handlePaymentChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">
                    Other Payment Methods
                  </h3>
                  <div>
                    <label htmlFor="mpesaNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      M-Pesa Number
                    </label>
                    <input type="text" id="mpesaNumber" name="mpesaNumber" value={paymentForm.mpesaNumber} onChange={handlePaymentChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 254712345678" />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      PayPal Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" id="paypalEmail" name="paypalEmail" value={paymentForm.paypalEmail} onChange={handlePaymentChange} className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 flex items-center">
                    {isSubmitting ? <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </> : 'Save Payment Details'}
                  </button>
                </div>
              </div>
            </form>}
        </div>
      </div>
    </div>;
};
export default HostSettings;