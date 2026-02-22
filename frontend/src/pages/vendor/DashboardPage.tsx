import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, Users, TrendingUp, PieChart, Moon, Sun } from 'lucide-react';
import { Reservation, ReservationStatus } from '../../../../shared/types';
import restaurantService from '../../services/restaurantService';
import reservationService from '../../services/reservationService';
import { ReservationCard } from '../../components/reservation/ReservationCard';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const VendorDashboardPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);

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
  }, [selectedDate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [restaurantData] = await Promise.all([
        restaurantService.getMyRestaurant(),
      ]);
      setRestaurant(restaurantData);

      if (restaurantData) {
        const reservationData = await reservationService.getRestaurantReservations(
          restaurantData.id,
          selectedDate
        );
        setReservations(reservationData);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
    try {
      await reservationService.updateReservationStatus(reservationId, status);
      toast.success(`Reservation ${status}`);
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update reservation');
    }
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === ReservationStatus.PENDING).length,
    confirmed: reservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
    completed: reservations.filter(r => r.status === ReservationStatus.COMPLETED).length,
    cancelled: reservations.filter(r => r.status === ReservationStatus.CANCELLED).length,
  };

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'Confirmed', value: stats.confirmed, color: '#10B981' },
    { name: 'Completed', value: stats.completed, color: '#8B5CF6' },
    { name: 'Cancelled', value: stats.cancelled, color: '#EF4444' },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-neutral-50'
      } py-8`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className={`h-12 rounded shimmer mb-8 w-1/3 ${
            isDarkMode ? 'bg-gray-800' : 'bg-neutral-200'
          }`}></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-32 rounded-xl shimmer ${
                isDarkMode ? 'bg-gray-800' : 'bg-neutral-200'
              }`}></div>
            ))}
          </div>
          <div className={`h-96 rounded-xl shimmer ${
            isDarkMode ? 'bg-gray-800' : 'bg-neutral-200'
          }`}></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-neutral-50'
      } py-20`}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-neutral-100'
          }`}>
            <Users className={`w-12 h-12 ${
              isDarkMode ? 'text-gray-600' : 'text-neutral-400'
            }`} />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}>
            No Restaurant Found
          </h2>
          <p className={isDarkMode ? 'text-gray-400 mb-8' : 'text-neutral-600 mb-8'}>
            You need to create a restaurant profile first to access the dashboard.
          </p>
          <Button variant="primary" size="lg">
            Create Restaurant Profile
          </Button>
        </div>
      </div>
    );
  }

  const pendingReservations = reservations
    .filter(r => r.status === ReservationStatus.PENDING)
    .sort((a, b) => a.reservationTime.localeCompare(b.reservationTime));

  const confirmedReservations = reservations
    .filter(r => r.status === ReservationStatus.CONFIRMED)
    .sort((a, b) => a.reservationTime.localeCompare(b.reservationTime));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-neutral-50 to-white'
    } py-8`}>
      
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

      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}>
            {restaurant.name}
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>Dashboard Overview</p>
        </motion.div>

        {/* Date Selector */}
        <div className={`rounded-2xl shadow-lg p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className={`font-semibold ${
                isDarkMode ? 'text-gray-200' : 'text-neutral-700'
              }`}>Select Date</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full sm:w-auto px-4 py-2 border-2 rounded-lg focus:border-primary-500 focus:outline-none transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900'
              }`}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-blue-100 text-sm mb-1">Total Bookings</div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                </div>
                <Calendar className="w-12 h-12 text-blue-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-yellow-100 text-sm mb-1">Pending</div>
                  <div className="text-3xl font-bold">{stats.pending}</div>
                </div>
                <Clock className="w-12 h-12 text-yellow-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-green-100 text-sm mb-1">Confirmed</div>
                  <div className="text-3xl font-bold">{stats.confirmed}</div>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-purple-100 text-sm mb-1">Completed</div>
                  <div className="text-3xl font-bold">{stats.completed}</div>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-200" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Analytics Section */}
        {reservations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className={`col-span-1 lg:col-span-1 p-6 flex flex-col items-center justify-center min-h-[300px] ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                <PieChart className="w-5 h-5 mr-2 text-primary-500" />
                Reservation Status
              </h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <div className="col-span-1 lg:col-span-2">
              {/* Pending Reservations */}
              {pendingReservations.length > 0 ? (
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-6 flex items-center ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>
                    <Clock className="w-6 h-6 text-yellow-500 mr-2" />
                    Pending Approval ({pendingReservations.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {pendingReservations.map((reservation) => (
                      <div key={reservation.id}>
                        <ReservationCard reservation={reservation} showCustomer />
                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="primary"
                            fullWidth
                            onClick={() => handleStatusUpdate(reservation.id, ReservationStatus.CONFIRMED)}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            fullWidth
                            onClick={() => handleStatusUpdate(reservation.id, ReservationStatus.CANCELLED)}
                            leftIcon={<XCircle className="w-4 h-4" />}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl p-8 text-center border h-full flex flex-col justify-center ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-neutral-200'
                }`}>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>All caught up!</h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-neutral-500'}>
                    No pending reservations to review.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirmed Reservations */}
        {confirmedReservations.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-6 flex items-center ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              Confirmed Reservations ({confirmedReservations.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {confirmedReservations.map((reservation) => (
                <div key={reservation.id}>
                  <ReservationCard reservation={reservation} showCustomer />
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => handleStatusUpdate(reservation.id, ReservationStatus.COMPLETED)}
                    >
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Reservations State */}
        {reservations.length === 0 && (
          <div className="text-center py-20">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-neutral-100'
            }`}>
              <Calendar className={`w-12 h-12 ${
                isDarkMode ? 'text-gray-600' : 'text-neutral-400'
              }`} />
            </div>
            <h3 className={`text-2xl font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              No reservations for {format(new Date(selectedDate), 'MMM dd, yyyy')}
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>
              Check a different date or wait for new bookings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};