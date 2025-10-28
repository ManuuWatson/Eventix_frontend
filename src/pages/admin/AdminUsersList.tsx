import React, { useState } from 'react';
import { UserIcon, ShieldIcon, EditIcon, LockIcon, UnlockIcon } from 'lucide-react';
// Mock user data for demonstration
const mockUsers = [{
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  status: 'active',
  eventsAttended: 5,
  dateJoined: '2023-01-15'
}, {
  id: '2',
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'host',
  status: 'active',
  eventsHosted: 8,
  dateJoined: '2022-11-20'
}, {
  id: '3',
  name: 'Robert Johnson',
  email: 'robert@example.com',
  role: 'user',
  status: 'inactive',
  eventsAttended: 3,
  dateJoined: '2023-02-05'
}, {
  id: '4',
  name: 'Emily Wilson',
  email: 'emily@example.com',
  role: 'host',
  status: 'active',
  eventsHosted: 12,
  dateJoined: '2022-08-10'
}, {
  id: '5',
  name: 'Michael Brown',
  email: 'michael@example.com',
  role: 'admin',
  status: 'active',
  dateJoined: '2022-05-22'
}, {
  id: '6',
  name: 'Sarah Davis',
  email: 'sarah@example.com',
  role: 'user',
  status: 'active',
  eventsAttended: 9,
  dateJoined: '2023-03-18'
}, {
  id: '7',
  name: 'David Miller',
  email: 'david@example.com',
  role: 'host',
  status: 'inactive',
  eventsHosted: 5,
  dateJoined: '2022-12-30'
}, {
  id: '8',
  name: 'Lisa Taylor',
  email: 'lisa@example.com',
  role: 'user',
  status: 'active',
  eventsAttended: 2,
  dateJoined: '2023-04-05'
}];
const AdminUsersList = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState('all'); // all, users, hosts, admins, inactive
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter(user => {
    // Filter by role/status
    if (filter === 'users' && user.role !== 'user') return false;
    if (filter === 'hosts' && user.role !== 'host') return false;
    if (filter === 'admins' && user.role !== 'admin') return false;
    if (filter === 'inactive' && user.status !== 'inactive') return false;
    // Filter by search term
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    }));
  };
  const handleMakeAdmin = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: 'admin'
        };
      }
      return user;
    }));
  };
  const handleEditUser = (userId: string) => {
    // In a real app, this would open a modal or navigate to an edit page
    alert(`Edit user ${userId}`);
  };
  return <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                All Users
              </button>
              <button onClick={() => setFilter('users')} className={`px-4 py-2 rounded-md ${filter === 'users' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Regular Users
              </button>
              <button onClick={() => setFilter('hosts')} className={`px-4 py-2 rounded-md ${filter === 'hosts' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Event Hosts
              </button>
              <button onClick={() => setFilter('admins')} className={`px-4 py-2 rounded-md ${filter === 'admins' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Admins
              </button>
              <button onClick={() => setFilter('inactive')} className={`px-4 py-2 rounded-md ${filter === 'inactive' ? 'bg-red-100 text-red-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Inactive
              </button>
            </div>
            <div className="relative">
              <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" />
            </div>
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
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'host' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role === 'host' && `${user.eventsHosted} events hosted`}
                    {user.role === 'user' && `${user.eventsAttended} events attended`}
                    {user.role === 'admin' && 'System administrator'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.dateJoined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEditUser(user.id)} className="text-indigo-600 hover:text-indigo-900" title="Edit User">
                        <EditIcon className="h-5 w-5" />
                      </button>
                      {user.role !== 'admin' && <button onClick={() => handleMakeAdmin(user.id)} className="text-purple-600 hover:text-purple-900" title="Make Admin">
                          <ShieldIcon className="h-5 w-5" />
                        </button>}
                      <button onClick={() => handleStatusToggle(user.id)} className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`} title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}>
                        {user.status === 'active' ? <LockIcon className="h-5 w-5" /> : <UnlockIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && <div className="p-8 text-center">
            <p className="text-gray-500">
              No users found matching your criteria
            </p>
          </div>}
      </div>
    </div>;
};
export default AdminUsersList;