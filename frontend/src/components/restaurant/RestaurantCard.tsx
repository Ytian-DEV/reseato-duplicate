import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../../../../shared/types';
import { MapPin, Clock, Star } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate();

  const primaryImage = restaurant.images?.find(img => img.isPrimary)?.imageUrl 
    || restaurant.images?.[0]?.imageUrl 
    || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={primaryImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-neutral-900">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>

        {/* Cuisine Type Badge */}
        <div className="absolute top-4 left-4 bg-primary-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
          {restaurant.cuisineType}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {restaurant.name}
        </h3>
        
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
          {restaurant.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-start space-x-2 text-neutral-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
            <span className="text-sm line-clamp-1">{restaurant.address}</span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-600">
            <Clock className="w-4 h-4 flex-shrink-0 text-primary-500" />
            <span className="text-sm">
              {restaurant.openingTime.slice(0, 5)} - {restaurant.closingTime.slice(0, 5)}
            </span>
          </div>

          {restaurant.totalReviews > 0 && (
            <div className="text-xs text-neutral-500">
              {restaurant.totalReviews} {restaurant.totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          )}
        </div>

        {/* Reserve Button */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 btn-ripple">
            Reserve Table
          </button>
        </div>
      </div>
    </motion.div>
  );
};