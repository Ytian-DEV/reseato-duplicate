import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Utensils, Calendar, DollarSign, Search, Filter, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import adminService, { DashboardStats, AdminReservation, AdminRestaurant, AdminUser } from '../../services/adminService';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

type Tab = 'overview' | 'reservations' | 'restaurants' | 'users';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Data States
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Filter States
  const [reservationFilter, setReservationFilter] = useState({ status: '', search: '' });

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
      // Removed toast error to prevent spamming if it fails silently
    }
  };

  const handleReservationAction = async (id: string, action: 'override' | 'cancel') => {
    try {
      const status = action === 'override' ? 'completed' : 'cancelled';
      await adminService.updateReservationStatus(id, status);
      toast.success(`Reservation ${status}`);
      loadReservations();
      loadDashboardData(); // Update stats
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
      <div className="min-h-screen flex items-center justify-center">
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
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
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
        <Card className="min-h-[300px] flex flex-col justify-center items-center text-gray-400 border-2 border-dashed border-gray-200">
          <Calendar className="w-12 h-12 mb-2 opacity-50" />
          <p>Reservations by Day (Chart Placeholder)</p>
        </Card>
        <Card className="min-h-[300px] flex flex-col justify-center items-center text-gray-400 border-2 border-dashed border-gray-200">
          <CheckCircle className="w-12 h-12 mb-2 opacity-50" />
          <p>Completion vs Cancellation (Chart Placeholder)</p>
        </Card>
      </div>
    </div>
  );

  const renderReservations = () => (
    <Card>
      <div className="mb-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">All Reservations</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Search user or restaurant..." 
              leftIcon={<Search className="w-4 h-4" />}
              value={reservationFilter.search}
              onChange={(e) => setReservationFilter({ ...reservationFilter, search: e.target.value })}
            />
          </div>
          <select 
            className="px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500"
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
            <tr className="border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">Restaurant</th>
              <th className="p-4 font-semibold text-gray-600">Date/Time</th>
              <th className="p-4 font-semibold text-gray-600">Guests</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Commission</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">#{res.id.slice(0, 5)}</td>
                <td className="p-4 font-medium">{res.user_first_name} {res.user_last_name}</td>
                <td className="p-4 text-gray-600">{res.restaurant_name}</td>
                <td className="p-4 text-gray-600">
                  {format(new Date(res.reservation_date), 'MMM d')} – {res.reservation_time.slice(0, 5)}
                </td>
                <td className="p-4 text-gray-600">{res.guest_count}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${res.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      res.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {res.status}
                  </span>
                </td>
                <td className="p-4 font-medium text-green-600">₱{res.commission}</td>
                <td className="p-4 flex space-x-2">
                  <button 
                    onClick={() => handleReservationAction(res.id, 'override')}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                  >
                    Override
                  </button>
                  <button 
                    onClick={() => handleReservationAction(res.id, 'cancel')}
                    className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reservations.length === 0 && (
          <div className="p-8 text-center text-gray-500">No reservations found matching filters.</div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-4 italic">* Each completed reservation automatically earns ₱70 commission</p>
    </Card>
  );

  const renderRestaurants = () => (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Restaurant Management</h2>
        <Button size="sm" leftIcon={<Utensils className="w-4 h-4" />}>+ Create Restaurant</Button>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Restaurant</th>
              <th className="p-4 font-semibold text-gray-600">Owner</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Completed Res.</th>
              <th className="p-4 font-semibold text-gray-600">Commission Due</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((rest) => (
              <tr key={rest.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium">{rest.name}</td>
                <td className="p-4 text-gray-600">{rest.owner}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${rest.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {rest.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{rest.completedReservations}</td>
                <td className="p-4 font-bold text-gray-900">₱{rest.commissionDue.toLocaleString()}</td>
                <td className="p-4 flex space-x-2">
                  <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">View</button>
                  {rest.commissionDue > 0 && (
                    <button 
                      onClick={() => handleMarkPaid(rest.id)}
                      className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 border border-green-200"
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

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h4 className="font-semibold text-blue-900 mb-2">Commission Overview:</h4>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>₱70 is automatically collected per completed reservation.</li>
          <li>Pending commissions are displayed per restaurant.</li>
          <li>Admin can manually mark commissions as paid.</li>
        </ul>
      </div>
    </Card>
  );

  const renderUsers = () => (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Joined</th>
              <th className="p-4 font-semibold text-gray-600">Reservations</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{user.name}</span>
                </td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 capitalize text-gray-600">{user.role}</td>
                <td className="p-4 text-gray-600">{format(new Date(user.joinedAt), 'MMM d, yyyy')}</td>
                <td className="p-4 text-gray-600">{user.reservationCount}</td>
                <td className="p-4 flex space-x-2">
                  <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">History</button>
                  <button 
                    onClick={() => handleToggleUser(user.id)}
                    className={`text-xs px-2 py-1 rounded border ${user.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
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
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Platform overview and management</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            {(['overview', 'reservations', 'restaurants', 'users'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                  ${activeTab === tab 
                    ? 'bg-primary-50 text-primary-700 shadow-sm' 
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
