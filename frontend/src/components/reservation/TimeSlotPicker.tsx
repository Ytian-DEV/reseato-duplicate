import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';
import { TimeSlot } from '../../../../shared/types';
import reservationService from '../../services/reservationService';

interface TimeSlotPickerProps {
  restaurantId: string;
  date: string;
  guestCount: number;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  restaurantId,
  date,
  guestCount,
  selectedTime,
  onTimeSelect,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurantId && date && guestCount) {
      loadTimeSlots();
    }
  }, [restaurantId, date, guestCount]);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const slots = await reservationService.getAvailableTimeSlots(
        restaurantId,
        date,
        guestCount
      );
      setTimeSlots(slots);
    } catch (error) {
      console.error('Failed to load time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-neutral-700 mb-4">
          <Clock className="w-5 h-5 text-primary-500" />
          <span className="font-semibold">Loading available times...</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-12 bg-neutral-200 rounded-lg shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-600">No time slots available for selected criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-neutral-700 mb-4">
        <Clock className="w-5 h-5 text-primary-500" />
        <span className="font-semibold">Select Time</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {timeSlots.map((slot) => {
          const isSelected = selectedTime === slot.time;
          const isAvailable = slot.available;

          return (
            <motion.button
              key={slot.time}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              onClick={() => isAvailable && onTimeSelect(slot.time)}
              disabled={!isAvailable}
              className={`
                relative px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200
                ${isSelected
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : isAvailable
                    ? 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-primary-300 hover:bg-primary-50'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-60'
                }
              `}
            >
              {isSelected && (
                <CheckCircle className="w-4 h-4 absolute top-1 right-1" />
              )}
              <div>{slot.time}</div>
              {isAvailable && slot.tablesAvailable > 0 && (
                <div className="text-xs mt-1 opacity-75">
                  {slot.tablesAvailable} table{slot.tablesAvailable !== 1 ? 's' : ''}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-neutral-500 mt-4">
        * Times shown are in 30-minute intervals
      </p>
    </div>
  );
};