import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Phone, Mail, Calendar, ArrowLeft, Moon, Sun } from 'lucide-react';
import { Restaurant } from '../../../../shared/types';
import restaurantService from '../../services/restaurantService';
import reservationService from '../../services/reservationService';
import authService from '../../services/authService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { GuestSelector } from '../../components/reservation/GuestSelector';
import { TimeSlotPicker } from '../../components/reservation/TimeSlotPicker';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Reservation form state
  const [reservationDate, setReservationDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTime, setSelectedTime] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    if (id) {
      loadRestaurant();
    }
  }, [id]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getRestaurantById(id!);
      setRestaurant(data);
    } catch (error) {
      toast.error('Failed to load restaurant');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async () => {
    if (!authService.isAuthenticated()) {
      toast.error('Please login to make a reservation');
      navigate('/login');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      setSubmitting(true);
      const reservation = await reservationService.createReservation({
        restaurantId: id!,
        reservationDate,
        reservationTime: selectedTime,
        guestCount,
        specialNotes,
      });

      toast.success('Reservation initiated! Proceed to payment.');
      navigate(`/payment/${reservation.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-neutral-50'
      }`}>
        <div className={`h-96 shimmer ${
          isDarkMode ? 'bg-gray-800' : 'bg-neutral-200'
        }`}></div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className={`h-12 rounded shimmer ${
                isDarkMode ? 'bg-gray-800' : 'bg-neutral-200'
              }`}></div>
              <div className={`h-32 rounded shimmer ${
                isDarkMode ? 'bg-gray-800' : 'bg-neutral-200'
              }`}></div>
            </div>
            <div className={`h-96 rounded shimmer ${
              isDarkMode ? 'bg-gray-800' : 'bg-neutral-200'
            }`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  const primaryImage = restaurant.images?.find(img => img.isPrimary)?.imageUrl 
    || restaurant.images?.[0]?.imageUrl 
    || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80';

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-neutral-50'
    }`}>
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

      {/* Hero Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={primaryImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className={`absolute top-4 left-4 md:top-8 md:left-8 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/80 transition-all duration-200 shadow-lg ${
            isDarkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-neutral-900'
          }`}
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 md:space-y-4"
            >
              <div className="inline-block bg-primary-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wide">
                {restaurant.cuisineType}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {restaurant.name}
              </h1>
              <div className="flex items-center space-x-4 md:space-x-6 text-white">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-base md:text-lg font-semibold">{restaurant.rating.toFixed(1)}</span>
                  <span className="text-xs md:text-base text-neutral-300">({restaurant.totalReviews} reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
              <h2 className={`text-2xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>About</h2>
              <p className={isDarkMode ? 'text-gray-300 leading-relaxed' : 'text-neutral-700 leading-relaxed'}>
                {restaurant.description}
              </p>
            </Card>

            {/* Info */}
            <Card className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className={`font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-neutral-900'
                    }`}>Address</div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>
                      {restaurant.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className={`font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-neutral-900'
                    }`}>Hours</div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>
                      {restaurant.openingTime.slice(0, 5)} - {restaurant.closingTime.slice(0, 5)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className={`font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-neutral-900'
                    }`}>Phone</div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>
                      {restaurant.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className={`font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-neutral-900'
                    }`}>Email</div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>
                      {restaurant.email}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Image Gallery */}
            {restaurant.images && restaurant.images.length > 1 && (
              <Card className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <h2 className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {restaurant.images.map((image, index) => (
                    <div key={image.id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={`${restaurant.name} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Reservation Form */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className={`shadow-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>Reserve a Table</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>
                  Commission: ₱30 per booking
                </p>
              </div>

              <div className="space-y-6">
                {/* Date Picker */}
                <div>
                  <label className={`flex items-center space-x-2 mb-3 font-semibold ${
                    isDarkMode ? 'text-gray-200' : 'text-neutral-700'
                  }`}>
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <span>Select Date</span>
                  </label>
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-neutral-200 text-neutral-900'
                    }`}
                  />
                </div>

                {/* Guest Selector */}
                <GuestSelector
                  guestCount={guestCount}
                  onGuestCountChange={setGuestCount}
                />

                {/* Time Slot Picker */}
                <TimeSlotPicker
                  restaurantId={restaurant.id}
                  date={reservationDate}
                  guestCount={guestCount}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />

                {/* Special Notes */}
                <div>
                  <label className={`block mb-2 font-semibold ${
                    isDarkMode ? 'text-gray-200' : 'text-neutral-700'
                  }`}>
                    Special Notes (Optional)
                  </label>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="E.g., Birthday celebration, dietary restrictions..."
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 resize-none ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-white border-neutral-200 text-neutral-900'
                    }`}
                  />
                </div>

                {/* Reserve Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleReservation}
                  isLoading={submitting}
                  disabled={!selectedTime}
                >
                  Proceed to Payment
                </Button>

                <p className={`text-xs text-center ${
                  isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                }`}>
                  You will be charged ₱100 as reservation fee
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};