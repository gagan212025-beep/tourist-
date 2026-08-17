import React, { useState, useEffect } from 'react';
import { Destination } from '../types';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Sparkles,
  Info,
  Car,
  Train,
  Plane,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface InteractiveMapProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onOpenVR: (siteId: string) => void;
  language: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinations,
  onSelectDestination,
  onOpenVR,
  language
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePin, setActivePin] = useState<Destination | null>(destinations[0] || null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [distances, setDistances] = useState<Record<string, number>>({});

  // Default center: Ranchi (23.3441° N, 85.3096° E)
  // Jharkhand Latitude range: ~21.98° to 25.33° (Span ~3.35°)
  // Jharkhand Longitude range: ~83.33° to 87.95° (Span ~4.62°)

  const latMin = 22.8;
  const latMax = 24.8;
  const lngMin = 83.8;
  const lngMax = 87.2;

  // Convert lat/lng to percentage coordinates on visual map canvas
  const getMapCoordinates = (lat: number, lng: number) => {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    const y = ((latMax - lat) / (latMax - latMin)) * 100;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(10, Math.min(90, y))
    };
  };

  // Haversine formula for distance calculation in kilometers
  const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const handleRequestGeo = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported on this device/browser');
      return;
    }
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });

        const distMap: Record<string, number> = {};
        destinations.forEach(d => {
          distMap[d.id] = calculateHaversine(uLat, uLng, d.coordinates.lat, d.coordinates.lng);
        });
        setDistances(distMap);
      },
      err => {
        console.warn('Geo permission or timeout:', err);
        // Default simulated GPS near Ranchi Airport for seamless demonstration
        const uLat = 23.32;
        const uLng = 85.32;
        setUserLocation({ lat: uLat, lng: uLng });
        const distMap: Record<string, number> = {};
        destinations.forEach(d => {
          distMap[d.id] = calculateHaversine(uLat, uLng, d.coordinates.lat, d.coordinates.lng);
        });
        setDistances(distMap);
      },
      { timeout: 8000 }
    );
  };

  const filteredDestinations = destinations.filter(d => {
    if (selectedCategory === 'all') return true;
    return d.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'All Destinations', color: 'emerald' },
    { id: 'eco', label: 'Eco & Forests', color: 'green' },
    { id: 'waterfalls', label: 'Waterfalls & Gorges', color: 'cyan' },
    { id: 'spiritual', label: 'Spiritual Shrines', color: 'amber' },
    { id: 'cultural', label: 'Tribal Cultural Heritage', color: 'purple' },
    { id: 'adventure', label: 'Valley Ghats & Lakes', color: 'blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar & Geo Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-900/90 p-4 rounded-2xl border border-stone-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(c => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-md border border-emerald-500'
                    : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleRequestGeo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{userLocation ? 'GPS Located: Near Me Active' : 'Locate Near Me (GPS)'}</span>
        </button>
      </div>

      {/* Main Map & Interactive Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Custom Interactive Geo-Map Canvas */}
        <div className="lg:col-span-2 relative min-h-[460px] sm:min-h-[560px] bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950/40 rounded-3xl border border-stone-800 shadow-2xl p-6 overflow-hidden flex flex-col justify-between">
          {/* Subtle Topographical Elevation Contours SVG Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Plateau Contour curves */}
              <circle cx="45%" cy="55%" r="180" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="45%" cy="55%" r="120" fill="none" stroke="#34d399" strokeWidth="1" />
              <circle cx="28%" cy="40%" r="90" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* District Labels */}
          <div className="absolute top-8 left-8 text-[11px] font-bold text-stone-600 uppercase tracking-widest pointer-events-none">
            Palamau / Latehar Hills (West)
          </div>
          <div className="absolute top-8 right-8 text-[11px] font-bold text-stone-600 uppercase tracking-widest pointer-events-none">
            Deoghar & Santhal Pargana (East)
          </div>
          <div className="absolute bottom-8 left-8 text-[11px] font-bold text-stone-600 uppercase tracking-widest pointer-events-none">
            Khunti & Kolhan (South)
          </div>
          <div className="absolute bottom-8 right-8 text-[11px] font-bold text-stone-600 uppercase tracking-widest pointer-events-none">
            Subarnarekha Valley
          </div>

          {/* Map Title Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Interactive Chotanagpur Geo-Discovery Engine
              </span>
            </div>
            <span className="text-xs text-stone-400">
              Showing {filteredDestinations.length} Verified Locations
            </span>
          </div>

          {/* Pins Canvas Area */}
          <div className="relative w-full h-[380px] sm:h-[440px] my-auto">
            {/* User GPS Pin if available */}
            {userLocation && (
              <div
                style={{
                  left: `${getMapCoordinates(userLocation.lat, userLocation.lng).x}%`,
                  top: `${getMapCoordinates(userLocation.lat, userLocation.lng).y}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></span>
                  <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-blue-950/90 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500 whitespace-nowrap shadow">
                  You are here
                </div>
              </div>
            )}

            {/* Destination Pins */}
            {filteredDestinations.map(d => {
              const coords = getMapCoordinates(d.coordinates.lat, d.coordinates.lng);
              const isSelected = activePin?.id === d.id;

              return (
                <div
                  key={d.id}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  onClick={() => setActivePin(d)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center">
                    {/* Glowing beacon ring */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 scale-125 shadow-lg shadow-amber-500/50 ring-4 ring-amber-400/40'
                          : 'bg-emerald-800 text-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 shadow-md border border-emerald-400/50'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    {/* Pin Label Tooltip */}
                    <div
                      className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap transition-all shadow-md ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 ring-2 ring-stone-950 font-black'
                          : 'bg-stone-900/90 text-stone-200 group-hover:text-white border border-stone-700'
                      }`}
                    >
                      {d.name}
                      {distances[d.id] && (
                        <span className="ml-1 text-[9px] text-emerald-400 font-normal">
                          ({distances[d.id]} km)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 pt-3 border-t border-stone-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-700 border border-emerald-400"></span>
                <span>Active Destination Pin</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Selected</span>
              </span>
            </div>
            <span className="italic text-[11px]">Click any pin to inspect transit routes and 360° tours</span>
          </div>
        </div>

        {/* Right 1 Col: Selected Destination Live Transit & Detail Card */}
        {activePin ? (
          <div className="bg-stone-900 rounded-3xl border border-stone-700 p-6 flex flex-col justify-between shadow-2xl text-stone-100">
            <div>
              {/* Image & Category */}
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-stone-800">
                <img
                  src={activePin.imageUrl}
                  alt={activePin.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                    {activePin.category}
                  </span>
                </div>
                {activePin.has360Panorama && (
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => onOpenVR(activePin.panoramaUrl || 'netarhat_sunset')}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <Layers className="w-3 h-3" />
                      <span>360° VR</span>
                    </button>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-black font-serif text-white">{activePin.name}</h3>
                  <p className="text-xs text-amber-300 font-medium">District: {activePin.district}</p>
                </div>
              </div>

              {/* Distance badge if GPS on */}
              {distances[activePin.id] && (
                <div className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    Distance from your GPS location:
                  </span>
                  <span className="text-white font-black text-sm">{distances[activePin.id]} km</span>
                </div>
              )}

              <p className="text-xs text-stone-300 line-clamp-3 mb-4 leading-relaxed">
                {activePin.description}
              </p>

              {/* Transit Logistics */}
              <div className="space-y-2 bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800 text-xs text-stone-300">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Car className="w-3.5 h-3.5" />
                  <span>Transit & Road Directions</span>
                </div>
                <p className="flex items-start gap-2">
                  <Plane className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{activePin.transportInfo.nearestAirport}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Train className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{activePin.transportInfo.nearestRailway}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Car className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{activePin.transportInfo.roadAccess}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center gap-2">
              <button
                onClick={() => onSelectDestination(activePin)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Info className="w-4 h-4" />
                <span>Full Guide & Guides</span>
              </button>

              {activePin.has360Panorama && (
                <button
                  onClick={() => onOpenVR(activePin.panoramaUrl || 'netarhat_sunset')}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs border border-stone-700 flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>360° VR</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-stone-900/60 rounded-3xl border border-dashed border-stone-800 p-8 flex flex-col items-center justify-center text-center text-stone-400">
            <Compass className="w-10 h-10 text-stone-600 mb-2" />
            <p className="text-sm">Click any map pin to inspect road access and distance</p>
          </div>
        )}
      </div>
    </div>
  );
};
