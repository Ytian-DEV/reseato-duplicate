import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Utensils, MapPin } from 'lucide-react';
import { Restaurant } from '../../../../shared/types';
import restaurantService from '../../services/restaurantService';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
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
      if (match) {
        navigate(`/restaurant/${match.id}`);
      }
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
          r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(
        (r) => r.cuisineType.toLowerCase() === selectedCuisine.toLowerCase()
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
            ].includes(r.name) || r.address.includes('SM City Cebu')
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
            ].includes(r.name) || r.address.includes('SM Seaside')
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
      transition: { staggerChildren: 0.08 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Elegant header */}
      <div className="relative bg-gradient-to-b from-primary-900/95 to-primary-800/90 text-white py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-primary-200 text-sm uppercase tracking-widest mb-2">
              Reserve a table
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight">
              Discover Restaurants
            </h1>
            <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm md:text-base">
              Browse and reserve at the best tables in Cebu.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl shadow-warm-lg border border-primary-100/50 p-2">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search for a restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-neutral-800 placeholder-neutral-400"
              autoComplete="off"
            />
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden max-h-56 overflow-y-auto"
                >
                  {suggestions.map((restaurant) => (
                    <button
                      key={restaurant.id}
                      onClick={() => handleSuggestionClick(restaurant.id)}
                      className="w-full text-left px-5 py-3 hover:bg-primary-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-neutral-800">
                        {restaurant.name}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {restaurant.cuisineType}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            size="lg"
            onClick={handleSearch}
            className="w-full sm:w-auto bg-primary-700 hover:bg-primary-800 text-white rounded-xl px-6 py-3 font-semibold"
          >
            <Search className="w-5 h-5 sm:mr-2" />
            Find Table
          </Button>
        </div>
      </div>

      {/* Location selector */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <Card className="bg-white/90 border border-primary-100/50 p-4 md:p-6">
          <h3 className="text-lg font-display font-semibold text-neutral-800 mb-4 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            Explore by Location
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <button
                onClick={() =>
                  setActiveMall(activeMall === 'SM City' ? null : 'SM City')
                }
                className={`w-full relative overflow-hidden rounded-lg h-44 group transition-all ${
                  activeMall === 'SM City'
                    ? 'ring-2 ring-primary-600 ring-offset-2'
                    : 'hover:shadow-lg'
                }`}
              >
                <SimpleMap
                  locationName="SM City Cebu"
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span className="text-white font-semibold">SM City Cebu</span>
                  <span className="text-white/80 text-xs">Sachi, Chika-an, Mesa</span>
                </div>
              </button>
              {activeMall === 'SM City' && (
                <p className="text-center text-sm text-primary-600 font-medium">
                  Showing restaurants in SM City Cebu
                </p>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={() =>
                  setActiveMall(activeMall === 'SM Seaside' ? null : 'SM Seaside')
                }
                className={`w-full relative overflow-hidden rounded-2xl h-44 group transition-all ${
                  activeMall === 'SM Seaside'
                    ? 'ring-2 ring-primary-600 ring-offset-2'
                    : 'hover:shadow-lg'
                }`}
              >
                <SimpleMap
                  locationName="SM Seaside City Cebu"
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span className="text-white font-semibold">SM Seaside</span>
                  <span className="text-white/80 text-xs">Cabalen, Seoul Black, Kuya J</span>
                </div>
              </button>
              {activeMall === 'SM Seaside' && (
                <p className="text-center text-sm text-primary-600 font-medium">
                  Showing restaurants in SM Seaside
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-primary-100/50 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-neutral-700">
              <Utensils className="w-5 h-5 text-primary-600" />
              <span className="font-semibold">Filter by Cuisine</span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-neutral-600 hover:text-primary-600"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCuisine === cuisine
                      ? 'bg-primary-700 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-800'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-display font-semibold text-neutral-900">
            {activeMall ? `${activeMall} Restaurants` : 'All Restaurants'}
            <span className="text-neutral-500 font-normal text-base ml-2">
              ({filteredRestaurants.length} found)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-primary-100/30"
              >
                <div className="h-52 bg-neutral-200 shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-neutral-200 rounded shimmer" />
                  <div className="h-4 bg-neutral-200 rounded shimmer w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded shimmer w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-neutral-600">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
