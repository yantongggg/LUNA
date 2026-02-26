import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { getExternalMapsUrl, formatCoordinates } from '../utils/mapsHelper';

interface FallbackMapProps {
  latitude: number;
  longitude: number;
  eta?: number | null;
  destinationName?: string;
}

export function FallbackMap({
  latitude,
  longitude,
  eta,
  destinationName = 'Your Location'
}: FallbackMapProps) {
  const openInMaps = () => {
    const url = getExternalMapsUrl(latitude, longitude, destinationName);
    window.open(url, '_blank');
  };

  return (
    <div
      className="h-48 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center"
      style={{
        background: `
          linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)
        `,
      }}
    >
      {/* Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(159, 183, 164, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(159, 183, 164, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Location Marker */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3 animate-bounce"
          style={{
            background: 'rgba(159, 183, 164, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <MapPin className="w-8 h-8" style={{ color: '#8DA895' }} strokeWidth={2.5} />
        </div>

        {/* Coordinates */}
        <div className="text-xs font-medium mb-2" style={{ color: '#8DA895' }}>
          {formatCoordinates(latitude, longitude)}
        </div>

        {/* ETA Badge */}
        {eta && (
          <div
            className="px-3 py-1.5 rounded-lg flex items-center gap-2 mb-3"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Navigation className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {Math.floor(eta / 60)} min
            </span>
          </div>
        )}

        {/* Open in Maps Button */}
        <button
          onClick={openInMaps}
          className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ExternalLink className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Open in Google Maps</span>
        </button>
      </div>

      {/* Map Not Available Notice */}
      <div
        className="absolute bottom-2 left-2 right-2 px-3 py-2 rounded-lg text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p className="text-xs" style={{ color: '#8B7A7F' }}>
          Map loading... Using fallback view
        </p>
      </div>
    </div>
  );
}
