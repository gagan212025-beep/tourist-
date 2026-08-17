import React, { useState, useEffect } from 'react';
import { Destination, Provider, TouristReview } from '../types';
import { INITIAL_REVIEWS } from '../data/seedData';
import {
  X,
  MapPin,
  Star,
  Layers,
  Car,
  Train,
  Plane,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Home,
  MessageSquare,
  Send,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';

interface DestinationModalProps {
  destination: Destination;
  providers: Provider[];
  onClose: () => void;
  onOpenVR: (siteId: string) => void;
  onBookService: (serviceType: string, targetTitle: string, providerId?: string, amount?: number) => void;
  language: string;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  providers,
  onClose,
  onOpenVR,
  onBookService,
  language
}) => {
  const [activeImage, setActiveImage] = useState(destination.imageUrl);
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'reviews' | 'transit'>('overview');

  // Reviews state with default fallback
  const [reviews, setReviews] = useState<TouristReview[]>(
    INITIAL_REVIEWS.filter(r => r.destinationId === destination.id)
  );
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Filter providers relevant to this destination
  const matchedProviders = (Array.isArray(providers) ? providers : []).filter(
    p =>
      p &&
      (p.location?.toLowerCase().includes(destination?.district?.toLowerCase() || '') ||
        p.location?.toLowerCase().includes(destination?.name?.toLowerCase() || '') ||
        p.bio?.toLowerCase().includes(destination?.name?.toLowerCase() || '') ||
        (Array.isArray(p.servicesOffered) &&
          p.servicesOffered.some(s => s?.toLowerCase().includes(destination?.name?.toLowerCase() || ''))))
  );

  // Fetch reviews for this destination with safe fallback
  useEffect(() => {
    let isMounted = true;
    setIsLoadingReviews(true);

    fetch(`/api/reviews?destinationId=${destination.id}`)
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setReviews(data);
          }
        }
      })
      .catch(err => {
        console.warn('Reviews fetch notice:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingReviews(false);
      });

    return () => {
      isMounted = false;
    };
  }, [destination.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: destination.id,
          authorName: newAuthor,
          authorLocation: newLocation || 'Tourist Visitor',
          rating: newRating,
          comment: newComment
        })
      });
      const data = await res.json();
      setReviews(prev => [data, ...prev]);
      setNewAuthor('');
      setNewLocation('');
      setNewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      console.error('Review submit failed:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl text-stone-100 my-8">
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/40">
              {destination.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight mt-1 flex items-baseline gap-2">
              <span>{language === 'hi' && destination.hindiName ? destination.hindiName : destination.name}</span>
              <span className="text-xs text-amber-400 font-sans font-semibold">
                District: {destination.district}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {destination.has360Panorama && (
              <button
                onClick={() => onOpenVR(destination.panoramaUrl || 'netarhat_sunset')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold shadow hover:scale-105 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>360° VR View</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 space-y-6">
          {/* Main Gallery Hero */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-stone-800 bg-stone-950">
              <img
                src={activeImage}
                alt={destination.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
                <span className="bg-stone-950/80 px-3 py-1.5 rounded-lg backdrop-blur-md border border-stone-800 font-medium">
                  {destination.tagline}
                </span>
                <span className="bg-amber-950/80 text-amber-300 px-3 py-1.5 rounded-lg backdrop-blur-md border border-amber-500/40 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {destination.ratings.average} ({destination.ratings.count} Reviews)
                </span>
              </div>
            </div>

            {/* Gallery Thumbnail Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[destination.imageUrl, ...(destination.galleryUrls || [])].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img ? 'border-amber-400 scale-105 shadow-md' : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950/70 p-4 rounded-2xl border border-stone-800 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Best Season</span>
              <span className="font-bold text-emerald-300">{destination.bestTimeToVisit}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Entry Fee</span>
              <span className="font-bold text-stone-200">{destination.entryFee}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Timings</span>
              <span className="font-bold text-stone-200">{destination.timings}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Elevation</span>
              <span className="font-bold text-amber-300">{destination.elevation || '600 m'}</span>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
            {[
              { id: 'overview', label: 'Overview & Highlights' },
              { id: 'providers', label: `Verified Guides & Stays (${matchedProviders.length})` },
              { id: 'transit', label: 'Road & Transit Access' },
              { id: 'reviews', label: `AI Sentiment Reviews (${reviews.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white shadow border border-emerald-600'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & HIGHLIGHTS */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-amber-300 mb-2">About the Destination</h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {destination.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-emerald-300 mb-2">Key Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {destination.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-300 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Significance Box */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Indigenous Cultural & Sarna Heritage
                </h4>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {destination.culturalSignificance}
                </p>
              </div>

              {/* Eco & Responsible Guidelines */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Eco-Tourism Norms & Forest Guidelines
                </h4>
                <ul className="space-y-1 text-xs text-emerald-100/90">
                  {destination.ecoGuidelines.map((g, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFIED PROVIDERS */}
          {activeTab === 'providers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-400">
                  Certified Naturalists, Guides, and Traditional Homestays with Blockchain-verified credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedProviders.length > 0 ? (
                  matchedProviders.map(p => (
                    <div key={p.id} className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.avatarUrl}
                              alt={p.name}
                              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                            />
                            <div>
                              <h5 className="font-bold text-sm text-white flex items-center gap-1">
                                <span>{p.name}</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              </h5>
                              <span className="text-[10px] px-2 py-0.2 rounded bg-amber-900/60 text-amber-300 font-semibold uppercase">
                                {p.role}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {p.rating}
                            </span>
                            <span className="text-[10px] text-stone-400">({p.reviewsCount} reviews)</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-300 mt-2 line-clamp-2">{p.bio}</p>
                        <div className="mt-2 text-[11px] text-stone-400">
                          <strong>Community:</strong> {p.community}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p.pricing}</span>
                        <button
                          onClick={() => {
                            onBookService(
                              p.role === 'guide' ? 'guide_tour' : p.role === 'homestay' ? 'homestay_stay' : 'marketplace_order',
                              `${destination.name} with ${p.name}`,
                              p.id,
                              p.role === 'guide' ? 1200 : 2200
                            );
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all"
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-stone-400 text-xs">
                    No specific dedicated providers listed yet for this sector. General JTDC assistance available.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TRANSIT & ROAD ACCESS */}
          {activeTab === 'transit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4" />
                  Complete Transportation Guide
                </h4>

                <div className="space-y-3 text-xs text-stone-300">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                    <Plane className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Nearest Airport:</strong>
                      {destination.transportInfo.nearestAirport}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                    <Train className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Nearest Railway Junction:</strong>
                      {destination.transportInfo.nearestRailway}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                    <Car className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Highway & Ghat Road Route:</strong>
                      {destination.transportInfo.roadAccess}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                    <strong>Local Traveler Advice:</strong> {destination.transportInfo.localTransportTips}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS & LIVE AI SENTIMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Write Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    Share Your Experience (AI Sentiment Scored)
                  </h4>
                  {reviewSuccess && (
                    <span className="text-xs text-emerald-400 font-bold animate-pulse">
                      ✓ Review logged & AI Scored!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Your City / Country (e.g. Ranchi, Pune, Paris)"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-400">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-stone-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Describe the atmosphere, cleanliness, guide service, and tribal hospitality..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow hover:brightness-110 disabled:opacity-50"
                  >
                    {isSubmittingReview ? (
                      <span>Analyzing with AI...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>{rev.authorName}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({rev.authorLocation})</span>
                        </h5>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 text-amber-400 fill-amber-400" />
                          ))}
                          <span className="text-[10px] text-stone-500 ml-2">{rev.date}</span>
                        </div>
                      </div>

                      {/* AI Sentiment Score Tag */}
                      <div className="text-right">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            rev.sentimentScore >= 85
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          AI Sentiment: {rev.sentimentScore}% ({rev.sentimentLabel})
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">{rev.comment}</p>

                    {/* Aspect Breakdown Tags */}
                    {rev.aspects && (
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-stone-400">
                        <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                          Authenticity: {rev.aspects.authenticity}%
                        </span>
                        <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                          Safety: {rev.aspects.safety}%
                        </span>
                        <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                          Hospitality: {rev.aspects.hospitality}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
