import { useState, useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSignIcon, UsersIcon, TicketIcon, CalendarIcon } from 'lucide-react';

interface SalesStats {
  total_revenue: number;
  total_tickets: number;
  avg_price: number;
  sales_history: any[];
  recent_buyers: any[];
  events_breakdown: any[];
}

const HostSalesDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('week'); // Keep UI but logic might be limited

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/events/sales_stats/');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching sales stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading sales data...</div>;
  if (!stats) return <div className="p-8 text-center text-gray-500">No sales data available.</div>;

  // Filter Logic
  // If 'all', use global stats. If specific event, calculate from breakdown/buyers.
  let displayTickets = stats.total_tickets;
  let displayRevenue = stats.total_revenue;
  let displayAvgPrice = stats.avg_price;
  let displayBuyers = stats.recent_buyers;
  let displayBreakdown = stats.events_breakdown;

  if (selectedEventId !== 'all') {
    const evt = stats.events_breakdown.find(e => e.event_id === Number(selectedEventId));
    if (evt) {
      displayTickets = evt.sold;
      displayRevenue = evt.revenue;
      displayAvgPrice = displayTickets > 0 ? displayRevenue / displayTickets : 0;
      displayBreakdown = [evt]; // Only show this event
      // Filter buyers
      displayBuyers = stats.recent_buyers.filter(b => b.event === evt.title);
    } else {
      displayTickets = 0;
      displayRevenue = 0;
      displayAvgPrice = 0;
      displayBuyers = [];
      displayBreakdown = [];
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales & Revenue</h1>

      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Event
            </label>
            <select
              id="event-select"
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Events</option>
              {stats.events_breakdown.map((event: any) => (
                <option key={event.event_id} value={event.event_id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select id="date-range" value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="week">All Time</option>
              {/* Backend currently returns all history. Date filtering would need frontend slice or backend param. */}
              {/* For now keeping 'All Time' as effectively default */}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 sm:p-3 rounded-full">
              <TicketIcon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-gray-500 text-xs sm:text-sm">Total Sales</h3>
              <p className="text-lg sm:text-2xl font-semibold">{displayTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 sm:p-3 rounded-full">
              <DollarSignIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0">
              <h3 className="text-gray-500 text-xs sm:text-sm truncate">Total Revenue</h3>
              <p className="text-lg sm:text-2xl font-semibold truncate">KSh {displayRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
              <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-gray-500 text-xs sm:text-sm">Avg. Price</h3>
              <p className="text-lg sm:text-2xl font-semibold">KSh {Math.round(displayAvgPrice).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-gray-500 text-xs sm:text-sm">Active Events</h3>
              <p className="text-lg sm:text-2xl font-semibold">{stats.events_breakdown.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart (Global Only for now) */}
      {selectedEventId === 'all' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sales Trends (All Events)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.sales_history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" name="Tickets Sold" fill="#8884d8" barSize={20} />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue (KSh)" fill="#82ca9d" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Ticket Type Breakdown */}
      {displayBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ticket Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayBreakdown.map((evt: any) => (
                  evt.ticket_types.map((type: any, idx: number) => (
                    <tr key={`${evt.event_id} -${type.name} -${idx} `}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{evt.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KSh {type.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.sold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KSh {type.revenue.toLocaleString()}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Buyer List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayBuyers.length > 0 ? displayBuyers.map((buyer: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{buyer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{buyer.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{buyer.ticket_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(buyer.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KSh {buyer.amount.toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostSalesDashboard;