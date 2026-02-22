import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, UtensilsCrossed, Sparkles } from 'lucide-react';
import { Restaurant } from '../../../../shared/types';
import restaurantService from '../../services/restaurantService';
import authService from '../../services/authService';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import { Button } from '../../components/common/Button';
import { SimpleMap } from '../../components/common/SimpleMap';

const cuisineTypes = [
  'All',
  'Filipino',
  'Japanese',
  'Korean',
  'Italian',
  'American',
  'Chinese',
  'Thai',
  'Mexican',
  'Fast Food',
];

export const CustomerDashboardPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMall, setActiveMall] = useState<'SM City' | 'SM Seaside' | null>(null);
  const [suggestions, setSuggestions] = useState<Restaurant[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const user = authService.getStoredUser();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const matches = restaurants.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, restaurants]);

  const handleSearch = () => {
    if (searchTerm) {
      const match =
        restaurants.find((r) => r.name.toLowerCase() === searchTerm.toLowerCase()) ||
        suggestions[0];
      if (match) navigate(`/restaurant/${match.id}`);
    }
  };

  const handleSuggestionClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = [...restaurants];
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(
        (r) => r.cuisineType?.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }
    if (activeMall) {
      if (activeMall === 'SM City') {
        filtered = filtered.filter(
          (r) =>
            [
              'Sachi Ramen',
              'Seafood & Ribs Warehouse',
              'Mesa Restaurant Philippines',
              'Chika-an Cebuano Kitchen',
              'Superbowl of China',
            ].includes(r.name) ||
            r.address?.includes('SM City Cebu')
        );
      } else if (activeMall === 'SM Seaside') {
        filtered = filtered.filter(
          (r) =>
            [
              'Seoul Black',
              'Seafood & Ribs Warehouse',
              'Kuya J',
              'Somac Korean Restaurant',
              'Mesa Restaurant Philippines',
              'Boy Belly',
              'Cabalen',
            ].includes(r.name) ||
            r.address?.includes('SM Seaside')
        );
      }
    }
    setFilteredRestaurants(filtered);
  };

  useEffect(() => {
    filterRestaurants();
  }, [searchTerm, selectedCuisine, activeMall, restaurants]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary-900 via-primary-800 to-primary-800/98 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 md:pt-18 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-primary-200/90 text-sm font-medium tracking-wide mb-1">
              {greeting()}
              {user?.firstName ? `, ${user.firstName}` : ''}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white">
              Find your next table
            </h1>
            <p className="mt-3 text-white/75 text-base md:text-lg max-w-lg">
              Reserve at top-rated restaurants in SM City and SM Seaside Cebu. Skip the line, enjoy the dine.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search bar - floating */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative"
        >
          <div className="bg-white rounded-2xl shadow-lg shadow-primary-900/10 border border-white/80 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 relative flex items-center min-h-[52px]">
                <Search className="absolute left-5 w-5 h-5 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name or cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-5 py-3.5 bg-transparent border-none focus:outline-none text-neutral-800 placeholder-neutral-400 text-base"
                  autoComplete="off"
                />
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden max-h-52 overflow-y-auto z-50"
                    >
                      {suggestions.map((restaurant) => (
                        <button
                          key={restaurant.id}
                          onClick={() => handleSuggestionClick(restaurant.id)}
                          className="w-full text-left px-5 py-3.5 hover:bg-primary-50/80 transition-colors flex items-center justify-between gap-3"
                        >
                          <span className="font-medium text-neutral-800 truncate">
                            {restaurant.name}
                          </span>
                          <span className="text-xs text-neutral-500 shrink-0">
                            {restaurant.cuisineType}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="sm:border-l border-neutral-100 p-2 flex items-center">
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="w-full sm:w-auto bg-primary-700 hover:bg-primary-800 text-white rounded-xl px-6 font-semibold h-11"
                >
                  <Search className="w-5 h-5 sm:mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Location cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center gap-2 mb-4"
        >
          <MapPin className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-display font-semibold text-neutral-800">
            Explore by location
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.button
            type="button"
            onClick={() => setActiveMall(activeMall === 'SM City' ? null : 'SM City')}
            className={`relative overflow-hidden rounded-2xl h-48 text-left transition-all duration-300 ${
              activeMall === 'SM City'
                ? 'ring-2 ring-primary-600 ring-offset-2 ring-offset-[#faf8f6] shadow-lg'
                : 'hover:shadow-lg hover:ring-1 hover:ring-primary-200'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <SimpleMap
              locationName="SM City Cebu"
              className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-white font-display font-semibold text-lg block">
                SM City Cebu
              </span>
              <span className="text-white/80 text-sm">Sachi, Chika-an, Mesa & more</span>
            </div>
            {activeMall === 'SM City' && (
              <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Active
              </div>
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setActiveMall(activeMall === 'SM Seaside' ? null : 'SM Seaside')}
            className={`relative overflow-hidden rounded-2xl h-48 text-left transition-all duration-300 ${
              activeMall === 'SM Seaside'
                ? 'ring-2 ring-primary-600 ring-offset-2 ring-offset-[#faf8f6] shadow-lg'
                : 'hover:shadow-lg hover:ring-1 hover:ring-primary-200'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <SimpleMap
              locationName="SM Seaside City Cebu"
              className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-white font-display font-semibold text-lg block">
                SM Seaside
              </span>
              <span className="text-white/80 text-sm">Cabalen, Seoul Black, Kuya J & more</span>
            </div>
            {activeMall === 'SM Seaside' && (
              <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Active
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Cuisine filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-neutral-600 mr-2">
            <UtensilsCrossed className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium">Cuisine</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cuisineTypes.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCuisine === cuisine
                    ? 'bg-primary-700 text-white shadow-md shadow-primary-700/25'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200/80'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-baseline justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-neutral-900">
              {activeMall ? `${activeMall} Restaurants` : 'All Restaurants'}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'place' : 'places'}
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100"
              >
                <div className="h-56 bg-neutral-200/60 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-neutral-200/60 rounded animate-pulse w-2/3" />
                  <div className="h-4 bg-neutral-200/60 rounded animate-pulse w-full" />
                  <div className="h-4 bg-neutral-200/60 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-neutral-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-neutral-600 max-w-sm mx-auto">
              Try a different search or clear the location filter to see all options.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRestaurants.map((restaurant) => (
              <motion.div key={restaurant.id} variants={item}>
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
