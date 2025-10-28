import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSignIcon, UsersIcon, TicketIcon, CalendarIcon } from 'lucide-react';
// Mock sales data for demonstration
const generateMockSalesData = (eventId: string) => {
  const today = new Date();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      sales: Math.floor(Math.random() * 20) + 5,
      revenue: (Math.floor(Math.random() * 20) + 5) * 25
    });
  }
  return data;
};
const generateMockTicketTypeData = (event: any) => {
  return event.ticketTypes.map((type: any) => ({
    name: type.name,
    sold: Math.floor(Math.random() * 50) + 10,
    revenue: (Math.floor(Math.random() * 50) + 10) * type.price
  }));
};
const HostSalesDashboard = () => {
  const {
    events
  } = useEvents();
  const {
    user
  } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('week'); // week, month, year
  // Filter events by current host
  const hostEvents = events.filter(event => event.hostId === user?.id);
  // Get selected event or all events
  const filteredEvents = selectedEvent === 'all' ? hostEvents : hostEvents.filter(event => event.id === selectedEvent);
  // Generate mock data for charts
  const salesData = generateMockSalesData(selectedEvent);
  // Calculate totals
  const totalTickets = filteredEvents.reduce((total, event) => {
    return total + Math.floor(Math.random() * 100) + 20; // Mock data
  }, 0);
  const totalRevenue = filteredEvents.reduce((total, event) => {
    return total + (Math.floor(Math.random() * 1000) + 500); // Mock data
  }, 0);
  const averageTicketPrice = totalTickets > 0 ? (totalRevenue / totalTickets).toFixed(2) : 0;
  return <div>
      <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>
      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Event
            </label>
            <select id="event-select" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Events</option>
              {hostEvents.map(event => <option key={event.id} value={event.id}>
                  {event.title}
                </option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select id="date-range" value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last 12 months</option>
            </select>
          </div>
        </div>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full">
              <TicketIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Tickets Sold</h3>
              <p className="text-2xl font-semibold">{totalTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Revenue</h3>
              <p className="text-2xl font-semibold">${totalRevenue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Avg. Ticket Price</h3>
              <p className="text-2xl font-semibold">${averageTicketPrice}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Events</h3>
              <p className="text-2xl font-semibold">{filteredEvents.length}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" name="Tickets Sold" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Ticket Types Breakdown */}
      {selectedEvent !== 'all' && filteredEvents.length > 0 && <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ticket Type Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Sold
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generateMockTicketTypeData(filteredEvents[0]).map((ticketData, index) => <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticketData.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${filteredEvents[0].ticketTypes[index].price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticketData.sold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${ticketData.revenue}
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
      {/* Buyer List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Buyers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Mock buyer data */}
              {Array.from({
              length: 5
            }).map((_, index) => {
              const randomEvent = filteredEvents[Math.floor(Math.random() * filteredEvents.length)] || hostEvents[0];
              const randomTicket = randomEvent.ticketTypes[Math.floor(Math.random() * randomEvent.ticketTypes.length)];
              return <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Wilson', 'Michael Brown'][index]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {['john@example.com', 'jane@example.com', 'robert@example.com', 'emily@example.com', 'michael@example.com'][index]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {randomEvent.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {randomTicket.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${randomTicket.price}
                    </td>
                  </tr>;
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default HostSalesDashboard;