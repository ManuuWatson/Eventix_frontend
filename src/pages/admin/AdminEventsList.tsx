import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from 'lucide-react';
const AdminEventsList = () => {
  const {
    events,
    updateEvent
  } = useEvents();
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [searchTerm, setSearchTerm] = useState('');
  const filteredEvents = events.filter(event => {
    // Filter by status
    if (filter === 'pending' && event.isApproved) return false;
    if (filter === 'approved' && !event.isApproved) return false;
    // Filter by search term
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  const handleApprove = (eventId: string) => {
    updateEvent(eventId, {
      isApproved: true
    });
  };
  const handleReject = (eventId: string) => {
    // In a real app, you might want to add a reason for rejection
    // For now, we'll just set isApproved to false
    updateEvent(eventId, {
      isApproved: false
    });
  };
  const handleViewDetails = (eventId: string) => {
    // In a real app, this would open a modal or navigate to a details page
    alert(`View details for event ${eventId}`);
  };
  return <div>
      <h1 className="text-2xl font-bold mb-6">Events Management</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-4">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                All Events
              </button>
              <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Pending Approval
              </button>
              <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded-md ${filter === 'approved' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Approved
              </button>
            </div>
            <div className="relative">
              <input type="text" placeholder="Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Host
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map(event => <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={event.posterUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.hostName}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {event.hostId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {event.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleViewDetails(event.id)} className="text-indigo-600 hover:text-indigo-900" title="View Details">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {!event.isApproved && <button onClick={() => handleApprove(event.id)} className="text-green-600 hover:text-green-900" title="Approve Event">
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>}
                      {event.isApproved && <button onClick={() => handleReject(event.id)} className="text-red-600 hover:text-red-900" title="Reject Event">
                          <XCircleIcon className="h-5 w-5" />
                        </button>}
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {filteredEvents.length === 0 && <div className="p-8 text-center">
            <p className="text-gray-500">
              No events found matching your criteria
            </p>
          </div>}
      </div>
    </div>;
};
export default AdminEventsList;