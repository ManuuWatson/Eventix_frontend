import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, MessageCircleIcon } from 'lucide-react';
// Mock complaints data for demonstration
const mockComplaints = [{
  id: '1',
  userId: 'user123',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  eventId: 'event456',
  eventTitle: 'Summer Music Festival',
  issueType: 'Refund Request',
  description: 'I was unable to attend the event due to a medical emergency. I have attached my medical certificate as proof.',
  status: 'pending',
  dateSubmitted: '2023-06-20T14:30:00',
  priority: 'medium'
}, {
  id: '2',
  userId: 'user789',
  userName: 'Sarah Wilson',
  userEmail: 'sarah@example.com',
  eventId: 'event123',
  eventTitle: 'Tech Conference 2023',
  issueType: 'Payment Issue',
  description: 'I was charged twice for the same ticket. Please refund one of the charges.',
  status: 'in-progress',
  dateSubmitted: '2023-06-18T09:15:00',
  priority: 'high'
}, {
  id: '3',
  userId: 'user456',
  userName: 'Mike Johnson',
  userEmail: 'mike@example.com',
  eventId: 'event789',
  eventTitle: 'Food & Wine Festival',
  issueType: 'Ticket Validation',
  description: 'My ticket QR code was not working at the entrance and I was denied entry.',
  status: 'pending',
  dateSubmitted: '2023-06-19T16:45:00',
  priority: 'high'
}, {
  id: '4',
  userId: 'user234',
  userName: 'Emily Davis',
  userEmail: 'emily@example.com',
  eventId: 'event567',
  eventTitle: 'Business Leadership Summit',
  issueType: 'Event Cancellation',
  description: 'The event was cancelled with less than 24 hours notice and I have not received a refund yet.',
  status: 'resolved',
  dateSubmitted: '2023-06-15T11:20:00',
  priority: 'medium',
  resolution: 'Full refund processed on June 16, 2023.'
}, {
  id: '5',
  userId: 'user567',
  userName: 'Robert Brown',
  userEmail: 'robert@example.com',
  eventId: 'event234',
  eventTitle: 'Marathon for Charity',
  issueType: 'Other',
  description: 'I registered for the 10K race but my name was listed in the 5K category.',
  status: 'pending',
  dateSubmitted: '2023-06-21T08:30:00',
  priority: 'low'
}];
const AdminReports = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filter, setFilter] = useState('all'); // all, pending, in-progress, resolved
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');
  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });
  const handleResolve = (complaintId: string) => {
    if (!resolution.trim()) {
      alert('Please enter a resolution before resolving the complaint');
      return;
    }
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          status: 'resolved',
          resolution
        };
      }
      return complaint;
    }));
    setSelectedComplaint(null);
    setResolution('');
  };
  const handleInProgress = (complaintId: string) => {
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          status: 'in-progress'
        };
      }
      return complaint;
    }));
  };
  const handleSelectComplaint = (complaintId: string) => {
    const complaint = complaints.find(c => c.id === complaintId);
    setSelectedComplaint(complaintId);
    setResolution(complaint?.resolution || '');
  };
  return <div>
      <h1 className="text-2xl font-bold mb-6">Reports & Complaints</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex space-x-4">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                  All
                </button>
                <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Pending
                </button>
                <button onClick={() => setFilter('in-progress')} className={`px-4 py-2 rounded-md ${filter === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                  In Progress
                </button>
                <button onClick={() => setFilter('resolved')} className={`px-4 py-2 rounded-md ${filter === 'resolved' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Resolved
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.map(complaint => <tr key={complaint.id} className={selectedComplaint === complaint.id ? 'bg-blue-50' : ''} onClick={() => handleSelectComplaint(complaint.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {complaint.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {complaint.userEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {complaint.eventTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {complaint.issueType}
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.priority === 'high' ? 'bg-red-100 text-red-800' : complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(complaint.dateSubmitted).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {complaint.status === 'pending' && <button onClick={e => {
                        e.stopPropagation();
                        handleInProgress(complaint.id);
                      }} className="text-blue-600 hover:text-blue-900" title="Mark as In Progress">
                              <MessageCircleIcon className="h-5 w-5" />
                            </button>}
                          {complaint.status !== 'resolved' && <button onClick={e => {
                        e.stopPropagation();
                        handleSelectComplaint(complaint.id);
                      }} className="text-green-600 hover:text-green-900" title="Resolve Complaint">
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>}
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            {filteredComplaints.length === 0 && <div className="p-8 text-center">
                <p className="text-gray-500">
                  No complaints found matching your criteria
                </p>
              </div>}
          </div>
        </div>
        {/* Complaint Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            {selectedComplaint ? (() => {
            const complaint = complaints.find(c => c.id === selectedComplaint);
            if (!complaint) return null;
            return <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Complaint Details
                    </h2>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        User
                      </h3>
                      <p className="text-gray-900">{complaint.userName}</p>
                      <p className="text-sm text-gray-500">
                        {complaint.userEmail}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Event
                      </h3>
                      <p className="text-gray-900">{complaint.eventTitle}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Issue Type
                      </h3>
                      <p className="text-gray-900">{complaint.issueType}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Description
                      </h3>
                      <p className="text-gray-900 whitespace-pre-line">
                        {complaint.description}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Status
                      </h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Date Submitted
                      </h3>
                      <p className="text-gray-900">
                        {new Date(complaint.dateSubmitted).toLocaleString()}
                      </p>
                    </div>
                    {complaint.status === 'resolved' ? <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Resolution
                        </h3>
                        <p className="text-gray-900 whitespace-pre-line">
                          {complaint.resolution}
                        </p>
                      </div> : <div className="mb-4">
                        <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">
                          Resolution
                        </label>
                        <textarea id="resolution" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter resolution details..." value={resolution} onChange={e => setResolution(e.target.value)}></textarea>
                        <div className="mt-4 flex justify-end">
                          <button onClick={() => handleResolve(complaint.id)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Mark as Resolved
                          </button>
                        </div>
                      </div>}
                  </div>;
          })() : <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <XCircleIcon className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No complaint selected</p>
                <p className="text-sm">
                  Select a complaint from the list to view details
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default AdminReports;