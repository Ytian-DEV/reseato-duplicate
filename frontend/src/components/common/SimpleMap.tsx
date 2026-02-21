import React from 'react';

interface SimpleMapProps {
  locationName: string; // e.g., "SM City Cebu"
  className?: string;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({ locationName, className = "h-64 w-full" }) => {
  // Encodes the location for the URL
  const query = encodeURIComponent(locationName);
  
  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${className}`}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0, minHeight: '100%' }}
        src={`https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map of ${locationName}`}
      />
    </div>
  );
};
