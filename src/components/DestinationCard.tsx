import React from 'react';
import { Destination } from '../types';
import {
  MapPin,
  Star,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Car
} from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (dest: Destination) => void;
  onOpenVR: (siteId: string) => void;
  language: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  onOpenVR,
  language
}) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'eco':
        return { label: 'Eco Forest', bg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' };
      case 'waterfalls':
        return { label: 'Waterfall', bg: 'bg-sky-950/90 text-sky-300 border-sky-500/40' };
      case 'spiritual':
        return { label: 'Spiritual', bg: 'bg-amber-950/90 text-amber-300 border-amber-500/40' };
      case 'cultural':
        return { label: 'Tribal Culture', bg: 'bg-purple-950/90 text-purple-300 border-purple-500/40' };
      case 'adventure':
        return { label: 'Ghats & Dam', bg: 'bg-teal-950/90 text-teal-300 border-teal-500/40' };
      default:
        return { label: 'Heritage', bg: 'bg-stone-900 text-stone-300 border-stone-700' };
    }
  };

  const badge = getCategoryBadge(destination.category);

  return (
    <div className="group bg-stone-900 rounded-3xl border border-stone-800 hover:border-emerald-500/40 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-stone-100">
      <div>
        {/* Card Image Banner */}
        <div className="relative h-52 sm:h-56 overflow-hidden bg-stone-950">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md ${badge.bg}`}
            >
              {badge.label}
            </span>

            {destination.has360Panorama && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onOpenVR(destination.panoramaUrl || 'netarhat_sunset');
                }}
                className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>360° VR</span>
              </button>
            )}
          </div>

          {/* Bottom Overlay Title on Image */}
          <div className="absolute bottom-3 left-3.5 right-3.5">
            <h3 className="text-xl font-black font-serif text-white tracking-tight flex items-baseline justify-between">
              <span>{language === 'hi' && destination.hindiName ? destination.hindiName : destination.name}</span>
              {destination.elevation && (
                <span className="text-[11px] text-amber-300 font-sans font-semibold">
                  {destination.elevation}
                </span>
              )}
            </h3>
            <p className="text-xs text-emerald-300 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>District: {destination.district}</span>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
            {destination.tagline}
          </p>

          {/* Highlights Bullets */}
          <div className="space-y-1.5 pt-1">
            {destination.highlights.slice(0, 2).map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <span className="line-clamp-1">{h}</span>
              </div>
            ))}
          </div>

          {/* Ratings & Best Season */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{destination.ratings.average}</span>
              <span className="text-stone-400 font-normal">({destination.ratings.count})</span>
            </div>
            <span className="text-[11px] text-stone-400 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
              {destination.bestTimeToVisit.split('(')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0">
        <button
          onClick={() => onSelect(destination)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-800 hover:bg-emerald-700 text-stone-200 hover:text-white font-bold text-xs border border-stone-700 hover:border-emerald-600 shadow transition-all group-hover:bg-emerald-700 group-hover:text-white"
        >
          <span>{language === 'hi' ? 'विस्तार से देखें एवं बुक करें' : 'View Full Guide & Book'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
