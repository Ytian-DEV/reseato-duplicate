import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Moon, Sun } from 'lucide-react';
import { Reservation, ReservationStatus } from '../../../../shared/types';
import reservationService from '../../services/reservationService';
import { ReservationCard } from '../../components/reservation/ReservationCard';
import toast, { Toaster } from 'react-hot-toast';

export const MyReservationsPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | ReservationStatus>('all');

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
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationService.cancelReservation(id);
      toast.success('Reservation cancelled successfully');
      loadReservations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel reservation');
    }
  };

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  const upcomingReservations = reservations.filter(
    r => r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.PENDING
  );

  const pastReservations = reservations.filter(
    r => r.status === ReservationStatus.COMPLETED || r.status === ReservationStatus.CANCELLED
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-neutral-50 to-white'
    } py-12`}>
      <Toaster position="top-center" />

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                My Reservations
              </h1>
              <p className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>
                Manage your restaurant bookings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className={`rounded-2xl shadow-lg p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center space-x-2 ${
              isDarkMode ? 'text-gray-200' : 'text-neutral-700'
            }`}>
              <Filter className="w-5 h-5 text-primary-500" />
              <span className="font-semibold">Filter by Status</span>
            </div>
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-neutral-500'
            }`}>
              {filteredReservations.length} {filteredReservations.length === 1 ? 'reservation' : 'reservations'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    filter === status
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`rounded-2xl p-6 shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="space-y-4">
                  <div className={`h-6 rounded shimmer w-3/4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-neutral-200'
                  }`}></div>
                  <div className={`h-4 rounded shimmer w-1/2 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-neutral-200'
                  }`}></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`h-16 rounded shimmer ${
                      isDarkMode ? 'bg-gray-700' : 'bg-neutral-200'
                    }`}></div>
                    <div className={`h-16 rounded shimmer ${
                      isDarkMode ? 'bg-gray-700' : 'bg-neutral-200'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredReservations.length === 0 ? (
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
              No reservations found
            </h3>
            <p className={isDarkMode ? 'text-gray-400 mb-8' : 'text-neutral-600 mb-8'}>
              {filter === 'all' 
                ? "You haven't made any reservations yet"
                : `No ${filter} reservations`
              }
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/30"
            >
              Browse Restaurants
            </a>
          </div>
        ) : (
          <>
            {/* Upcoming Reservations */}
            {upcomingReservations.length > 0 && filter === 'all' && (
              <div className="mb-12">
                <h2 className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  Upcoming Reservations
                </h2>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {upcomingReservations.map((reservation) => (
                    <motion.div key={reservation.id} variants={item}>
                      <ReservationCard
                        reservation={reservation}
                        onCancel={handleCancel}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Past Reservations */}
            {pastReservations.length > 0 && filter === 'all' && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  Past Reservations
                </h2>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {pastReservations.map((reservation) => (
                    <motion.div key={reservation.id} variants={item}>
                      <ReservationCard reservation={reservation} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Filtered Results */}
            {filter !== 'all' && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredReservations.map((reservation) => (
                  <motion.div key={reservation.id} variants={item}>
                    <ReservationCard
                      reservation={reservation}
                      onCancel={handleCancel}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};