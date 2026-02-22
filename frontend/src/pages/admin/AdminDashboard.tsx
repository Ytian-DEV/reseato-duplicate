import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Utensils, Calendar, DollarSign, Search, Filter, CheckCircle, XCircle, AlertCircle, Eye, Moon, Sun } from 'lucide-react';
import adminService, { DashboardStats, AdminReservation, AdminRestaurant, AdminUser } from '../../services/adminService';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

type Tab = 'overview' | 'reservations' | 'restaurants' | 'users';

export const AdminDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Data States
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Filter States
  const [reservationFilter, setReservationFilter] = useState({ status: '', search: '' });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Check for saved preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'reservations') loadReservations();
    if (activeTab === 'restaurants') loadRestaurants();
    if (activeTab === 'users') loadUsers();
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async () => {
    try {
      const data = await adminService.getAllReservations(reservationFilter.status, reservationFilter.search);
      setReservations(data);
    } catch (error) {
      toast.error('Failed to load reservations');
    }
  };

  const loadRestaurants = async () => {
    try {
      const data = await adminService.getAllRestaurants();
      setRestaurants(data);
    } catch (error) {
      toast.error('Failed to load restaurants');
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleReservationAction = async (id: string, action: 'override' | 'cancel') => {
    try {
      const status = action === 'override' ? 'completed' : 'cancelled';
      await adminService.updateReservationStatus(id, status);
      toast.success(`Reservation ${status}`);
      loadReservations();
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to update reservation');
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await adminService.markCommissionPaid(id);
      toast.success('Commission marked as paid');
      loadRestaurants();
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark as paid');
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      await adminService.toggleUserStatus(id);
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Loader size="lg" />
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Restaurants', value: stats?.totalRestaurants || 0, icon: Utensils, color: 'bg-orange-500' },
          { title: 'Reservations', value: stats?.totalReservations || 0, icon: Calendar, color: 'bg-green-500' },
          { title: 'Total Revenue', value: `₱${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-lg transition-shadow duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{stat.title}</p>
                  <h3 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className={`min-h-[300px] flex flex-col justify-center items-center border-2 border-dashed ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-600' 
            : 'bg-white border-gray-200 text-gray-400'
        }`}>
          <Calendar className="w-12 h-12 mb-2 opacity-50" />
          <p>Reservations by Day (Chart Placeholder)</p>
        </Card>
        <Card className={`min-h-[300px] flex flex-col justify-center items-center border-2 border-dashed ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-600' 
            : 'bg-white border-gray-200 text-gray-400'
        }`}>
          <CheckCircle className="w-12 h-12 mb-2 opacity-50" />
          <p>Completion vs Cancellation (Chart Placeholder)</p>
        </Card>
      </div>
    </div>
  );

  const renderReservations = () => (
    <Card className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
      <div className="mb-6 space-y-4">
        <h2 className={`text-xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>All Reservations</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              label="Search"
              placeholder="Search user or restaurant..." 
              leftIcon={<Search className="w-4 h-4" />}
              value={reservationFilter.search}
              onChange={(e) => setReservationFilter({ ...reservationFilter, search: e.target.value })}
            />
          </div>
          <select 
            className={`px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-neutral-200 text-gray-900'
            }`}
            value={reservationFilter.status}
            onChange={(e) => setReservationFilter({ ...reservationFilter, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button onClick={loadReservations}>Apply Filters</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>ID</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>User</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Restaurant</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Date/Time</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Guests</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Status</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Commission</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className={`border-b ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
              }`}>
                <td className={`p-4 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>#{res.id.slice(0, 5)}</td>
                <td className={`p-4 font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{res.user_first_name} {res.user_last_name}</td>
                <td className={`p-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{res.restaurant_name}</td>
                <td className={`p-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {format(new Date(res.reservation_date), 'MMM d')} – {res.reservation_time.slice(0, 5)}
                </td>
                <td className={`p-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{res.guest_count}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${res.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                      res.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {res.status}
                  </span>
                </td>
                <td className={`p-4 font-medium ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>₱{res.commission}</td>
                <td className="p-4 flex space-x-2">
                  <button 
                    onClick={() => handleReservationAction(res.id, 'override')}
                    className="text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    Override
                  </button>
                  <button 
                    onClick={() => handleReservationAction(res.id, 'cancel')}
                    className="text-xs bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reservations.length === 0 && (
          <div className={`p-8 text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>No reservations found matching filters.</div>
        )}
      </div>
      <p className={`text-xs mt-4 italic ${
        isDarkMode ? 'text-gray-500' : 'text-gray-400'
      }`}>* Each completed reservation automatically earns ₱70 commission</p>
    </Card>
  );

  const renderRestaurants = () => (
    <Card className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Restaurant Management</h2>
        <Button size="sm" leftIcon={<Utensils className="w-4 h-4" />}>+ Create Restaurant</Button>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Restaurant</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Owner</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Status</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Completed Res.</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Commission Due</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((rest) => (
              <tr key={rest.id} className={`border-b ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
              }`}>
                <td className={`p-4 font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{rest.name}</td>
                <td className={`p-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{rest.owner}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${rest.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {rest.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className={`p-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{rest.completedReservations}</td>
                <td className={`p-4 font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>₱{rest.commissionDue.toLocaleString()}</td>
                <td className="p-4 flex space-x-2">
                  <button className={`text-xs px-2 py-1 rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>View</button>
                  {rest.commissionDue > 0 && (
                    <button 
                      onClick={() => handleMarkPaid(rest.id)}
                      className="text-xs bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-900"
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`p-4 rounded-xl border ${
        isDarkMode 
          ? 'bg-blue-900/20 border-blue-800' 
          : 'bg-blue-50 border-blue-100'
      }`}>
        <h4 className={`font-semibold mb-2 ${
          isDarkMode ? 'text-blue-300' : 'text-blue-900'
        }`}>Commission Overview:</h4>
        <ul className={`list-disc list-inside text-sm space-y-1 ${
          isDarkMode ? 'text-blue-300' : 'text-blue-800'
        }`}>
          <li>₱70 is automatically collected per completed reservation.</li>
          <li>Pending commissions are displayed per restaurant.</li>
          <li>Admin can manually mark commissions as paid.</li>
        </ul>
      </div>
    </Card>
  );

  const renderUsers = () => (
    <Card className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
      <div className="mb-6">
        <h2 className={`text-xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>User Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>User</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Email</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Role</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Joined</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Reservations</th>
              <th className={`p-4 font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`border-b ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
              }`}>
                <td className={`p-4 font-medium flex items-center space-x-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{user.name}</span>
                </td>
                <td className={`p-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{user.email}</td>
                <td className={`p-4 capitalize ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{user.role}</td>
                <td className={`p-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{format(new Date(user.joinedAt), 'MMM d, yyyy')}</td>
                <td className={`p-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{user.reservationCount}</td>
                <td className="p-4 flex space-x-2">
                  <button className={`text-xs px-2 py-1 rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>History</button>
                  <button 
                    onClick={() => handleToggleUser(user.id)}
                    className={`text-xs px-2 py-1 rounded border ${
                      user.isActive 
                        ? isDarkMode
                          ? 'text-red-400 border-red-800 hover:bg-red-900/30'
                          : 'text-red-600 border-red-200 hover:bg-red-50'
                        : isDarkMode
                          ? 'text-green-400 border-green-800 hover:bg-green-900/30'
                          : 'text-green-600 border-green-200 hover:bg-green-50'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    } p-8`}>
      
      {/* Dark Mode Toggle - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
            isDarkMode 
              ? 'bg-purple-900 text-yellow-300 hover:bg-purple-800' 
              : 'bg-gray-800 text-gray-100 hover:bg-gray-700'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Admin Dashboard</h1>
            <p className={isDarkMode ? 'text-gray-400 mt-2' : 'text-gray-600 mt-2'}>
              Platform overview and management
            </p>
          </div>
          
          <div className={`flex space-x-2 mt-4 md:mt-0 p-1 rounded-xl shadow-sm border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {(['overview', 'reservations', 'restaurants', 'users'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                  ${activeTab === tab 
                    ? isDarkMode
                      ? 'bg-purple-900/30 text-purple-300 shadow-sm'
                      : 'bg-primary-50 text-primary-700 shadow-sm'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'reservations' && renderReservations()}
          {activeTab === 'restaurants' && renderRestaurants()}
          {activeTab === 'users' && renderUsers()}
        </div>
      </div>
    </div>
  );
};