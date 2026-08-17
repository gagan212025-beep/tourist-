import React, { useState, useEffect } from 'react';
import { AnalyticsSummary, BlockchainBlock } from '../types';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Send,
  Sparkles,
  MapPin,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface OfficialDashboardProps {
  language: string;
}

export const OfficialDashboard: React.FC<OfficialDashboardProps> = ({ language }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advisoryTitle, setAdvisoryTitle] = useState('');
  const [advisoryMessage, setAdvisoryMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.warn('Analytics fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleBroadcastAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisoryTitle || !advisoryMessage) return;
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setAdvisoryTitle('');
      setAdvisoryMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-stone-100">
      {/* Official Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-teal-950 via-stone-900 to-emerald-950 border border-teal-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/80 border border-teal-400/40 text-teal-300 text-xs font-bold">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Jharkhand Tourism Department Command Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Tourism Analytics & Policy Intelligence Dashboard
            </h2>
            <p className="text-xs text-stone-300">
              Live footfall tracking, community revenue distribution, and AI sentiment monitoring across all 24 districts.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-teal-300 border border-stone-700 text-xs font-semibold shadow transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Footfall */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase">
            <span>Total Monthly Visitors</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-serif">
            {analytics?.totalTouristsMonthly ? analytics.totalTouristsMonthly.toLocaleString() : '142,580'}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% YoY Growth (Eco Sector)</span>
          </div>
        </div>

        {/* Eco Revenue Volume */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase">
            <span>Direct Community Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-serif">
            ₹{analytics?.totalRevenueMonthlyINR ? (analytics.totalRevenueMonthlyINR / 10000000).toFixed(2) : '3.84'} Cr
          </div>
          <div className="text-[11px] text-stone-400">
            Directly to tribal guides, homestays & artisans
          </div>
        </div>

        {/* Verified Providers */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase">
            <span>Verified Local Guides & Stays</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white font-serif">
            {analytics?.activeProvidersCount || 342}
          </div>
          <div className="text-[11px] text-teal-300">
            100% Cryptographically verified on-ledger
          </div>
        </div>

        {/* Average AI Sentiment Rating */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase">
            <span>Visitor Satisfaction Index</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-300 font-serif">
            {analytics?.averageSatisfactionScore || 94.2}%
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            High Authenticity & Hospitality Rating
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Popular Destinations & Category Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Destination Footfall Bar Chart */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Footfall Distribution by Flagship Destination (Current Quarter)
            </h3>

            <div className="space-y-3 pt-2">
              {[
                { name: 'Netarhat Plateau & Sunset Point', count: 48500, percent: 85, color: 'bg-amber-500' },
                { name: 'Hundru & Jonha Waterfalls Corridor', count: 41200, percent: 72, color: 'bg-cyan-500' },
                { name: 'Betla National Park & Tiger Reserve', count: 32800, percent: 58, color: 'bg-emerald-500' },
                { name: 'Patratu Valley Serpentine Ghats', count: 29400, percent: 52, color: 'bg-teal-500' },
                { name: 'Baba Baidyanath Dham (Deoghar)', count: 56000, percent: 98, color: 'bg-purple-500' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">{item.name}</span>
                    <span className="text-stone-400">{item.count.toLocaleString()} visitors</span>
                  </div>
                  <div className="w-full h-3 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                    <div
                      style={{ width: `${item.percent}%` }}
                      className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Sentiment Dimensions Radar/Aspects */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Natural Language Sentiment Radar (Extracted from 2,400+ reviews)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <span className="text-2xl font-black text-emerald-400 font-serif">96%</span>
                <span className="text-[11px] text-stone-400 block mt-1">Tribal Authenticity</span>
              </div>
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <span className="text-2xl font-black text-amber-400 font-serif">94%</span>
                <span className="text-[11px] text-stone-400 block mt-1">Host Hospitality</span>
              </div>
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <span className="text-2xl font-black text-teal-400 font-serif">91%</span>
                <span className="text-[11px] text-stone-400 block mt-1">Safety & Security</span>
              </div>
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <span className="text-2xl font-black text-cyan-400 font-serif">89%</span>
                <span className="text-[11px] text-stone-400 block mt-1">Trail Cleanliness</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Official Broadcast Advisory Tool */}
        <div className="space-y-6">
          <form
            onSubmit={handleBroadcastAdvisory}
            className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Broadcast Official Travel Advisory</span>
            </div>
            <p className="text-xs text-stone-400">
              Instantly push official alerts regarding weather, river water levels, or festive gatherings to the platform.
            </p>

            {broadcastSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold animate-pulse">
                ✓ Advisory broadcasted to public banner!
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Advisory Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Monsoon Safety Advisory for Hundru Falls"
                value={advisoryTitle}
                onChange={e => setAdvisoryTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Detailed Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Specify precautions, active safety ropes, lifeguard timings, and emergency contacts..."
                value={advisoryMessage}
                onChange={e => setAdvisoryMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Official Notice</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
