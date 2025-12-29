import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboardIcon, CalendarIcon, UsersIcon, AlertTriangleIcon, SettingsIcon, LogOutIcon, DollarSignIcon } from 'lucide-react';
import AdminEventsList from './AdminEventsList';
import AdminUsersList from './AdminUsersList';
import AdminReports from './AdminReports';
import AdminSettings from './AdminSettings';

interface DashboardStats {
  totalEvents: number;
  pendingApproval: number;
  totalUsers: number;
  totalHosts: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalServiceFee: number;
  activeComplaints: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');

  const { data: stats, isLoading: loading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users/admin-stats/');
      return response.data as DashboardStats;
    },
    refetchInterval: 5000, // Poll every 5 seconds for "instant" updates
    initialData: {
      totalEvents: 0,
      pendingApproval: 0,
      totalUsers: 0,
      totalHosts: 0,
      totalTicketsSold: 0,
      totalRevenue: 0,
      totalServiceFee: 0,
      activeComplaints: 0
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return <div className="min-h-screen bg-gray-100">
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 hidden md:block relative z-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome, {user?.email}</p>
        </div>

        <nav className="space-y-1">
          <Link
            to="/admin"
            className={`flex items-center px-4 py-3 rounded-md ${activePage === 'dashboard' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            onClick={() => setActivePage('dashboard')}
          >
            <LayoutDashboardIcon className="h-5 w-5 mr-3" />
            Dashboard
          </Link>

          <Link
            to="/admin/events"
            className={`flex items-center px-4 py-3 rounded-md ${activePage === 'events' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            onClick={() => setActivePage('events')}
          >
            <CalendarIcon className="h-5 w-5 mr-3" />
            Events Management
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center px-4 py-3 rounded-md ${activePage === 'users' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            onClick={() => setActivePage('users')}
          >
            <UsersIcon className="h-5 w-5 mr-3" />
            User Management
          </Link>

          <Link
            to="/admin/reports"
            className={`flex items-center px-4 py-3 rounded-md ${activePage === 'reports' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            onClick={() => setActivePage('reports')}
          >
            <AlertTriangleIcon className="h-5 w-5 mr-3" />
            Reports & Complaints
          </Link>

          <Link
            to="/admin/settings"
            className={`flex items-center px-4 py-3 rounded-md ${activePage === 'settings' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            onClick={() => setActivePage('settings')}
          >
            <SettingsIcon className="h-5 w-5 mr-3" />
            System Settings
          </Link>

          {/* Fix: ensure button has a higher z-index and proper positioning */}
          <button
            className="flex items-center px-4 py-3 rounded-md hover:bg-gray-800 w-full text-left relative z-30 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white w-full p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
          <button className="p-2">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">
                  Admin Dashboard Overview
                </h1>
                <p className="text-gray-600">
                  Monitor and manage all system activities
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <CalendarIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">
                        Total Events
                      </h3>
                      <p className="text-2xl font-semibold">
                        {stats.totalEvents}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <CalendarIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">
                        Pending Approval
                      </h3>
                      <p className="text-2xl font-semibold">
                        {stats.pendingApproval}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <UsersIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">
                        Total Users
                      </h3>
                      <p className="text-2xl font-semibold">
                        {stats.totalUsers}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">
                        Active Complaints
                      </h3>
                      <p className="text-2xl font-semibold">
                        {stats.activeComplaints}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Service Fee Card - Added for Super Admin */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <DollarSignIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">
                        Total Service Fee
                      </h3>
                      <p className="text-2xl font-semibold">
                        ${stats.totalServiceFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Events Pending Approval
                    </h2>
                    <Link to="/admin/events" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium" onClick={() => setActivePage('events')}>
                      View All
                    </Link>
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
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Mock data for pending events */}
                        {[{
                          id: 1,
                          title: 'Summer Beach Party',
                          host: 'Beach Events Ltd',
                          date: '2023-08-15'
                        }, {
                          id: 2,
                          title: 'Tech Summit 2023',
                          host: 'Tech Conferences Inc',
                          date: '2023-09-22'
                        }, {
                          id: 3,
                          title: 'Wine Tasting Festival',
                          host: 'Wine Lovers Group',
                          date: '2023-07-30'
                        }].map(event => <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {event.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {event.host}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {event.date}
                            </div>
                          </td>
                        </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Recent Complaints
                    </h2>
                    <Link to="/admin/reports" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium" onClick={() => setActivePage('reports')}>
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {/* Mock data for complaints */}
                    {[{
                      id: 1,
                      user: 'John Doe',
                      event: 'Summer Music Festival',
                      issue: 'Refund request',
                      status: 'New'
                    }, {
                      id: 2,
                      user: 'Sarah Wilson',
                      event: 'Tech Conference 2023',
                      issue: 'Duplicate charge',
                      status: 'In Progress'
                    }, {
                      id: 3,
                      user: 'Mike Johnson',
                      event: 'Food & Wine Festival',
                      issue: 'Ticket validation failed',
                      status: 'New'
                    }].map(complaint => <div key={complaint.id} className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {complaint.user}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {complaint.event}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {complaint.issue}
                          </p>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'New' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>)}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    System Statistics
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      User Statistics
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Total Users:
                        </span>
                        <span className="font-medium">
                          {stats.totalUsers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Event Hosts:
                        </span>
                        <span className="font-medium">
                          {stats.totalHosts}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Regular Users:
                        </span>
                        <span className="font-medium">
                          {stats.totalUsers - stats.totalHosts}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Event Statistics
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Total Events:
                        </span>
                        <span className="font-medium">
                          {stats.totalEvents}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Upcoming Events:
                        </span>
                        <span className="font-medium">
                          {stats.totalEvents - 45}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Past Events:
                        </span>
                        <span className="font-medium">45</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Sales Statistics
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Total Tickets Sold:
                        </span>
                        <span className="font-medium">
                          {stats.totalTicketsSold}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Total Revenue:
                        </span>
                        <span className="font-medium">
                          ${stats.totalRevenue}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Avg. Ticket Price:
                        </span>
                        <span className="font-medium">
                          $
                          {(stats.totalTicketsSold > 0 ? (stats.totalRevenue / stats.totalTicketsSold) : 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>} />
            <Route path="/events" element={<AdminEventsList />} />
            <Route path="/users" element={<AdminUsersList />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  </div>;
};
export default AdminDashboard;