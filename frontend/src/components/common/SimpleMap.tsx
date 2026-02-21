import React from 'react';

interface SimpleMapProps {
  locationName: string; // e.g., "SM City Cebu"
  className?: string;
  title?: string;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({ locationName, className = "h-64 w-full", title }) => {
  // Encodes the location for the URL
  const query = encodeURIComponent(locationName);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {title && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <h4 className="font-bold text-neutral-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {title}
          </h4>
        </div>
      )}
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
        src={`https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map of ${locationName}`}
        className="w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none border-4 border-white/20 rounded-xl shadow-inner"></div>
    </div>
  );
};