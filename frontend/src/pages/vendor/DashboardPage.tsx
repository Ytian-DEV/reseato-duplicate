import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, Users, TrendingUp } from 'lucide-react';
import { Reservation, ReservationStatus } from '../../../../shared/types';
import restaurantService from '../../services/restaurantService';
import reservationService from '../../services/reservationService';
import { ReservationCard } from '../../components/reservation/ReservationCard';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

export const VendorDashboardPage: React.FC = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-12 bg-neutral-200 rounded shimmer mb-8 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-xl shimmer"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded-xl shimmer"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-neutral-400" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            No Restaurant Found
          </h2>
          <p className="text-neutral-600 mb-8">
            You need to create a restaurant profile first to access the dashboard.
          </p>
          <Button variant="primary" size="lg">
            Create Restaurant Profile
          </Button>
        </div>
      </div>
    );
  }

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === ReservationStatus.PENDING).length,
    confirmed: reservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
    completed: reservations.filter(r => r.status === ReservationStatus.COMPLETED).length,
  };

  const pendingReservations = reservations
    .filter(r => r.status === ReservationStatus.PENDING)
    .sort((a, b) => a.reservationTime.localeCompare(b.reservationTime));

  const confirmedReservations = reservations
    .filter(r => r.status === ReservationStatus.CONFIRMED)
    .sort((a, b) => a.reservationTime.localeCompare(b.reservationTime));

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            {restaurant.name}
          </h1>
          <p className="text-neutral-600">Dashboard Overview</p>
        </motion.div>

        {/* Date Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-neutral-700">Select Date</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-neutral-50 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-all duration-200"
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

        {/* Pending Reservations */}
        {pendingReservations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 text-yellow-500 mr-2" />
              Pending Approval ({pendingReservations.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        )}

        {/* Confirmed Reservations */}
        {confirmedReservations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
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

        {/* No Reservations */}
        {reservations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
              No reservations for {format(new Date(selectedDate), 'MMM dd, yyyy')}
            </h3>
            <p className="text-neutral-600">
              Check a different date or wait for new bookings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};