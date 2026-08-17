import React, { useState } from 'react';
import { CulturalEvent } from '../types';
import {
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Sun,
  Flame,
  ArrowRight
} from 'lucide-react';

interface EventsCalendarProps {
  events: CulturalEvent[];
  onBookService: (serviceType: string, targetTitle: string, providerId?: string, amount?: number) => void;
  language: string;
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  events,
  onBookService,
  language
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CulturalEvent>(events[0] || null);

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-stone-100">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-teal-950 to-stone-900 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/80 border border-amber-400/40 text-amber-300 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Tribal Harvest & Sacred Sarna Calendar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight">
            {language === 'hi' ? 'झारखंड के पारंपरिक उत्सव एवं हाट' : 'Tribal Festivals & Cultural Melas'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            {language === 'hi'
              ? 'सरहुल के सखुआ फूलों के पूजन से लेकर करमा, सोहराई और टुसू परब तक — प्रकृति, वन और उर्वरता के प्रति कृतज्ञता व्यक्त करने वाले जीवंत जनजातीय पर्व।'
              : 'Experience sacred Sarna groves during Sarhul, dynamic Karma drum dances, Sohrai cattle art rituals, and winter Tusu melas celebrating the rhythm of earth and harvest.'}
          </p>
        </div>
      </div>

      {/* Grid of Festivals & Selected Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Events List Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map(ev => {
              const isSelected = selectedEvent?.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`cursor-pointer group bg-stone-900 rounded-3xl border p-5 space-y-3 transition-all duration-300 ${
                    isSelected
                      ? 'border-amber-500 bg-stone-900/90 shadow-2xl ring-2 ring-amber-400/30'
                      : 'border-stone-800 hover:border-emerald-500/50 hover:bg-stone-850'
                  }`}
                >
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                        {ev.tribeFocus}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-xs">
                      <span className="font-mono text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded backdrop-blur-md">
                        {ev.dates}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      {ev.title}
                    </h4>
                    {ev.hindiTitle && (
                      <p className="text-xs text-amber-400 font-medium">{ev.hindiTitle}</p>
                    )}
                    <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ev.location}</span>
                    </p>
                  </div>

                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Selected Festival In-Depth Rituals & Guide Booking */}
        {selectedEvent && (
          <div className="bg-stone-900 rounded-3xl border border-stone-700 p-6 flex flex-col justify-between shadow-2xl text-stone-100 space-y-6">
            <div className="space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden border border-stone-800">
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold uppercase border border-amber-500/40">
                    {selectedEvent.tribeFocus}
                  </span>
                  <h3 className="text-lg font-black font-serif text-white mt-1">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-300">
                <div className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800">
                  <span className="text-stone-400">Festival Dates:</span>
                  <span className="font-bold text-amber-300">{selectedEvent.dates}</span>
                </div>
                <div className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800">
                  <span className="text-stone-400">Primary Hub:</span>
                  <span className="font-bold text-emerald-300">{selectedEvent.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Sacred Rituals & Highlights
                </h5>
                <div className="space-y-1.5">
                  {selectedEvent.rituals.map((r, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-stone-300 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  onBookService(
                    'festival_pass',
                    `Festival Guide & Experience: ${selectedEvent.title}`,
                    'prov-001',
                    1800
                  );
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Book Cultural Experience Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
