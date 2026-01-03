import { useState, useEffect } from 'react';


import axiosInstance from '../../api/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSignIcon, UsersIcon, TicketIcon, WalletIcon, XIcon } from 'lucide-react';

interface SalesStats {
  total_revenue: number;
  total_tickets: number;
  service_fee: number;
  sales_history: any[];
  recent_buyers: any[];
  events_breakdown: any[];
}

interface Withdrawal {
  id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const HostSalesDashboard = () => {

  const [stats, setStats] = useState<SalesStats | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  // Withdraw Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, balanceRes, withdrawalsRes] = await Promise.all([
          axiosInstance.get('/events/sales_stats/'),
          axiosInstance.get('/payments/balance/'),
          axiosInstance.get('/payments/withdrawals/')
        ]);
        setStats(statsRes.data);
        setBalance(balanceRes.data.available_balance);
        setWithdrawals(withdrawalsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(null);
    try {
      await axiosInstance.post('/payments/withdraw/', { amount: withdrawAmount });
      setWithdrawSuccess("Withdrawal requested successfully!");
      setWithdrawAmount('');
      // Refresh data
      const [balanceRes, withdrawalsRes] = await Promise.all([
        axiosInstance.get('/payments/balance/'),
        axiosInstance.get('/payments/withdrawals/')
      ]);
      setBalance(balanceRes.data.available_balance);
      setWithdrawals(withdrawalsRes.data);
      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setWithdrawSuccess(null);
      }, 2000);
    } catch (err: any) {
      setWithdrawError(err.response?.data?.error || "Failed to request withdrawal.");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading sales data...</div>;
  if (!stats) return <div className="p-8 text-center text-gray-500">No sales data available.</div>;

  // Filter Logic
  let displayTickets = stats.total_tickets;
  let displayRevenue = stats.total_revenue;
  let displayServiceFee = stats.service_fee;

  // Calculate Balance logic: 
  // If 'all': Show global wallet balance (which accounts for withdrawals).
  // If event selected: Show Net Earnings for that event (Revenue * 0.9). withdrawals are global so can't be subtracted per event.
  let displayBalance = balance;
  let isGlobalView = selectedEventId === 'all';

  if (!isGlobalView) {
    const evt = stats.events_breakdown.find(e => e.event_id === Number(selectedEventId));
    if (evt) {
      displayTickets = evt.sold;
      displayRevenue = evt.revenue;
      displayServiceFee = displayRevenue * 0.10;
      displayBalance = displayRevenue * 0.90; // Net earnings for this specific event
    } else {
      displayTickets = 0;
      displayRevenue = 0;
      displayServiceFee = 0;
      displayBalance = 0;
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
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6 mb-8">
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
            <div className="bg-red-100 p-2 sm:p-3 rounded-full">
              <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-gray-500 text-xs sm:text-sm">Service Fee (10%)</h3>
              <p className="text-lg sm:text-2xl font-semibold">KSh {displayServiceFee.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Net Earnings Card */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
              <DollarSignIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0">
              <h3 className="text-gray-500 text-xs sm:text-sm">Net Earnings</h3>
              <p className="text-lg sm:text-2xl font-semibold break-words">KSh {(displayRevenue - displayServiceFee).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Withdrawal / Wallet Card */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center mb-2">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
                <WalletIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <h3 className="text-gray-500 text-xs sm:text-sm">
                  {isGlobalView ? "Available To Withdraw" : "Net Earnings (Event)"}
                </h3>
                <p className="text-lg sm:text-2xl font-semibold break-words">KSh {displayBalance.toLocaleString()}</p>
              </div>
            </div>

            {isGlobalView ? (
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="w-full mt-auto bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold py-2 rounded transition-colors"
                disabled={balance <= 0}
              >
                Request Withdrawal
              </button>
            ) : (
              <div className="w-full mt-auto text-center">
                <span className="text-xs text-gray-500 block mb-1">Switch to "All Events" to withdraw</span>
                <button
                  title="Switch to All Events to withdraw funds"
                  className="w-full bg-gray-100 text-gray-400 text-xs sm:text-sm font-semibold py-2 rounded cursor-not-allowed"
                  disabled
                >
                  Request Withdrawal
                </button>
              </div>
            )}

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

      {/* Withdrawal History Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref #</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawals.length > 0 ? withdrawals.map((w) => (
                <tr key={w.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">KSh {Number(w.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${w.status === 'approved' ? 'bg-green-100 text-green-800' :
                        w.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{/* Ref Not Exposed yet in logic, maybe add later */} - </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 text-sm">No withdrawal history.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Request Withdrawal</h2>

            {withdrawSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                {withdrawSuccess}
              </div>
            )}
            {withdrawError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdraw}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount (KSh)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={balance}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`Max: ${balance}`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Available: KSh {balance.toLocaleString()}</p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="mr-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default HostSalesDashboard;