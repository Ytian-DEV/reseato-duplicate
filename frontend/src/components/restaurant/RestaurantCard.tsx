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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-primary-100/40 transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={primaryImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center space-x-1 shadow">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-neutral-900">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>

        {/* Cuisine Type Badge */}
        <div className="absolute top-3 left-3 bg-primary-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide">
          {restaurant.cuisineType}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors">
          {restaurant.name}
        </h3>
        
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
          {restaurant.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-start space-x-2 text-neutral-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-600" />
            <span className="text-sm line-clamp-1">{restaurant.address}</span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-600">
            <Clock className="w-4 h-4 flex-shrink-0 text-primary-600" />
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
        <div className="mt-4 pt-4 border-t border-primary-100/50">
          <button className="w-full bg-primary-700 text-white py-2.5 rounded-xl font-semibold hover:bg-primary-800 transition-colors duration-200 btn-ripple">
            Reserve Table
          </button>
        </div>
      </div>
    </motion.div>
  );
};