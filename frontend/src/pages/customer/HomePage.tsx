import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Utensils } from 'lucide-react';
import { Restaurant } from '../../../../shared/types';
import restaurantService from '../../services/restaurantService';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import { Button } from '../../components/common/Button';

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

export const HomePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchTerm, selectedCuisine, restaurants]);

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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by cuisine
    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(
        (r) => r.cuisineType.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    setFilteredRestaurants(filtered);
  };

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
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[800px] flex items-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary-200/30 blur-[100px] animate-float-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-300/20 blur-[120px] animate-float-medium"></div>
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full bg-accent-200/30 blur-[80px] animate-float-fast"></div>
        </div>

        {/* Floating 3D Food Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top Right - Burger */}
          <motion.img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
            className="absolute top-[10%] right-[5%] w-32 h-32 md:w-48 md:h-48 object-cover rounded-full shadow-2xl rotate-12 opacity-80 hover:opacity-100 transition-opacity duration-500 animate-float-slow"
            style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
            alt="Floating Burger"
          />
          
          {/* Bottom Left - Pizza */}
          <motion.img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80"
            className="absolute bottom-[15%] left-[5%] w-40 h-40 md:w-56 md:h-56 object-cover rounded-full shadow-2xl -rotate-12 opacity-80 hover:opacity-100 transition-opacity duration-500 animate-float-medium"
            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            alt="Floating Pizza"
          />

          {/* Center Right - Salad */}
          <motion.img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
            className="absolute top-[40%] right-[15%] w-24 h-24 md:w-36 md:h-36 object-cover rounded-full shadow-xl rotate-45 opacity-60 hover:opacity-100 transition-opacity duration-500 animate-float-fast"
            style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
            alt="Floating Salad"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mb-6 tracking-wide uppercase animate-fade-in">
              The Best Food in Cebu
            </span>
            <h1 className="text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 mb-8 leading-tight drop-shadow-sm tracking-tight animate-gradient-x">
              Taste the <span className="text-primary-500">Extraordinary</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Book the best tables at top-rated restaurants. Skip the line, enjoy the dine.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-16 relative z-20">
              <div className="flex flex-col sm:flex-row gap-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-3 shadow-warm-lg hover:shadow-warm transition-shadow duration-300">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-6 w-6 h-6 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="What are you craving today?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 bg-transparent border-none focus:outline-none text-lg text-neutral-800 placeholder-neutral-400 font-medium"
                  />
                </div>
                <Button size="lg" className="sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30 rounded-2xl px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Search className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Find Table</span>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { number: restaurants.length, label: 'Restaurants', icon: '🍽️' },
                { number: '10k+', label: 'Happy Diners', icon: '😊' },
                { number: '4.9', label: 'Average Rating', icon: '⭐' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-soft hover:shadow-warm transition-all duration-300 group cursor-default"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-neutral-800 mb-1">{stat.number}</div>
                  <div className="text-neutral-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-neutral-700">
              <Utensils className="w-5 h-5 text-primary-500" />
              <span className="font-semibold">Filter by Cuisine</span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-neutral-600 hover:text-primary-600 transition-colors"
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
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedCuisine === cuisine
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }
                  `}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'Restaurant' : 'Restaurants'} Found
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="h-56 bg-neutral-200 shimmer"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-neutral-200 rounded shimmer"></div>
                  <div className="h-4 bg-neutral-200 rounded shimmer w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded shimmer w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No restaurants found</h3>
            <p className="text-neutral-600">Try adjusting your search or filters</p>
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