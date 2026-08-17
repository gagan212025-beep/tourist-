import React, { useState } from 'react';
import { GeneratedItinerary } from '../types';
import {
  Sparkles,
  Calendar,
  DollarSign,
  Compass,
  MapPin,
  Clock,
  Car,
  Home,
  CheckCircle2,
  Utensils,
  Sun,
  Sunset,
  Download,
  Share2,
  Bookmark,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ItineraryPlannerProps {
  language: string;
  onBookService: (serviceType: string, targetTitle: string, providerId?: string, amount?: number) => void;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  language,
  onBookService
}) => {
  const [durationDays, setDurationDays] = useState(3);
  const [startingCity, setStartingCity] = useState('Ranchi');
  const [budgetTier, setBudgetTier] = useState<'Budget' | 'Moderate' | 'Heritage Luxury'>('Moderate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Eco & Forests',
    'Waterfalls',
    'Tribal Culture'
  ]);
  const [partyType, setPartyType] = useState('Family');

  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);

  const interestOptions = [
    'Eco & Forests',
    'Waterfalls & Gorges',
    'Tribal Culture & Crafts',
    'Wildlife & Safaris',
    'Spiritual Pilgrimage',
    'Serpentine Ghats & Lakes',
    'Colonial & Heritage Towns'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationDays,
          startingCity,
          budgetTier,
          interests: selectedInterests,
          partyType
        })
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setItinerary(data);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Itinerary generation fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border border-emerald-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Powered by Gemini AI Engine</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight">
            {language === 'hi' ? 'स्मार्ट AI यात्रा योजनाकार' : 'Personalized AI Itinerary Planner'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            {language === 'hi'
              ? 'अपनी रुचियों, बजट और अवधि के अनुसार प्रमाणित जनजातीय गाइडों, पारंपरिक खान-पान और प्राकृतिक सूर्यास्त स्थलों के साथ दिन-प्रतिदिन का यात्रा कार्यक्रम तैयार करें।'
              : 'Generate an authentic, day-by-day Jharkhand expedition tailored to your travel dates, budget tier, and cultural interests with verified eco-stays and local guides.'}
          </p>
        </div>
      </div>

      {/* Planner Parameters Input Card */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl text-stone-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Duration Slider */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Duration
              </span>
              <span className="text-amber-400 font-black text-sm">{durationDays} Days</span>
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={durationDays}
              onChange={e => setDurationDays(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>1 Day Excursion</span>
              <span>7 Days Complete Loop</span>
            </div>
          </div>

          {/* Starting City Hub */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Starting Hub
            </label>
            <select
              value={startingCity}
              onChange={e => setStartingCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="Ranchi">Ranchi (Birsa Munda Airport / Rail Hub)</option>
              <option value="Deoghar">Deoghar (Jasidih Rail / Airport)</option>
              <option value="Jamshedpur">Jamshedpur (Tatanagar Rail)</option>
              <option value="Daltonganj">Daltonganj / Medininagar (Latehar Gateway)</option>
              <option value="Dhanbad">Dhanbad (Grand Chord Rail)</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Budget Tier
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
              {(['Budget', 'Moderate', 'Heritage Luxury'] as const).map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setBudgetTier(tier)}
                  className={`py-1.5 text-[11px] rounded-lg font-bold transition-all ${
                    budgetTier === tier
                      ? 'bg-emerald-700 text-white shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {tier === 'Heritage Luxury' ? 'Luxury' : tier}
                </button>
              ))}
            </div>
          </div>

          {/* Party Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Travel Group
            </label>
            <select
              value={partyType}
              onChange={e => setPartyType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="Solo Traveler">Solo Explorer</option>
              <option value="Couple">Couple / Romantic</option>
              <option value="Family with Kids">Family with Children</option>
              <option value="Friends Adventure Group">Friends Adventure Group</option>
              <option value="Senior Citizens">Senior Citizens / Spiritual</option>
            </select>
          </div>
        </div>

        {/* Interests Selection Pills */}
        <div className="space-y-2 pt-2 border-t border-stone-800">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            Select Your Preferred Experiences & Interests:
          </label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map(interest => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/60 shadow'
                      : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-stone-600'}`}></span>
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 text-white font-black text-sm shadow-xl shadow-emerald-950 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
            <span>{isLoading ? 'Generating Custom AI Trip Plan...' : 'Generate AI Day-by-Day Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* Generated Itinerary Display View */}
      {itinerary && (
        <div className="bg-stone-900 rounded-3xl border border-stone-700 p-6 sm:p-8 space-y-8 shadow-2xl text-stone-100 animate-fade-in">
          {/* Plan Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <span className="text-[11px] px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/40">
                {itinerary.durationDays}-Day Verified Plan
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight mt-1">
                {itinerary.tripTitle}
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                {itinerary.summary}
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-right min-w-[200px]">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Estimated Total Budget</span>
              <span className="text-2xl font-black text-amber-400">
                ₹{itinerary.totalEstimatedCost.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block">
                Tier: {itinerary.budgetTier} | Eco Score: {itinerary.sustainabilityScore}%
              </span>
            </div>
          </div>

          {/* Day by Day Accordion / Cards */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Day-by-Day Schedule & Activity Breakdown
            </h4>

            <div className="space-y-6">
              {itinerary.days.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-stone-950 rounded-2xl border border-stone-800 p-5 sm:p-6 space-y-4 shadow-md"
                >
                  {/* Day Title & Est Cost */}
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black flex items-center justify-center text-xs">
                        D{day.dayNumber}
                      </span>
                      <h5 className="font-bold text-sm sm:text-base text-white">{day.title}</h5>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      Est. ₹{day.dailyTotalEst}
                    </span>
                  </div>

                  {/* Morning, Afternoon, Evening Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Morning */}
                    <div className="bg-stone-900/70 p-3.5 rounded-xl border border-stone-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Morning (Dawn to Noon)</span>
                      </div>
                      <p className="text-white font-semibold">{day.morning.destinationName}</p>
                      <p className="text-stone-300 leading-relaxed">{day.morning.activity}</p>
                      <p className="text-[11px] text-emerald-400 italic">💡 {day.morning.tips}</p>
                    </div>

                    {/* Afternoon */}
                    <div className="bg-stone-900/70 p-3.5 rounded-xl border border-stone-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" />
                        <span>Afternoon & Lunch</span>
                      </div>
                      <p className="text-white font-semibold">{day.afternoon.destinationName}</p>
                      <p className="text-stone-300 leading-relaxed">{day.afternoon.activity}</p>
                      <p className="text-[11px] text-amber-300 font-medium">
                        🍴 Food: {day.afternoon.lunchSuggestion}
                      </p>
                    </div>

                    {/* Evening & Sunset */}
                    <div className="bg-stone-900/70 p-3.5 rounded-xl border border-stone-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Sunset className="w-3.5 h-3.5 text-amber-400" />
                        <span>Evening & Sunset</span>
                      </div>
                      <p className="text-white font-semibold">{day.evening.destinationName}</p>
                      <p className="text-stone-300 leading-relaxed">{day.evening.activity}</p>
                      {day.evening.sunsetSpot && (
                        <p className="text-[11px] text-rose-300">
                          🌅 Viewpoint: {day.evening.sunsetSpot}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stay & Transport Footnote */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-800/80 text-xs">
                    <div className="flex items-center gap-2 text-stone-300">
                      <Home className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Stay:</strong> {day.staySuggestion}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-300">
                      <Car className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Transit:</strong> {day.transportAdvice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packing & Etiquette Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-800">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Essential Packing List
              </h5>
              <ul className="space-y-1 text-xs text-stone-300">
                {itinerary.essentialPacking.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Tribal Cultural Etiquette & Eco-Tips
              </h5>
              <ul className="space-y-1 text-xs text-stone-300">
                {itinerary.culturalEtiquette.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Itinerary ID: {itinerary.id} (Saved to your session)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={() => {
                  onBookService(
                    'guide_tour',
                    `Full ${itinerary.durationDays}-Day Tour: ${itinerary.tripTitle}`,
                    'prov-001',
                    itinerary.totalEstimatedCost
                  );
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg hover:brightness-110 transition-all"
              >
                <span>Book This Entire Tour Package</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
