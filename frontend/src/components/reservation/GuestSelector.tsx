import React from 'react';
import { motion } from 'framer-motion';
import { Users, Minus, Plus } from 'lucide-react';

interface GuestSelectorProps {
  guestCount: number;
  onGuestCountChange: (count: number) => void;
  min?: number;
  max?: number;
}

export const GuestSelector: React.FC<GuestSelectorProps> = ({
  guestCount,
  onGuestCountChange,
  min = 1,
  max = 12,
}) => {
  const handleDecrement = () => {
    if (guestCount > min) {
      onGuestCountChange(guestCount - 1);
    }
  };

  const handleIncrement = () => {
    if (guestCount < max) {
      onGuestCountChange(guestCount + 1);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-neutral-700 mb-4">
        <Users className="w-5 h-5 text-primary-500" />
        <span className="font-semibold">Number of Guests</span>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          disabled={guestCount <= min}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
            ${guestCount <= min
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
            }
          `}
        >
          <Minus className="w-5 h-5" />
        </motion.button>

        <div className="w-32 text-center">
          <div className="text-4xl font-bold text-neutral-900">{guestCount}</div>
          <div className="text-sm text-neutral-500 mt-1">
            {guestCount === 1 ? 'Guest' : 'Guests'}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          disabled={guestCount >= max}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
            ${guestCount >= max
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
            }
          `}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="text-center">
        <input
          type="range"
          min={min}
          max={max}
          value={guestCount}
          onChange={(e) => onGuestCountChange(parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>
    </div>
  );
};