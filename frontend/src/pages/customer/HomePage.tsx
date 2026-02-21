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

export const HomePage: React.FC = () => {
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
      const matches = restaurants.filter(r => 
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
      // Find exact match or first suggestion
      const match = restaurants.find(r => r.name.toLowerCase() === searchTerm.toLowerCase()) || suggestions[0];
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

    // Filter by Mall Location
    if (activeMall) {
      if (activeMall === 'SM City') {
        filtered = filtered.filter(r => 
          ['Sachi Ramen', 'Seafood & Ribs Warehouse', 'Mesa Restaurant Philippines', 'Chika-an Cebuano Kitchen', 'Superbowl of China'].includes(r.name) || r.address.includes('SM City Cebu')
        );
      } else if (activeMall === 'SM Seaside') {
        filtered = filtered.filter(r => 
          ['Seoul Black', 'Seafood & Ribs Warehouse', 'Kuya J', 'Somac Korean Restaurant', 'Mesa Restaurant Philippines', 'Boy Belly', 'Cabalen'].includes(r.name) || r.address.includes('SM Seaside')
        );
      }
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
      <div className="relative overflow-hidden min-h-[600px] md:min-h-[800px] flex items-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-primary-200/30 blur-[60px] md:blur-[100px] animate-float-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-primary-300/20 blur-[70px] md:blur-[120px] animate-float-medium"></div>
          <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-accent-200/30 blur-[50px] md:blur-[80px] animate-float-fast"></div>
        </div>

        {/* Floating 3D Food Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
            className="absolute top-[5%] right-[-10%] md:top-[10%] md:right-[5%] w-24 h-24 md:w-48 md:h-48 object-cover rounded-full shadow-2xl rotate-12 opacity-60 md:opacity-80 hover:opacity-100 transition-opacity duration-500 animate-float-slow"
            style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
            alt="Floating Burger"
          />
          <motion.img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80"
            className="absolute bottom-[10%] left-[-5%] md:bottom-[15%] md:left-[5%] w-32 h-32 md:w-56 md:h-56 object-cover rounded-full shadow-2xl -rotate-12 opacity-60 md:opacity-80 hover:opacity-100 transition-opacity duration-500 animate-float-medium"
            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            alt="Floating Pizza"
          />
          <motion.img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
            className="absolute top-[60%] right-[-5%] md:top-[40%] md:right-[15%] w-20 h-20 md:w-36 md:h-36 object-cover rounded-full shadow-xl rotate-45 opacity-50 md:opacity-60 hover:opacity-100 transition-opacity duration-500 animate-float-fast"
            style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
            alt="Floating Salad"
          />
          <motion.img
            src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80"
            className="absolute top-[20%] left-[-5%] md:top-[30%] md:left-[10%] w-28 h-28 md:w-40 md:h-40 object-cover rounded-full shadow-2xl rotate-12 opacity-50 md:opacity-70 hover:opacity-100 transition-opacity duration-500 animate-float-slow"
            style={{ borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%' }}
            alt="Floating Sushi"
          />
          <motion.img
            src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80"
            className="absolute bottom-[20%] right-[-5%] md:bottom-[30%] md:right-[10%] w-32 h-32 md:w-44 md:h-44 object-cover rounded-full shadow-2xl -rotate-12 opacity-50 md:opacity-70 hover:opacity-100 transition-opacity duration-500 animate-float-medium"
            style={{ borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%' }}
            alt="Floating Drink"
          />
          <motion.img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
            className="absolute top-[80%] left-[20%] md:top-[70%] md:left-[25%] w-24 h-24 md:w-32 md:h-32 object-cover rounded-full shadow-xl rotate-45 opacity-40 md:opacity-60 hover:opacity-100 transition-opacity duration-500 animate-float-fast"
            style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
            alt="Floating Bowl"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 text-xs md:text-sm font-semibold mb-4 md:mb-6 tracking-wide uppercase animate-fade-in">
              The Best Food in Cebu
            </span>
            <h1 className="text-4xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 mb-6 md:mb-8 leading-tight drop-shadow-sm tracking-tight animate-gradient-x">
              Taste the <span className="text-primary-500">Extraordinary</span>
            </h1>
            <p className="text-lg md:text-2xl text-neutral-600 mb-8 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-4">
              Book the best tables at top-rated restaurants. Skip the line, enjoy the dine.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-10 md:mb-16 relative z-50">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl md:rounded-3xl p-2 md:p-3 shadow-warm-lg hover:shadow-warm transition-shadow duration-300">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-4 md:left-6 w-5 h-5 md:w-6 md:h-6 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search for a restaurant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-4 bg-transparent border-none focus:outline-none text-base md:text-lg text-neutral-800 placeholder-neutral-400 font-medium"
                    autoComplete="off"
                  />
                  
                  {/* Custom Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden max-h-60 overflow-y-auto"
                      >
                        {suggestions.map((restaurant) => (
                          <button
                            key={restaurant.id}
                            onClick={() => handleSuggestionClick(restaurant.id)}
                            className="w-full text-left px-6 py-3 hover:bg-primary-50 transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium text-neutral-700 group-hover:text-primary-700">
                              {restaurant.name}
                            </span>
                            <span className="text-xs text-neutral-400 group-hover:text-primary-400">
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
                  className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30 rounded-xl md:rounded-2xl px-6 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-5 h-5 sm:mr-2" />
                  <span className="inline sm:inline">Find Table</span>
                </Button>
              </div>
            </div>

            {/* Mall Map Selector */}
            <div className="max-w-3xl mx-auto mb-12">
              <Card className="bg-white/80 backdrop-blur-md p-4 md:p-6 border border-white/60">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  Explore by Location
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveMall(activeMall === 'SM City' ? null : 'SM City')}
                      className={`
                        w-full relative overflow-hidden rounded-xl h-48 group transition-all duration-300 text-left
                        ${activeMall === 'SM City' ? 'ring-4 ring-primary-500 ring-offset-2' : 'hover:shadow-lg'}
                      `}
                    >
                      <SimpleMap locationName="SM City Cebu" className="absolute inset-0 w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none flex flex-col justify-end p-4">
                        <span className="text-white font-bold text-lg">SM City Cebu</span>
                        <span className="text-white/80 text-xs">Sachi, Chika-an, Superbowl, Mesa</span>
                      </div>
                    </button>
                    {activeMall === 'SM City' && (
                      <div className="text-center text-sm text-primary-600 font-medium animate-fade-in">
                        Showing restaurants in SM City Cebu
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveMall(activeMall === 'SM Seaside' ? null : 'SM Seaside')}
                      className={`
                        w-full relative overflow-hidden rounded-xl h-48 group transition-all duration-300 text-left
                        ${activeMall === 'SM Seaside' ? 'ring-4 ring-primary-500 ring-offset-2' : 'hover:shadow-lg'}
                      `}
                    >
                      <SimpleMap locationName="SM Seaside City Cebu" className="absolute inset-0 w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none flex flex-col justify-end p-4">
                        <span className="text-white font-bold text-lg">SM Seaside</span>
                        <span className="text-white/80 text-xs">Cabalen, Seoul Black, Kuya J, Somac</span>
                      </div>
                    </button>
                    {activeMall === 'SM Seaside' && (
                      <div className="text-center text-sm text-primary-600 font-medium animate-fade-in">
                        Showing restaurants in SM Seaside
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-3xl mx-auto">
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
                  className="bg-white/60 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-6 border border-white/60 shadow-soft hover:shadow-warm transition-all duration-300 group cursor-default"
                >
                  <div className="text-2xl md:text-4xl mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-xl md:text-4xl font-bold text-neutral-800 mb-0 md:mb-1">{stat.number}</div>
                  <div className="text-neutral-500 text-xs md:text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 z-30">
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
            {activeMall ? `${activeMall} Restaurants` : 'All Restaurants'}
            <span className="text-neutral-500 font-normal text-lg ml-3">
              ({filteredRestaurants.length} found)
            </span>
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